import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
  Platform,
  Dimensions,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Header from '../../../Components/Header';
import {
  mainStyles,
  stat_styles,
  other_style,
  HabitStats_style,
} from '../../../Utilities/styles';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';
import * as Progress from 'react-native-progress';
import {CustomTouchableTextInput} from '../../../Components/CustomTextInput';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Collapsible from 'react-native-collapsible';
// fro API calling
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import EmptyView from '../../../Components/EmptyView';
import {allHabit_styles} from '../../../Utilities/styles';
const screen = Dimensions.get('screen');

//Icons
const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');

const Statistics = props => {
  //Hoooks and Variables
  const {Token} = useContext(Context);
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [filterOption, setFilterOption] = useState(1);
  const [sHabitList, setHabitList] = useState([]);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [appliedFilter, setAppliedFilter] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-30, 'days'),
    startDateModal: false,
    endDate: moment(),
    endDateModal: false,
  });

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  const btn_apply = () => {
    setIsCollapsed(!isCollapsed);
    setAppliedFilter(filterOption);
    setisLoading(true);
    api_habitList();
  };

  const findProgress = item => {
    let freq = [];
    item.frequency.filter((x, i) => {
      if (x.status == true) {
        freq.push(x.day);
      }
    });
    let count = 0;
    item.notes.map((x, i) => {
      if (freq.includes(moment(x.date).format('dddd').toLowerCase())) {
        count = count + 1;
      }
    });
    return count;
  };

  async function api_habitList() {
    let dateObj;

    if (appliedFilter == 1) {
      dateObj = {
        end_date: moment().toISOString(),
        start_date: moment().subtract({days: 6}).toISOString(),
      };
    } else if (appliedFilter == 2) {
      dateObj = {
        end_date: moment().toISOString(),
        start_date: moment().subtract({days: 29}).toISOString(),
      };
    } else {
      dateObj = {
        end_date: moment(dateRange.startDate).toISOString(),
        start_date: moment(dateRange.endDate).toISOString(),
      };
    }

    console.log('dateObj', dateObj);

    let res = await invokeApi({
      path: 'api/habit/habit_filter_list',
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: dateObj,
      navigation: props.navigation,
    });

    if (res) {
      if (res.code == 200) {
        console.log('response', res);

        let newArray = res.habits;
        let completed = 0;
        let length = 0;
        let pending = 0;
        newArray.map((x, i) => {
          if (findProgress(x) / x.total_days == 1) {
            completed = completed + 1;
          }
        });

        setStats({
          total: newArray.length,
          completed: completed,
          pending: newArray.length - completed,
        });
        setHabitList(res.habits);
        setisLoading(false);
        setRefreshing(false);
      } else {
        setisLoading(false);
        setRefreshing(false);
        showToast(res.message);
      }
    }
  }

  const refreshFlatList = () => {
    setRefreshing(true);
    api_habitList();
  };

  const callHabitListApi = () => {
    setisLoading(true);
    api_habitList();
  };

  React.useEffect(() => {
    callHabitListApi();
    return () => {
      setHabitList([]);
    };
  }, []);

  // Views

  const filterComponent = () => {
    return (
      <View style={{backgroundColor: Colors.background, marginTop: 10}}>
        <View style={stat_styles.filterView}>
          <Pressable
            onPress={() => setIsCollapsed(!isCollapsed)}
            style={stat_styles.collapseButtonView}>
            <View style={stat_styles.collapseButtonInnerView}>
              <Text style={other_style.labelText}>Filter</Text>
              <View style={stat_styles.appliedFilterView}>
                <Text style={stat_styles.appliedFilterText}>
                  {appliedFilter == 1
                    ? 'Last 7 Days'
                    : appliedFilter == 2
                    ? 'Last 30 Days'
                    : moment(dateRange.startDate).format('DD MMM YYYY') +
                      ' - ' +
                      moment(dateRange.endDate).format('DD MMM YYYY')}
                </Text>
              </View>
            </View>
            <Image
              style={[
                stat_styles.collapseArrow,
                {
                  transform: [
                    {
                      rotateZ: isCollapsed == true ? '0deg' : '180deg',
                    },
                  ],
                },
              ]}
              source={require('../../../Assets/Icons/down-arrow.png')}
            />
          </Pressable>
          <Collapsible collapsed={isCollapsed}>
            <View style={{marginTop: 20}}>
              <Pressable
                onPress={() => setFilterOption(1)}
                style={[stat_styles.filterButtonView, {marginTop: 0}]}>
                <Text style={stat_styles.filterButtonText}>Last 7 Days</Text>
                <Image
                  source={filterOption == 1 ? checked : unChecked}
                  style={stat_styles.filterButtonIcon}
                />
              </Pressable>

              <Pressable
                onPress={() => setFilterOption(2)}
                style={stat_styles.filterButtonView}>
                <Text style={stat_styles.filterButtonText}>Last 30 Days</Text>
                <Image
                  source={filterOption == 2 ? checked : unChecked}
                  style={stat_styles.filterButtonIcon}
                />
              </Pressable>

              <Pressable
                onPress={() => setFilterOption(3)}
                style={stat_styles.filterButtonView}>
                <Text style={stat_styles.filterButtonText}>Select Dates</Text>
                <Image
                  source={filterOption == 3 ? checked : unChecked}
                  style={stat_styles.filterButtonIcon}
                />
              </Pressable>

              <Collapsible collapsed={filterOption == 3 ? false : true}>
                <View style={{flexDirection: 'row', marginTop: 10}}>
                  <View style={{flex: 1}}>
                    <CustomTouchableTextInput
                      onPress={() =>
                        setDateRange({...dateRange, startDateModal: true})
                      }
                      lable="From"
                      height={45}
                      lableBold
                      lableColor={Colors.black}
                      value={moment(dateRange.startDate).format('DD MMM YYYY')}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: 10}}>
                    <CustomTouchableTextInput
                      onPress={() =>
                        setDateRange({...dateRange, endDateModal: true})
                      }
                      height={45}
                      lable="To"
                      lableBold
                      lableColor={Colors.black}
                      value={moment(dateRange.endDate).format('DD MMM YYYY')}
                    />
                  </View>
                </View>
              </Collapsible>

              <View style={{marginTop: 10}}>
                <CustomButton onPress={btn_apply} title="Apply" height={45} />
              </View>
            </View>
          </Collapsible>
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            marginHorizontal: 20,
            paddingVertical: 20,
            marginTop: 15,
            marginBottom: 10,
            borderRadius: 10,
            borderColor: Colors.gray02,
            borderWidth: 1,
          }}>
          <View style={{alignItems: 'center'}}>
            <Progress.Circle
              thickness={12}
              color={Colors.primary}
              strokeCap="round"
              unfilledColor={Colors.gray02}
              progress={stats.total != 0 ? stats.completed / stats.total : 0}
              textStyle={{
                fontFamily: font.regular,
                fontWeight: '600',
                textAlign: 'center',
              }}
              allowFontScaling={true}
              borderWidth={0}
              showsText={true}
              size={150}
              animated={false}
            />
          </View>
          <View style={HabitStats_style.statRow}>
            <View style={HabitStats_style.statItemView}>
              <Text style={HabitStats_style.statItemtext1}>Total</Text>
              <Text style={HabitStats_style.statItemtext2}>
                {stats.total < 10 ? '0' + stats.total : stats.total}
              </Text>
            </View>

            <View style={HabitStats_style.statItemView}>
              <Text style={HabitStats_style.statItemtext1}>Completed</Text>
              <Text style={HabitStats_style.statItemtext2}>
                {stats.completed < 10 ? '0' + stats.completed : stats.completed}
              </Text>
            </View>

            <View style={HabitStats_style.statItemView}>
              <Text style={HabitStats_style.statItemtext1}>Pending</Text>
              <Text style={HabitStats_style.statItemtext2}>
                {stats.pending < 10 ? '0' + stats.pending : stats.pending}
              </Text>
            </View>
          </View>
        </View>
        {/* //todo ///////////// GRAPH */}
        {/* <View
          style={{
            paddingVertical: 50,
          }}>
          <LineChart
            data={data}
            width={screenWidth}
            height={250}
            // verticalLabelRotation={50}

            // withVerticalLabels={false}
            withHorizontalLabels={false}
            chartConfig={{
              backgroundGradientFrom: Colors.background,
              backgroundGradientFromOpacity: 1,
              backgroundGradientTo: Colors.background,
              backgroundGradientToOpacity: 1,
              color: (opacity = 1) => `rgba(101, 95, 177, ${opacity})`,
              strokeWidth: 4, // optional, default 3
              decimalPlaces: 0,
              linejoinType: 'round',
              labelColor: (opacity = 1) => Colors.black,
              fillShadowGradient: 'skyblue',
              fillShadowGradientOpacity: 1,
              propsForBackgroundLines: {
                strokeWidth: 0,
              },
              propsForLabels: {
                fontFamily: font.regular,
                fontWeight: '500',
              },
            }}
            bezier
          />
        </View> */}

        <View style={stat_styles.lableView}>
          <Text style={other_style.labelText}>List of Habits</Text>
        </View>
      </View>
    );
  };

  const renderHabitsList = ({item, index}) => {
    let progress = findProgress(item);
    return (
      <Pressable style={allHabit_styles.itemView}>
        <View style={allHabit_styles.imageView}>
          <CustomImage
            source={{uri: fileURL + item.images?.small}}
            indicatorProps={{color: Colors.primary}}
            style={allHabit_styles.itemImage}
          />
        </View>
        <View style={allHabit_styles.detailView}>
          <View style={{flex: 1}}>
            <Text numberOfLines={1} style={allHabit_styles.title}>
              {item.name}
            </Text>
            <View style={allHabit_styles.targetDateView}>
              <Text style={allHabit_styles.targetDate}>
                Target Date : {moment(item.target_date).format('DD MMM YYYY')}
              </Text>
            </View>
            <View style={{height: 14}}>
              {!!item.reminder && (
                <View style={allHabit_styles.reminderView}>
                  <Text style={allHabit_styles.reminderText}>
                    <Text>
                      Reminder at {moment(item.reminder_time).format('hh:mm A')}
                    </Text>
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={allHabit_styles.weekView}>
            {item.frequency.map((x, i) => {
              return (
                <View
                  key={x._id}
                  style={[
                    allHabit_styles.weekDayView,
                    {
                      backgroundColor: x.status
                        ? Colors.lightPrimary
                        : Colors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: x.status ? font.xbold : font.medium,
                      fontSize: 12,
                      color: x.status ? Colors.primary : Colors.placeHolder,
                      textTransform: 'capitalize',
                    }}>
                    {x.day.charAt(0)}
                  </Text>
                </View>
              );
            })}
          </View>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 5,
              }}>
              <Text
                style={{
                  fontFamily: font.bold,
                  color: Colors.placeHolder,
                  fontSize: 12,
                }}>
                {parseInt((progress / item?.total_days) * 100) + '%'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Progress.Bar
                color={Colors.primary}
                height={8}
                borderColor={Colors.gray02}
                borderRadius={13}
                borderWidth={1}
                progress={progress / item?.total_days}
                width={null}
              />
            </View>
          </View>
        </View>
        {progress / item?.total_days == 1 && (
          <View
            style={{
              backgroundColor: Colors.primary,
              paddingHorizontal: 30,
              paddingVertical: 5,
              transform: [{rotateZ: '-45deg'}],
              position: 'absolute',
              left: -30,
              top: 15,
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 1,
              },
              shadowOpacity: 0.2,
              shadowRadius: 1.41,

              elevation: 2,
            }}>
            <Text
              style={{
                color: Colors.white,
                fontFamily: font.medium,
                fontSize: 10,
                textAlign: 'center',
                // letterSpacing:1
              }}>
              COMPLETED
            </Text>
          </View>
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Habit Statistics'} />
      <View style={{flex: 1}}>
        <Loader enable={isLoading} />

        <View style={{flex: 1}}>
          <FlatList
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshFlatList}
                tintColor={Colors.primary}
                colors={[Colors.primary]}
                progressBackgroundColor={Colors.white}
              />
            }
            ListEmptyComponent={() =>
              isLoading == false &&
              sHabitList.length == 0 && <EmptyView style={{marginTop: 50}} />
            }
            showsVerticalScrollIndicator={false}
            stickyHeaderIndices={[0]}
            stickyHeaderHiddenOnScroll={true}
            ListHeaderComponent={filterComponent()}
            data={sHabitList}
            renderItem={renderHabitsList}
          />
        </View>
      </View>
      <DateTimePickerModal
        accentColor={Colors.primary}
        buttonTextColorIOS={Colors.primary}
        isVisible={dateRange.startDateModal}
        mode="date"
        display={Platform.OS == 'android' ? 'default' : 'inline'}
        date={moment(dateRange.startDate).toDate()}
        onConfirm={val => {
          setDateRange({
            ...dateRange,
            startDate: val,
            startDateModal: false,
          });
        }}
        maximumDate={moment(dateRange.endDate).subtract(1,'day').toDate()}
        onCancel={() =>
          setDateRange({
            ...dateRange,
            startDateModal: false,
          })
        }
        ListEmptyComponent={() =>
          isLoading == false && sHabitList.length == 0 && <EmptyView />
        }
      />

      <DateTimePickerModal
        accentColor={Colors.primary}
        buttonTextColorIOS={Colors.primary}
        isVisible={dateRange.endDateModal}
        mode="date"
        date={moment(dateRange.endDate).toDate()}
        minimumDate={moment(dateRange.startDate).add(1, 'day').toDate()}
        display={Platform.OS == 'android' ? 'default' : 'inline'}
        onConfirm={val => {
          setDateRange({
            ...dateRange,
            endDate: val,
            endDateModal: false,
          });
        }}
        onCancel={() =>
          setDateRange({
            ...dateRange,
            endDateModal: false,
          })
        }
      />
    </SafeAreaView>
  );
};

export default Statistics;
