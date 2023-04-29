import React, { useContext } from "react";
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    FlatList,
    Image,
    Pressable,
    Dimensions,
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


const NotificationScreen = (props) => {
    const win = Dimensions.get("window");
    const screen = Dimensions.get("screen");
    const { setBadgeCount } = useContext(Context)
    const [isLoading, setisLoading] = useState(false);
    const [notificationList, setNotificationList] = useState([]);


    useEffect(() => {
        setisLoading(true);
        notificationListApi()
    }, [])

    const notificationListApi = async () => {
        let res = await invokeApi({
            path: 'api/notification/notification_listing',
            method: 'GET',
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
                console.log(res, "response...")
                let list = res.notifications
                await setNotificationList(list)
                setisLoading(false);
                clearNotificationBadge()
            } else {
                showToast(res.message);
                setisLoading(false);
            }
        }
    }

    const clearNotificationBadge = async () => {
        await AsyncStorage.setItem('@badgeCount', "0");
        setBadgeCount(0)
    }

    const renderNotificationList = ({ item, index }) => {

        return (
            <Pressable
                onPress={() =>
                    props.navigation.navigate(screens.qouteList, {
                        _id: item._id,
                    })
                }
                style={{
                    overflow: "hidden",
                    borderColor: Colors.gray02,
                    borderWidth: 1,
                    backgroundColor: Colors.white,
                    borderRadius: 18,
                    paddingHorizontal: 10,
                    paddingVertical: 12,
                    marginBottom: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "flex-start"
                }}>
                <CustomImage
                    source={{ uri: item.image }}
                    style={{ height: 35, width: 35 }}
                    imageStyle={{ borderRadius: 35 / 2 }}
                />

                <View style={{ marginLeft: 12.5, flex: 1 }}>
                    <View
                        style={{
                            marginRight: 5,
                            flexDirection: "row",
                            justifyContent: "space-between",
                        }}>
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

                        <Text
                            style={{
                                fontFamily: font.medium,
                                color: Colors.text,
                                fontSize: 11.5,
                            }}>
                            {moment(item.date).format("MMMM DD, YYYY")}
                        </Text>
                    </View>

                    <Text
                        style={{
                            marginTop: 5,
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 12,
                            lineHeight: 18,
                        }}>
                        {item.description}
                    </Text>

                </View>
            </Pressable>
        );
    }


    return (
        <SafeAreaView style={mainStyles.MainView} >
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header
                navigation={props.navigation}
                title={'Notifications'}
            />


            <View style={mainStyles.innerView}>

                <View style={{ flex: 1 }}>
                    <FlatList
                        contentContainerStyle={{ paddingVertical: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={notificationList}
                        renderItem={renderNotificationList}
                        shouldBounceOnMount={true}
                        maxSwipeDistance={70}
                        keyExtractor={(item, index) => {
                            return index;
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
                    />
                </View>

                <Loader enable={isLoading} />
            </View>


        </SafeAreaView>
    )
}

export default NotificationScreen;