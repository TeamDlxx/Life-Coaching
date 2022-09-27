import {screens} from './Screens';
import {useState, useEffect} from 'react';
import * as React from 'react';
import {View, StatusBar} from 'react-native';
import Colors from '../Utilities/Colors';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
//Screens

import Login from '../screens/Auth/Login';
import Onboarding from '../screens/Auth/Onboarding';
import Landing from '../screens/Auth/Landing';
import Signup from '../screens/Auth/Signup';
import NewPassword from '../screens/Auth/NewPassword';
import ForgotPassword from '../screens/Auth/ForgotPassword';
import OTP from '../screens/Auth/OTP';
import BottomTabs from './BottomTabs';

// //? Profile
import EditProfile from '../screens/Profile/EditProfile';
import ChangePassword from '../screens/Profile/ChangePassword';

// //? Habits
import HabitTracker from '../screens/Home/Habit/HabitTracker';
import ChooseHabit from '../screens/Home/Habit/ChooseHabit';
import CreateHabit from '../screens/Home/Habit/CreateHabit';
import HabitDetail from '../screens/Home/Habit/HabitDetail';
import Statistics from '../screens/Home/Habit/Statistics';
import AllHabits from '../screens/Home/Habit/AllHabits';

// //? MoodTracker
import MoodTracker from '../screens/Home/MoodTracker/MoodTracker';
import AddMood from '../screens/Home/MoodTracker/AddMood';

// //? Quotes
import List from '../screens/Home/Quotes/List';
import FavQuoteList from '../screens/Home/Quotes/FavQuoteList';

// //? Meditation
import Meditation from '../screens/Home/Meditation/Meditation';
// //
import TrackPlayerScreen from '../screens/Home/Meditation/TrackPlayerScreen';

// //? TimeTable
import TimeTable from '../screens/Home/TimeTable/TimeTable';
import AddTask from '../screens/Home/TimeTable/AddTask';
import TaskDetail from '../screens/Home/TimeTable/TaskDetail';

// //? Gratitude
import Gratitude from '../screens/Home/Gratitude/Gratitude';

// import Colors from '../Utilities/Colors';
const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [whichScreen, setWhichScreen] = useState(undefined);
  const checkOBoarding = async () => {
    let seen = await AsyncStorage.multiGet(['@onboarding', '@token']);
    console.log(seen[1][1]);
    if (seen[1][1] != null) {
      setWhichScreen(screens.bottomTabs);
    } else if (seen[0][1] != null) {
      setWhichScreen(screens.landing);
    } else {
      setWhichScreen(screens.onboarding);
    }
  };

  useEffect(() => {
    checkOBoarding();
  }, []);

  if (whichScreen != undefined) {
    return (
      <Stack.Navigator
        screenOptions={{headerShown: false, orientation: 'portrait'}}
        initialRouteName={whichScreen}>
        <Stack.Screen name={screens.Login} component={Login} />
        <Stack.Screen name={screens.signup} component={Signup} />
        <Stack.Screen name={screens.onboarding} component={Onboarding} />
        <Stack.Screen name={screens.landing} component={Landing} />
        <Stack.Screen name={screens.otp} component={OTP} />
        <Stack.Screen name={screens.newPassword} component={NewPassword} />
        <Stack.Screen
          name={screens.forgotPassword}
          component={ForgotPassword}
        />
        <Stack.Screen name={screens.bottomTabs} component={BottomTabs} />
        {/* Profile */}
        <Stack.Screen name={screens.editProfile} component={EditProfile} />
        <Stack.Screen
          name={screens.changePassword}
          component={ChangePassword}
        />
        {/* Habits */}
        <Stack.Screen name={screens.habitTracker} component={HabitTracker} />
        <Stack.Screen name={screens.chooseHabit} component={ChooseHabit} />
        <Stack.Screen name={screens.createHabit} component={CreateHabit} />
        <Stack.Screen name={screens.habitStats} component={Statistics} />
        <Stack.Screen name={screens.allHabits} component={AllHabits} />
        <Stack.Screen name={screens.habitDetail} component={HabitDetail} />
        {/* MoodTracker */}
        <Stack.Screen name={screens.moodTracker} component={MoodTracker} />
        <Stack.Screen name={screens.addMood} component={AddMood} />
        {/* Quotes */}
        <Stack.Screen name={screens.qouteList} component={List} />
        <Stack.Screen name={screens.favQuoteList} component={FavQuoteList} />
        {/* Meditation*/}
        <Stack.Screen name={screens.meditation} component={Meditation} />
        <Stack.Screen name={screens.trackPlayer} component={TrackPlayerScreen} />
        {/* TimeTable */}
        <Stack.Screen name={screens.timeTable} component={TimeTable} />
        <Stack.Screen name={screens.addTask} component={AddTask} />
        <Stack.Screen name={screens.taskDetail} component={TaskDetail} />
        {/* Gratitude */}
        <Stack.Screen name={screens.gratitude} component={Gratitude} />
      </Stack.Navigator>
    );
  } else {
    return (
      <View style={{flex: 1, backgroundColor: Colors.background}}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.background}
        />
      </View>
    );
  }
};

export default AuthStack;
