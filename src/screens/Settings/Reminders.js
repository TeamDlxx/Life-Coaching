import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Image,
    Pressable,
    Switch,
    ScrollView,
    Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import {
    mainStyles,
    other_style,
    reminder_styles,
} from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import showToast from '../../functions/showToast';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rountToNextmins from '../../functions/rountToNextmins';


const Reminders = props => {
    const [showModal, setShowModal] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [time, setTime] = useState(rountToNextmins(0));

    React.useEffect(() => {
        getReminderTime();
        getReminderValue();
        return () => {}
    },[])

    const getReminderTime = async () => {
        return await AsyncStorage.getItem('@reminderTime').then(val => {
            if (val !== null) {
                console.log(val, "Reminder Time ...")
                setTime(moment(val).toISOString());
            }
        })
    }

    const getReminderValue = async () => {
        return await AsyncStorage.getItem('@reminderValue').then(val => {
            if (val !== null) {
                console.log(val, "Reminder Value ...")
                setIsEnabled(JSON.parse(val));
            }
        })
    }

    const switchFunction = async () => {
        await setIsEnabled(!isEnabled)
        console.log(isEnabled, "switch value....")

        if (isEnabled == true) {
            cancelGratitudeNotification("1")
            await AsyncStorage.setItem('@reminderValue', JSON.stringify(false))
        } else {
            showToast('Please select the reminder time', 'Alert')
        }
    }

    const scheduleLocalNotification = async (time) => {
        PushNotification.localNotificationSchedule({
            title: "Gratitude",
            message: "It is your time to add everything you are thankful for today!",
            date: moment(time).toDate(),
            userInfo: {
                _id: "1",
                type: 'gratitude',
            },
            channelId: '6007',
            channelName: 'lifeCoaching',
            smallIcon: 'ic_stat_name',
            repeatType: 'day',
        });
        showToast(
            'Gratitude reminder has been set successfully',
            'Gratitude Reminder',
            'success',
        );
        console.log(" Notification scheduled on ......", time)
    }

    const cancelGratitudeNotification = async id => {
        PushNotification.getScheduledLocalNotifications(list => {
            list.map(x => {
                if (x.data._id == id) {
                    PushNotification.cancelLocalNotification(x.id);
                    console.log("Notification cancelled ......")
                }
            });
        });
    };

    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />

            <Header
                navigation={props.navigation}
                title={'Reminders'}
            />
            <View style={[mainStyles.innerView, { paddingTop: 10 }]}>
                <ScrollView bounces={false} showsVerticalScrollIndicator={false}>

                    <View style={reminder_styles.reminderView}>
                        <View style={{ marginBottom: 0, paddingVertical: 10 }}>
                            <Text style={other_style.labelText}>Gratitude Reminder</Text>
                        </View>
                        <View>
                            <Switch
                                value={isEnabled}
                                onValueChange={switchFunction}
                                trackColor={{ true: Colors.primary }}
                                thumbColor={
                                    Platform.OS == 'android' ? Colors.gray01 : Colors.white
                                }
                            />
                        </View>
                    </View>


                    <View style={reminder_styles.timeButton}>
                        <View style={{}}>
                            <Image
                                source={require('../../Assets/Icons/alert.png')}
                                style={{ height: 80, width: 80 }}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginTop: 10,
                                }}>
                                <Text
                                    style={[
                                        reminder_styles.timeButtonTextHeader,
                                        { marginTop: 0 },
                                    ]}>
                                    Set Reminder
                                </Text>
                            </View>
                            <Text style={reminder_styles.timeButtonText1}>
                                You will recieve a daily reminder on the following
                                time{' '}
                            </Text>
                            <Pressable
                                onPress={() =>
                                    isEnabled == true ? setShowModal(!showModal)
                                        : showToast('Please turn on the reminder', 'Alert')
                                }
                                style={reminder_styles.selectTimeButtion}>
                                <Text style={[reminder_styles.timeButtonText2]}>
                                    {moment(time).format('hh:mm A')}
                                </Text>
                            </Pressable>
                        </View>
                    </View>


                </ScrollView>

            </View>
            <DateTimePickerModal
                accentColor={Colors.primary}
                buttonTextColorIOS={Colors.primary}
                isVisible={showModal}
                mode="time"
                display="spinner"
                date={moment(time).toDate()}
                is24Hour={false}
                onConfirm={async (val) => {
                    console.log(val, "value .... ")

                    await setTime(moment(val).toISOString())
                    await setShowModal(false)

                    const asyncData = [
                        ['@reminderTime', moment(val).toISOString(),],
                        ['@reminderValue', JSON.stringify(isEnabled)]
                    ]

                    await AsyncStorage.multiSet(asyncData);
                    console.log(asyncData, "async data....")

                    await cancelGratitudeNotification("1")
                    scheduleLocalNotification(val)
                }
                }
                onCancel={() =>
                    setShowModal(false)
                }
            />

        </SafeAreaView>
    );
};

export default Reminders;
