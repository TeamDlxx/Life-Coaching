import {
    View,
    Text,
    Image,
    Pressable,
    Platform,
    FlatList
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../../Utilities/Colors';
import { font } from '../../../../Utilities/font';
import Modal from 'react-native-modal';
import moment from 'moment';
import CustomButton from '../../../../Components/CustomButton';
import { CustomTouchableTextInput } from '../../../../Components/CustomTextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import ic_cross from '../../../../Assets/Icons/cross.png';
import { notesColors } from '../../../../Utilities/Colors';
import { mainStyles, stat_styles } from '../../../../Utilities/styles';


const checked = require('../../../../Assets/Icons/checked.png');
const unChecked = require('../../../../Assets/Icons/unchecked.png');

/// Emojis
import Happy from "../../../../Assets/emojy/smile.gif"
import Neutral from "../../../../Assets/emojy/neutral.gif"
import Sad from "../../../../Assets/emojy/sad.gif"
import Cry from "../../../../Assets/emojy/cry.gif"
import Angry from "../../../../Assets/emojy/angrygif.gif"

const MoodsFilterModal = props => {

    const [moods, setMoods] = useState([
        { 'source': Happy, "mood": "Happy", "isSelected": false },
        { 'source': Neutral, "mood": "Neutral", "isSelected": false },
        { 'source': Sad, "mood": "Sad", "isSelected": false },
        { 'source': Cry, "mood": "Cry", "isSelected": false },
        { 'source': Angry, "mood": "Angry", "isSelected": false },
    ]);

    const [dataRange, setDataRange] = useState({
        startDate: moment().subtract(7, 'days').toISOString(),
        endDate: moment().toISOString(),
        startDateModal: false,
        endDateModal: false,
        selectedMoods: props?.previousFilterData ? props?.previousFilterData?.moods : []
    });
    const [isError, setError] = useState(false);


    useEffect(() => {
        if(props?.previousFilterData?.startDate != '' && props?.previousFilterData?.endDate != ''){
            setDataRange({
                ...dataRange,
                startDate: props?.previousFilterData?.startDate,
                endDate : props?.previousFilterData?.endDate,
            })
        }
        if (props?.previousFilterData) {
            setPreviousData()
        }
    }, [])

    const setPreviousData = async () => {
        for (let i = 0; i < props?.previousFilterData?.moods.length; i++) {
            let index = await moods.findIndex((obj) => obj.mood === props?.previousFilterData?.moods[i])
            if (index != -1) {
                moods[index].isSelected = !moods[index].isSelected
                await setMoods([...moods]);
            }
        }
    }


    const toggleSelect = async (item, idx) => {

        moods[idx].isSelected = !moods[idx].isSelected;
        await setMoods([...moods]);

        let temp = [...dataRange.selectedMoods];
        let index = temp.findIndex(x => x == item?.mood);
        if (index != -1) {
            temp.splice(index, 1);
        } else {
            temp.push(item.mood);
        }

        await setDataRange({
            ...dataRange,
            selectedMoods: [...temp]
        })

        console.log(dataRange.selectedMoods, "mooods....")
    };


    const btn_ClearFilter = async () => {
        setDataRange({
            ...dataRange,
            selectedMoods: []
        })
        setDataRange({
            startDate: "",
            endDate: "",
            startDateModal: false,
            endDateModal: false,
        });

        props.onCancel()
        await props.filter({
            startDate: moment().subtract(7, 'days').toISOString(),
            endDate: moment().toISOString(),
            moods: []
        })

        props.filterMoodApi({
            start_date: '',
            end_date: '',
            moods: ''
        })
    };

    const btn_applyFilter = async () => {
        if (
            moment(dataRange.endDate).isSameOrBefore(dataRange.startDate, 'dates')
        ) {
            setError(true)
        } else {
            setError(false)

            await props.filter({
                startDate: dataRange.startDate.toString(),
                endDate: dataRange.endDate.toString(),
                moods: dataRange.selectedMoods
            })


            console.log(dataRange.selectedMoods, "mooods....")

            props.filterMoodApi({
                start_date: dataRange.startDate.toString(),
                end_date: dataRange.endDate.toString(),
                moods: dataRange.selectedMoods.length != 0 ? JSON.stringify(dataRange.selectedMoods) : ''
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
            style={{ marginTop: 'auto', marginHorizontal: 0, }}
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
                            Moods Filter
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
                        marginTop: 20,
                        backgroundColor: Colors.background,
                        borderRadius: 10,
                        padding: 10,
                    }}>
                    <Text style={{ fontFamily: font.bold, fontSize: 16 }}>Moods </Text>

                    <View style={{ marginTop: 10 }}>
                        <FlatList
                            data={moods}
                            numColumns={2}
                            keyExtractor={(item, index) => { return index.toString() }}
                            renderItem={({ item, index }) => {
                                return (
                                    <View style={{ flex: 1 / 2 }}>
                                        <Pressable
                                            onPress={() => toggleSelect(item, index)}
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
                                            <Image source={item.source} style={{ height: 30, width: 30 }} />

                                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                                <Image
                                                    source={
                                                        // dataRange.selectedMoods.find(x => x == item.mood)
                                                        item.isSelected == true
                                                            ? checked
                                                            : unChecked
                                                    }
                                                    style={[
                                                        stat_styles.filterButtonIcon,
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
                    <Text style={{ fontFamily: font.bold, fontSize: 16, marginLeft: 5 }}>Date</Text>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <View style={{ flex: 1 }}>
                            <CustomTouchableTextInput
                                onPress={() =>
                                    setDataRange({ ...dataRange, startDateModal: true })
                                }
                                lable="From"
                                height={45}
                                lableColor={Colors.black}
                                value={moment(dataRange.startDate).format('DD MMM YYYY')}
                            />
                        </View>
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <CustomTouchableTextInput
                                onPress={() =>
                                    setDataRange({ ...dataRange, endDateModal: true })
                                }
                                height={45}
                                lable="To"
                                lableColor={Colors.black}
                                value={moment(dataRange.endDate).format('DD MMM YYYY')}
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

                <View style={{ marginTop: 20, marginBottom: 5, flexDirection: 'row' }}>
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
                isVisible={dataRange.startDateModal}
                mode="date"
                display={Platform.OS == 'android' ? 'default' : 'inline'}
                date={moment(dataRange.startDate).toDate()}
                onChange={val => {
                    setDataRange({
                        ...dataRange,
                        startDate: moment(val).toISOString(),
                    });
                }}
                onConfirm={async val => {
                    await setDataRange({
                        ...dataRange,
                        startDate: moment(val).toISOString(),
                        startDateModal: false,
                    });
                }}
                maximumDate={moment().toDate()}
                onCancel={() =>
                    setDataRange({
                        ...dataRange,
                        startDateModal: false,
                    })
                }
            />

            <DateTimePickerModal
                accentColor={Colors.primary}
                buttonTextColorIOS={Colors.primary}
                isVisible={dataRange.endDateModal}
                mode="date"
                date={moment(dataRange.endDate).toDate()}
                maximumDate={moment().toDate()}
                display={Platform.OS == 'android' ? 'default' : 'inline'}
                onChange={val => {
                    setDataRange({
                        ...dataRange,
                        endDate: moment(val).toISOString(),
                    });
                }}
                onConfirm={async val => {
                    await setDataRange({
                        ...dataRange,
                        endDate: moment(val).toISOString(),
                        endDateModal: false,
                    });
                }}
                onCancel={() =>
                    setDataRange({
                        ...dataRange,
                        endDateModal: false,
                    })
                }
            />
        </Modal>
    );
};

export default MoodsFilterModal;
