import { View, Text, Image, Pressable, Dimensions, } from "react-native";
import React from 'react';
import Colors from "../../../../Utilities/Colors";
import { font } from "../../../../Utilities/font";
import moment from "moment";


/// Emojis
import Happy from "../../../../Assets/emojy/smile.gif"
import Neutral from "../../../../Assets/emojy/neutral.gif"
import Sad from "../../../../Assets/emojy/sad.gif"
import Cry from "../../../../Assets/emojy/cry.gif"
import Angry from "../../../../Assets/emojy/angrygif.gif"


/// Sphere of Life
import BeachChair from "../../../../Assets/Icons/beach-chair.png"
import Family from "../../../../Assets/Icons/family.png"
import FriendShip from "../../../../Assets/Icons/friendship.png"
import Heart from "../../../../Assets/Icons/heart.png"
import Lock from "../../../../Assets/Icons/lock.png"
import Money from "../../../../Assets/Icons/money.png"
import Portfolio from "../../../../Assets/Icons/portfolio.png"
import Stethoscope from "../../../../Assets/Icons/stethoscope.png"

const MoodListItem = props => {
    const params = props?.item;
    const mood = props?.item?.mood;

    React.useEffect(() => { }, []);

    return (
        <Pressable
            onPress={props?.onPress}
            style={{
                // overflow: "hidden",
                borderColor: Colors.gray02,
                borderWidth: 1,
                backgroundColor: Colors.white,
                marginTop: 15,
                marginBottom: 20,
                borderRadius: 20,
                marginHorizontal: 12,
                minHeight: 70,
            }}>


            <View style={{
                backgroundColor: "white",
                borderRadius: 15,
                borderWidth: 0,
                borderColor: Colors.lightPrimary,
                padding: 14.5, marginTop: 5
            }}>
                <Text style={{
                    marginTop: 10,
                    fontFamily: font.bold,
                    fontSize: 17,
                    includeFontPadding: false,
                }}>{params?.title}</Text>

                {/* <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center" }}>

                    <Image source={mood == "Happy" ? Happy : mood == "Neutral" ? Neutral : mood == "Cry" ? Cry : mood == "Angry" ? Angry : Sad} style={{ height: 47, width: 47 }} />

                    <View style={{ marginLeft: 10, flex: 1 }}>
                        <Text style={{ fontFamily: font.bold, fontSize: 15 }}>{params?.emotion} </Text>
                    </View>

                    <View style={{ height: 28, paddingHorizontal: 12, alignItems: "center", justifyContent: "center", backgroundColor: Colors.lightPrimary, borderRadius: 13 }}>
                        <Text style={{ color: Colors.primary, fontWeight: "500", fontSize: 13 }}>{params?.sphere_of_life} </Text>
                    </View>

                </View> */}

                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 12,
                    justifyContent: "flex-start",
                    marginLeft: -7
                }}>
                    {params?.emotion?.map((item, index) => {
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

                <View style={{
                    flexDirection: "row",
                    flexWrap: "wrap",
                    marginTop: 12,
                    justifyContent: "flex-start",
                    marginLeft: -7
                }}>
                    {params?.sphere_of_life?.map((item, index) => {
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


                <View>
                    <Text numberOfLines={5} style={{ marginTop: 9, fontFamily: font.regular, fontSize: 15, lineHeight: 20.5, color: Colors.gray14, }}>{params?.description}</Text>
                </View>

                {props.allMoods &&
                    <View style={{
                        alignItems: "flex-end",
                        marginTop: 10,
                        marginRight: 5,
                    }}>
                        <Text style={{ marginTop: 6, fontFamily: font.medium, fontSize: 12, color: Colors.text }}>
                            {moment(params?.date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD") ? "Today, " + moment(params?.date).format("hh:mm a") : moment(params?.date).format("MMMM DD, YYYY , hh:mm a")}
                        </Text>
                    </View>}

            </View>

            <View
                style={{
                    position: "absolute",
                    top: -28,
                    left: 10,
                }}
            >
                <Image source={mood == "Happy" ? Happy : mood == "Neutral" ? Neutral : mood == "Cry" ? Cry : mood == "Angry" ? Angry : Sad} style={{ height: 50, width: 50 }} />
            </View>

        </Pressable>

    )
}

export default MoodListItem;