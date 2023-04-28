import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
} from 'react-native';
import React, {useState , useRef , useEffect} from 'react';
import Header from '../../../Components/Header';
import {mainStyles, chooseHabit_style} from '../../../Utilities/styles';
import Colors from '../../../Utilities/Colors';
import {font} from '../../../Utilities/font';
import CustomButton from '../../../Components/CustomButton';
import {screens} from '../../../Navigation/Screens';
import analytics from '@react-native-firebase/analytics';

// For API's
import {useContext} from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import invokeApi from '../../../functions/invokeAPI';
import {fileURL} from '../../../Utilities/domains';
import CustomImage from '../../../Components/CustomImage';

const ChooseHabit = props => {
  const {params} = props.route;
  const {navigation} = props;
  const {Token} = useContext(Context);
  const [preDefinedHabits, setPreDefinedHabits] = useState([]);
  const [selectedhabits, setSelectedhabits] = useState(null);
  const [isLoading, setisLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [progressViewOffsetValue, setProgressViewOffsetValue] = useState(undefined);
  const goBackEventWasHandled = useRef(false)

  const callAdminHabitsListAPI = () => {
    setisLoading(true);
    api_AdminHabits();
  };

  const refreshFlatList = () => {
    setRefreshing(true);
    api_AdminHabits();
  };

  const api_AdminHabits = async () => {
    let res = await invokeApi({
      path: 'api/habit/admin_habit_list',
      method: 'POST',
      headers: {
        'x-sh-auth': Token,
      },
      postData: {
        type: params?.todo == 1 ? 'to-do' : 'not-to-do',
      },
      navigation: props.navigation,
    });

    setisLoading(false);
    setRefreshing(false);
    if (res) {
      if (res.code == 200) {
        setPreDefinedHabits(res.habits);
      } else {
        showToast(res.message);
      }
    }
  };

  React.useEffect(() => {
    callAdminHabitsListAPI();

    analytics().logEvent(props?.route?.name);

    return () => {
      setPreDefinedHabits([]);
    };
  }, []);

  useEffect(() => {
    // perform the navigation with the hidden refresh indicator
    if (progressViewOffsetValue !== undefined) {
      props.navigation.goBack()
    }
    const unsubscribe = props.navigation.addListener('beforeRemove', (event) => {
      // Handle GO_BACK event only, because it fits my use case, please tweak it to fit yours
      if (event.data.action.type === 'GO_BACK' && !goBackEventWasHandled.current) {
        event.preventDefault()
        goBackEventWasHandled.current = true
        setProgressViewOffsetValue(-1000) // set to a ridiculous value to hide the refresh control
      }
    })
    return unsubscribe
  }, [props.navigation, progressViewOffsetValue])


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
              selectedhabits?._id == item._id
                ? Colors.lightPrimary
                : Colors.white,
          }}>
          <View
            style={{
              width: 80,
              height: 80,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CustomImage
              resizeMode="contain"
              source={{uri: fileURL + item?.images?.small}}
              style={{width: 60, height: 60}}
              indicatorProps={{color: Colors.primary}}
            />
          </View>
          <View style={{marginTop: 0}}>
            <Text style={{fontFamily: font.medium, fontSize: 16,textAlign:"center"}}>
              {item.name}
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
          <Loader enable={isLoading} />
          <View style={{flex: 1}}>
            <FlatList
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={refreshFlatList}
                  tintColor={Colors.primary}
                  colors={[Colors.primary]}
                  progressBackgroundColor={Colors.white}
                  progressViewOffset={progressViewOffsetValue}
                />
              }
              contentContainerStyle={{paddingTop: 10, paddingBottom: 40}}
              showsVerticalScrollIndicator={false}
              numColumns={2}
              data={preDefinedHabits}
              renderItem={renderItem}
              ListFooterComponent={() => {
                if (isLoading == false) {
                  return (
                    <Pressable
                      onPress={() =>
                        navigation.navigate(screens.createHabit, {
                          todo: params.todo,
                        })
                      }
                      style={chooseHabit_style.addButton}>
                      <Image
                        source={require('../../../Assets/Icons/add.png')}
                        style={chooseHabit_style.addButtonIcon}
                      />
                      <Text style={chooseHabit_style.addButtonText}>
                        Create Habit
                      </Text>
                    </Pressable>
                  );
                }
              }}
            />
          </View>
        </View>
        {!!selectedhabits && (
          <View style={{paddingHorizontal: 20, paddingBottom: 10}}>
            <CustomButton
              title="Get Started"
              onPress={() =>
                navigation.navigate(screens.createHabit, {
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
