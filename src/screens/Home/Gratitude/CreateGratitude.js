import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    ScrollView,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Image,
    Alert
} from 'react-native';
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
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
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

const CreateGratitude = props => {
    const { Token, gratitudesList, setGratitudesList, updateGratitudeList } = useContext(Context);
    const { params } = props.route;
    const win = Dimensions.get("window");
    const [isLoading, setisLoading] = useState(false);

    const [modalImage, setModalImage] = useState(null);
    const oldGratitude = params?.item;

    const [Gratitude, setGratitude] = useState({
        title: oldGratitude ? oldGratitude.title : '',
        description: oldGratitude ? oldGratitude.description : '',
        images: [],
        oldImages: oldGratitude ? oldGratitude.images : [],
        removedImages: [],
    });

    const updateGratitude = updation => setGratitude({ ...Gratitude, ...updation });

    // BackButton Handler 
    const onBackPress = () => {
        if (oldGratitude && (Gratitude.title != oldGratitude?.title ||
            Gratitude.description !=  oldGratitude?.description ||
            oldGratitude.images.length != Gratitude?.oldImages.length ||
            Gratitude?.images.length != 0)){
                console.log("yes.... ")

            Alert.alert(
                'Unsaved Changes',
                'Are you sure you want to discard changes?',
                [{ text: 'No' }, { text: 'Yes', onPress: () => props.navigation.goBack() }],
            );
        }
        else if (params?.item == undefined && (Gratitude.title != '' ||
            Gratitude.description != '' ||
            Gratitude.images.length != 0)) {
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
        }, [Gratitude]),
    );

    useEffect(() => {
        if(oldGratitude){
            console.log(oldGratitude.date , "date.....")
        }
    }, []);

    const btn_Save = () => {
        let t_title = Gratitude.title.trim();
        let t_description = Gratitude.description.trim();
        let t_date = params?.date ? params?.date : moment().format('YYYY-MM-DD')

        if (t_title == '') {
            showToast('Please enter a title', 'Alert');
        } else if (t_description == '') {
            showToast('Please enter a description', 'Alert');
        } else {
            let fd_createGratitude = new FormData();
            fd_createGratitude.append('title', t_title);
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
        let t_title = Gratitude.title.trim();
        let t_description = Gratitude.description.trim();
        let t_date = oldGratitude?.date ?? oldGratitude?.data;
        let t_removeImages = Gratitude.removedImages;
        let t_oldImages = Gratitude.oldImages;

        if (t_title == '') {
            showToast('Please enter a title', 'Alert');
        } else if (t_description == '') {
            showToast('Please enter a description', 'Alert');
        } else {
            let fd_editGratitude = new FormData();
            fd_editGratitude.append('title', t_title);
            fd_editGratitude.append('description', t_description);
            fd_editGratitude.append('date', t_date)
            Gratitude.images.forEach(image => fd_editGratitude.append('image', image));
            fd_editGratitude.append('remove_images', JSON.stringify(t_removeImages));
            fd_editGratitude.append('old_images', JSON.stringify(t_oldImages));
            console.log(fd_editGratitude, "Form Data ........")
            api_editGratitude(fd_editGratitude);
        }
    };

    const api_editGratitude = async fdata => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/gratitude/edit_gratitude/' + params.item?._id,
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
                updateGratitude({ images: [...arr, ...Gratitude.images] });

                // await setImages((currentImages) => [objImage, ...currentImages]);
                // await setImages((currentImages) => [img[i].path, ...currentImages]);
            }
        }
    };

    const removeImage = async (index) => {
        let temp = [...Gratitude.images];
        temp.splice(index, 1);
        updateGratitude({ images: [...temp] });
        // await setImages((currentImages) => currentImages.filter((item, idx) => idx !== index));
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
    };

    const renderImages = ({ item, index }) => {
        return (
            <Pressable
                onPress={() => showImageModal(!!item?.uri ? item?.uri : item?.large)}
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
                        source={{ uri: item?.uri ? item?.uri : fileURL + item?.small }}
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


    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header navigation={props.navigation} title={params?.item ? "Update gratitude " : "Add gratitude "} onBackPress={onBackPress} />

            <View style={mainStyles.innerView}>
                <ScrollView showsVerticalScrollIndicator={false}>

                    <View style={{ marginTop: 20 }}>
                        <CustomSimpleTextInput
                            autoCapitalize={true}
                            lable={'Title'}
                            lableColor={Colors.black}
                            lableBold={true}
                            placeholder={'Your Gratitude Title'}
                            value={Gratitude.title}
                            onChangeText={text => updateGratitude({ title: text })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <CustomMultilineTextInput
                            autoCapitalize={true}
                            lable={'Description'}
                            lableColor={Colors.black}
                            lableBold={true}
                            placeholder={'Your Gratitude Description'}
                            value={Gratitude.description}
                            onChangeText={text => updateGratitude({ description: text })}
                        />
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <Text
                            style={{
                                color: Colors.black,
                                fontFamily: font.bold,
                                letterSpacing: 0.5,
                            }}>
                            Gratitude Images
                        </Text>
                    </View>

                    <View >
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

                    <TouchableOpacity onPress={params?.item ? btn_Update : btn_Save} style={{ backgroundColor: Colors.primary, borderRadius: 10, height: 50, alignItems: "center", justifyContent: "center", marginTop: "31%" }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>{params?.item ? "Update " : "Save "} </Text>
                    </TouchableOpacity>

                </ScrollView>
                <Loader enable={isLoading} />
            </View>
            <ImageZoomer
                closeModal={hideImageModal}
                visible={!!modalImage}
                url={modalImage}
            // noUrl
            />
        </SafeAreaView>
    );
};

export default CreateGratitude;

