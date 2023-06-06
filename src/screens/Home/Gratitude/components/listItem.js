import { View, Text, FlatList, ImageBackground, Image, Dimensions, Pressable } from "react-native";
import React from 'react';
import Colors from "../../../../Utilities/Colors";
import { font } from "../../../../Utilities/font";
import moment from "moment";
import { fileURL } from "../../../../Utilities/domains";

const ListItem = props => {
    const win = Dimensions.get("window");

    const renderImages = ({ item, index, mainIdx }) => {
        return (
            <View
                style={{
                    marginVertical: 8,
                    marginLeft: 15,
                    marginRight: 2,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    borderWidth: 0.8,
                    borderColor: Colors.gray02,
                    height: 60,
                    width: win.width / 5.7,
                    overflow: 'hidden',
                }}>
                {index >= 3 ?
                    <ImageBackground
                        // source={{ uri: item }}
                        source={{ uri: fileURL + item?.small }}
                        style={{ height: 60, width: win.width / 5.8, alignItems: "center", justifyContent: "center" }}
                        imageStyle={{ height: 60, width: win.width / 5.8, opacity: 0.3 }}>
                        <Text style={{ fontSize: 18, color: Colors.black }}>+{mainIdx} </Text>
                    </ImageBackground>
                    :
                    <CustomImage
                        source={{ uri: fileURL + item.large }}
                        style={{
                            flex: 1,
                            height: 60, width: win.width / 5.8
                        }}
                        imageStyle={{
                            borderRadius: 20,
                        }}
                        indicatorProps={{
                            color: Colors.primary,
                        }}
                    />
                
                    // <Image source={{ uri: fileURL + item?.small }} style={{ height: 60, width: win.width / 5.8 }} />
                }
            </View>

        );
    };

    return (
        <Pressable
            onPress={props?.onPress}
            style={{
                overflow: "hidden",
                borderColor: Colors.gray02,
                borderWidth: 1,
                backgroundColor: Colors.white,
                marginBottom: 20,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 15,
                marginHorizontal: 12,
                minHeight: 70,
            }}>
            <View style={{ marginLeft: 5, flex: 1 }}>

                <Text
                    style={{
                        color: Colors.black,
                        fontFamily: font.bold,
                        letterSpacing: 0.5,
                        fontSize: 15,
                    }}>
                    {moment(props?.item.date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD") ? "Today I am so Happy and Grateful for..." : "I was so Happy and Grateful for......"}
                </Text>

                <View style={{ marginTop: 10, }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={props?.item.title}
                        scrollEnabled={false}
                        renderItem={(itemData) => {
                            return (
                                <View style={{
                                    marginTop: 5,
                                    marginBottom: 8,
                                    padding: 8,
                                    paddingLeft: 10,
                                    marginRight: 5,
                                    backgroundColor: Colors.lightPrimary2,
                                    borderRadius: 10,
                                }}>
                                    <Text
                                        style={{
                                            fontFamily: font.regular,
                                            color: Colors.black,
                                            fontSize: 13,
                                        }}
                                    >{itemData.item} </Text>
                                </View>
                            )

                        }
                        }
                    />
                </View>


                <View
                    style={{
                        marginTop: 8,
                    }}>
                    <Text
                        numberOfLines={5}
                        style={{
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 12,
                            lineHeight: 17,
                        }}>
                        {props?.item.description}
                    </Text>
                </View>

                <View style={{ marginTop: 5, marginLeft: -14 }}>
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={props?.item.images}
                        horizontal={true}
                        scrollEnabled={false}
                        renderItem={(itemData) => renderImages({ item: itemData.item, index: itemData.index, mainIdx: props?.extraImg })}
                    />
                </View>

                {props?.allGratitudes && <View
                    style={{
                        alignItems: "flex-end",
                        marginTop: 5,
                        marginRight: 5,
                    }}>
                    <Text
                        style={{
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 12,
                        }}>
                        {moment(props?.item.date).format("YYYY-MM-DD") == moment().format("YYYY-MM-DD") ? "Today, " + moment(props?.item.date).format("hh:mm a") : moment(props?.item.date).format("MMMM DD, YYYY , hh:mm a")}
                        {/* {moment(props?.item.date).format('MMMM DD, YYYY')} */}
                    </Text>
                </View>}

            </View>
        </Pressable>
    )
}


export default ListItem;