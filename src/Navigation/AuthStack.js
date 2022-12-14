import {screens} from './Screens';
import {useState, useEffect} from 'react';
import * as React from 'react';
import {View, StatusBar, SafeAreaView} from 'react-native';
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

// ? Extra
import ComingSoon from '../screens/Extra/ComingSoon';

// //? Subscription

import AllPackages from '../screens/Subscriptions/AllPackages';

// //? Profile
import EditProfile from '../screens/Profile/EditProfile';
import ChangePassword from '../screens/Profile/ChangePassword';
import OfflineTracks from '../screens/Profile/OfflineTracks';
// //? Habits
import HabitTracker from '../screens/Home/Habit/HabitTracker';
import ChooseHabit from '../screens/Home/Habit/ChooseHabit';
import CreateHabit from '../screens/Home/Habit/CreateHabit';
import HabitDetail from '../screens/Home/Habit/HabitDetail';
import Statistics from '../screens/Home/Habit/Statistics';
import AllHabits from '../screens/Home/Habit/AllHabits';
import NotesDetail from '../screens/Home/Habit/NotesDetail';
import AllNotes from '../screens/Home/Habit/AllNotes';

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
import FavouriteTracks from '../screens/Home/Meditation/FavouriteTracks';

// //? TimeTable
import TimeTable from '../screens/Home/TimeTable/TimeTable';
import AddTask from '../screens/Home/TimeTable/AddTask';
import TaskDetail from '../screens/Home/TimeTable/TaskDetail';

// //? Gratitude
import Gratitude from '../screens/Home/Gratitude/Gratitude';

// //? Notes
import NotesList from '../screens/Home/Notes/NotesList';
import Editor from '../screens/Home/Notes/Editor';
import NoteFilter from '../screens/Home/Notes/Filter';
import NoteDetail from '../screens/Home/Notes/Detail';

// import Colors from '../Utilities/Colors';
import Context from '../Context';
import {useContext} from 'react';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const [whichScreen, setWhichScreen] = useState(undefined);
  const {Token, setToken} = useContext(Context);

  const checkOBoarding = async () => {
    let seen = await AsyncStorage.multiGet([
      '@onboarding',
      '@token',
      '@guestMode',
    ]);
    console.log(seen, 'seen...');
    if (seen[0][1] != null) {
      if (seen[1][1] != null) {
        setToken(seen[1][1]);
        setWhichScreen(screens.bottomTabs);
      } else if (seen[2][1] != null && seen[2][1] == 'true') {
        setWhichScreen(screens.bottomTabs);
      } else {
        setWhichScreen(screens.landing);
      }
    } else {
      setWhichScreen(screens.onboarding);
    }
  };

  useEffect(() => {
    if (whichScreen == undefined) {
      checkOBoarding();
    }
  }, []);

  if (whichScreen != undefined) {
    return (
      <Stack.Navigator
        screenListeners={() => {}}
        screenOptions={{
          headerShown: false,
          orientation: 'portrait',
        }}
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
        <Stack.Screen name={screens.comingSoon} component={ComingSoon} />
        {/* Profile */}
        <Stack.Screen
          name={screens.dowloadedTracks}
          component={OfflineTracks}
        />
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
        <Stack.Screen name={screens.NotesDetail} component={NotesDetail} />
        <Stack.Screen name={screens.AllNotes} component={AllNotes} />

        {/* MoodTracker */}
        <Stack.Screen name={screens.moodTracker} component={MoodTracker} />
        <Stack.Screen name={screens.addMood} component={AddMood} />
        <Stack.Screen name={screens.favTracks} component={FavouriteTracks} />
        {/* Quotes */}
        <Stack.Screen name={screens.qouteList} component={List} />
        <Stack.Screen name={screens.favQuoteList} component={FavQuoteList} />
        {/* Meditation*/}
        <Stack.Screen name={screens.meditation} component={Meditation} />
        <Stack.Screen
          name={screens.trackPlayer}
          component={TrackPlayerScreen}
        />
        {/* Notes */}

        <Stack.Screen name={screens.notesList} component={NotesList} />
        <Stack.Screen name={screens.noteEditor} component={Editor} />
        <Stack.Screen name={screens.notesFilter} component={NoteFilter} />
        <Stack.Screen name={screens.notesDetail} component={NoteDetail} />

        {/* TimeTable */}
        <Stack.Screen name={screens.timeTable} component={TimeTable} />
        <Stack.Screen name={screens.addTask} component={AddTask} />
        <Stack.Screen name={screens.taskDetail} component={TaskDetail} />
        {/* Gratitude */}
        <Stack.Screen name={screens.gratitude} component={Gratitude} />

        {/* Subscriptions */}

        <Stack.Screen name={screens.allPackages} component={AllPackages} />
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
