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
    StyleSheet,
    Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Header from '../../Components/Header';
import {
    mainStyles,
    other_style,
} from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import showToast from '../../functions/showToast';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import rountToNextmins from '../../functions/rountToNextmins';


const screen = Dimensions.get('screen');

const Reminders = props => {
    const [showModal, setShowModal] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [time, setTime] = useState(rountToNextmins(0));

    React.useEffect(() => {
        getReminderTime();
        getReminderValue();
        return () => { }
    }, [])

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
        }
        // else {
        //     showToast('Please select the reminder time', 'Alert')
        // }
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
                title={'Reminder'}
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


                    <View style={reminder_styles.reminderCard}>
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
                                        reminder_styles.reminderCardTextHeader,
                                        { marginTop: 0 },
                                    ]}>
                                    Set Time
                                </Text>
                            </View>
                            <Text style={reminder_styles.reminderDescription}>
                                You will recieve a daily reminder on this time to add your gratitude{' '}
                            </Text>

                            <View >
                                <Pressable
                                    onPress={() =>
                                        isEnabled == true ? setShowModal(!showModal)
                                            : showToast('Please turn on the reminder', 'Alert')
                                    }
                                    style={[reminder_styles.timeButton, { borderColor: isEnabled == true ? Colors.primary : Colors.gray03, }]}>
                                    <Text style={[reminder_styles.reminderTime, { color: isEnabled == true ? Colors.primary : Colors.gray04, }]}>
                                        {moment(time).format('hh:mm A')}
                                    </Text>
                                </Pressable>
                            </View>
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
                locale="en_GB"
                date={moment(time).toDate()}
                is24Hour={false}
                onConfirm={async (val) => {
                    console.log(val, "value .... ")
                    await setShowModal(false)
                    await setTime(moment(val).toISOString())

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
                onCancel={async () =>
                    await setShowModal(false)
                }
            />

        </SafeAreaView>
    );
};

export default Reminders;

const reminder_styles = StyleSheet.create({

    reminderView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 15,
        borderWidth: 1,
        borderColor: Colors.gray02,
        borderRadius: 10,
        padding: 10,
        backgroundColor: Colors.white,
    },

    reminderCard: {
        borderWidth: 1,
        borderColor: Colors.gray02,
        padding: 30,
        borderRadius: 10,
        marginTop: 15,
        alignItems: 'center',
        backgroundColor: Colors.white,
    },

    reminderCardTextHeader: {
        fontFamily: font.bold,
        color: Colors.black,
        fontSize: 16,
        textAlign: 'center',
        marginTop: 10,
    },

    reminderDescription: {
        fontFamily: font.regular,
        textAlign: 'center',
        marginTop: 10,
    },

    reminderTime: {
        fontFamily: font.bold,
        fontSize: 16,
        textAlign: 'center',
        paddingVertical: 10,
        paddingHorizontal: 15,
    },

    timeButton: {
        borderWidth: 1,
        alignSelf: 'center',
        borderRadius: 10,
        marginTop: 15,
    },
});
