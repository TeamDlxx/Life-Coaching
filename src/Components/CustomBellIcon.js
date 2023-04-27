import React from "react";
import { View, Pressable, Text } from "react-native";
import CustomImage from "./CustomImage";
import Colors from "../Utilities/Colors";
import notification from '../Assets/Icons/notification.png';
import { useContext } from 'react';
import Context from '../Context';

const CustomBellIcon = (props) => {
    const { count } = useContext(Context);

    return (
        <Pressable onPress={props.onPress}>
            <CustomImage
                source={notification}
                style={{ height: 26, width: 26 }}
                imageStyle={{ borderRadius: 26 / 2 }}
            />
            <View
                style={{
                    height: 19.5,
                    width: 19.5,
                    borderRadius: 19 / 2,
                    backgroundColor: "red",
                    position: "absolute",
                    top: -8,
                    bottom: 0,
                    left: 10.5,
                    right: 0,
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                <Text style={{
                    color: Colors.white,
                    fontSize: count > 99 ? 9.5 : 11,
                    textAlign: "center",
                    paddingLeft: count < 9 || count > 99 ? 0 : 2,
                }}>{count > 99 ? "99+ " : count >= 10 ? count + " " : count}</Text>
            </View>
        </Pressable>
    )
}
export default CustomBellIcon;