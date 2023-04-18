
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    StyleSheet,
    Dimensions,
    Pressable,
    Image,
    ScrollView,
    TouchableHighlight,
    TouchableOpacity,
    Platform,
    ActivityIndicator,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import SplashScreen from 'react-native-splash-screen';
import NotificationConfig from '../../Components/NotificationConfig';
import { screens } from '../../Navigation/Screens';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { mainStyles } from '../../Utilities/styles';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import { fileURL } from '../../Utilities/domains';
import formatTime from '../../functions/formatTime';
import CustomImage from '../../Components/CustomImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import showToast from '../../functions/showToast';

import Share from 'react-native-share';
import axios from 'axios';
import kFormatter from '../../functions/kFormatter';

import ImageZoomer from '../../Components/ImageZoomer';
import debounnce from '../../functions/debounce';
import Clipboard from '@react-native-clipboard/clipboard';


// For API's calling
import { useContext } from 'react';
import Context from '../../Context';
import invokeApi from '../../functions/invokeAPI';

import play from '../../Assets/Icons/play.png';
import profile_placeholder from '../../Assets/Icons/dummy.png';
import CustomButton from './Components/CustomButton';

import Fav from '../../Assets/Icons/fav.png';
import notFav from '../../Assets/Icons/notfav.png';
import favList from '../../Assets/Icons/favList.png';
import ic_share from '../../Assets/Icons/share.png';
import ic_download from '../../Assets/Icons/ic_download.png';


const HomeScreen = (props) => {
    const { Token } = useContext(Context);
    const [loading, setisLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [dashboardData, setDashboardData] = useState({
        meditation: [],
        quote: [],
        habitStats: {},
        notes: [],
    })


    useEffect(() => {
        checkNotificationPermission();
        NotificationConfig(props);
        analytics().logEvent(props?.route?.name);
        setTimeout(() => {
            SplashScreen.hide();
        }, 500);
        dashBoardApi();
        return () => {
        };
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if (Token) {
                getUserDetail();
            }
        });
        return unsubscribe;
    }, [Token, props.navigation,]);

    async function checkNotificationPermission() {
        const authorizationStatus = await messaging().requestPermission();

        if (authorizationStatus === messaging.AuthorizationStatus.AUTHORIZED) {
            // await messaging().registerDeviceForRemoteMessages();
        } else if (
            authorizationStatus === messaging.AuthorizationStatus.PROVISIONAL
        ) {
            // await messaging().registerDeviceForRemoteMessages();
        } else { }
    }

    const dashBoardApi = async () => {
        let res = await invokeApi({
            path: 'api/customer/app_dashboard',
            method: 'GET',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
                console.log(res, "response...")
                // let meditation = 
            } else {
                showToast(res.message);
            }
        }
    }

    const appendZero = val => {
        if (val < 10) {
            return '0' + val;
        }
        return val;
    };

    const getUserDetail = async () => {
        AsyncStorage.getItem('@user').then(val => {
            if (val != null) {
                setUser(JSON.parse(val));
            }
        });
    };

    const gotoTrackPlayer = (item, index) => {


        trackIndex = index;
        setSelectedTrackIndex(index);

        if (!chooseScreenOnPurchasesAndLockedTrack(item.is_locked)) {


            let list = [];
            list = selectedCategory?.category_track;

            props.navigation.navigate(screens.trackPlayer, {
                item: item,
                category: selectedCategory?.name,
                list: list,
                likeUnLikeFunc: likeUnLikeLocally,
            });
        }
    };

    const likeUnLikeLocally = (id, val) => {
        let list = [...categoryList];
        list.map(obj => {
            let index = obj?.category_track.findIndex(x => x._id == id);
            if (index > -1) {
                let newObj = {
                    ...obj.category_track[index],
                    is_favourite: val,
                };
                obj?.category_track.splice(index, 1, newObj);
            }
        });

        let index1 = selectedCategory?.category_track.findIndex(x => x._id == id);
        if (index1 > -1) {
            let newList = [...selectedCategory?.category_track];
            let newObj = { ...newList[index1], is_favourite: val };
            newList.splice(index1, 1, newObj);
            setSelectedCategory({
                ...selectedCategory,
                category_track: newList,
            });
        }
        setCategoryList(list);
    };


    return (
        <SafeAreaView
            style={[
                mainStyles.MainViewForBottomTabScreens,
                { marginBottom: useBottomTabBarHeight() },
            ]}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />

            <View
                style={{
                    marginTop: 15,
                    paddingRight: 50,
                    height: 50,
                    marginLeft: 30,
                    width: '100%',
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                <View style={{}}>
                    <Text >Welcome back,{'   '}</Text>
                    <Text style={home_styles.nameText}>{!!user && !!user.name
                        ? user?.name + ' '
                        : " "}</Text>
                </View>
                <View style={{}}>
                    <CustomImage
                        source={
                            // profile_placeholder
                            !!user && !!user.profile_image
                                ? { uri: fileURL + user?.profile_image }
                                : profile_placeholder
                        }
                        style={{ height: 40, width: 40 }}
                        imageStyle={{ borderRadius: 40 / 2 }}
                    />
                </View>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 15 }}>

                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={2 * 250}>
                    <View
                        style={[home_styles.customCardView, { minHeight: 245 }]}>
                        <Text style={home_styles.heading}>Habit Tracker </Text>

                        <View style={{ marginTop: 10, }}>
                            <FlatList
                                contentContainerStyle={{ justifyContent: 'space-evenly', width: '100%' }}
                                showsHorizontalScrollIndicator={false}
                                data={habitCount}
                                scrollEnabled={false}
                                numColumns={3}
                                keyExtractor={item => {
                                    return item.id;
                                }}
                                renderItem={(itemData) => {
                                    return (
                                        <View style={home_styles.statItemView}>
                                            <Text style={home_styles.statItemtext1}>{itemData.item.title}</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {appendZero(itemData.item.count)}
                                                {/* {loading ? '--' : appendZero(itemData.item.count)} */}
                                            </Text>
                                        </View>
                                    )
                                }
                                }
                            />
                        </View>
                        <View style={{ alignItems: "flex-end", }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.habitTracker)} />
                        </View>
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={2 * 250}>
                    <View
                        style={[home_styles.customCardView, { minHeight: 165 }]}>
                        <Text style={home_styles.heading}>Meditation Of The Day </Text>

                        <View style={{ marginTop: 10, }}>
                            <Pressable
                                onPress={() => {
                                    // gotoTrackPlayer(item, index);
                                }}
                                style={{
                                    marginTop: 5,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    marginHorizontal: 5,
                                }}>
                                <View
                                    style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: Colors.gray02,
                                    }}>
                                    <CustomImage
                                        source={{ uri: fileURL + "TRACK/8e7d82d0-7078-11ed-a8f1-554b0ac616b5.jpg" }}
                                        style={{ height: 70, width: 70 }}
                                        indicatorProps={{ color: Colors.primary }}
                                    />
                                    <View
                                        style={{
                                            position: 'absolute',
                                            height: 20,
                                            width: 20,
                                            backgroundColor: Colors.white,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderRadius: 999,
                                            bottom: 5,
                                            right: 5,
                                        }}>
                                        <Image
                                            style={{ height: 12, width: 12, tintColor: Colors.primary }}
                                            source={play}
                                        />
                                    </View>

                                </View>

                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text
                                        style={{
                                            fontFamily: font.bold,
                                            fontSize: 14,
                                            includeFontPadding: false,
                                            color: Colors.black,
                                        }}>
                                        {"Happy Life"}
                                    </Text>

                                    <View
                                        style={{
                                            marginTop: 3,
                                        }}>
                                        <Text
                                            numberOfLines={2}
                                            style={{
                                                fontFamily: font.medium,
                                                color: Colors.text,
                                                fontSize: 12,
                                            }}>
                                            {"Let the state of happiness be your constant thing with energetic meditation music. Be the carrier of your own happiness with the help of this music. \n"}
                                        </Text>
                                    </View>

                                    <View
                                        style={{
                                            marginTop: 3,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                        <Text
                                            style={{
                                                fontFamily: font.medium,
                                                color: Colors.gray12,
                                                fontSize: 12,
                                            }}>
                                            {formatTime(170.031)}
                                        </Text>
                                    </View>
                                </View>
                            </Pressable>
                        </View>

                        <View style={{ alignItems: "flex-end", marginTop: 7, }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.meditation)} />
                        </View>
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={1 * 250}>
                    <View
                        style={[home_styles.customCardView, { minHeight: 185 }]}>
                        <Text style={home_styles.heading}>Note Of The Day </Text>

                        <View style={{ marginTop: 10, }}>
                            <View style={home_styles.noteText}>
                                <Text style={{ fontFamily: font.regular, color: Colors.black, fontSize: 13, }}
                                >{"Good thoughts make a happy person!"} </Text>
                            </View>
                            <View style={home_styles.noteText}>
                                <Text style={{ fontFamily: font.regular, color: Colors.black, fontSize: 13, }}
                                >{"Make yourself your own competition!"} </Text>
                            </View>
                        </View>
                        <View style={{ alignItems: "flex-end", marginTop: 10, }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.notesList)} />
                        </View>
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={1 * 250}>
                    <View
                        style={[home_styles.customCardView, { minHeight: 185 }]}>
                        <Text style={home_styles.heading}>Quote Of The Day </Text>
                        {/* <View
                            style={{
                                margin: 10,
                                borderRadius: 15,
                                overflow: 'hidden',
                                borderColor: Colors.gray02,
                                borderWidth: 1,
                                backgroundColor: Colors.white,
                            }}> */}
                        <Pressable onPress={() => showImageModal(item?.images?.large)}>
                            <View style={{
                                marginTop: 12,
                                overflow:"hidden",
                                borderRadius: 12, borderColor: Colors.gray02,
                                borderWidth: 1,
                            }}>
                                <CustomImage
                                    source={{ uri: fileURL + "HABIT/e3fa30c0-43cb-11ed-b6d8-e1cced6e1241.jpg" }}
                                    style={{
                                        width: '100%',
                                        aspectRatio: 1
                                        // item?.image_height != 0
                                        //     ? item?.image_width / item?.image_height
                                        //     : 1,
                                    }}
                                />
                            </View>
                        </Pressable>
                        {/* {!!item?.description && ( */}
                        <TouchableHighlight
                            disabled={Platform.OS == 'ios'}
                            onLongPress={() => copyText(item?.description.trim())}
                            delayLongPress={500}
                            underlayColor={Colors.gray01}
                            style={{}}>
                            <Text
                                selectable={Platform.OS == 'ios' ? true : false}
                                style={{
                                    fontSize: 14,
                                    fontFamily: font.regular,
                                    paddingHorizontal: 5,
                                    paddingVertical: 10,
                                }}> {"Description"}
                            </Text>
                        </TouchableHighlight>
                        {/* )} */}

                        {/* </View> */}

                        <View style={{ alignItems: "flex-end", marginTop: 10, }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.qouteList)} />
                        </View>
                    </View>
                </Animatable.View>

            </ScrollView>

        </SafeAreaView>
    )
}
export default HomeScreen;

const home_styles = StyleSheet.create({
    nameText: {
        marginTop: 5,
        fontSize: 22,
        letterSpacing: 1,
        fontFamily: font.bold,
        color: Colors.black,
        textTransform: 'capitalize',
    },

    customCardView: {
        overflow: "hidden",
        borderColor: Colors.gray02,
        borderWidth: 1,
        backgroundColor: Colors.white,
        marginTop: 5,
        marginBottom: 10,
        borderRadius: 20,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginHorizontal: 15,
    },

    statItemtext1: {
        color: Colors.placeHolder,
        fontFamily: font.medium,
        fontSize: 12,
    },
    statItemtext2: {
        marginTop: 2,
        color: Colors.black,
        fontFamily: font.bold,
        fontSize: 20,
    },
    statItemView: {
        width: Dimensions.get('window').width / 4,
        marginVertical: 6,
        borderRadius: 10,
        aspectRatio: 1.3,
        marginHorizontal: 5,
        alignItems: 'center',
        // backgroundColor: '#BDC3C733',
        backgroundColor: Colors.lightPrimary2,
        paddingVertical: 10,
        justifyContent: 'center',
    },

    heading: {
        marginLeft: 6,
        fontFamily: font.bold,
        color: Colors.black,
        fontSize: 16,
        textTransform: 'capitalize',
    },

    noteText: {
        marginTop: 5,
        marginBottom: 8,
        padding: 8,
        paddingLeft: 10,
        marginHorizontal: 5,
        backgroundColor: Colors.lightPrimary2,
        borderRadius: 10,
    }
});


const habitCount = [
    {
        id: '1',
        title: 'Total Habit',
        count: 10,
    },

    {
        id: '2',
        title: 'Completed',
        count: 6,
    },
    {
        id: '3',
        title: 'Pending',
        count: 4,
    },

    {
        id: '5',
        title: 'Good Habits',
        count: 7,
    },
    {
        id: '4',
        title: 'Bad Habits',
        count: 3,
    },

];


// {/* {kFormatter(item?.favourite)} */ }

// {/* {item?.description.trim()} */ }


<View
    style={{
        flexDirection: 'row',
        backgroundColor: '#FFF',
    }}>
    <TouchableOpacity
        onPress={() => favUnFavFunction(item, index)}
        style={{
            flex: 1,
            alignItems: 'center',
            height: 50,
            justifyContent: 'center',
            flexDirection: 'row',
        }}>
        <Image
            // source={item?.is_favourite_by_me ? Fav : notFav}
            source={Fav}
            style={{
                height: 20,
                width: 20,
                // tintColor: item?.is_favourite_by_me
                //     ? Colors.primary
                //     : Colors.placeHolder,
            }}
        />
        <Text
            style={{
                marginLeft: 5,
                fontFamily: font.medium,
                color: Colors.placeHolder,
                letterSpacing: 1,
                includeFontPadding: false,
            }}>{kFormatter("yes")}
        </Text>
    </TouchableOpacity>

    <TouchableOpacity
        onPress={() => download(item)}
        style={{
            flex: 1,
            alignItems: 'center',
            height: 50,
            justifyContent: 'center',
        }}>
        {/* {!checkQuoteDownloading(item._id) ? ( */}
        <Image
            source={ic_download}
            style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
        />
        {/* ) : (
<ActivityIndicator color={Colors.placeHolder} size="small" />
)} */}
    </TouchableOpacity>

    <TouchableOpacity
        // disabled={isSharing != null}
        onPress={async () => {
            await shareQuote(item);
        }}
        style={{
            flex: 1,
            alignItems: 'center',
            height: 50,
            justifyContent: 'center',
        }}>
        {/* {isSharing != item._id ? */}
        (
        <Image
            source={ic_share}
            style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
        />
        ) : (
        <ActivityIndicator color={Colors.placeHolder} size="small" />
        )
        {/* } */}
    </TouchableOpacity>
</View>