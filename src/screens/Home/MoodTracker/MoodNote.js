import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Alert,
    Pressable,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { font } from '../../../Utilities/font';
import React, { useEffect, useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles } from '../../../Utilities/styles';
import { screens } from '../../../Navigation/Screens';
import { CustomMultilineTextInput, CustomSimpleTextInput } from '../../../Components/CustomTextInput';
import showToast from '../../../functions/showToast';
import { useContext } from 'react';
import Context from '../../../Context';
import moment from 'moment';
import invokeApi from '../../../functions/invokeAPI';
import Loader from '../../../Components/Loader';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';


const MoodNote = props => {
    const { Token, allMoodJournals, setAllMoodJournals, updateAllMoodJournals } = useContext(Context);
    const { params } = props.route;
    const [isLoading, setisLoading] = useState(false);
    const oldData = params?.oldData

    const [note, setNote] = useState({
        title: oldData ? oldData.title : '',
        description: oldData ? oldData.description : '',
    });

    const updateNote = updation => setNote({ ...note, ...updation });


    // BackButton Handler 
    const onBackPress = () => {
        if (oldData && (note.title != oldData?.title ||
            note.description != oldData?.description 
        )) {
            Alert.alert(
                'Unsaved Changes',
                'Are you sure you want to discard changes?',
                [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
            );
        }
        else if (oldData == undefined && (note.title != '' ||
            note.description != '')) {
            Alert.alert(
                'Unsaved Changes',
                'Are you sure you want to discard changes?',
                [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
            );
        }
        else {
            props.navigation.goBack();
        }
        return true;
    };

    // phone's back button listener

    useFocusEffect(
        useCallback(() => {
            const subscription = BackHandler.addEventListener(
                'hardwareBackPress',
                onBackPress,
            );
            return () => subscription.remove();
        }, [note]),
    );

    const btn_Save = () => {

        let t_mood = params?.moodItem.mood;
        let t_intensity = params?.moodItem.intensity;
        let t_emotion = params?.moodItem.emotion;
        let t_sphere = params?.moodItem.sphere;
        let t_title = note.title.trim();
        let t_description = note.description.trim();
        let t_date = moment(params?.moodItem.date).toISOString();


        if (t_title == '') {
            showToast('Please enter a title', 'Alert');
        } else {
            let fd_createMood = new FormData();
            fd_createMood.append('mood', t_mood);
            fd_createMood.append('intensity', t_intensity);
            fd_createMood.append('emotion', JSON.stringify(t_emotion));
            fd_createMood.append('sphere_of_life', JSON.stringify(t_sphere));
            fd_createMood.append('title', t_title);
            fd_createMood.append('description', t_description);
            fd_createMood.append('date', t_date)

            console.log(fd_createMood, "Form Data ........")
            api_createMood(fd_createMood);
        }
    }

    const api_createMood = async fdata => {
        setisLoading(true);

        let res = await invokeApi({
            path: 'api/mood/add_mood',
            method: 'POST',
            postData: fdata,
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
                console.log(res)
                await updateAllMoodJournals(res?.mood);
                if (params?.parameters) {
                    props.navigation.reset({
                        index: 0,
                        routes: [{ name: 'BOTTOM_TABS_SCREEN' }, { name: 'MOOD_CHART' }, { name: 'MOODS_JOURNAL' },]
                    })
                } else {
                    props.navigation.navigate(screens.moodsJournal);
                }
            } else {
                showToast(res.message);
            }
        }
        setisLoading(false);
    };

    const btn_Update = () => {
        let t_mood = params?.moodItem.mood;
        let t_intensity = params?.moodItem.intensity;
        let t_emotion = params?.moodItem.emotion;
        let t_sphere = params?.moodItem.sphere;
        let t_title = note.title.trim();
        let t_description = note.description.trim();
        let t_date = moment(params?.moodItem.date).toISOString();

        if (t_title == '') {
            showToast('Please enter a title', 'Alert');
        } else {
            let fd_editMood = new FormData();
            fd_editMood.append('mood', t_mood);
            fd_editMood.append('intensity', t_intensity);
            fd_editMood.append('emotion', JSON.stringify(t_emotion))
            fd_editMood.append('sphere_of_life', JSON.stringify(t_sphere));
            fd_editMood.append('title', t_title);
            fd_editMood.append('description', t_description);
            fd_editMood.append('date', t_date)
            console.log(fd_editMood, "Form Data ........")
            api_editMood(fd_editMood);
        }
    };

    const api_editMood = async fdata => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/mood/edit_mood/' + oldData?._id,
            method: 'PUT',
            postData: fdata,
            headers: {
                'Content-Type': 'multipart/form-data',
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {

                showToast(
                    'Mood has been updated successfully',
                    'Mood Updated',
                    'success',
                );
                updateAllMoodsList(res?.mood);
                if (!!params?.parameters.updateMoodDetail) {
                    console.log("selected mood id is updated...")
                    params?.parameters.updateMoodDetail(res?.mood);
                }
                if (!!params?.parameters.updateMood) {
                    params?.parameters.updateMood(res?.mood);
                }
                props.navigation.navigate(screens.moodDetail);
                // props?.navigation.goBack();
            } else {
                showToast(res.message);
            }
        }
    };

    const updateAllMoodsList = mood => {
        let newArray = [...allMoodJournals];
        let index = newArray.findIndex(x => x._id == mood._id);
        if (index != -1) {
            newArray.splice(index, 1, mood);
            setAllMoodJournals(newArray);
        }
    };


    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header navigation={props.navigation} 
            title={oldData ? "Update Note " : 'Add a note '} 
            onBackPress={onBackPress} />
            <View style={mainStyles.innerView}>

                <KeyboardAwareScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={{ marginTop: 20 }}>
                        <Text style={{ marginBottom: -20, marginLeft: 5, }}>
                            <Text
                                style={{
                                    color: Colors.black,
                                    fontFamily: font.bold,
                                    letterSpacing: 0.5,
                                }}>
                                {"Title"}
                            </Text>
                            <Text style={{ color: 'red', fontSize: 17, height: 13, }}>*</Text>
                        </Text>
                        <CustomSimpleTextInput
                            autoCapitalize={true}
                            lableBold={true}
                            placeholder={'Your note title'}
                            value={note.title}
                            onChangeText={text => updateNote({ title: text })}
                        />
                    </View>


                    <View style={{ marginTop: 20 }}>
                        <CustomMultilineTextInput
                            autoCapitalize={true}
                            lable={'Description'}
                            lableColor={Colors.black}
                            lableBold={true}
                            placeholder={'Your note description'}
                            value={note.description}
                            onChangeText={text => updateNote({ description: text })}
                        />
                    </View>


                    <Pressable
                        disabled={isLoading}
                        onPress={oldData ? btn_Update : btn_Save}
                        style={{ backgroundColor: Colors.primary, borderRadius: 10, height: 50, alignItems: "center", justifyContent: "center", marginTop: "18%" }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{oldData ? "Update  " : "Save  "}</Text>
                    </Pressable>

                </KeyboardAwareScrollView>
                <Loader enable={isLoading} />
            </View>
        </SafeAreaView>
    );
};

export default MoodNote;

