import React, { useContext, useRef } from "react";
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Alert,
    Image,
    Pressable,
    Dimensions,
    ActivityIndicator,
    StyleSheet,
    TouchableHighlight,
} from 'react-native';
import Header from '../../Components/Header';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import { mainStyles } from '../../Utilities/styles';
import Loader from "../../Components/Loader";
import { useEffect, useState } from 'react';
import moment from "moment";
import showToast from "../../functions/showToast";
import { fileURL } from "../../Utilities/domains";
import { screens } from "../../Navigation/Screens";
import invokeApi from '../../functions/invokeAPI';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Context from "../../Context";
import TimeAgo from 'react-native-timeago';
import SwipeableFlatList from "react-native-swipeable-list";
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';


const limit = 10;
let pageNumber = 0;
let canLoadMore = false;

const NotificationScreen = (props) => {
    const win = Dimensions.get("window");
    const screen = Dimensions.get("screen");
    const { setBadgeCount, Token } = useContext(Context)
    const [isLoading, setisLoading] = useState(false);
    const [isLoadingMore, setisLoadingMore] = useState(false);
    const [notificationList, setNotificationList] = useState([]);
    const EditMenu = useRef();



    useEffect(() => {
        setisLoading(true);
        notificationListApi()
    }, [])

    const notificationListApi = async () => {
        let res;
        if (Token) {
            res = await invokeApi({
                path: `api/notification/user_notification_listing?page=${pageNumber}&limit=${limit}`,
                method: 'GET',
                headers: {
                    'x-sh-auth': Token,
                },
                navigation: props.navigation,
            });
        } else {
            res = await invokeApi({
                path: `api/notification/notification_listing?page=${pageNumber}&limit=${limit}`,
                method: 'GET',
                navigation: props.navigation,
            });
        }

        if (res) {
            setisLoading(false);
            setisLoadingMore(false);
            if (res.code == 200) {
                let total = notificationList.length + res?.notifications.length;
                await setNotificationList([...notificationList, ...res?.notifications]);
                pageNumber++;
                if (total < res?.count) {
                    canLoadMore = true;
                } else {
                    canLoadMore = false;
                }
                clearNotificationBadge()
            } else {
                showToast(res.message);
            }
        }
    }

    const onEndReached = () => {
        if (canLoadMore) {
            setisLoadingMore(true)
            canLoadMore = false;
            notificationListApi();

        }
    };

    const clearNotificationBadge = async () => {
        await AsyncStorage.setItem('@badgeCount', "0");
        setBadgeCount(0)
    }


    const apiDeleteNotification = async id => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/notification/delete_user_notification/' + id,
            method: 'DELETE',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
                await removeNotificationFromList(id);
                showToast(
                    'Notification has been deleted successfully',
                    'Notification deleted',
                    'success',
                );
            } else {
                showToast(res.message);
            }
        }
    };

    const removeNotificationFromList = async id => {
        let newArray = [...notificationList];
        let index = newArray.findIndex(x => x._id == id);
        newArray.splice(index, 1);
        await setNotificationList(newArray);
    };

    const deleteAllNotificationsApi = async () => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/notification/delete_user_all_notification',
            method: 'DELETE',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
                let emptyArr = []
                await setNotificationList(emptyArr)
                showToast(
                    res.message,
                    'Notifications deleted',
                    'success',
                );
            } else {
                showToast(res.message);
            }
        }
    };


    const renderNotificationList = ({ item, index }) => {

        return (
            <Pressable
                onPress={() =>
                    props.navigation.navigate(screens.quoteDetail, {
                        _id: item.action_id,
                    })
                }
                style={{
                    overflow: "hidden",
                    borderColor: Colors.gray02,
                    borderWidth: 1,
                    backgroundColor: Colors.white,
                    borderRadius: 18,
                    paddingHorizontal: 10,
                    paddingVertical: 9,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                <View
                    style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 18,
                        borderWidth: 0.8,
                        borderColor: Colors.gray02,
                        height: 63,
                        width: win.width / 5.7,
                        overflow: 'hidden',
                    }}>
                    <CustomImage
                        source={{ uri: item.image }}
                        style={{
                            height: 63, width: win.width / 5.7
                        }}
                        imageStyle={{
                            borderRadius: 20,
                        }}
                        indicatorProps={{
                            color: Colors.primary,
                        }}
                    />

                </View>

                {/* <CustomImage
                    source={{ uri: item.image }}
                    style={{ height: 35, width: 35 }}
                    imageStyle={{ borderRadius: 35 / 2 }}
                /> */}

                <View style={{ marginLeft: 12.5, flex: 1 }}>
                    <Text
                        style={{
                            flex: 1,
                            color: Colors.black,
                            fontFamily: font.bold,
                            letterSpacing: 0.5,
                            fontSize: 13.5,
                        }}>
                        {item.title}
                    </Text>

                    {/* <Text
                        style={{
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 11,
                        }}>
                        {'Category'}
                    </Text> */}

                    {item.description && <Text
                        numberOfLines={2}
                        style={{
                            marginTop: 3,
                            fontFamily: font.light,
                            color: Colors.black,
                            fontSize: 11,
                            lineHeight: 18,
                        }}>
                        {item.description}
                    </Text>}

                    <TimeAgo
                        style={{
                            marginTop: 3,
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 9,
                        }}
                        time={item.date} interval={20000} />





                </View>
            </Pressable>
        );
    }

    // BackButton Handler 
    const onBackPress = () => {
        pageNumber = 0;
        canLoadMore = false;
        props.navigation.goBack();
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
                            source={require('../../Assets/Icons/threeDots.png')}
                            style={{ height: 15, width: 15, tintColor: Colors.black }}
                        />
                    </TouchableHighlight>
                }>
                <MenuItem
                    onPress={() => {
                        EditMenu?.current.hide();
                        Alert.alert(
                            'Delete all Notifications',
                            'Are you sure you want to delete all notifications?',
                            [{ text: 'No' }, {
                                text: 'Yes', onPress: () => deleteAllNotificationsApi()
                            }],
                            { cancelable: true },
                        );
                    }}>
                    <Text style={{ fontFamily: font.bold, color: Colors.delete }}>Delete All</Text>
                </MenuItem>
            </Menu>
        );
    };

    return (
        <SafeAreaView style={mainStyles.MainView} >
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header
                navigation={props.navigation}
                title={'Notifications'}
                onBackPress={onBackPress}
                menu={Token && notificationList.length != 0 && dropDownMenu}
            />


            <View style={mainStyles.innerView}>

                <View style={{ flex: 1 }}>
                    <SwipeableFlatList
                        contentContainerStyle={{ paddingVertical: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={notificationList}
                        renderItem={renderNotificationList}
                        shouldBounceOnMount={true}
                        maxSwipeDistance={70}
                        keyExtractor={item => {
                            return item._id;
                        }}
                        renderQuickActions={({ item, index }) => {
                            if (Token)
                                return (
                                    <Pressable
                                        key={item._id}
                                        onPress={() =>
                                            Alert.alert(
                                                'Delete Notification',
                                                'Are you sure you want to delete this Notification?',
                                                [
                                                    { text: 'No' },
                                                    { text: 'Yes', onPress: () => apiDeleteNotification(item._id) },
                                                ],
                                                { cancelable: true },
                                            )
                                        }
                                        style={notificationStyles.hiddenView}>
                                        <Image
                                            source={require('../../Assets/Icons/trash.png')}
                                            style={notificationStyles.hiddenIcon}
                                        />
                                    </Pressable>
                                );
                        }}

                        ListEmptyComponent={() =>
                            isLoading == false &&
                            notificationList.length == 0 && (
                                <View style={{ alignItems: "center", justifyContent: "center", marginTop: screen.width / 2, }}>
                                    <Image
                                        source={require('../../Assets/Icons/alert.png')}
                                        style={{
                                            width: win.width * 0.40,
                                            height: win.width * 0.40,
                                        }}
                                    />
                                    <Text
                                        style={{
                                            fontFamily: font.bold,
                                            fontSize: 15,
                                            letterSpacing: 0.5,
                                            marginTop: 30,
                                        }}>
                                        No Notifications Yet
                                    </Text>
                                </View>
                            )
                        }
                        onEndReached={onEndReached}
                        ListFooterComponent={
                            isLoadingMore && (
                                <View style={{ height: 100, justifyContent: 'center' }}>
                                    <ActivityIndicator color={Colors.primary} size="small" />
                                </View>
                            )
                        }
                    />
                </View>

                <Loader enable={isLoading} />
            </View>


        </SafeAreaView>
    )
}

export default NotificationScreen;

const notificationStyles = StyleSheet.create({
    hiddenView: {
        justifyContent: 'center',
        alignItems: 'flex-end',
        overflow: "hidden",
        marginHorizontal: 12,
        backgroundColor: Colors.delete,
        borderRadius: 20,
        paddingRight: 20,
        marginBottom: 13,
        flex: 1,
        borderColor: Colors.background,
        borderWidth: 1,
    },
    hiddenIcon: { height: 25, width: 25, tintColor: Colors.white },
});