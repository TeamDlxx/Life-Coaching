import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Image,
    Alert,
    StyleSheet,
    TouchableHighlight,
    ScrollView,
    Dimensions,
} from 'react-native';
import React, { useState, useRef } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, } from '../../../Utilities/styles';
import { font } from '../../../Utilities/font';
import { screens } from '../../../Navigation/Screens';
import { Menu, MenuItem, MenuDivider } from 'react-native-material-menu';
import { useEffect } from 'react';
import Loader from '../../../Components/Loader';
import moment from 'moment';
import invokeApi from '../../../functions/invokeAPI';
import showToast from '../../../functions/showToast';


/// Emojis
import Happy from "../../../Assets/emojy/smile.gif"
import Neutral from "../../../Assets/emojy/neutral.gif"
import Sad from "../../../Assets/emojy/sad.gif"
import Cry from "../../../Assets/emojy/cry.gif"
import Angry from "../../../Assets/emojy/angrygif.gif"

/// Sphere of Life
import BeachChair from "../../../Assets/Icons/beach-chair.png"
import Family from "../../../Assets/Icons/family.png"
import FriendShip from "../../../Assets/Icons/friendship.png"
import Heart from "../../../Assets/Icons/heart.png"
import Lock from "../../../Assets/Icons/lock.png"
import Money from "../../../Assets/Icons/money.png"
import Portfolio from "../../../Assets/Icons/portfolio.png"
import Stethoscope from "../../../Assets/Icons/stethoscope.png"

// For API's calling
import { useContext } from 'react';
import Context from '../../../Context';

const MoodDetail = props => {
    const { Token, allMoodJournals, setAllMoodJournals, updateAllMoodJournals } = useContext(Context);
    const { params } = props?.route;
    const screen = Dimensions.get("screen");
    const EditMenu = useRef();
    const [isLoading, setisLoading] = useState(false);
    const [moodDetail, setMoodDetail] = useState(null);
    const [emoji, setEmoji] = useState()


    useEffect(() => {
        callMoodDetailApi();
        return () => { }
    }, []);


    const renderEmoji = async (mood) => {
        if (mood == "Happy") {
            setEmoji(Happy)
        } else if (mood == "Neutral") {
            setEmoji(Neutral)
        } else if (mood == "Sad") {
            setEmoji(Sad)
        } else if (mood == "Cry") {
            setEmoji(Cry)
        } else if (mood == "Angry") {
            setEmoji(Angry)
        }
    }

    const callMoodDetailApi = () => {
        setisLoading(true);
        api_MoodDetail();
    };

    const api_MoodDetail = async () => {
        let res = await invokeApi({
            path: 'api/mood/mood_detail/' + params?.id,
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
                setMoodDetail(res?.mood);
                console.log(moodDetail, "mood details...")
                renderEmoji(res?.mood.mood);
            } else {
                showToast(res.message);
            }
        }
    };

    const api_deleteMood = async () => {
        let id = moodDetail?._id;
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/mood/delete_mood/' + id,
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
                    'Mood Journal has been deleted successfully',
                    'Mood Journal deleted',
                    'success',
                );
                if (!!params?.removeMoodFromPreviousScreenList) {
                    params?.removeMoodFromPreviousScreenList(id);
                }
                removeFromGlobalMoodList(id);
                props?.navigation?.goBack();
            } else {
                showToast(res.message);
            }
        }
    };

    const removeFromGlobalMoodList = id => {
        let newArray = [...allMoodJournals];
        let index = newArray.findIndex(x => x._id == id);
        if (index != -1) {
            newArray.splice(index, 1);
            setAllMoodJournals(newArray);
        }
    };

    const updateMoodLocally = async item => {
        console.log('--> Mood <--', item);
        setMoodDetail(item);

        await renderEmoji(item?.mood)

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
                        props.navigation.navigate(screens.moodTracker, {
                            item: moodDetail,
                            updateMood: params?.updateMood,
                            updateMoodDetail: updateMoodLocally,
                        });
                    }}>
                    <Text style={{ fontFamily: font.bold }}>Edit</Text>
                </MenuItem>

                <MenuDivider />

                <MenuItem
                    onPress={() => {
                        EditMenu?.current.hide();
                        Alert.alert(
                            'Delete Mood Journal',
                            'Are you sure, you want to delete this mood journal?',
                            [{ text: 'No' }, {
                                text: 'Yes', onPress: () => api_deleteMood()
                            }],
                            {cancelable: true},
                        );
                    }}>
                    <Text style={{ fontFamily: font.bold }}>Delete</Text>
                </MenuItem>
            </Menu>
        );
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
                    title={'Mood Detail'}
                />
                <View style={{ flex: 1 }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 30 }}>
                        <View style={{ flex: 1 }}>
                            <View style={{
                                backgroundColor: "white",
                                borderRadius: 20,
                                borderWidth: 1,
                                borderColor: Colors.gray02,
                                padding: 15,
                                marginTop: '25%',
                                marginHorizontal: 10,
                            }}>
                                <View
                                    style={{
                                        width: screen.width / 3,
                                        aspectRatio: 1,
                                        borderRadius: 20,
                                        alignSelf: 'center',
                                        shadowColor: '#000',
                                        shadowOffset: {
                                            width: 0,
                                            height: 2,
                                        },
                                        shadowOpacity: 0.25,
                                        shadowRadius: 3.84,

                                        elevation: 5,
                                        marginTop: -screen.width / 5,
                                        backgroundColor: Colors.white,
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                    <Image source={
                                        emoji
                                    }
                                        style={{
                                            width: screen.width / 3.5,
                                            height: screen.width / 3.5,
                                            aspectRatio: 1,
                                        }}
                                        resizeMode="cover"
                                    />

                                </View>


                                <View style={{ marginTop: 30 }}>
                                    <Text style={MoodDetail_style.lable}>Title </Text>
                                    <Text
                                        style={[MoodDetail_style.detailText, { fontSize: 20 }]}>
                                        {moodDetail?.title}
                                    </Text>
                                </View>

                                <View style={MoodDetail_style.ItemView}>
                                    <Text style={MoodDetail_style.lable}>Mood Intensity </Text>
                                    <Text style={[MoodDetail_style.detailText]}>
                                        {(moodDetail?.intensity <= 9) ? "0" + moodDetail?.intensity : moodDetail?.intensity}
                                    </Text>
                                </View>


                                <View style={MoodDetail_style.ItemView}>
                                    <Text style={MoodDetail_style.lable}>Emotions </Text>
                                    <View style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        marginTop: 5,
                                        justifyContent: "flex-start",
                                        marginLeft: -7
                                    }}>
                                        {moodDetail?.emotion?.map((item, index) => {
                                            return (
                                                <View key={index}
                                                    style={{
                                                        backgroundColor: Colors.secondary,
                                                        height: 32,
                                                        borderRadius: 15,
                                                        paddingHorizontal: 12,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        margin: 4,
                                                        borderColor: Colors.primary,
                                                        borderWidth: 0.3,
                                                    }}>
                                                    <Text style={{
                                                        color: Colors.primary,
                                                        fontWeight: "500"
                                                    }}>{item}  </Text>
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>


                                <View style={MoodDetail_style.ItemView}>
                                    <Text style={MoodDetail_style.lable}>Sphere of life </Text>

                                    <View style={{
                                        flexDirection: "row",
                                        flexWrap: "wrap",
                                        marginTop: 5,
                                        justifyContent: "flex-start",
                                        marginLeft: -7
                                    }}>
                                        {moodDetail?.sphere_of_life?.map((item, index) => {
                                            return (
                                                <View key={index}
                                                    style={{
                                                        flexDirection: "row",
                                                        backgroundColor: '#e6e6e6',
                                                        height: 32,
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        borderRadius: 15,
                                                        paddingHorizontal: 12,
                                                        margin: 4,
                                                        borderColor: '#d1d1d1',
                                                        borderWidth: 0.5,
                                                    }}>
                                                    <Image
                                                        source={item.trim() == "Work" ? Portfolio :
                                                            item.trim() == "Friends" ? FriendShip :
                                                                item.trim() == "Love" ? Heart :
                                                                    item.trim() == "Family" ? Family :
                                                                        item.trim() == "Personal" ? Lock :
                                                                            item.trim() == "Health" ? Stethoscope :
                                                                                item.trim() == "Finance" ? Money : BeachChair}
                                                        style={{ height: 18, width: 18, resizeMode: "contain" }} />
                                                    <Text style={{
                                                        marginLeft: 5,
                                                        color: "black",
                                                        fontWeight: "500",
                                                    }}
                                                    >{item}  </Text>
                                                </View>
                                            )
                                        })}
                                    </View>

                                    {/* <Text style={[MoodDetail_style.detailText]}>
                                        {moodDetail?.sphere_of_life}
                                    </Text> */}
                                </View>

                                {moodDetail?.description && <View style={MoodDetail_style.ItemView}>
                                    <Text style={MoodDetail_style.lable}>Description </Text>
                                    <Text
                                        style={MoodDetail_style.description}>
                                        {moodDetail?.description}
                                    </Text>
                                </View>}

                                {isLoading == false && <View style={MoodDetail_style.ItemView}>
                                    <Text style={{
                                        fontSize: 13,
                                        fontFamily: font.regular,
                                        marginTop: 5,
                                        color: Colors.placeHolder,
                                        alignSelf: "center"
                                    }}>
                                        {moment(moodDetail?.date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD") ? "Today, " + moment(moodDetail?.date).format("hh:mm a") : moment(moodDetail?.date).format("MMMM DD, YYYY , hh:mm a")}
                                        {/* {moment(moodDetail?.date).format('MMMM DD, YYYY , hh:mm a')} */}
                                    </Text>
                                </View>}

                            </View>
                        </View>

                    </ScrollView>
                </View>
            </View >
            <Loader enable={isLoading} />
        </SafeAreaView >
    );
};

export default MoodDetail;

const MoodDetail_style = StyleSheet.create({
    ItemView: {
        marginTop: 15,
    },

    lable: {
        fontSize: 12.5,
        fontFamily: font.regular,
        color: Colors.placeHolder,
    },

    description: {
        marginTop: 5,
        fontFamily: font.regular,
        lineHeight: 20.5,
        color: Colors.gray14
    },

    detailText: {
        fontSize: 14,
        fontFamily: font.bold,
        marginTop: 5,
        color: Colors.black,
    },

});
