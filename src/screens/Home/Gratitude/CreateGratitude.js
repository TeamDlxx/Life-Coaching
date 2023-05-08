import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    Dimensions,
    Pressable,
    Image,
    Alert,
    TextInput,
    Keyboard,
    StyleSheet,
    Platform,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import React, { useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import showToast from '../../../functions/showToast';
import { mainStyles } from '../../../Utilities/styles';
import { CustomMultilineTextInput, CustomSimpleTextInput } from '../../../Components/CustomTextInput';
import { useContext } from 'react';
import Context from '../../../Context';
import { font } from '../../../Utilities/font';
import ImagePickerModel from './components/ImagePickerModel';
import ic_trash from '../../../Assets/Icons/trash.png';
import CustomImage from '../../../Components/CustomImage';
import ImageZoomer from '../../../Components/ImageZoomer';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BackHandler } from 'react-native';
import { useEffect } from 'react';
import invokeApi from '../../../functions/invokeAPI';
import moment from 'moment';
import Loader from '../../../Components/Loader';
import { screens } from '../../../Navigation/Screens';
import { fileURL } from '../../../Utilities/domains';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


let gratitudeDate = "";
let isGratitudeExist = false;

let tempObj = {
    titles: [],
    description: "",
    images: [],
}

const CreateGratitude = props => {
    const { Token, gratitudesList, setGratitudesList, updateGratitudeList, } = useContext(Context);
    const { params } = props.route;
    const win = Dimensions.get("window");
    const [isLoading, setisLoading] = useState(false);

    const [modalImage, setModalImage] = useState(null);
    const oldGratitude = params?.item;
    const [id, setId] = useState(params?.item?._id);
    const [isValueChange, setChange] = useState(false);


    const [Gratitude, setGratitude] = useState({
        titlesList: oldGratitude ? oldGratitude.title : [],
        description: oldGratitude ? oldGratitude.description : '',
        images: [],
        oldImages: oldGratitude ? oldGratitude.images : [],
        removedImages: [],
        date: oldGratitude ? moment(oldGratitude.date).toDate() : moment().toDate(),
    });

    const updateGratitude = (updation) => {

        console.log("update gratitude called", updation)
        console.log("gratitude gratitude called", Gratitude)

        let newGratitude = { ...Gratitude, ...updation };

        try {
            setGratitude(newGratitude);
        }
        catch (e) {
            console.log(e, "error in update gratitude")
        }
    }

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false);

    // BackButton Handler 
    const onBackPress = () => {

        if (oldGratitude) {
            if (Gratitude.description != oldGratitude?.description ||
                moment(Gratitude.date).toISOString() != oldGratitude?.date ||
                oldGratitude.images.length != Gratitude?.oldImages.length ||
                Gratitude?.images.length != 0 ||
                oldGratitude?.title.length != Gratitude?.titlesList.length ||
                oldGratitude?.title != Gratitude?.titlesList
            ) {

                console.log("yess......")
                Alert.alert(
                    'Unsaved Changes',
                    'Are you sure you want to discard changes?',
                    [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
                    { cancelable: true },
                );
            }
            else {
                props.navigation.goBack();
            }
        }
        else if (isGratitudeExist == true) {

            if (isValueChange == true) {
                Alert.alert(
                    'Unsaved Changes',
                    'Are you sure you want to discard changes?',
                    [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
                    { cancelable: true },
                );
            } else {
                props.navigation.goBack();
            }
        }
        else if (isGratitudeExist == false) {
            let isError = false;
            if (Gratitude.description != '' ||
                Gratitude.images.length != 0) {
                isError = true;
            }

            for (let i = 0; i < Gratitude?.titlesList.length; i++) {
                if (Gratitude?.titlesList[i] != "") {
                    isError = true;
                }
            }

            if (isError == true) {
                Alert.alert(
                    'Unsaved Changes',
                    'Are you sure you want to discard changes?',
                    [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
                    { cancelable: true },
                );
            }
            else {
                props.navigation.goBack();
            }

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
        }, []),
    );

    useEffect(() => {
        if (gratitudesList.length == 0) {
            gratitudeDate = "";
            isGratitudeExist = false;
        }
        const unsubscribe = props.navigation.addListener('focus', () => {

            tempObj = {
                titles: [],
                description: "",
                images: []
            }
            if (oldGratitude == undefined) {
                checkGratitudeExist(moment().toDate())
            }

            if (oldGratitude == undefined && params?.allGratitudes.length == 0) {
                addNewTextField()
                console.log(Gratitude.titlesList, "title list........")
            }
        });
        return unsubscribe;
    }, [props.navigation]);


    const checkGratitudeExist = async (date) => {
        for (let i = 0; i < params.allGratitudes.length; i++) {
            if (moment(params.allGratitudes[i].date).format("DD-MM-YYYY") == moment(date).format("DD-MM-YYYY")) {
                isGratitudeExist = true;

                let titles = params.allGratitudes[i].title;
                let date = moment(params.allGratitudes[i].date).toDate();
                let description = params.allGratitudes[i].description;
                let images = params.allGratitudes[i].images;

                Gratitude.titlesList = titles;
                Gratitude.date = date;
                Gratitude.description = description;
                Gratitude.oldImages = images;
                Gratitude.images = [];
                Gratitude.removedImages = [];

                setId(params.allGratitudes[i]._id)
                console.log(id, "idddd.....")

                await setGratitude({ ...Gratitude })
                break;

            } else if (tempObj.titles.length != 0 || tempObj.description != "" || tempObj.images.length != 0) {
                isGratitudeExist = false;
                setId('');

                Gratitude.titlesList = tempObj.titles;
                Gratitude.description = tempObj.description;
                Gratitude.images = tempObj.images;
                Gratitude.oldImages = [];
                Gratitude.removedImages = [];
                Gratitude.date = date;

                await setGratitude({ ...Gratitude })
            }
            else {
                isGratitudeExist = false;
                setId('');

                Gratitude.titlesList = [];
                Gratitude.date = date;
                Gratitude.description = "";
                Gratitude.oldImages = [];
                Gratitude.images = [];
                Gratitude.removedImages = [];
                await setGratitude({ ...Gratitude })
                addNewTextField()
            }
        }
    }


    const btn_Save = () => {
        let t_title = Gratitude.titlesList;
        let t_description = Gratitude.description.trim();
        let t_date = moment(Gratitude.date).toISOString();

        let isError = false;

        if (t_title.length != 0) {
            for (let i = 0; i < t_title.length; i++) {
                if (t_title[i] == '') {
                    showToast('Inputs are not allowed to be empty', 'Alert');
                    isError = true;
                }
            }
        }
        if (isError == false) {
            console.log("save....")
            let fd_createGratitude = new FormData();
            fd_createGratitude.append('title', JSON.stringify(t_title));
            fd_createGratitude.append('description', t_description);
            fd_createGratitude.append('date', t_date)
            Gratitude.images.forEach(image => fd_createGratitude.append('image', image));
            // fd_createGratitude.append('image', t_images)

            console.log(fd_createGratitude, "Form Data ........")
            api_createGratitude(fd_createGratitude);
        }
    };


    const api_createGratitude = async fdata => {
        setisLoading(true);

        let res = await invokeApi({
            path: 'api/gratitude/add_gratitude',
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
                await updateGratitudeList(res?.gratitude);
                props.navigation.navigate(screens.gratitude);
                // props.navigation.goBack()
            } else {
                showToast(res.message);
            }
        }
        setisLoading(false);
    };

    const btn_Update = () => {
        let t_title = Gratitude.titlesList;
        let t_description = Gratitude.description.trim();
        let t_removeImages = Gratitude.removedImages;
        let t_oldImages = Gratitude.oldImages;
        // let t_date = moment(Gratitude.date).toISOString();

        let isError = false;

        if (t_title.length != 0) {
            for (let i = 0; i < t_title.length; i++) {
                if (t_title[i] == '') {
                    showToast('Inputs are not allowed to be empty', 'Alert');
                    isError = true;
                }
            }
        }

        if (isError == false) {
            console.log("edit....")
            let fd_editGratitude = new FormData();
            fd_editGratitude.append('title', JSON.stringify(t_title));
            fd_editGratitude.append('description', t_description);
            // fd_editGratitude.append('date', t_date)
            Gratitude.images.forEach(image => fd_editGratitude.append('image', image));
            fd_editGratitude.append('remove_images', JSON.stringify(t_removeImages));
            fd_editGratitude.append('old_images', JSON.stringify(t_oldImages));
            console.log(fd_editGratitude, "Form Data ........")
            api_editGratitude(fd_editGratitude);
        }
    };

    const api_editGratitude = async fdata => {
        console.log(fdata)
        setisLoading(true);
        let res = await invokeApi({
            // path: 'api/gratitude/edit_gratitude/' + params.item?._id,
            path: 'api/gratitude/edit_gratitude/' + id,
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
                    'Gratitude has been updated successfully',
                    'Gratitude Updated',
                    'success',
                );
                updateAllGratitudeList(res?.gratitude);
                if (!!params?.updateGratitudeDetail) {
                    console.log("selected gratitude id is updated...")
                    params?.updateGratitudeDetail(res?.gratitude);
                }
                if (!!params?.updateGratitude) {
                    params?.updateGratitude(res?.gratitude);
                }
                props?.navigation.goBack();
            } else {
                showToast(res.message);
            }
        }
    };

    const updateAllGratitudeList = gratitude => {
        let newArray = [...gratitudesList];
        let index = newArray.findIndex(x => x._id == gratitude._id);
        if (index != -1) {
            newArray.splice(index, 1, gratitude);
            setGratitudesList(newArray);
        }
    };

    const addImage = async (img) => {
        let tempArr = [];
        if (img) {
            let arr = [];
            for (let i = 0; i < img.length; i++) {
                let objImage;
                if (Platform.OS == 'android') {
                    let name = img[i].path.split('/');
                    objImage = {
                        uri: img[i].path,
                        name: name[name.length - 1],
                        type: img[i].mime,
                    };
                } else if (Platform.OS == 'ios') {
                    objImage = {
                        uri: img[i].path,
                        name: img[i].filename,
                        type: img[i].mime,
                    };
                };
                arr = [...arr, objImage]
                tempArr = [...arr]
                updateGratitude({ images: [...arr, ...Gratitude.images] });
                // await setImages((currentImages) => [objImage, ...currentImages]);
                // await setImages((currentImages) => [img[i].path, ...currentImages]);
            }
        }

        if (isGratitudeExist) {
            await setChange(true)
        } else {
            tempObj.images.push(...tempArr)
        }
    };

    const removeImage = async (index) => {
        let temp = [...Gratitude.images];
        temp.splice(index, 1);
        updateGratitude({ images: [...temp] });
        // await setImages((currentImages) => currentImages.filter((item, idx) => idx !== index));
        if (isGratitudeExist) {
            await setChange(true)
        }
    };

    // Add in Remove Array
    const addInRemoveArray = obj => {
        let newArray = [...Gratitude.oldImages];
        let index = newArray.findIndex(x => x.small == obj.small);
        let arr = [obj.small, obj.medium, obj.large];
        console.log(arr, 'removed Image arr...');
        let uniqArr = [...new Set(arr)];
        console.log(uniqArr, 'uniqArr...');
        if (index != -1) {
            newArray.splice(index, 1);
            updateGratitude({
                oldImages: [...newArray],
                removedImages: [...Gratitude.removedImages, ...uniqArr],
            });
        }

        if (isGratitudeExist) {
            setChange(true)
        }
    };

    const renderImages = ({ item, index }) => {
        return (
            <Pressable
                onPress={() => showImageModal(!!item?.uri ? item.uri : fileURL + item?.large)}
                style={{
                    marginHorizontal: 10,
                    width: win.width / 4,
                    borderRadius: 20,
                    marginVertical: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: Colors.white,
                    borderColor: Colors.gray02,
                    borderWidth: 1,
                    aspectRatio: 1,

                }}>
                <>
                    <CustomImage
                        source={{ uri: item?.uri ? item.uri : fileURL + item?.medium }}
                        // source={{ uri: fileURL + item?.small }}
                        style={{
                            flex: 1,
                            width: '100%',
                            height: '100%',
                        }}
                        imageStyle={{
                            borderRadius: 20,
                        }}
                        indicatorProps={{
                            color: Colors.primary,
                        }}
                    />
                    <Pressable
                        onPress={() => !!item?.uri ? removeImage(index) : addInRemoveArray(item)}
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '40%',
                            bottom: 0,
                            overflow: 'hidden',
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                        }}>
                        <View style={{ flex: 1 }} />
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: '#FFFFFF88',
                                alignItems: 'center',
                                justifyContent: 'center',
                                paddingBottom: 2
                            }}>
                            <Image
                                source={ic_trash}
                                style={{ height: 15, width: 15, tintColor: '#000' }}
                            />
                        </View>
                    </Pressable>
                </>
            </Pressable>
        );
    };

    const showImageModal = async (image) => {
        await setModalImage(image);
    };

    const hideImageModal = () => {
        setModalImage(null);
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleDateConfirm = async date => {

        try {
            console.log(date)
            hideDatePicker();
            gratitudeDate = date;
            await updateGratitude({ date: date })
            await setTimePickerVisibility(true)
            if (Platform.OS == "ios") {
                await checkGratitudeExist(date)

            }
        }
        catch (e) {
            console.log(e)
        }

    };

    const handleTimeConfirm = async time => {
        console.log(time, "time...")
        hideTimePicker();
        gratitudeDate = time;
        await updateGratitude({ date: time })
        await checkGratitudeExist(gratitudeDate)
    };

    const hideTimePicker = async () => {
        await setTimePickerVisibility(false)
    };

    const addNewTextField = async () => {
        let temp = [...Gratitude.titlesList]
        let obj = { title: '' }
        temp.push(obj.title.trim())
        await updateGratitude({ titlesList: [...temp] })
        console.log(Gratitude.titlesList, "Title List.....")
    }

    const removeTextField = async (idx) => {
        let temp = [...Gratitude.titlesList]
        let titleIdx = temp.findIndex((item, index) => index == idx)
        temp.splice(titleIdx, 1)
        await updateGratitude({ titlesList: temp })
        tempObj.titles = [...temp]
        console.log(Gratitude.titlesList, "Title List.....")

        if (isGratitudeExist) {
            await setChange(true)
        }
    }

    const addToTitlesList = async (txt, idx) => {
        let text = txt;
        Gratitude.titlesList[idx] = text;
        await setGratitude({ ...Gratitude })

        if (isGratitudeExist) {
            setChange(true)
        } else {
            tempObj.titles[idx] = text;
        }

    }



    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header navigation={props.navigation}
                title={params?.item || isGratitudeExist == true ?
                    "Update Gratitude " : "Add Gratitude "}
                onBackPress={onBackPress} />

            <View style={mainStyles.innerView}>
                <KeyboardAwareScrollView
                    bounces={false}
                    showsVerticalScrollIndicator={false}
                    keyboardShouldPersistTaps={'handled'}
                >
                    <View style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                marginLeft: 5,
                                color: Colors.black,
                                fontFamily: font.bold,
                                letterSpacing: 0.5,
                                fontSize: 15,
                            }}>
                            {"Today I'm Happy and Grateful for......"}
                        </Text>

                    </View>

                    <View>
                        <FlatList
                            data={Gratitude.titlesList}
                            scrollEnabled={false}
                            keyExtractor={(item, index) => index}
                            renderItem={(itemData) => {
                                return (
                                    <View style={{ marginTop: 10 }}>
                                        <View style={{ marginBottom: 8 }}>
                                            <Text
                                                style={{
                                                    marginLeft: 5,
                                                    color: Colors.black,
                                                    fontFamily: font.bold,
                                                    letterSpacing: 0.5,
                                                }}>
                                                {itemData.index + 1 + ":"}
                                                <Text style={{ color: "red" }}>{"* "}</Text>
                                            </Text>
                                        </View>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "center",
                                                alignItems: "center"
                                            }}>
                                            <View style={styles.textFieldView}>
                                                <TextInput
                                                    editable={true}
                                                    style={{ paddingHorizontal: 20, fontFamily: font.regular , alignItems: "center" , height: "100%"}}
                                                    autoCorrect={false}
                                                    autoCapitalize={'sentences'}
                                                    selectTextOnFocus={false}
                                                    selectionColor={Colors.primary}
                                                    keyboardType={'default'}
                                                    value={Gratitude.titlesList[itemData.index]}
                                                    onChangeText={(text) => addToTitlesList(text, itemData.index)}
                                                />
                                            </View>

                                            {Gratitude.titlesList.length > 1 && <Pressable
                                                style={{
                                                    height: 30,
                                                    backgroundColor: "transparent"
                                                }}
                                                onPress={() => { removeTextField(itemData.index) }} >
                                                <Image
                                                    style={{
                                                        height: 22,
                                                        width: 22,
                                                        tintColor: "red"
                                                    }}
                                                    source={require("../../../Assets/Icons/minus.png")} />

                                            </Pressable>}
                                        </View>
                                    </View>
                                )
                            }
                            }
                        />
                    </View>

                    <Pressable
                        onPress={addNewTextField}
                        style={{
                            marginTop: 20,
                            height: 55,
                            backgroundColor: Colors.lightPrimary2,
                            borderRadius: 15,
                            overflow: 'hidden',
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderColor: Colors.primary,
                            justifyContent: "center",
                            alignItems: "center"

                        }}>
                        <Image style={{ height: 25, width: 25, tintColor: Colors.primary }} source={require("../../../Assets/Icons/add.png")} />
                    </Pressable>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ marginBottom: 10 }}>
                            <Text
                                style={{
                                    marginLeft: 5,
                                    color: Colors.black,
                                    fontFamily: font.bold,
                                    letterSpacing: 0.5,
                                }}>
                                {"Date"}
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => {
                                Keyboard.dismiss();
                                if (oldGratitude == undefined) {
                                    showDatePicker();
                                }
                            }}
                            style={{
                                height: 55,
                                backgroundColor: '#fff',
                                borderRadius: 15,
                                overflow: 'hidden',
                                borderWidth: 1,
                                borderColor: Colors.gray02,
                                flexDirection: "row",
                                alignItems: "center",
                            }}>
                            <TextInput
                                editable={false}
                                style={{ flex: 1, paddingHorizontal: 20, fontFamily: font.regular, color: oldGratitude ? Colors.disable : Colors.black , height: "100%"}}
                                value={moment(Gratitude.date).format('ddd, MMMM DD YYYY , hh:mm a')}
                            />
                            <View
                                style={{ justifyContent: "center", paddingRight: 13 }}>
                                <Image style={{ height: 13, width: 13, tintColor: oldGratitude ? Colors.disable : Colors.black }} source={require("../../../Assets/Icons/down-arrow.png")} />
                            </View>
                        </Pressable>

                    </View>


                    <View style={{ marginTop: 20 }}>
                        <CustomMultilineTextInput
                            lable={'Description'}
                            lableColor={Colors.black}
                            autoCapitalize={true}
                            lableBold={true}
                            placeholder={'Your Gratitude Description'}
                            value={Gratitude.description}
                            onChangeText={text => {
                                updateGratitude({ description: text })
                                if (isGratitudeExist) {
                                    setChange(true)
                                } else {
                                    tempObj.description = text;
                                }
                            }}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                color: Colors.black,
                                fontFamily: font.bold,
                                letterSpacing: 0.5,
                                marginLeft: 5,
                            }}>
                            Gratitude Images
                        </Text>
                    </View>

                    <View style={{ marginStart: -7, marginTop: 2 }}>
                        <FlatList
                            data={[...Gratitude?.images, ...Gratitude?.oldImages]}
                            scrollEnabled={false}
                            numColumns={3}
                            keyExtractor={(item, index) => index}
                            renderItem={(itemData) =>
                                renderImages({ item: itemData.item, index: itemData.index })
                            }
                        />
                    </View>

                    <View>
                        <ImagePickerModel
                            setImage={addImage}
                            borderRadius={20}
                            width="100%"
                            height={90}
                        />
                    </View>

                    <Pressable
                        onPress={params?.item || isGratitudeExist == true ? btn_Update : btn_Save}
                        style={{
                            backgroundColor: Colors.primary,
                            borderRadius: 10, height: 50,
                            alignItems: "center",
                            justifyContent: "center",
                            marginTop: "18%",
                            marginBottom: 15
                        }}>
                        <Text style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 16
                        }}>{params?.item || isGratitudeExist == true ? "Update " : "Save "} </Text>
                    </Pressable>

                </KeyboardAwareScrollView>
                <Loader enable={isLoading} />

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode={Platform.OS == "ios" ? "datetime" : "date"}
                    date={Gratitude.date}
                    // date={new Date()}
                    onChange={date => updateGratitude({ date: date })}
                    value={handleDateConfirm}
                    // value={new Date()}
                    onConfirm={handleDateConfirm}
                    onCancel={hideDatePicker}
                    maximumDate={moment().toDate()}
                />

                {Platform.OS == "android" &&
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        locale="en_GB"
                        is24Hour={false}
                        date={Gratitude.date}
                        onChange={date => updateGratitude({ date: date })}
                        value={handleTimeConfirm}
                        onConfirm={handleTimeConfirm}
                        onCancel={hideTimePicker}
                    />
                }

            </View>
            <ImageZoomer
                closeModal={hideImageModal}
                visible={!!modalImage}
                url={modalImage}
                noUrl
            />
        </SafeAreaView>
    );
};

export default CreateGratitude;

const styles = StyleSheet.create({
    textFieldView: {
        flex: 1,
        height: 55,
        backgroundColor: '#fff',
        borderRadius: 15,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.gray02,
        marginRight: 6
    },
})

