import { View, Text, Pressable, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import colors from '../Utilities/Colors';
import { font } from '../Utilities/font';
import Modal from "react-native-modal";

import LockIcon from "../Assets/Images/lock.png"
import Cross from "../Assets/Icons/close.png"
import CustomButton from './CustomButton';
import Loader from './Loader';

export default function CustomAlert(props) {
  return (

    <Modal onBackButtonPress={props.backdropPressed} isVisible={props.visible} style = {{flex:1}}>



      <View style={{ backgroundColor: "white", minHeight: 250, width: "100%", borderRadius: 20, padding: 23, alignItems: "center", paddingBottom:26 }}>

        <TouchableOpacity style = {{alignSelf:"flex-end"}} onPress = {props.backdropPressed}>
          <Image source={Cross} style={{ height: 15, width: 15, resizeMode: "contain" }} />
        </TouchableOpacity>

        <View style={{ backgroundColor: "#37C09A", height: 90, width: 90, borderRadius: 90 / 2, alignSelf: "center", alignItems: "center", justifyContent: "center" }}>
          <Image source={LockIcon} style={{ height: 40, width: 40, resizeMode: "contain" }} />
        </View>
        <Text style={{ fontSize: 18, fontFamily: "Pangram-Bold", marginTop: 20 }}>How Would You Like To Unlock?</Text>
        <Text style={{ fontSize: 12, fontFamily: "Pangram-Regular", marginTop: 10, textAlign: "center" }}>To unlock items  you can either click on subscriptions to buy an offer or you can watch an ad to get some points and unlock the item for one time.</Text>


        <TouchableOpacity onPress={props.buyOfferScreen} style={{ height: 40, width: "100%", backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", borderRadius: 10, marginTop: 20 }}>
          <Text style={{ color: "white", fontFamily: 'Pangram-Bold' }}>Buy An Offer</Text>
        </TouchableOpacity>

        {/* <TouchableOpacity onPress={props.showAd} style={{ height: 40, width: "100%", backgroundColor: colors.lightPrimary, alignItems: "center", justifyContent: "center", borderRadius: 10, marginTop: 10 }}>
          <Text style={{ color: colors.primary, fontFamily: 'Pangram-Bold' }}>Watch An Ad</Text>
        </TouchableOpacity> */}


      </View>
    </Modal>

  );
}
