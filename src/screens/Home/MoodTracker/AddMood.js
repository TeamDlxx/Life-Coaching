import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useRef, useState} from 'react';
  import Header from '../../../Components/Header';
  import Colors from '../../../Utilities/Colors';
  import {mainStyles, FAB_style, other_style} from '../../../Utilities/styles';
  import {font} from '../../../Utilities/font';
  import {screens} from '../../../Navigation/Screens';
  import nextWhite from '../../../Assets/Icons/nextWhite.png'

  import Greateful1 from '../../../Assets/emojy/Greateful.png'
  import Excited1 from '../../../Assets/emojy/Excited.png'
  import Happy1 from '../../../Assets/emojy/Happy.png'
  import Confused1 from '../../../Assets/emojy/Confused2.png'
  import Calm1 from '../../../Assets/emojy/Calm.png'
  import Surprised1 from '../../../Assets/emojy/Surprised.png'
  import Sick1 from '../../../Assets/emojy/Sick.png'
  import Angry1 from '../../../Assets/emojy/Angry.png'
  import Sleepy1 from '../../../Assets/emojy/Sleepy.png'

  const AddMood = (props ) => {
    const {params} = props.route;
  const [selectedMood, setSelectedMood] = useState(props.route.params.selectedMood);
   
  const changeMood=(item)=>
  {
    setSelectedMood(item)
    console.log(item,'item item')
  }
  const singleItem=(item)=>
  {
    return( 
    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
    <TouchableOpacity onPress={()=>{changeMood(item)}}
        style={selectedMood._id==item._id ?
        {
        alignItems: 'center',
        justifyContent:'center',
        borderRadius: 20,
        backgroundColor: Colors.lightPrimary,
        paddingHorizontal: 0,
        height: '90%',
        width:'85%',
        borderRadius:30,
        }
        :
        {
        alignItems: 'center',
        justifyContent:'center',
        borderRadius: 20,
        backgroundColor: Colors.white,
        paddingHorizontal: 0,
        height: '90%',
        width:'85%',
        borderRadius:30,
        }
    }>
      <Image source={item.emoji} style={{width:50,height:50}}></Image>
      <Text style={[other_style.labelText,{marginLeft:0,fontSize:14,letterSpacing:0,fontFamily:'Pangram-Black',marginTop:5}]}>
      {item.name}
     </Text>               
      </TouchableOpacity>
    </View>)
  }
    //? Views


       // Main render View............
    return (
      <SafeAreaView style={mainStyles.MainView}>
        <StatusBar
          barStyle={'dark-content'}
          backgroundColor={Colors.background}
        />
        <Header
          navigation={props.navigation}
          title={''}
          titleAlignLeft
        />
        <View style={mainStyles.innerView}>
          <View style={{flex: 1, marginHorizontal:0}}>
          <View
        style={{
          marginTop: 0,
          marginBottom: 20,
          marginHorizontal: -5,
          height: 110,
        }}>
            <View style={{flex:4,justifyContent:'center'}}>
            <Text style={[other_style.labelText,{marginLeft:10,fontSize:23,letterSpacing:0,fontFamily:'Pangram-Black'}]}>
              What's your mood {'\n'} today?
          </Text> 
            </View>
            
          </View>

          <View style={{flex:7,borderRadius:18, marginHorizontal: -5,}}>

           <View style={{flex:1,flexDirection:'row',marginHorizontal:10}}>

             {singleItem(emojis[0])}
             {singleItem(emojis[1])}
             {singleItem(emojis[2])}

           </View>

           <View style={{flex:1,flexDirection:'row',marginHorizontal:10}}>

            {singleItem(emojis[3])}
            {singleItem(emojis[4])}
            {singleItem(emojis[5])}

           </View>


           <View style={{flex:1,flexDirection:'row',marginHorizontal:10}}>
            
            {singleItem(emojis[6])}
            {singleItem(emojis[7])}
            {singleItem(emojis[8])}

           </View>


          
          </View>
          <View style={{flex:2.5,alignItems:'flex-end'}}>

          <TouchableOpacity onPress={()=>{
             props.route.params.item(selectedMood)
             props.navigation.goBack()
          }}  style={modalStyle.View}>
                <Image
            source={nextWhite}
            style={[FAB_style.image,{height:12,width:12}]}
            />
                </TouchableOpacity>
          </View>
          </View>
        
        </View>
      </SafeAreaView>
    );
  };

 
  
  export default AddMood;
  
 
  
  const habitsList = [
    {
      _id: '1',
      title: 'Leave Junk Food',
      status: false,
      note: '',
      frequency: [1, 2, 3, 4, 5, 6, 7],
      image: require('../../../Assets/Images/junkfood.webp'),
      to_do: false,
      target_date: '12 Oct 2022',
      reminder: true,
      reminder_time: '10:00 AM',
    },
  
    {
      _id: '2',
      title: 'Drink Water Regularly',
      status: true,
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      frequency: [1, 3, 4],
      image: require('../../../Assets/Images/water.png'),
      to_do: true,
      target_date: '12 Oct 2022',
      reminder: false,
      reminder_time: '06:30 PM',
    },
  
    {
      _id: '3',
      title: 'Quit Smoking',
      status: false,
      note: '',
      to_do: false,
      frequency: [1, 6, 7],
      image: require('../../../Assets/Images/smoking.jpeg'),
      target_date: '10 Nov 2022',
      reminder: true,
      reminder_time: '02:00 PM',
    },
  
    {
      _id: '4',
      title: 'Walk Regularly',
      status: true,
      note: '',
      to_do: true,
      frequency: [2, 3, 4],
      image: require('../../../Assets/Images/walking.webp'),
      target_date: '25 Sep  2022',
      reminder: true,
      reminder_time: '10:00 PM',
    },
  
    {
      _id: '23e1',
      title: 'Leave Junk Food',
      status: false,
      note: '',
      frequency: [1, 2, 3, 4, 5, 6, 7],
      image: require('../../../Assets/Images/junkfood.webp'),
      to_do: false,
      target_date: '12 Oct 2022',
      reminder: true,
      reminder_time: '10:00 AM',
    },
  
    {
      _id: 'fwe2',
      title: 'Drink Water Regularly',
      status: true,
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      frequency: [1, 3, 4],
      image: require('../../../Assets/Images/water.png'),
      to_do: true,
      target_date: '12 Oct 2022',
      reminder: false,
      reminder_time: '06:30 PM',
    },
  
    {
      _id: 'vDS3',
      title: 'Quit Smoking',
      status: false,
      note: '',
      to_do: false,
      frequency: [1, 6, 7],
      image: require('../../../Assets/Images/smoking.jpeg'),
      target_date: '10 Nov 2022',
      reminder: true,
      reminder_time: '02:00 PM',
    },
  
    {
      _id: '4EFWEFW',
      title: 'Walk Regularly',
      status: true,
      note: '',
      to_do: true,
      frequency: [2, 3, 4],
      image: require('../../../Assets/Images/walking.webp'),
      target_date: '25 Sep  2022',
      reminder: true,
      reminder_time: '10:00 PM',
    },
  
    {
      _id: '1F23F2WE',
      title: 'Leave Junk Food',
      status: false,
      note: '',
      frequency: [1, 2, 3, 4, 5, 6, 7],
      image: require('../../../Assets/Images/junkfood.webp'),
      to_do: false,
      target_date: '12 Oct 2022',
      reminder: true,
      reminder_time: '10:00 AM',
    },
  
    {
      _id: 'WEFWEF2',
      title: 'Drink Water Regularly',
      status: true,
      note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
      frequency: [1, 3, 4],
      image: require('../../../Assets/Images/water.png'),
      to_do: true,
      target_date: '12 Oct 2022',
      reminder: false,
      reminder_time: '06:30 PM',
    },
  
    {
      _id: 'WEFBWRWEF3',
      title: 'Quit Smoking',
      status: false,
      note: '',
      to_do: false,
      frequency: [1, 6, 7],
      image: require('../../../Assets/Images/smoking.jpeg'),
      target_date: '10 Nov 2022',
      reminder: true,
      reminder_time: '02:00 PM',
    },
  
    {
      _id: '4WEFBRWEF',
      title: 'Walk Regularly',
      status: true,
      note: '',
      to_do: true,
      frequency: [2, 3, 4],
      image: require('../../../Assets/Images/walking.webp'),
      target_date: '25 Sep  2022',
      reminder: true,
      reminder_time: '10:00 PM',
    },
  ];

  const emojis = [
    {name: 'Greateful', emoji: Greateful1, _id: '1'},
    {name: 'Excited', emoji: Excited1, _id: '2'},
    {name: 'Happy', emoji: Happy1, _id: '3'},
    {name: 'Confused', emoji: Confused1, _id: '4'},
    {name: 'Calm', emoji: Calm1, _id: '5'},
    {name: 'Surprised', emoji: Surprised1, _id: '6'},
    {name: 'Sick', emoji: Sick1, _id: '7'},
    {name: 'Angry', emoji: Angry1, _id: '8'},
    {name: 'Sleepy', emoji: Sleepy1, _id: '9'},
    
  ];
  
  const modalStyle = StyleSheet.create({
    btn_view: {
      paddingVertical: 10,
      paddingHorizontal: 10,
    //   flexDirection: 'row',
      borderWidth: 1,
      borderColor: Colors.gray02,
      backgroundColor: Colors.background,
      marginHorizontal: 10,
      marginBottom: 10,
      borderRadius: 10,
      justifyContent: 'flex-end',
      alignSelf:'flex-end',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
  
      elevation: 2,
    },
    selectedBtnView: {
      borderColor: Colors.gray02,
      backgroundColor: Colors.lightPrimary,
    },
    btn_text: {
      fontFamily: font.medium,
      fontSize: 16,
      color: Colors.gray10,
    },
    selectedBtnText: {
      color: Colors.primary,
    },
    btn_icon: {
      marginLeft: 5,
      height: 20,
      width: 20,
      tintColor: Colors.gray10,
    },
    slectedIcon: {
      tintColor: Colors.primary,
    },
    emojiView: {
      borderColor: Colors.gray02,
      backgroundColor: Colors.background,
      borderWidth: 1,
      marginHorizontal: 10,
      borderRadius: 10,
      flexDirection: 'row',
      // justifyContent:"space-evenly"
      alignItems: 'center',
      // paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.2,
      shadowRadius: 1.41,
      elevation: 2,
    },
    View: {
        height: 70,
        width: 70,
        borderRadius: 26,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
    
        elevation: 4,
        marginTop:50,marginRight:20
      },
  });
  