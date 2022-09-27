import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
  Platform,
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


//Icons
const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');

const Statistics = props => {
  //Hoooks and Variables
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [filterOption, setFilterOption] = useState(1);
  const [appliedFilter, setAppliedFilter] = useState(1);
  const [dateRange, setDateRange] = useState({
    startDate: moment().add(-30, 'days'),
    startDateModal: false,
    endDate: moment(),
    endDateModal: false,
  });

  //  Functions

  const findProgress = row => {
    let startDate = moment(row.createdAt, 'DD MMM YYYY');
    let endDate = moment(row.target_date, 'DD MMM YYYY');
    let diff = endDate.diff(startDate, 'days');
    console.log('startDate', row.createdAt);
    console.log('endDate', row.target_date);
    console.log('daysCmpleted  difference', row.daysCompleted + '  ' + diff);
    return row.daysCompleted / diff;
  };

  // Views

  const filterComponent = () => {
    return (
      <View style={{backgroundColor: Colors.background}}>
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
                <CustomButton
                  onPress={() => {
                    setIsCollapsed(!isCollapsed);
                    setAppliedFilter(filterOption);
                  }}
                  title="Apply"
                  height={45}
                />
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
              progress={0.6}
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
              <Text style={HabitStats_style.statItemtext2}>10</Text>
            </View>

            <View style={HabitStats_style.statItemView}>
              <Text style={HabitStats_style.statItemtext1}>Completed</Text>
              <Text style={HabitStats_style.statItemtext2}>06</Text>
            </View>

            <View style={HabitStats_style.statItemView}>
              <Text style={HabitStats_style.statItemtext1}>Pending</Text>
              <Text style={HabitStats_style.statItemtext2}>04</Text>
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
    return (
      <View style={stat_styles.listView}>
        <View style={stat_styles.listImageView}>
          <Image source={item.image} style={stat_styles.listImage} />
        </View>
        <View style={stat_styles.listDetailView}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Text style={stat_styles.listTitle}>{item.title}</Text>
          </View>

          <View style={stat_styles.listTargetDateView}>
            <Text style={stat_styles.listTargetDateText}>
              Target Date : {item.target_date}
            </Text>
          </View>

          <View style={stat_styles.listCreatedAtView}>
            <Text style={stat_styles.listCreatedAtText}>
              <Text>Created at {item.createdAt}</Text>
            </Text>
          </View>

          <View style={stat_styles.listWeekView}>
            {weekDays.map((x, i) => {
              return (
                <View
                  style={[
                    stat_styles.weekItemView,
                    {
                      backgroundColor: item?.frequency?.find(z => z == x.day)
                        ? Colors.lightPrimary
                        : Colors.white,
                    },
                  ]}>
                  <Text
                    style={{
                      fontFamily: item?.frequency?.find(z => z == x.day)
                        ? font.xbold
                        : font.medium,
                      fontSize: 12,
                      color: item?.frequency?.find(z => z == x.day)
                        ? Colors.primary
                        : Colors.placeHolder,
                    }}>
                    {x.name.charAt(0)}
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
                {Math.round(findProgress(item) * 100) + '%'}
              </Text>
            </View>
            <View style={{flex: 1}}>
              <Progress.Bar
                color={Colors.primary}
                height={8}
                borderColor={Colors.gray02}
                borderRadius={13}
                borderWidth={1}
                progress={findProgress(item)}
                width={null}
              />
            </View>
          </View>
        </View>
        {/* <View
          style={{
            // backgroundColor: Colors.lightPrimary,

            borderRadius: 999,
            // height: 40,
            // width: 40,
            // paddingHorizontal: 7,
            // paddingVertical: 3,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 5,
            position:"absolute"
          }}>
          <Text
            style={{
              fontFamily: font.bold,
              color: Colors.placeHolder,
              fontSize: 12,
              // top: 1.5,
            }}>
            {Math.round(findProgress(item) * 100) + '%'}
          </Text>
        </View> */}
      </View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Habit Statistics'} />
      <View style={{flex: 1, paddingTop: 10}}>
        <FlatList
          showsVerticalScrollIndicator={false}
          stickyHeaderIndices={[0]}
          stickyHeaderHiddenOnScroll={true}
          ListHeaderComponent={filterComponent()}
          data={habitsList}
          renderItem={renderHabitsList}
        />
      </View>
      <DateTimePickerModal
        buttonTextColorIOS={Colors.primary}
        isVisible={dateRange.startDateModal}
        mode="date"
        display={Platform.OS == 'android' ? 'calendar' : 'spinner'}
        date={moment(dateRange.startDate).toDate()}
        onConfirm={val =>
          setDateRange({
            ...dateRange,
            startDate: val,
            startDateModal: false,
          })
        }
        onCancel={() =>
          setDateRange({
            ...dateRange,
            startDateModal: false,
          })
        }
      />

      <DateTimePickerModal
        buttonTextColorIOS={Colors.primary}
        isVisible={dateRange.endDateModal}
        mode="date"
        date={moment(dateRange.endDate).toDate()}
        display={Platform.OS == 'android' ? 'calendar' : 'spinner'}
        onConfirm={val =>
          setDateRange({
            ...dateRange,
            endDate: val,
            endDateModal: false,
          })
        }
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

// Sample Data

const habitsList = [
  {
    _id: '1',
    title: 'Leave Junk Food',
    status: false,
    frequency: [1, 2, 3, 4, 5, 6, 7],
    image: require('../../../Assets/Images/junkfood.webp'),
    to_do: false,
    target_date: '12 Oct 2022',
    daysCompleted: 12,
    reminder: true,
    reminder_time: '10:00 AM',
    createdAt: '10 Aug 2022',
  },

  {
    _id: '2',
    title: 'Drink Water Regularly',
    status: true,
    frequency: [1, 3, 4],
    image: require('../../../Assets/Images/water.png'),
    to_do: true,
    target_date: '12 Sep 2022',
    createdAt: '30 Aug 2022',
    reminder: false,
    daysCompleted: 10,
    reminder_time: '06:30 PM',
  },

  {
    _id: '3',
    title: 'Quit Smoking',
    status: false,
    to_do: false,
    frequency: [1, 6, 7],
    image: require('../../../Assets/Images/smoking.jpeg'),
    target_date: '10 Nov 2022',
    reminder: true,
    daysCompleted: 20,
    reminder_time: '02:00 PM',
    createdAt: '30 Aug 2022',
  },

  {
    _id: '4',
    title: 'Walk Regularly',
    status: true,
    to_do: true,
    frequency: [2, 3, 4],
    image: require('../../../Assets/Images/walking.webp'),
    target_date: '25 Sep 2022',
    createdAt: '30 Aug 2022',
    reminder: true,
    daysCompleted: 15,
    reminder_time: '10:00 PM',
  },
];

const weekDays = [
  {name: 'Monday', day: 1, value: false},
  {name: 'Tuesday', day: 2, value: false},
  {name: 'Wednesday', day: 3, value: false},
  {name: 'Thursday', day: 4, value: false},
  {name: 'Friday', day: 5, value: false},
  {name: 'Satuday', day: 6, value: false},
  {name: 'Sunday', day: 7, value: false},
];

// const data = {
//   labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],

//   datasets: [
//     {
//       data: [20, 45, 28, 80, 99, 43, 87],
//       strokeWidth: 2, // optional
//     },
//   ],
// };
