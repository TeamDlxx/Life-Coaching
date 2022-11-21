import React, {useContext, useRef, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Pressable,
  Image,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Header from '../../Components/Header';
import {mainStyles} from '../../Utilities/styles';
import Context from '../../Context';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import Collapsible from 'react-native-collapsible';
import {requestPurchase, useIAP} from 'react-native-iap';

const ic_filledTick = require('../../Assets/Icons/circleFilledCheck.png');
const ic_star = require('../../Assets/pkgIcons/star.png');
const ic_diamond = require('../../Assets/pkgIcons/diamond.png');
const ic_crown = require('../../Assets/pkgIcons/crown.png');
const ic_tick = require('../../Assets/Icons/tick.png');

const AllPackages = props => {
  const {Token} = useContext(Context);
  const {navigation} = props;
  const list = useRef();
  const {params} = props.route;
  const [selectedPkg, setSelectedPkg] = useState(packages[0]);

  const {
    connected,
    products,
    promotedProductsIOS,
    subscriptions,
    purchaseHistories,
    availablePurchases,
    currentPurchase,
    currentPurchaseError,
    initConnectionError,
    finishTransaction,
    getProducts,
    getSubscriptions,
    getAvailablePurchases,
    getPurchaseHistories,
  } = useIAP();

  const ProductsDetail = async () => {
    let p = await getProducts([
      'meditation.monthly.subscription',
      'lifetime.purchase',
      'habits.monthly.subscription',
      'all_in_one.monthly.subscription',
    ]);
    console.log('product', p);
  };

  React.useEffect(() => {
    ProductsDetail();
  }, []);

  const FlatListHeader = () => {
    return (
      <View style={{marginBottom: 0}}>
        <View style={{marginTop: 20}}>
          <Text
            style={{fontFamily: font.bold, fontSize: 30, color: Colors.black}}>
            Get Access to more Features
          </Text>
        </View>
        {/*
        <View style={{marginTop: 15}}>
          <Text
            style={{
              fontFamily: font.regular,
              fontSize: 14,
              color: Colors.gray10,
            }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut
          </Text>
        </View> */}

        {/* <View style={{marginTop: 25}}>
          {selectedPkg?.description.map((x, i) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginVertical: 5,
                }}>
                <Image
                  source={ic_filledTick}
                  style={{height: 15, width: 15, tintColor: Colors.completed}}
                />
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 14,
                    color: Colors.black,
                    marginLeft: 5,
                  }}>
                  {x}
                </Text>
              </View>
            );
          })}
        </View> */}
        <View style={{marginTop: 25}}>
          <Text
            style={{
              color: Colors.darkPrimary,
              fontSize: 16,
              fontFamily: font.bold,
            }}>
            Select your subscription plan
          </Text>
        </View>
      </View>
    );
  };

  const pkgView = ({item, index}) => {
    if (
      params?.from == undefined ||
      !!item.service.find(x => x.toLowerCase() == params?.from.toLowerCase())
    )
      return (
        <Pressable
          onPress={() => {
            setSelectedPkg(item);
          }}>
          <View
            style={{
              marginTop: 10,
              backgroundColor: Colors.white,

              borderWidth: selectedPkg._id == item._id ? 2 : 1,
              borderColor:
                selectedPkg._id == item._id ? Colors.primary : Colors.gray02,
              minHeight: 80,

              borderRadius: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                paddingVertical: 10,
              }}>
              <Image
                source={
                  item?.type == 'star'
                    ? ic_star
                    : item?.type == 'diamond'
                    ? ic_diamond
                    : item?.type == 'crown'
                    ? ic_crown
                    : null
                }
                style={{height: 50, width: 50}}
              />
              <View style={{flex: 1, marginLeft: 10}}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 16,
                    textTransform: 'capitalize',
                  }}>
                  {item.duration}
                </Text>
                <Text
                  style={{
                    fontFamily: font.regular,
                    fontSize: 12,
                    marginTop: 5,
                  }}>
                  {item.name}
                </Text>
              </View>

              <View style={{marginLeft: 10}}>
                <Text
                  style={{
                    fontFamily: font.bold,
                    fontSize: 18,
                    textTransform: 'capitalize',
                    color: Colors.primary,
                  }}>
                  {`$${item.price}`}
                </Text>
              </View>
            </View>
            <Collapsible collapsed={item._id != selectedPkg._id}>
              <View style={{padding: 10}}>
                {item.description.map(x => (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginVertical: 5,
                    }}>
                    <Image
                      source={ic_filledTick}
                      style={{
                        height: 15,
                        width: 15,
                        tintColor: Colors.completed,
                      }}
                    />
                    <Text
                      style={{
                        fontFamily: font.regular,
                        fontSize: 14,
                        color: Colors.black,
                        marginLeft: 5,
                      }}>
                      {x}
                    </Text>
                  </View>
                ))}
              </View>
            </Collapsible>
          </View>
        </Pressable>
      );
  };

  return (
    <SafeAreaView style={mainStyles.MainView}>
      <StatusBar
        backgroundColor={Colors.background}
        barStyle={'dark-content'}
      />
      <Header title="Subscriptions" navigation={props.navigation} />

      <View style={{flex: 1, paddingHorizontal: 20}}>
        <View style={{flex: 1}}>
          <FlatList
            // keyExtractor={(item, index) => index.toString()}
            data={packages}
            ListHeaderComponent={FlatListHeader()}
            renderItem={pkgView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 20}}
          />
        </View>
        <View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 60,
              backgroundColor: Colors.primary,
              borderRadius: 30,
              paddingHorizontal: 7,
            }}>
            <View style={{height: 50, width: 50}} />
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: font.medium,
                  color: Colors.white,
                  fontSize: 16,
                }}>
                Subscribe Now
              </Text>
            </View>
            <View
              style={{
                height: 40,
                width: 40,
                backgroundColor: Colors.lightPrimary3,
                borderRadius: 40 / 2,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image
                source={ic_tick}
                style={{height: 20, width: 20, tintColor: Colors.white}}
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AllPackages;

const packages = [
  {
    _id: '1',
    name: 'Habits',
    service: ['habit'],
    description: ['Unlimited Habits', 'Unlimited time for Habits', 'Reminder'],
    price: 2.99,
    type: 'star',
    duration: 'monthly',
  },
  {
    _id: '2',
    name: 'Meditations',
    service: ['meditation'],
    description: ['Access to all tracks', 'Download & listen without internet'],
    price: 2.99,
    type: 'star',
    duration: 'monthly',
  },
  {
    _id: '3',
    name: 'All in one',
    service: ['habit', 'meditation'],
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
    ],
    price: 4.99,
    type: 'diamond',
    duration: 'monthly',
  },
  {
    _id: '4',
    name: 'Access to all features',
    service: ['habit', 'meditation'],
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
    ],
    price: 44.99,
    type: 'crown',
    duration: 'lifetime',
  },
];
