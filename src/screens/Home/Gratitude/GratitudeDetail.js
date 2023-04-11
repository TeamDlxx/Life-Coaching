import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Pressable,
    Image,
    Alert,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Dimensions,
    FlatList,
} from 'react-native';
import React, { useState, useRef } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import CustomImage from '../../../Components/CustomImage';
import { fileURL } from '../../../Utilities/domains';
import { useEffect } from 'react';
import Loader from '../../../Components/Loader';
import moment from 'moment';
import invokeApi from '../../../functions/invokeAPI';
import showToast from '../../../functions/showToast';


// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';
import ImageZoomer from '../../../Components/ImageZoomer';

const GratitudeDetail = props => {

    const { Token, gratitudesList, setGratitudesList, } = useContext(Context);
    const { params } = props.route;
    const win = Dimensions.get("window");
    const [modalImage, setModalImage] = useState(null);
    const EditMenu = useRef();
    const [isLoading, setisLoading] = useState(false);
    const [gratitude, setGratitudeDetail] = useState(null);


    useEffect(() => {
        callGratitudeDetailApi();
        return () => { };
    }, []);

    const callGratitudeDetailApi = () => {
        setisLoading(true);
        api_gratitudeDetail();
    };

    const api_gratitudeDetail = async () => {
        let res = await invokeApi({
            path: 'api/gratitude/gratitude_detail/' + params?.id,
            method: 'GET',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);

        if (res) {
            if (res.code == 200) {
                console.log('response', res);
                setGratitudeDetail(res.gratitude);
            } else {
                showToast(res.message);
            }
        }
    };

    const api_deleteGratitude = async () => {
        let id = gratitude?._id;
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/gratitude/delete_gratitude/' + id,
            method: 'DELETE',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
                showToast(
                    'Gratitude has been deleted successfully',
                    'Gratitude Deleted',
                    'success',
                );
                if (!!params?.removeGratitudeFromPreviousScreenList) {
                    params?.removeGratitudeFromPreviousScreenList(id);
                  }
                removeFromGlobalGratitudeList(id);
                props?.navigation?.goBack();
            } else {
                showToast(res.message);
            }
        }
    };

    const removeFromGlobalGratitudeList = id => {
        let newArray = [...gratitudesList];
        let index = newArray.findIndex(x => x._id == id);
        if (index != -1) {
            newArray.splice(index, 1);
            setGratitudesList(newArray);
        }
    };

    const updateGratitudeLocally = item => {
        console.log('--> gratitude <--', item);
        setGratitudeDetail(item);
      };
    
    const dropDownMenu = () => {
        return (
            <Menu
                style={{
                    backgroundColor: Colors.white,
                }}
                ref={EditMenu}
                onRequestClose={() => EditMenu?.current.hide()}
                anchor={
                    <TouchableHighlight
                        onPress={() => EditMenu?.current.show()}
                        underlayColor={Colors.lightPrimary}
                        style={{
                            height: 40,
                            width: 40,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: 25,
                        }}>
                        <Image
                            source={require('../../../Assets/Icons/threeDots.png')}
                            style={{ height: 15, width: 15, tintColor: Colors.black }}
                        />
                    </TouchableHighlight>
                }>
                <MenuItem
                    onPress={() => {
                        EditMenu?.current.hide();
                        props.navigation.navigate(screens.addGratitude, {
                            item: gratitude,
                            updateGratitude: params?.updateGratitude,
                            updateGratitudeDetail: updateGratitudeLocally,

                        });
                    }}>
                    <Text style={{ fontFamily: font.bold }}>Edit</Text>
                </MenuItem>

                <MenuDivider />

                <MenuItem
                    onPress={() => {
                        EditMenu?.current.hide();
                        Alert.alert(
                            'Delete Gratitude',
                            'Are you sure you want to delete this Gratitude',
                            [{ text: 'No' }, {
                                text: 'Yes', onPress: () => api_deleteGratitude()
                            }],
                        );
                    }}>
                    <Text style={{ fontFamily: font.bold }}>Delete</Text>
                </MenuItem>
            </Menu>
        );
    };

    const renderImages = ({ item, index }) => {
        return (
            <Pressable
                onPress={() => showImageModal(item?.large)}
                style={{
                    marginHorizontal: 6,
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
                        // source={{ uri: item }}
                        source={{uri: fileURL + item.large}}
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
            <View style={{ flex: 1 }}>
                <Header
                    menu={dropDownMenu}
                    navigation={props.navigation}
                    title={'Gratitude Detail'}
                />
                <View style={{ flex: 1 }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={{ flex: 1 }}>
                            <View
                                style={{
                                    backgroundColor: Colors.white,
                                    padding: 15,
                                    borderRadius: 20,
                                    borderWidth: 1,
                                    borderColor: Colors.gray02,
                                    marginTop: '5%',
                                    marginHorizontal: 10,
                                }}>

                                <View style={{ marginTop: 15 }}>
                                    <Text
                                        style={[GratitudeDetail_style.title, { fontSize: 20 }]}>
                                        {gratitude?.title}
                                    </Text>
                                </View>

                                <View style={{ marginTop: 15 }}>
                                    <Text style={GratitudeDetail_style.lable}>Description</Text>
                                    <Text
                                        style={[GratitudeDetail_style.description,]}>
                                        {gratitude?.description}
                                    </Text>
                                </View>

                                <View style={{ marginTop: 15, alignSelf: "flex-end", marginHorizontal: 10 }}>
                                    <Text
                                        style={[GratitudeDetail_style.description,]}>
                                        {moment(gratitude?.date).format('DD MMM YYYY')}
                                    </Text>
                                </View>

                                {gratitude?.images.length != 0 &&
                                    <View style={{ marginTop: 15 }}>
                                        <View>
                                            <FlatList
                                                data={gratitude?.images}
                                                scrollEnabled={false}
                                                numColumns={3}
                                                keyExtractor={(item , index) => index}
                                                renderItem={(itemData) => renderImages({ item: itemData.item, index: itemData.index })}
                                            />
                                        </View>

                                    </View>}

                            </View>
                        </View>
                    </ScrollView>
                </View>
            </View>
            <ImageZoomer
                closeModal={hideImageModal}
                visible={!!modalImage}
                url={modalImage}
            />
            <Loader enable={isLoading} />

        </SafeAreaView>
    );
};

export default GratitudeDetail;

const GratitudeDetail_style = StyleSheet.create({
    lable: {
        fontSize: 13,
        fontFamily: font.regular,
        color: Colors.placeHolder,
    },
    title: {
        fontSize: 14,
        fontFamily: font.bold,
        marginTop: 5,
        color: Colors.black,
    },

    description: {
        fontSize: 14,
        fontFamily: font.regular,
        marginTop: 5,
        color: Colors.black,
    },

    ItemView: {
        marginTop: 20,
    },
});
