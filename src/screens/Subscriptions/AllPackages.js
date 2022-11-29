import React, {useContext, useEffect, useRef, useState} from 'react';
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
  Platform,
} from 'react-native';
import Header from '../../Components/Header';
import {mainStyles} from '../../Utilities/styles';
import Context from '../../Context';
import Colors from '../../Utilities/Colors';
import {font} from '../../Utilities/font';
import Collapsible from 'react-native-collapsible';
import * as RNIap from 'react-native-iap';
import showToast from '../../functions/showToast';
import Loader from '../../Components/Loader';
import analytics from '@react-native-firebase/analytics';

const ic_filledTick = require('../../Assets/Icons/circleFilledCheck.png');
const ic_star = require('../../Assets/pkgIcons/star.png');
const ic_diamond = require('../../Assets/pkgIcons/diamond.png');
const ic_crown = require('../../Assets/pkgIcons/crown.png');
const ic_tick = require('../../Assets/Icons/tick.png');

let purchaseUpdateSubscription = null;

let purchaseErrorSubscription = null;

const itemsPurchase = Platform.select({
  ios: [
    'habits.monthly.subscription',
    'meditation.monthly.subscription',
    'all_in_one.monthly.subscription',
    'lifetime.purchase',
  ],
  android: [
    'habits.monthly.subscription',
    'meditation.monthly.subscription',
    'all_in_one.monthly.subscription',
    'lifetime.purchase',
  ],
});

const AllPackages = props => {
  const {Token, CheckPurchases, purchasedSKUs} = useContext(Context);
  console.log('purchasedSKUs', purchasedSKUs);
  const [loading, setisLoading] = useState(false);
  const {navigation} = props;
  const list = useRef();
  const {params} = props.route;
  const [pkgList, setPkgList] = useState([]);
  const [selectedPkg, setSelectedPkg] = useState(null);

  const initilizeIAPConnection = async () => {
    await RNIap.flushFailedPurchasesCachedAsPendingAndroid()
      .then(async consumed => {
        console.log('consumed all items?', consumed);
      })
      .catch(err => {
        console.log(
          `flushFailedPurchasesCachedAsPendingAndroid ERROR ${err.code}`,
          err.message,
        );
      });
  };

  const PurchaseSubscription = async () => {
    let item = selectedPkg;
    console.log(item, 'selectedPkg...');
    try {
      if (item.isSubscription) {
        subscribeIAP(item?.sku[0], item?.playStoreData?.offerToken);
      } else {
        puchaseIAP(item?.sku[0]);
      }
    } catch (err) {
      console.log('IAP error', err);
      showToast(err, 'Error');
      // setError(err.message);
    }
  };

  const subscribeIAP = async (sku, offerToken) => {
    console.log('requestSubscription...', sku, offerToken);

    try {
      // await RNIap.requestSubscription(
      //   {sku},
      //   ...(offerToken && {subscriptionOffers: [{sku, offerToken}]}),
      // );
      await RNIap.requestSubscription({
        // sku: sku,
        // subscriptionOffers: [offerToken],
        sku: sku,
        subscriptionOffers: [
          {
            offerToken: offerToken,
            sku: sku,
          },
        ],
      });
    } catch (err) {
      console.log(err.code, err.message);
    }
  };

  const puchaseIAP = async sku => {
    try {
      await RNIap.requestPurchase({
        skus: [sku],
        sku: sku,
        andDangerouslyFinishTransactionAutomaticallyIOS: false,
      });
    } catch (err) {
      console.log(err.code, err.message);
    }
  };

  const getIAPProductsAndSubscriptions = async () => {

    setisLoading(true);
    // if (Platform.OS == 'android') {
    // const subscription = await RNIap.getSubscriptions({
    //   skus: itemsPurchase,
    // });

    try {
      console.log('itemsPurchase....', itemsPurchase);
      const subscription = await RNIap.getSubscriptions({
        skus: itemsPurchase,
      });
      console.log('subscription....', subscription);

      const Products = await RNIap.getProducts({skus: itemsPurchase});
      console.log('Products...', Products);
      let IAP_list = [...subscription, ...Products];
      let newArray = [];
      if (IAP_list.length != 0) {
        packages.forEach(pakage => {
          let playStoreData = IAP_list.find(x => pakage.sku[0] == x.productId);
          let data;

          if (playStoreData.productType == 'subs') {
            let temp = playStoreData.subscriptionOfferDetails[0];
            data = {
              offerToken: temp.offerToken,
              formattedPrice:
                temp.pricingPhases.pricingPhaseList[0].formattedPrice,
            };
          } else {
            let temp = playStoreData.oneTimePurchaseOfferDetails;
            data = {
              formattedPrice: temp.formattedPrice,
            };
          }
          newArray.push({...pakage, playStoreData: data});
        });
      }
      if (newArray.length > 0) {
        if (params?.from == 'meditation') {
          setSelectedPkg(newArray[1]);
        } else {
          setSelectedPkg(newArray[0]);
        }
      }
      setPkgList(newArray);
      setisLoading(false);
    } catch (err) {
      console.log('Error get products', err);
      setisLoading(false);
    }
    // }
  };

  React.useEffect(() => {
    getIAPProductsAndSubscriptions();
    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        console.log('purchase', purchase);
        const receipt = JSON.parse(purchase.transactionReceipt);
        console.log('receipt', receipt);
        if (receipt) {
          try {
            if (Platform.OS === 'ios') {
              RNIap.finishTransactionIOS(purchase.transactionId);
            } else if (Platform.OS === 'android') {
              let acknowledgePurchaseAndroid =
                await RNIap.acknowledgePurchaseAndroid({
                  token: purchase.purchaseToken,
                });
              await CheckPurchases();

              if (params?.from != undefined) {
                setTimeout(() => {
                  props.navigation.goBack();
                }, 300);
              }
              console.log(
                'acknowledgePurchaseAndroid',
                acknowledgePurchaseAndroid,
              );
            }

            await RNIap.finishTransaction(purchase, true);
          } catch (ackErr) {
            //       console.log('ackErr INAPP>>>>', ackErr);
          }
        }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener(error => {
      console.log('purchaseErrorListener INAPP>>>>', error);
    });

    analytics().logEvent(props?.route?.name);

    return () => {
      if (purchaseUpdateSubscription) {
        purchaseUpdateSubscription.remove();
        purchaseUpdateSubscription = null;
      }
      if (purchaseErrorSubscription) {
        purchaseErrorSubscription.remove();
        purchaseErrorSubscription = null;
      }
    };
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
          key={item._id}
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
              overflow: 'hidden',
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
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: 16,
                      textTransform: 'capitalize',
                    }}>
                    {item.duration}
                  </Text>
                  {!!purchasedSKUs.find(x => x == item?.sku[0]) && (
                    <View style={{marginLeft: 5}}>
                      <Image
                        source={ic_filledTick}
                        style={{
                          height: 15,
                          width: 15,
                          tintColor: Colors.completed,
                        }}
                      />
                    </View>
                  )}
                </View>
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
                  {item?.playStoreData?.formattedPrice}
                </Text>
              </View>
            </View>
            <Collapsible collapsed={item._id != selectedPkg._id}>
              <View style={{padding: 10}}>
                {item.description.map((x, i) => (
                  <View
                    key={i.toString()}
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
        <Loader enable={loading} />
        {!loading && (
          <>
            <View style={{flex: 1}}>
              <FlatList
                keyExtractor={(item, index) => {
                  return item._id;
                }}
                data={pkgList}
                ListHeaderComponent={FlatListHeader()}
                renderItem={pkgView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: 20}}
              />
            </View>

            {!!purchasedSKUs.find(x => x == selectedPkg?.sku[0]) == false &&
              pkgList.length != 0 && (
                <View>
                  <TouchableOpacity
                    onPress={PurchaseSubscription}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: 60,
                      backgroundColor: Colors.primary,
                      borderRadius: 30,
                      paddingHorizontal: 7,
                      marginBottom: 5,
                    }}>
                    <View style={{height: 50, width: 50}} />
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
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
              )}
          </>
        )}
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
    sku: ['habits.monthly.subscription'],
    isSubscription: true,
  },
  {
    _id: '2',
    name: 'Meditations',
    service: ['meditation'],
    description: ['Access to all tracks', 'Download & listen without internet'],
    price: 2.99,
    type: 'star',
    duration: 'monthly',
    sku: ['meditation.monthly.subscription'],
    isSubscription: true,
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
    sku: ['all_in_one.monthly.subscription'],
    isSubscription: true,
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
    sku: ['lifetime.purchase'],
    isSubscription: false,
  },
];
