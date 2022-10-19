import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Setting from '../screens/Settings/Setting';
import Home from '../screens/Home/Home';
import Profile from '../screens/Profile/Profile';
import {screens} from './Screens';
import Colors from '../Utilities/Colors';

import React from 'react';
import {Image, View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {font} from '../Utilities/font';

//Icons

const homeIcon = require('../Assets/Icons/home.png');
const profileIcon = require('../Assets/Icons/user1.png');
const settingsIcon = require('../Assets/Icons/settings.png');

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={screens.home}
      screenOptions={{
        headerShown: false,
        keyboardHidesTabBar: true,
        tabBarShowLabel: false,

        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          padding: 0,
          elevation: 0,
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
        },
      }}>
      <Tab.Screen
        name={screens.home}
        component={Home}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={focused ? _styles.selectedTabView : _styles.TabView}>
              <Image
                resizeMode="contain"
                source={homeIcon}
                style={focused ? _styles.selectedIcon : _styles.Icon}
              />
              {focused && <Text style={_styles.selectedText}>Home</Text>}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={screens.profile}
        component={Profile}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={focused ? _styles.selectedTabView : _styles.TabView}>
              <Image
                resizeMode="contain"
                source={profileIcon}
                style={focused ? _styles.selectedIcon : _styles.Icon}
              />
              {focused && <Text style={_styles.selectedText}>Profile</Text>}
            </View>
          ),
        }}
      />

      <Tab.Screen
        name={screens.settings}
        component={Setting}
        options={{
          tabBarIcon: ({focused}) => (
            <View style={focused ? _styles.selectedTabView : _styles.TabView}>
              <Image
                resizeMode="contain"
                source={settingsIcon}
                style={focused ? _styles.selectedIcon : _styles.Icon}
              />
              {focused && <Text style={_styles.selectedText}>Settings</Text>}
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const _styles = StyleSheet.create({
  TabView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  selectedTabView: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightPrimary,
  },
  Icon: {
    height: 20,
    width: 20,
    tintColor: Colors.placeHolder,
  },
  selectedIcon: {
    height: 20,
    width: 20,
    tintColor: Colors.primary,
  },
  text: {
    color: Colors.placeHolder,
    fontSize: 14,
    marginLeft: 10,
    fontFamily: font.regular,
  },
  selectedText: {
    color: Colors.primary,
    fontSize: 14,
    marginLeft: 10,
    fontFamily: font.medium,
  },
});
