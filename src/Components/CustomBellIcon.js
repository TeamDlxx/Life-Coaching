import React from "react";
import { View, Pressable, Text } from "react-native";
import CustomImage from "./CustomImage";
import Colors from "../Utilities/Colors";
import notification from '../Assets/Icons/notification.png';
import { useContext } from 'react';
import Context from '../Context';

const CustomBellIcon = (props) => {
    const { badgeCount } = useContext(Context);

    return (
        <Pressable onPress={props.onPress}>
            <CustomImage
                source={notification}
                style={{ height: 24, width: 24 }}
                imageStyle={{ borderRadius: 24 / 2 }}
            />
            {badgeCount != 0 &&
                <View
                    style={{
                        height: 18,
                        width: 18,
                        borderRadius: 18 / 2,
                        backgroundColor: "red",
                        position: "absolute",
                        top: -7,
                        bottom: 0,
                        left: 10,
                        right: 0,
                        alignItems: "center",
                        justifyContent: "center"
                    }}>
                    <Text style={{
                        color: Colors.white,
                        fontSize: badgeCount > 99 ? 9 : 10,
                        textAlign: "center",
                        paddingLeft: badgeCount < 9 || badgeCount > 99 ? 0 : 1.8,
                    }}>{badgeCount > 99 ? "99+ " : badgeCount >= 10 ? badgeCount + " " : badgeCount}</Text>
                </View>
            }
        </Pressable>
    )
}
export default CustomBellIcon;