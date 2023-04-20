import { Pressable, Text  } from "react-native";
import Colors from "../../../Utilities/Colors";
import React from "react";

const CustomButton = (props) => {
    return (
        <Pressable onPress={props.onPress}
            style={{
                // backgroundColor: Colors.lightPrimary,
                height: 20, width: 90,
                borderRadius: 10,
                alignItems: "center",
                justifyContent: "center",
            }}>
            <Text style={{ color: Colors.primary, fontWeight: "bold" , fontSize: 13,textDecorationLine:"underline"}}>View More{' '}</Text>
         </Pressable>
    )
}

export default CustomButton;