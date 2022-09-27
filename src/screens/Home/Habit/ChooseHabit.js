import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
} from 'react-native';
import React, {useState} from 'react';
import Header from '../../../Components/Header';
import {mainStyles, chooseHabit_style} from '../../../Utilities/styles';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';
import {screens} from '../../../Navigation/Screens';

const ChooseHabit = props => {
  const {params} = props.route;
  const [selectedhabits, setSelectedhabits] = useState(null);

  const renderItem = ({item, index}) => {
    return (
      <View style={{flex: 1 / 2}}>
        <Pressable
          onPress={() => setSelectedhabits(item)}
          style={{
            flex: 1,
            marginLeft: index % 2 == 0 ? 0 : 10,
            marginRight: index % 2 != 0 ? 0 : 10,
            borderRadius: 20,
            overflow: 'hidden',
            alignItems: 'center',
            padding: 10,
            marginTop: 20,
            borderWidth: 1,
            borderColor: Colors.gray02,
            backgroundColor:
              selectedhabits?.id == item.id
                ? Colors.lightPrimary
                : Colors.white,
          }}>
          <View style={{}}>
            <Image
              resizeMode="contain"
              source={item.pic}
              style={{width: 70, height: 70}}
            />
          </View>
          <View style={{marginTop: 0}}>
            <Text style={{fontFamily: font.medium, fontSize: 16}}>
              {item.title}
            </Text>
          </View>
        </Pressable>
      </View>
    );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        barStyle={'dark-content'}
        backgroundColor={Colors.background}
      />
      <Header navigation={props.navigation} title={'Choose Habit'} />
      <View style={mainStyles.innerView}>
        <View style={{flex: 1}}>
          <FlatList
            bounces={false}
            contentContainerStyle={{paddingTop: 10, paddingBottom: 40}}
            showsVerticalScrollIndicator={false}
            numColumns={2}
            data={habitList}
            renderItem={renderItem}
            ListFooterComponent={() => (
              <Pressable
                onPress={() => props.navigation.navigate(screens.createHabit)}
                style={chooseHabit_style.addButton}>
                <Image
                  source={require('../../../Assets/Icons/add.png')}
                  style={chooseHabit_style.addButtonIcon}
                />
                <Text style={chooseHabit_style.addButtonText}>
                  Create Habit
                </Text>
              </Pressable>
            )}
          />
        </View>
        {!!selectedhabits && (
          <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
            <CustomButton
              title="Get Started"
              onPress={() =>
                props.navigation.navigate(screens.createHabit, {
                  habit: selectedhabits,
                  todo: params.todo,
                })
              }
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChooseHabit;

const habitList = [
  {
    id: '1',
    title: 'Work Out',
    to_do: true,
    pic: require('../../../Assets/Images/workout.png'),
  },

  {
    id: '2',
    title: 'Eat Food',
    to_do: true,
    pic: require('../../../Assets/Images/food.png'),
  },

  {
    id: '3',
    title: 'Music',
    to_do: false,
    pic: require('../../../Assets/Images/music.png'),
  },

  {
    id: '4',
    title: 'Art & Design',
    to_do: false,
    pic: require('../../../Assets/Images/art.png'),
  },

  {
    id: '5',
    title: 'Travelling',
    to_do: true,
    pic: require('../../../Assets/Images/travel.png'),
  },

  {
    id: '6',
    title: 'Reading Book',
    to_do: false,
    pic: require('../../../Assets/Images/reading.png'),
  },

  {
    id: '7',
    title: 'Gaming',
    to_do: false,
    pic: require('../../../Assets/Images/gaming.png'),
  },

  {
    id: '8',
    title: 'Machanic',
    to_do: true,
    pic: require('../../../Assets/Images/mechanic.png'),
  },
];
