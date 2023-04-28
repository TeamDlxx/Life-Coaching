
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
    ToastAndroid,
    ActivityIndicator,
} from 'react-native';
import Modal from 'react-native-modal';
import * as Animatable from 'react-native-animatable';
import SplashScreen from 'react-native-splash-screen';
import NotificationConfig from '../../Components/NotificationConfig';
import { screens } from '../../Navigation/Screens';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { mainStyles, _styleTrackPlayer, FAB_style } from '../../Utilities/styles';
import TrackPlayer, { State } from 'react-native-track-player';
import ProgressBar from '../../Components/ProgreeBar';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import { fileURL, deepLinkQuote } from '../../Utilities/domains';
import formatTime from '../../functions/formatTime';
import CustomImage from '../../Components/CustomImage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import analytics from '@react-native-firebase/analytics';
import messaging from '@react-native-firebase/messaging';
import showToast from '../../functions/showToast';
import moment from 'moment';

import Share from 'react-native-share';
import axios from 'axios';
import _ from 'buffer';
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
import LoginAlert from '../../Components/LoginAlert';
// import WallpaperManager, { TYPE } from "react-native-wallpaper-manage";


import Fav from '../../Assets/Icons/fav.png';
import notFav from '../../Assets/Icons/notfav.png';
import ic_share from '../../Assets/Icons/share.png';
import ic_wallPaper from '../../Assets/Icons/wallpapers.png';
import ic_download from '../../Assets/Icons/ic_download.png';
const ic_notes = require('../../Assets/Icons/notes.png');
const empty_notes = require('../../Assets/Icons/notes-empty.png');
const empty_habits = require('../../Assets/Icons/habits-empty.png');

import ic_lock from '../../Assets/Icons/ic_lock.png';
import ic_home from '../../Assets/Icons/home.png';
import ic_home_lock from '../../Assets/Icons/home-lock.png';
import ic_cross from '../../Assets/Icons/cross.png';

import pauseTrack from '../../Assets/TrackPlayer/pauseTrack.png';
import playTrack from '../../Assets/TrackPlayer/playTrack.png';
import CustomBellIcon from '../../Components/CustomBellIcon';

let todayMeditation;

const HomeScreen = (props) => {
    const { Token, downloadQuote, dashboardData, setDashBoardData } = useContext(Context);
    const { params } = props?.route;
    const [loading, setisLoading] = useState(true);
    const [user, setUser] = useState(null);
    const [playIcon, setPlayIcon] = useState(playTrack);

    const [modalImage, setModalImage] = useState(null);
    const [isSharing, setIsSharing] = useState(null);
    const [isModalVisible, setModalVisibility] = useState(false);

    let meditationOfTheDay = dashboardData.meditationOfTheDay;
    let quoteOfTheDay = dashboardData.quoteOfTheDay;
    let habitStats = dashboardData.habitStats;
    let notes = dashboardData.notes;


    useEffect(() => {
        if (Token) {
            dashBoardApi();
        } else {
            guestDashBoardApi();
        }
        checkNotificationPermission();
        NotificationConfig(props);
        analytics().logEvent(props?.route?.name);
        setTimeout(() => {
            SplashScreen.hide();
        }, 500);
        return () => {
        };
    }, []);

    useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            if (Token) {
                getUserDetail();
            }
            if (todayMeditation != undefined) {
                console.log(todayMeditation, "Today's Meditation......")
                LoadtheTrack();
            }
        });
        return unsubscribe;
    }, [Token, props.navigation, todayMeditation]);

    useEffect(() => {
        TrackPlayer.addEventListener('playback-state', async ({ state }) => {
            console.log('state: ' + state);

            if (state == 'playing' || state == 2) {
                console.log("already playing....")
                setPlayIcon(pauseTrack);
            }
            if (state == 'paused' || state == 3) {
                console.log("pausd.......")
                setPlayIcon(playTrack);
            }
            if (state == 'stopped' || state == 4) {
                console.log("stopped........")
                setPlayIcon(playTrack);
            }
        });

        TrackPlayer.addEventListener('remote-play', async ({ state }) => {
            console.log('state: ' + state);
        });

        analytics().logEvent(props?.route?.name);
        return () => {
            TrackPlayer.reset()
        };
    }, []);

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
                let meditation = res.meditation_of_the_day;
                let quote = res.quote_of_day;
                let habit = res.habit_stats;
                let note = res.notes;

                await setDashBoardData({
                    ...dashboardData,
                    habitStats: habit,
                    meditationOfTheDay: meditation,
                    quoteOfTheDay: quote,
                    notes: note,
                })
                todayMeditation = res?.meditation_of_the_day;
                LoadtheTrack()
                setisLoading(false);

                console.log(meditationOfTheDay, "Meditation of the Day......")
                console.log(quoteOfTheDay, "Quote of the Day......")
                console.log(habitStats, "Habit Stats of the Day......")
                console.log(notes, "Notes of the Day......")
            } else {
                showToast(res.message);
                setisLoading(false);
            }
        }
    }

    const guestDashBoardApi = async () => {
        let res = await invokeApi({
            path: 'api/customer/guest_app_dashboard',
            method: 'GET',
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
                console.log(res, "response...")
                let meditation = res.meditation_of_the_day;
                let quote = res.quote_of_day;
                let habit = res.habit_stats;
                let note = res.notes;

                await setDashBoardData({
                    ...dashboardData,
                    habitStats: habit,
                    meditationOfTheDay: meditation,
                    quoteOfTheDay: quote,
                    notes: note,
                })
                todayMeditation = res?.meditation_of_the_day;
                LoadtheTrack()
                setisLoading(false);
            } else {
                showToast(res.message);
                setisLoading(false);
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

    const resetTheTrack = async () => {
        await TrackPlayer.seekTo(0);
        if (repeat) {
            await TrackPlayer.play();
            setPlayIcon(pauseTrack);
        } else {
            await TrackPlayer.pause();
            setPlayIcon(playTrack);
        }
    };

    const moveTo = async val => {
        TrackPlayer.seekTo(val);
    };

    const changeStatus = async () => {
        console.log('change-Status');
        let duration = parseInt(await TrackPlayer.getDuration());
        let position = parseInt(await TrackPlayer.getPosition());
        let position1 = parseInt(await TrackPlayer.getPosition()) + 1;
        let isPlaying = await TrackPlayer.getState();
        console.log('isPlaying', isPlaying);

        if (
            (isPlaying != 2 || isPlaying != 'playing') &&
            (duration == position1 || duration == position)
        ) {
            TrackPlayer.seekTo(0);
            TrackPlayer.play();
            setPlayIcon(pauseTrack);
        } else {
            if (playIcon == playTrack) {
                TrackPlayer.play();
                setPlayIcon(pauseTrack);
                await analytics().logEvent(`PLAY_TRACK_EVENT`, {
                    item_name: meditationOfTheDay?.name,
                });
            } else {
                TrackPlayer.pause();
                setPlayIcon(playTrack);
            }
        }

    };

    const LoadtheTrack = async () => {
        await TrackPlayer.reset();
        await TrackPlayer.add({
            id: todayMeditation?._id,
            url: params?.from == 'down' ? todayMeditation?.mp3 : fileURL + todayMeditation?.audio,
            title: todayMeditation?.name,
            artist: todayMeditation?.category_id[0]?.name,
            album: '',
            genre: '',
            artwork:
                params?.from == 'down'
                    ? todayMeditation?.images?.small
                    : fileURL + todayMeditation?.images?.small,
            duration: Math.ceil(todayMeditation?.duration),
        });
        await TrackPlayer.pause();
        setPlayIcon(playTrack);
        await analytics().logEvent(`REPEAT_TRACK_EVENT`, {
            item_name: todayMeditation?.name,
        });

    };


    const showImageModal = image => {
        setModalImage(image);
    };

    const hideImageModal = () => {
        setModalImage(null);
    };

    const copyText = async text => {
        try {
            await Clipboard.setString(text);
            ToastAndroid.show('Text Copied', ToastAndroid.SHORT);
        } catch (e) {
            console.log(e, 'copyText...');
        }
    };

    const favUnFavFunction = async (item) => {
        if (Token) {
            api_favOrUnfavQuote(!item?.is_favourite_by_me, item._id);
            toggleLike(!item?.is_favourite_by_me, item._id);
            if (!item?.is_favourite_by_me) {
                await analytics().logEvent(`LIKE_QUOTE_EVENT`);
            }
        } else {
            LoginAlert(props.navigation, props.route?.name);
        }
    };

    const api_favOrUnfavQuote = async (val, id) => {
        let res = await invokeApi({
            path: 'api/quotes/favourite_quotes/' + id,
            method: 'POST',
            headers: {
                'x-sh-auth': Token,
            },
            postData: {
                favourite: val,
            },
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
            } else {
                showToast(res.message);
                toggleLike(!val, id);
            }
        }
    };

    const toggleLike = (val, id) => {
        let newObj = quoteOfTheDay;
        newObj.is_favourite_by_me = val;

        if (newObj.is_favourite_by_me) {
            newObj.favourite = newObj.favourite + 1;
        } else {
            newObj.favourite = newObj.favourite - 1;
        }
        quoteOfTheDay = newObj;

        setDashBoardData({
            ...dashboardData,
        })
    };


    const download = item => {
        debounceDownload(item);
    };

    const debounceDownload = debounnce(async item => {
        console.log('download');
        await downloadQuote(item?.images?.large, item?._id);
        await analytics().logEvent('QUOTE_DOWLOAD_EVENT');
    }, 500);

    const shareQuote = async item => {
        setIsSharing(item._id);
        try {
            let image = item?.images?.large;
            let description = !!item?.description ? item?.description.trim() : '';
            let res = await GetBase64(fileURL + image);
            let ext = await image.split('.')[image.split('.').length - 1];
            if (ext == 'jpg') {
                ext = 'jpeg';
            }
            let file = `data:image/${ext};base64,${res}`;

            setIsSharing(null);
            let objShare = {
                title: 'Better.Me | Quotes',
                message: description + '\n' + deepLinkQuote,
                url: file,
            };
            console.log('objShare', objShare);
            await Share.open(objShare)
                .then(async res => {
                    await analytics().logEvent('QUOTE_SHARE_EVENT');
                    console.log('res', res);
                })
                .catch(err => {
                    console.log('error', err);
                });
        } catch (e) {
            console.log('error1', e);
            setIsSharing(null);
        }
    };

    const GetBase64 = async url => {
        return await axios
            .get(url, {
                responseType: 'arraybuffer',
            })
            .then(response =>
                _.Buffer.from(response.data, 'binary').toString('base64'),
            )
            .catch(err => console.log('Error', err));
    };

    const updateNote = item => {
        let arr = [...notes];
        let index = arr.findIndex(x => x._id == item._id);
        if (index > -1) {
            arr.splice(index, 1, item);
            notes = [...arr];
            setDashBoardData({
                ...dashboardData,
            })
        }
    };

    const wallpaperOptionsModal = () => {
        return (
            <Modal
                isVisible={isModalVisible}
                onBackButtonPress={() => setModalVisibility(false)}
                onBackdropPress={() => setModalVisibility(false)}
                useNativeDriverForBackdrop={true}
                style={{
                    flex: 1,
                    justifyContent: 'flex-end'
                }}>
                <View
                    style={{
                        backgroundColor: '#fff',
                        marginTop: 'auto',
                        marginBottom: Platform.OS == 'ios' ? 30 : 10,
                        borderRadius: 10,
                        padding: 20,
                    }}>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1 }}>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontFamily: font.bold,
                                    letterSpacing: 0.5,
                                }}>
                                Set as wallpaper
                            </Text>
                        </View>

                        <Pressable
                            onPress={() => setModalVisibility(false)}
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
                                <Image source={ic_cross} style={{ height: 10, width: 10 }} />
                            </View>
                        </Pressable>
                    </View>

                    <View
                        style={{ marginTop: 20, }}>
                        <Pressable onPress={setHomeScreenWallpaper} style={{ alignItems: 'center', flexDirection: 'row', }}>
                            <View
                                style={{
                                    backgroundColor: '#BDC3C744',
                                    height: 40,
                                    width: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                }}>
                                <Image source={ic_home} style={{ height: 19, width: 19 }} />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: font.medium,
                                    letterSpacing: 0.5,
                                    marginLeft: 10
                                }}>
                                Home screen
                            </Text>
                        </Pressable>

                        <Pressable
                            onPress={setLockScreenWallpaper}
                            style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <View
                                style={{
                                    backgroundColor: '#BDC3C744',
                                    height: 40,
                                    width: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                }}>
                                <Image source={ic_lock} style={{ height: 20, width: 20 }} />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: font.medium,
                                    letterSpacing: 0.5,
                                    marginLeft: 10
                                }}>
                                Lock screen
                            </Text>
                        </Pressable>


                        <Pressable
                            onPress={setHomeAndLockScreenWallpaper}
                            style={{ alignItems: 'center', flexDirection: 'row', marginTop: 10 }}>
                            <View
                                style={{
                                    backgroundColor: '#BDC3C744',
                                    height: 40,
                                    width: 40,
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 20,
                                }}>
                                <Image source={ic_home_lock} style={{ height: 23, width: 23 }} />
                            </View>
                            <Text
                                style={{
                                    fontSize: 14,
                                    fontFamily: font.medium,
                                    letterSpacing: 0.5,
                                    marginLeft: 10
                                }}>
                                Home & Lock screens
                            </Text>
                        </Pressable>


                    </View>

                </View>
            </Modal>
        );
    };

    const setHomeScreenWallpaper = async () => {
        let image = quoteOfTheDay?.images?.large
        let URL = fileURL + `${image}`

        WallpaperManager.setWallpaper(
            URL,
            TYPE.FLAG_SYSTEM
        )
        ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
        await setModalVisibility(false)
    };

    const setLockScreenWallpaper = async () => {
        let image = quoteOfTheDay?.images?.large
        WallpaperManager.setWallpaper(
            fileURL + `${image}`,
            TYPE.FLAG_LOCK
        )
        ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
        await setModalVisibility(false)
    };

    const setHomeAndLockScreenWallpaper = async () => {
        let image = quoteOfTheDay?.images?.large
        WallpaperManager.setWallpaper(
            fileURL + `${image}`,
            TYPE.FLAG_SYSTEM
        )
        WallpaperManager.setWallpaper(
            fileURL + `${image}`,
            TYPE.FLAG_LOCK
        )
        ToastAndroid.show('Wallpaper has been set', ToastAndroid.SHORT);
        await setModalVisibility(false)
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
                    // marginTop: 15,
                    // paddingRight: 50,
                    // marginLeft: 30,
                    height: 50,
                    width: '100%',
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginLeft: 15,
                    paddingRight: 35,
                }}>
                {/* <View style={{}}>
                    <Text >Welcome back,{'   '}</Text>
                    <Text style={home_styles.nameText}>{!!user && !!user.name
                        ? user?.name + ' '
                        : " "}</Text>
                </View> */}
                <View>
                    <Image
                        resizeMode="contain"
                        source={require('../../Assets/app-icon/text.png')}
                        style={{ height: 25.5, aspectRatio: 6 }}
                    />
                </View>
                <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center" }}>
                    <CustomBellIcon
                        onPress={() => props.navigation.navigate(screens.notificationScreen)}
                    />
                    {Token && <Pressable
                        style={{
                            borderColor: Colors.gray05,
                            borderWidth: 1,
                            height: 34,
                            width: 34,
                            borderRadius: 34 / 2,
                            marginLeft: 10,
                            alignSelf: 'center',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                        onPress={() => {
                            props.navigation.navigate(screens.profile)
                            // props.navigation.navigate(screens.editProfile, {
                            //     user: !!user ? user : null,
                            //     isComingFrom: "dashBoard"
                            // });
                        }}>
                        <CustomImage
                            source={
                                !!user && !!user.profile_image
                                    ? { uri: fileURL + user?.profile_image }
                                    : profile_placeholder
                            }
                            style={{ height: 30, width: 30 }}
                            imageStyle={{ borderRadius: 30 / 2 }}
                        />
                    </Pressable>}
                </View>
            </View>

            <ScrollView style={{ flex: 1, marginTop: 10 }}>

                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={2 * 250}>
                    <View
                        style={home_styles.customCardView}>
                        <Text style={home_styles.heading}>Habit Tracker </Text>

                        {Token && habitStats.all_habits != 0 ?
                            <>
                                <View style={{ marginTop: 10, }}>
                                    <View
                                        style={{ justifyContent: 'space-evenly', width: '100%', flexDirection: 'row', }}>
                                        <View style={[home_styles.statItemView]}>
                                            <Text style={home_styles.statItemtext1}>Total Habits</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {loading ? '--' : appendZero(habitStats.all_habits)}
                                            </Text>
                                        </View>

                                        <View style={home_styles.statItemView}>
                                            <Text style={home_styles.statItemtext1}>Completed</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {loading ? '--' : appendZero(habitStats.completed_habits)}
                                            </Text>
                                        </View>

                                        <View style={home_styles.statItemView}>
                                            <Text style={home_styles.statItemtext1}>Pending</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {loading ? '--' : appendZero(habitStats.pending_habits)}
                                            </Text>
                                        </View>
                                    </View>
                                    <View
                                        style={{ justifyContent: 'flex-start', width: '100%', flexDirection: 'row', }}>
                                        <View style={[home_styles.statItemView]}>
                                            <Text style={home_styles.statItemtext1}>Good Habits</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {loading ? '--' : appendZero(habitStats.good_habits)}
                                            </Text>
                                        </View>

                                        <View style={home_styles.statItemView}>
                                            <Text style={home_styles.statItemtext1}>Bad Habits</Text>
                                            <Text style={home_styles.statItemtext2}>
                                                {loading ? '--' : appendZero(habitStats.bad_habits)}
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                                <View style={{ alignItems: "flex-end", }}>
                                    <CustomButton onPress={() => props.navigation.navigate(screens.allHabits)} />
                                </View>
                            </>
                            :
                            <>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1 }} >
                                    <Image source={empty_habits} style={{ height: 130, width: 130, resizeMode: "contain", marginTop: 20 }} />
                                    <Text
                                        style={{
                                            fontFamily: font.bold,
                                            fontSize: 15,
                                            includeFontPadding: false,
                                            color: Colors.black,
                                            marginTop: 15,
                                        }}>
                                        No Habits Yet
                                    </Text>
                                    <Text style={{
                                        fontFamily: font.medium,
                                        color: Colors.text,
                                        fontSize: 13,
                                        textAlign: 'center',
                                        marginTop: 8,
                                        paddingHorizontal: 30,
                                    }}>{"Start by creating a new habit to improve your daily routine!"}
                                    </Text>
                                    <Pressable onPress={() => props.navigation.navigate(screens.habitTracker)}
                                        style={{
                                            backgroundColor: Colors.primary,
                                            height: 33,
                                            borderRadius: 10,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            paddingHorizontal: 10,
                                            marginTop: 15
                                        }}>
                                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 13, }}>Change My Habit{'   '}</Text>
                                    </Pressable>
                                </View>
                            </>}
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={2 * 250}>
                    <View
                        style={home_styles.customCardView}>
                        <Text style={home_styles.heading}>Meditation Of The Day </Text>

                        <View style={{ marginTop: 10, }}>
                            <View
                                style={{
                                    marginTop: 5,
                                    alignItems: 'center',
                                    flexDirection: 'row',
                                    marginHorizontal: 5,
                                }}>
                                <Pressable
                                    onPress={changeStatus}
                                    style={{
                                        height: 70,
                                        width: 70,
                                        borderRadius: 10,
                                        overflow: 'hidden',
                                        borderWidth: 1,
                                        borderColor: Colors.gray02,
                                    }}>
                                    <CustomImage
                                        source={{ uri: fileURL + meditationOfTheDay?.images?.medium }}
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
                                            style={{ height: 13.5, width: 13.5, tintColor: Colors.primary }}
                                            source={playIcon}
                                        />
                                    </View>

                                </Pressable>

                                <View style={{ marginLeft: 15, flex: 1 }}>
                                    <Text
                                        style={{
                                            fontFamily: font.bold,
                                            fontSize: 14,
                                            includeFontPadding: false,
                                            color: Colors.black,
                                        }}>
                                        {meditationOfTheDay?.name}
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
                                            {meditationOfTheDay?.description}
                                        </Text>
                                    </View>

                                    <View style={{ marginTop: 5, }}>
                                        <ProgressBar
                                            resetPlayer={resetTheTrack}
                                            // moveTo={val => {
                                            //     moveTo(val);
                                            // }}
                                            moveTo={moveTo}
                                            time={meditationOfTheDay?.duration}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={{ alignItems: "flex-end", marginTop: 10, }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.meditation)} />
                        </View>
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={1 * 250}>
                    <View
                        style={home_styles.customCardView}>
                        <Text style={home_styles.heading}>Recent Notes </Text>

                        {Token && notes.length != 0 ?
                            <>
                                <View style={{ marginTop: 10, }}>
                                    {notes[0] &&
                                        <Pressable
                                            onPress={() => props.navigation.navigate(screens.notesDetail, {
                                                note: notes[0],
                                                isComingFrom: "dashBoard",
                                                updateNote,
                                            })}
                                            style={home_styles.note}>
                                            <View>
                                                <Image
                                                    source={ic_notes} style={{ height: 20, width: 20, tintColor: Colors.primary3 }}
                                                />
                                            </View>
                                            <View
                                                style={{ marginLeft: 15, justifyContent: 'center', flex: 1, }}>
                                                <Text style={home_styles.noteTitle}>{notes[0].title}</Text>
                                                <Text numberOfLines={1} style={home_styles.noteDate}>
                                                    <Text>
                                                        {notes[0]?.updatedAt == notes[0]?.createdAt
                                                            ? 'Created on : '
                                                            : 'Updated on : '}
                                                    </Text>
                                                    {moment(notes[0]?.updatedAt).format('DD-MM-YYYY')}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    }
                                    {notes[1] &&
                                        <Pressable
                                            onPress={() => props.navigation.navigate(screens.notesDetail, {
                                                note: notes[1],
                                                isComingFrom: "dashBoard",
                                                updateNote,
                                            })}
                                            style={home_styles.note}>
                                            <View>
                                                <Image
                                                    source={ic_notes} style={{ height: 20, width: 20, tintColor: Colors.primary3 }}
                                                />
                                            </View>
                                            <View
                                                style={{ marginLeft: 15, justifyContent: 'center', flex: 1, }}>
                                                <Text style={home_styles.noteTitle}>{notes[1].title}</Text>
                                                <Text numberOfLines={1} style={home_styles.noteDate}>
                                                    <Text>
                                                        {notes[1]?.updatedAt == notes[1]?.createdAt
                                                            ? 'Created on : '
                                                            : 'Updated on : '}
                                                    </Text>
                                                    {moment(notes[1]?.updatedAt).format('DD-MM-YYYY')}
                                                </Text>
                                            </View>
                                        </Pressable>
                                    }
                                </View>

                                <View style={{ alignItems: "flex-end", marginTop: 10, }}>
                                    <CustomButton onPress={() => props.navigation.navigate(screens.notesList)} />
                                </View>
                            </>
                            :
                            <>
                                <View style={{ justifyContent: "center", alignItems: "center", flex: 1, marginTop: 20, }} >
                                    <Image source={empty_notes} style={{ height: 80, width: 80 }} />
                                    <Text
                                        style={{
                                            fontFamily: font.bold,
                                            fontSize: 15,
                                            includeFontPadding: false,
                                            color: Colors.black,
                                            marginTop: 10,
                                        }}>
                                        No Notes Yet
                                    </Text>
                                    <Text style={{
                                        fontFamily: font.medium,
                                        color: Colors.text,
                                        fontSize: 13,
                                        textAlign: 'center',
                                        marginTop: 8,
                                        paddingHorizontal: 30,
                                    }}>{"Start writing down your thoughts and ideas to get organized!"}
                                    </Text>

                                    <View style={{ flex: 0.5, justifyContent: 'center' }}>
                                        <Pressable onPress={() => props.navigation.navigate(screens.notesList)}
                                            style={{
                                                backgroundColor: Colors.primary,
                                                height: 33,
                                                borderRadius: 10,
                                                alignItems: "center",
                                                justifyContent: "center",
                                                paddingHorizontal: 15,
                                                marginTop: 15
                                            }}>
                                            <Text style={{ color: "white", fontWeight: "bold", fontSize: 13, }}>Add Notes{'  '}</Text>
                                        </Pressable>
                                    </View>

                                </View>
                            </>
                        }
                    </View>
                </Animatable.View>


                <Animatable.View
                    useNativeDriver
                    animation={'bounceInDown'}
                    delay={1 * 250}>
                    <View
                        style={home_styles.customCardView}>
                        <Text style={home_styles.heading}>Quote Of The Day </Text>

                        <Pressable
                            onPress={() => props.navigation.navigate(screens.qouteList, {
                                _id: quoteOfTheDay?._id,
                            })}
                        // onPress={() => showImageModal(quoteOfTheDay?.images?.large)}
                        >
                            <View style={{
                                marginTop: 12,
                                overflow: "hidden",
                                borderRadius: 12, borderColor: Colors.gray02,
                                borderWidth: 1,
                            }}>
                                <CustomImage
                                    source={{ uri: fileURL + quoteOfTheDay?.images?.large }}
                                    style={{
                                        width: '100%',
                                        aspectRatio:
                                            !!quoteOfTheDay?.image_height != 0
                                                ? quoteOfTheDay?.image_width / quoteOfTheDay?.image_height
                                                : 1,
                                    }}
                                />
                            </View>
                        </Pressable>

                        {!!quoteOfTheDay?.description &&
                            <TouchableHighlight
                                disabled={Platform.OS == 'ios'}
                                onLongPress={() => copyText(quoteOfTheDay?.description.trim())}
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
                                    }}>
                                    {quoteOfTheDay?.description.trim()}
                                </Text>
                            </TouchableHighlight>
                        }

                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#FFF',
                            }}>
                            <TouchableOpacity
                                onPress={() => favUnFavFunction(quoteOfTheDay)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}>
                                <Image
                                    source={quoteOfTheDay?.is_favourite_by_me ? Fav : notFav}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: quoteOfTheDay?.is_favourite_by_me
                                            ? Colors.primary
                                            : Colors.placeHolder,
                                    }}
                                />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontFamily: font.medium,
                                        color: Colors.placeHolder,
                                        letterSpacing: 1,
                                        includeFontPadding: false,
                                    }}>
                                    {kFormatter(quoteOfTheDay?.favourite)}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => download(quoteOfTheDay)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={ic_download}
                                    style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={isSharing != null}
                                onPress={async () => {
                                    await shareQuote(quoteOfTheDay);
                                }}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                }}>
                                {isSharing != quoteOfTheDay._id ?
                                    (
                                        <Image
                                            source={ic_share}
                                            style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
                                        />
                                    ) : (
                                        <ActivityIndicator color={Colors.placeHolder} size="small" />
                                    )
                                }
                            </TouchableOpacity>

                            {/* <TouchableOpacity
                                onPress={() => setModalVisibility(true)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={ic_wallPaper}
                                    style={{ height: 18.5, width: 18.5, tintColor: Colors.placeHolder }}
                                />
                            </TouchableOpacity> */}

                        </View>

                        <View style={{ alignItems: "flex-end", marginTop: 10, }}>
                            <CustomButton onPress={() => props.navigation.navigate(screens.qouteList)} />
                        </View>
                    </View>
                </Animatable.View>

            </ScrollView>


            {/* {isModalVisible && wallpaperOptionsModal()} */}

            <ImageZoomer
                closeModal={hideImageModal}
                visible={!!modalImage}
                url={modalImage}
            />


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
        marginHorizontal: 15,
        padding: 22
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

    note: {
        marginTop: 5,
        marginBottom: 8,
        padding: 8,
        paddingLeft: 10,
        marginHorizontal: 5,
        backgroundColor: Colors.lightPrimary2,
        borderRadius: 10,
        alignItems: 'center',
        flexDirection: 'row',
    },
    noteTitle: {
        color: Colors.black, fontFamily: font.bold, fontSize: 13, includeFontPadding: false
    },

    noteDate: {
        fontFamily: font.medium, fontSize: 12, marginTop: 5, color: Colors.text,
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