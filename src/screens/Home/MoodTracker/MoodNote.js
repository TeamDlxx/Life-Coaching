import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ScrollView,
    TouchableHighlight,
    FlatList,
    Image,
    Dimensions,
    TouchableOpacity,
    TextInput
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import styles, { mainStyles } from '../../../Utilities/styles';
import { screens } from '../../../Navigation/Screens';



const MoodNote = props => {


    var textInput = useRef("")
    const [focused, setfocused] = useState(false)

    const moodsJournal = () => {
        props.navigation.navigate(screens.moodsJournal)
    }


    const focusField = () => {
        textInput.focus();
        setfocused(true)
    }

    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header navigation={props.navigation} title={'Add a note'} />
            <View style={mainStyles.innerView}>

                <ScrollView showsVerticalScrollIndicator={false}>


                    <View style={{ marginTop: 20 }}>
                        <TextInput
                            placeholder='Title'
                            style={{ height: 53, width: "100%", backgroundColor: "white", borderRadius: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: Colors.lightPrimary }}
                        />

                        <TouchableOpacity onPress={focusField} activeOpacity={1} style={{ height: 250, width: "100%", backgroundColor: "white", borderRadius: 8, borderWidth: 1, borderColor: Colors.lightPrimary, marginTop: 10, paddingTop: 13, paddingLeft: 13 }}>
                            <TextInput
                                placeholder='Description'
                                multiline
                                verticalAlign="top"
                                ref={(input) => { textInput = input; }}
                            // style={{ height: 250, width: "100%", backgroundColor: "white", borderRadius: 8, borderWidth: 1, borderColor: Colors.lightPrimary, marginTop: 10, paddingTop: 13, paddingLeft: 13 }}
                            />
                        </TouchableOpacity>



                    </View>



                    <TouchableOpacity onPress={moodsJournal} style={{ backgroundColor: Colors.primary, borderRadius: 10, height: 50, alignItems: "center", justifyContent: "center", marginTop: "31%" }}>
                        <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Save </Text>
                    </TouchableOpacity>



                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

export default MoodNote;

