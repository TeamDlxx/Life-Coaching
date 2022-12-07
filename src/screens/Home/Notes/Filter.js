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
import {
  mainStyles,
  allHabit_styles,
  FAB_style,
  stat_styles,
} from '../../../Utilities/styles';
import {font} from '../../../Utilities/font';
import {screens} from '../../../Navigation/Screens';
import {SwipeListView} from 'react-native-swipe-list-view';
import * as Progress from 'react-native-progress';
import moment from 'moment';
import CustomImage from '../../../Components/CustomImage';
import {notesColors} from '../../../Utilities/Colors';
import Collapsible from 'react-native-collapsible';
import Modal from 'react-native-modal';
import CustomButton from '../../../Components/CustomButton';
import {CustomTouchableTextInput} from '../../../Components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const checked = require('../../../Assets/Icons/checked.png');
const unChecked = require('../../../Assets/Icons/unchecked.png');

const Filter = props => {
  const {navigation} = props;
  const [selectedColors, setSelectedColors] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: moment().subtract(7, 'days'),
    endDate: moment(),
    startDateModal: false,
    endDateModal: false,
  });

  const toggleSelect = item => {
    let temp = [...selectedColors];
    let index = temp.findIndex(x => x.id == item.id);
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
                    <Pressable
                      onPress={() => toggleSelect(item)}
                      style={{
                        flex: 1 / 2,
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
                            selectedColors.find(x => x.id == item.id)
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

          <View style={{marginTop: 20}}>
            <CustomButton
              onPress={() => navigation.goBack()}
              title="Apply"
              height={45}
            />
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
            startDate: val,
            startDateModal: false,
          });
        }}
        maximumDate={moment(dateRange.endDate).subtract(1, 'day').toDate()}
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

export default Filter;
