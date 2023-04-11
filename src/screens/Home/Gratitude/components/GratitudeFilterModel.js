import {
    View,
    Text,
    Image,
    Pressable,
    Platform,
} from 'react-native';
import React, { useState , useEffect } from 'react';
import Colors from '../../../../Utilities/Colors';
import { font } from '../../../../Utilities/font';
import Modal from 'react-native-modal';
import moment from 'moment';
import CustomButton from '../../../../Components/CustomButton';
import { CustomTouchableTextInput } from '../../../../Components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ic_cross from '../../../../Assets/Icons/cross.png';



const GratitudeFilterModel = props => {

    const [dateRange, setDateRange] = useState({
        startDate: moment().subtract(7, 'days').toISOString(),
        endDate: moment().toISOString(),
        startDateModal: false,
        endDateModal: false,
    });

    const [isError, setError] = useState(false);


    useEffect(() => {
        if(props?.previousFilterData?.startDate != '' && props?.previousFilterData?.endDate != ''){
            setDateRange({
                ...dateRange,
                startDate: props?.previousFilterData?.startDate,
                endDate : props?.previousFilterData?.endDate,
            })
        }
    }, [])


    const btn_ClearFilter = async () => {

        setDateRange({
            startDate: "",
            endDate: "",
            startDateModal: false,
            endDateModal: false,
        });

        await props.filter({
            startDate: moment().subtract(7, 'days').toISOString(),
            endDate: moment().toISOString(),
        })

        props.filterGratitudeApi({
            start_date: '',
            end_date: '',
        })

        props.onCancel()

    };
    const btn_applyFilter = async () => {
        if (
            moment(dateRange.endDate).isSameOrBefore(dateRange.startDate, 'dates')
        ) {
            setError(true)
        } else {
            setError(false)
            await props.filter({
                startDate: dateRange.startDate.toString(),
                endDate: dateRange.endDate.toString(),
            })

            props.filterGratitudeApi({
                start_date: dateRange.startDate.toString(),
                end_date: dateRange.endDate.toString(),
            })

            props.onCancel()
        }
    };

    return (
        <Modal
            isVisible={props.visible}
            transparent
            onBackButtonPress={props.onCancel}
            onBackdropPress={props.onCancel}
            useNativeDriverForBackdrop={true}
            hasBackdrop={true}
            backdropOpacity={0.65}
            style={{ marginTop: 'auto', marginHorizontal: 0 }}
        >
            <View
                style={{
                    backgroundColor: '#fff',
                    marginTop: 'auto',
                    marginBottom: Platform.OS == 'ios' ? 30 : 10,
                    marginHorizontal: 10,
                    borderRadius: 10,
                    padding: 20,
                }}>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                fontFamily: font.bold,
                                letterSpacing: 0.5,
                            }}>
                            Select Date
                        </Text>
                    </View>

                    <Pressable
                        onPress={props.onCancel}
                        style={{ alignItems: 'center' }}>
                        <View
                            style={{
                                backgroundColor: '#BDC3C744',
                                height: 30,
                                width: 30,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 25,
                            }}>
                            <Image source={ic_cross} style={{ height: 12, width: 12 }} />
                        </View>
                    </Pressable>
                </View>



                <View
                    style={{
                        marginTop: 25,
                        backgroundColor: Colors.background,
                        borderRadius: 10,
                        padding: 10,
                    }}>
                    <Text style={{ fontFamily: font.bold, fontSize: 16, marginLeft: 5 }}>Date</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <CustomTouchableTextInput
                                onPress={() =>
                                    setDateRange({ ...dateRange, startDateModal: true })
                                }
                                lable="From"
                                height={45}
                                lableColor={Colors.black}
                                value={moment(dateRange.startDate).format('DD MMM YYYY')}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <CustomTouchableTextInput
                                onPress={() =>
                                    setDateRange({ ...dateRange, endDateModal: true })
                                }
                                height={45}
                                lable="To"
                                lableColor={Colors.black}
                                value={moment(dateRange.endDate).format('DD MMM YYYY')}
                            />
                        </View>
                    </View>

                    {isError && <>
                        <Text
                            style={{
                                marginTop: 10,
                                marginLeft: 5,
                                fontSize: 12,
                                color: "red"
                            }}
                        >Please select valid date range with difference of at least one day! </Text>
                    </>}
                </View>

                <View style={{ marginTop: 20, flexDirection: 'row' }}>
                    <View style={{ flex: 1, marginRight: 10 }}>
                        <CustomButton
                            onPress={() => btn_ClearFilter()}
                            title="Reset"
                            height={45}
                            backgroundColor={Colors.lightPrimary2}
                            textColor={Colors.primary}
                        />
                    </View>
                    <View style={{ flex: 1 }}>
                        <CustomButton
                            onPress={() => btn_applyFilter()}
                            title="Apply"
                            height={45}
                        />
                    </View>
                </View>

            </View>

            <DateTimePickerModal
                accentColor={Colors.primary}
                buttonTextColorIOS={Colors.primary}
                isVisible={dateRange.startDateModal}
                mode="date"
                display={Platform.OS == 'android' ? 'default' : 'inline'}
                date={moment(dateRange.startDate).toDate()}
                onChange={val => {
                    setDateRange({
                        ...dateRange,
                        startDate: moment(val).toISOString(),
                    });
                }}
                onConfirm={async val => {
                    await setDateRange({
                        ...dateRange,
                        startDate: moment(val).toISOString(),
                        startDateModal: false,
                    });
                }}
                maximumDate={moment().toDate()}
                onCancel={() =>
                    setDateRange({
                        ...dateRange,
                        startDateModal: false,
                    })
                }
            />

            <DateTimePickerModal
                accentColor={Colors.primary}
                buttonTextColorIOS={Colors.primary}
                isVisible={dateRange.endDateModal}
                mode="date"
                date={moment(dateRange.endDate).toDate()}
                maximumDate={moment().toDate()}
                display={Platform.OS == 'android' ? 'default' : 'inline'}
                onChange={val => {
                    setDateRange({
                        ...dateRange,
                        endDate: moment(val).toISOString(),
                    });
                }}
                onConfirm={async val => {
                    await setDateRange({
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
        </Modal>
    );
};

export default GratitudeFilterModel;
