import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  Alert,
  RefreshControl,
  Dimensions,
  FlatList,
  TextInput,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import {mainStyles, stat_styles} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';

import moment from 'moment';
import {notesColors} from '../../../Utilities/Colors';
import analytics from '@react-native-firebase/analytics';
import CustomButton from '../../../Components/CustomButton';
import {CustomTouchableTextInput} from '../../../Components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import showToast from '../../../functions/showToast';

const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');

const Filter = props => {
  const {navigation} = props;
  const {params} = props.route;
  const [selectedColors, setSelectedColors] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days').toISOString(),
    endDate: moment().toISOString(),
    startDateModal: false,
    endDateModal: false,
  });

  React.useEffect(() => {
    console.log(params?.filter, 'filter');
    if (params?.filter) {
      if (params?.filter.startDate != '' && params?.filter.endDate != '') {
        setDateRange({
          ...dateRange,
          startDate: params.filter.startDate,
          endDate: params.filter.endDate,
        });
      }

      if (params.filter.selectedColors.length != 0) {
        setSelectedColors(params.filter.selectedColors);
      }
    }
    analytics().logEvent(props?.route?.name);
  }, []);
  const btn_ClearFilter = () => {
    setSelectedColors([]);
    setDateRange({
      startDate: moment().subtract(7, 'days').toISOString(),
      endDate: moment().toISOString(),
      startDateModal: false,
      endDateModal: false,
    });

    navigation.navigate({
      name: screens.notesList,
      params: {
        filter: {
          date: {
            start: '',
            end: '',
          },
          selectedColors: [],
        },
      },
      merge: true,
    });
  };
  const btn_applyFilter = () => {
    if (
      moment(dateRange.endDate).isSameOrBefore(dateRange.startDate, 'dates')
    ) {
      showToast(
        'Please select valid date range with difference of at least one day',
        'Alert',
      );
    } else {
      navigation.navigate({
        name: screens.notesList,
        params: {
          filter: {
            date: {
              start: dateRange.startDate.toString(),
              end: dateRange.endDate.toString(),
            },
            selectedColors: selectedColors,
          },
        },
        merge: true,
      });
    }
  };

  const toggleSelect = item => {
    let temp = [...selectedColors];
    let index = temp.findIndex(x => x._id == item._id);
    if (index != -1) {
      temp.splice(index, 1);
    } else {
      temp.push(item);
    }
    setSelectedColors(temp);
  };

  const filterView = () => {
    return (
      <View
        style={{
          marginHorizontal: 10,
          borderRadius: 10,
          flex: 1,
        }}>
        <View>
          <View
            style={{
              marginTop: 20,
              backgroundColor: Colors.background,
              borderRadius: 10,
              padding: 10,
            }}>
            <Text style={{fontFamily: font.bold, fontSize: 16}}>Colors</Text>

            <View style={{marginTop: 10}}>
              <FlatList
                data={notesColors}
                numColumns={2}
                renderItem={({item, index}) => {
                  return (
                    <View style={{flex: 1 / 2}}>
                      <Pressable
                        onPress={() => toggleSelect(item)}
                        style={{
                          flex: 1,
                          backgroundColor: Colors.white,
                          margin: 5,
                          padding: 10,
                          borderRadius: 15,
                          flexDirection: 'row',
                          alignItems: 'center',
                          borderWidth: 1,
                          borderColor: Colors.gray02,
                        }}>
                        <View
                          style={{
                            height: 30,
                            width: 30,
                            backgroundColor: item.dark,
                            borderRadius: 999,
                            justifyContent: 'center',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              height: '80%',
                              width: '80%',
                              backgroundColor: item.dark,
                              borderRadius: 999,
                            }}
                          />
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                          <Image
                            source={
                              selectedColors.find(x => x._id == item._id)
                                ? checked
                                : unChecked
                            }
                            style={[
                              stat_styles.filterButtonIcon,
                              // {tintColor: Colors.placeHolder},
                            ]}
                          />
                        </View>
                      </Pressable>
                    </View>
                  );
                }}
              />
            </View>
          </View>

          <View
            style={{
              marginTop: 20,
              backgroundColor: Colors.background,
              borderRadius: 10,
              padding: 10,
            }}>
            <Text style={{fontFamily: font.bold, fontSize: 16}}>Date</Text>

            <View style={{flexDirection: 'row', marginTop: 10}}>
              <View style={{flex: 1}}>
                <CustomTouchableTextInput
                  onPress={() =>
                    setDateRange({...dateRange, startDateModal: true})
                  }
                  lable="From"
                  // lableStyle={{fontFamily:font.regular}}
                  height={45}
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
                  lableColor={Colors.black}
                  value={moment(dateRange.endDate).format('DD MMM YYYY')}
                />
              </View>
            </View>
          </View>

          <View style={{marginTop: 20, flexDirection: 'row'}}>
            <View style={{flex: 1, marginRight: 10}}>
              <CustomButton
                onPress={() => btn_ClearFilter()}
                title="Reset"
                height={45}
                backgroundColor={Colors.lightPrimary2}
                textColor={Colors.primary}
              />
            </View>
            <View style={{flex: 1}}>
              <CustomButton
                onPress={() => btn_applyFilter()}
                title="Apply"
                height={45}
              />
            </View>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView
      style={[
        mainStyles.MainView,
        {
          // backgroundColor: isSearchVisible ? Colors.background : Colors.white,
          backgroundColor: Colors.white,
        },
      ]}>
      <StatusBar barStyle={'dark-content'} backgroundColor={Colors.white} />
      <Header navigation={navigation} titleAlignLeft title={'Filter'} />
      <View style={{flex: 1, paddingHorizontal: 10}}>{filterView()}</View>
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
            startDate: moment(val).toISOString(),
            startDateModal: false,
          });
        }}
        // maximumDate={moment(dateRange.endDate).subtract(1, 'day').toDate()}
        maximumDate={moment().toDate()}
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
        // minimumDate={moment(dateRange.startDate).add(1, 'day').toDate()}
        maximumDate={moment().toDate()}
        display={Platform.OS == 'android' ? 'default' : 'inline'}
        onConfirm={val => {
          setDateRange({
            ...dateRange,
            endDate: moment(val).toISOString(),
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

export default Filter;
