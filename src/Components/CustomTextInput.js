import {View, Text, TextInput, Pressable, Image, ScrollView} from 'react-native';
import React from 'react';
import colors from '../Utilities/Colors';
import {font} from '../Utilities/font';
import Colors from '../Utilities/Colors';

const height = 55;

//Icons

const openEyeIcon = require('../Assets/Icons/openEye.png');
const closedEyeIcon = require('../Assets/Icons/closedEye.png');

export function CustomSimpleTextInput(props) {
  return (
    <View>
      <View style={{marginBottom: 10}}>
        <Text
          style={{
            marginLeft: 5,
            color: !!props.lableColor ? props.lableColor : '#454545',
            fontFamily: !!props.lableBold ? font.bold : font.regular,
            letterSpacing: 0.5,
          }}>
          {props.lable}
        </Text>
      </View>
      <View
        style={{
          height: height,
          backgroundColor: '#fff',
          borderRadius: 15,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.gray02,
        }}>
        <TextInput
          editable={props?.editable}
          style={{flex: 1, paddingHorizontal: 20, fontFamily: font.regular}}
          placeholderTextColor={colors.placeHolder}
          placeholder={props.placeholder}
          autoCorrect={false}
          autoCapitalize={!!props.autoCapitalize ? 'sentences' : 'none'}
          selectTextOnFocus={false}
          value={props.value}
          onChangeText={props.onChangeText}
          selectionColor={Colors.primary}
          keyboardType={!!props?.type ? props?.type : 'default'}
        />
      </View>
    </View>
  );
}

export function CustomMultilineTextInput(props) {
  return (
    <View>
      <View style={{marginBottom: 10}}>
        <Text
          style={{
            marginLeft: 5,
            color: !!props.lableColor ? props.lableColor : '#454545',
            fontFamily: !!props.lableBold ? font.bold : font.regular,
            letterSpacing: 0.5,
          }}>
          {props.lable}
          {!!props.subLabel && (
            <Text
              style={{
                fontSize: 12,
                fontFamily: font.regular,
                letterSpacing: 0.8,
              }}>
              {' ' + props.subLabel}
            </Text>
          )}
        </Text>
      </View>
      <View
        style={{
          height: 200,
          // maxHeight:300,
          backgroundColor: '#fff',
          borderRadius: 15,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.gray02,
        }}>
        <TextInput
          editable={props?.editable}
          scrollEnabled
          style={{
            flex: 1,
            paddingHorizontal: 20,
            fontFamily: font.regular,
          }}
          textAlignVertical="top"
          placeholderTextColor={colors.placeHolder}
          placeholder={props.placeholder}
          autoCorrect={false}
          autoCapitalize={!!props.autoCapitalize ? 'sentences' : 'none'}
          selectTextOnFocus={false}
          value={props.value}
          onChangeText={props.onChangeText}
          multiline={true}
          selectionColor={Colors.primary}
        />
      </View>
    </View>
  );
}

export function CustomTouchableTextInput(props) {
  return (
    <View>
      <View style={{marginBottom: 10}}>
        <Text
          style={[
            {
              marginLeft: 5,
              color: !!props.lableColor ? props.lableColor : '#454545',
              fontFamily: !!props.lableBold ? font.bold : font.regular,
              letterSpacing: 0.5,
            },
            {...props?.lableStyle},
          ]}>
          {props.lable}
        </Text>
      </View>
      <Pressable
        onPress={props.onPress}
        style={{
          height: !!props.height ? props.height : height,
          backgroundColor: Colors.white,
          borderRadius: 15,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: Colors.gray02,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={{paddingHorizontal: 20, fontFamily: font.regular}}>
          {props.value}
        </Text>
      </Pressable>
    </View>
  );
}

export function CustomPasswordTextInput(props) {
  const [Visible, setVisible] = React.useState(false);
  return (
    <View>
      <View style={{marginBottom: 10}}>
        <Text
          style={{
            color: '#454545',
            fontFamily: font.regular,
            letterSpacing: 0.5,
          }}>
          {props.lable}
        </Text>
      </View>
      <View
        style={{
          height: height,
          backgroundColor: '#fff',
          borderRadius: 15,
          overflow: 'hidden',
          flexDirection: 'row',
          borderWidth: 1,
          borderColor: Colors.gray02,
        }}>
        <View style={{flex: 1}}>
          <TextInput
            style={{flex: 1, paddingHorizontal: 20, fontFamily: font.regular}}
            placeholderTextColor={colors.placeHolder}
            placeholder={props.placeholder}
            value={props.value}
            onChangeText={props.onChangeText}
            secureTextEntry={!Visible}
            autoCorrect={false}
            autoCapitalize={'none'}
            selectTextOnFocus={false}
            selectionColor={Colors.primary}
          />
        </View>
        <Pressable
          style={{width: 40, justifyContent: 'center', alignItems: 'center'}}
          onPress={() => setVisible(!Visible)}>
          <Image
            source={!!Visible ? openEyeIcon : closedEyeIcon}
            style={{
              tintColor: Visible ? Colors.primary : '#bfbfbf',
              height: 20,
              width: 20,
            }}
          />
        </Pressable>
      </View>
    </View>
  );
}
