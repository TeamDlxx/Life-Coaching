import { View, TouchableOpacity, Text, FlatList, ImageBackground, Image, Dimensions } from "react-native";
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
                    marginHorizontal: 7,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 20,
                    borderWidth: 0.8,
                    height: 60,
                    width: win.width / 5.8,
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
                    <Image source={{ uri: fileURL + item?.small }} style={{ height: 60, width: win.width / 5.8 }} />
                    // <Image source={{ uri: item }} style={{ height: 60, width: win.width / 5.8 }} />
                }
            </View>

        );
    };

    return (
        <TouchableOpacity
            onPress={props?.onPress}
            activeOpacity={1}
            style={{
                overflow: "hidden",
                borderColor: Colors.gray02,
                borderWidth: 1,
                backgroundColor: Colors.white,
                marginBottom: 20,
                alignItems: 'center',
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 15,
                flexDirection: 'row',
                marginHorizontal: 12,
                minHeight: 70,
            }}>
            <View style={{ marginLeft: 10, flex: 1 }}>

                <Text
                    style={{
                        fontFamily: font.bold,
                        fontSize: 16,
                        includeFontPadding: false,
                        color: Colors.black,
                    }}>
                    {props?.item.title}
                </Text>

                <View
                    style={{
                        alignItems: "flex-start",
                        marginTop: 5,
                    }}>
                    <Text
                        style={{
                            fontFamily: font.medium,
                            color: Colors.text,
                            fontSize: 12,
                        }}>
                        {props?.item.description}
                    </Text>
                </View>

                <View
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
                        {moment(props?.item.date).format('DD MMM YYYY')}
                    </Text>
                </View>

                <View >
                    <FlatList
                        showsHorizontalScrollIndicator={false}
                        data={props?.item.images}
                        horizontal={true}
                        scrollEnabled={false}
                        renderItem={(itemData) => renderImages({ item: itemData.item, index: itemData.index, mainIdx: props?.extraImg })}
                    />
                </View>

            </View>
        </TouchableOpacity>
    )
}


export default ListItem;