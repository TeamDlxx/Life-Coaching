import React, { useContext, useEffect, useRef, useState } from 'react';
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
  Alert
} from 'react-native';
import Header from '../../Components/Header';
import { mainStyles } from '../../Utilities/styles';
import Context from '../../Context';
import Colors from '../../Utilities/Colors';
import { font } from '../../Utilities/font';
import Collapsible from 'react-native-collapsible';
import * as RNIap from 'react-native-iap';
import showToast from '../../functions/showToast';
import analytics from '@react-native-firebase/analytics';
import Loader from '../../Components/Loader';

const ic_filledTick = require('../../Assets/Icons/circleFilledCheck.png');
const ic_star = require('../../Assets/pkgIcons/star.png');
const ic_diamond = require('../../Assets/pkgIcons/diamond.png');
const ic_crown = require('../../Assets/pkgIcons/crown.png');
const ic_tick = require('../../Assets/Icons/tick.png');

let purchaseUpdateSubscription = null;

let purchaseErrorSubscription = null;

const itemsPurchase = Platform.select({
  ios: [
    // 'habits.monthly.subscription',
    // 'meditation.monthly.subscription',
    // 'all_in_one.monthly.subscription',
    // 'lifetime.purchase',



    'habittracker.monthly',
    'meditation.monthly',
    'allinone.monthly',
    'betterme.lifetime',
  ],
  android: [
    'habits.monthly.subscription',
    'meditation.monthly.subscription',
    'all_in_one.monthly.subscription',
    'lifetime.purchase',
  ],
});

const AllPackages = props => {

  const { Token, CheckPurchases, purchasedSKUs } = useContext(Context);
  console.log('props', props);
  const [loading, setisLoading] = useState(false);
  const { navigation } = props;
  const list = useRef();
  const { params } = props.route;
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
    setisLoading(true);
    try {
      if (item.isSubscription) {
        subscribeIAP(item?.sku[0], item?.playStoreData?.offerToken);
      }
      else {
        puchaseIAP(item?.sku[0]);
      }
    }

    catch (err) {
      console.log('IAP error', err);
      showToast(err, 'Error');
      setisLoading(false);
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
      setisLoading(false);
      console.log('subscribeIAP Error', err.code, err.message);
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
      setisLoading(false);
      console.log('puchaseIAP Error', err.code, err.message);
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

      const Products = await RNIap.getProducts({ skus: itemsPurchase });
      console.log('Products...', Products);
      let IAP_list = [...subscription, ...Products];
      let newArray = [];
      if (Platform.OS == 'android') {
        if (IAP_list.length != 0) {
          packages.forEach(pakage => {
            let playStoreData = IAP_list.find(
              x => pakage.sku[0] == x.productId,
            );
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
            newArray.push({ ...pakage, playStoreData: data });
          });
        }
      } else {
        if (IAP_list.length != 0) {
          packages.forEach(pakage => {
            let playStoreData = IAP_list.find(
              x => pakage.sku[0] == x.productId,
            );
            let data;

            if (playStoreData.productType == 'subs') {
              data = {
                offerToken: false,
                formattedPrice: playStoreData.localizedPrice,
              };
            } else {
              data = {
                formattedPrice: playStoreData.localizedPrice,
              };
            }
            newArray.push({ ...pakage, playStoreData: data });
          });
        }
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


  const restorePurchase = async () => {

    try {

      setisLoading(true)
      const purchases = await RNIap.getAvailablePurchases();

      setisLoading(false)


      console.log(purchases, "purchases from store...")




      purchases.forEach(async (purchase) => {


        if (Platform.OS == "ios") {
          purchases.forEach(async (purchase) => {
            switch (purchase.productId) {
              case 'betterme.lifetime':
                Alert.alert("All in one lifetime purchase successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
                await CheckPurchases()
                break

              case 'allinone.monthly':
                Alert.alert("All in one monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
                await CheckPurchases()
                break

              case 'habittracker.monthly':
                Alert.alert("Habit tracker monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
                await CheckPurchases()
                break

              case 'meditation.monthly':
                Alert.alert("Meditations  monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
                await CheckPurchases()
                break

              default:
                ("Nothing to restore!", '', [{ text: "Ok" }], { cancelable: true });
                break
            }

          })
        }
        else {
          switch (purchase.productId) {

            case 'lifetime.purchase':
              Alert.alert("All in one lifetime purchase successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
              await CheckPurchases()
              break

            case 'all_in_one.monthly.subscription':
              Alert.alert("All in one monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
              await CheckPurchases()
              break

            case 'habits.monthly.subscription':
              Alert.alert("Habit tracker monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
              await CheckPurchases()
              break

            case 'meditation.monthly.subscription':
              Alert.alert("Meditations  monthly subscription successfully restored.", '', [{ text: "Ok" }], { cancelable: true })
              await CheckPurchases()
              break

            default:
              ("Nothing to restore!", '', [{ text: "Ok" }], { cancelable: true });
              breakF

          }

        }



      })

      console.log('Restore Successful', 'You successfully restored the following purchases: ');
    } catch (err) {
      setisLoading(false)
      console.warn(err); // standardized err.code and err.message available
      console.log(err.message);
    }

  }

  React.useEffect(() => {
    getIAPProductsAndSubscriptions();

    purchaseUpdateSubscription = RNIap.purchaseUpdatedListener(
      async purchase => {
        console.log('purchase', purchase);
        let receipt;
        if (Platform.OS == 'android') {
          receipt = JSON.parse(purchase.transactionReceipt);
        } else {
          receipt = purchase.transactionReceipt;
        }
        console.log('receipt', receipt);
        if (receipt) {
          try {
            if (Platform.OS === 'android') {
              let acknowledgePurchaseAndroid =
                await RNIap.acknowledgePurchaseAndroid({
                  token: purchase.purchaseToken,
                });

              console.log(
                'acknowledgePurchaseAndroid',
                acknowledgePurchaseAndroid,
              );
            }
            console.log('before finish');
            let finish = await RNIap.finishTransaction({
              purchase,
            });

            console.log('finish', finish);
            setisLoading(false);
            await CheckPurchases();
            if (params?.from != undefined) {
              setTimeout(() => {
                props.navigation.goBack();
              }, 300);
            }
          } catch (ackErr) {
            console.log('ackErr', ackErr);
            setisLoading(false);
            await CheckPurchases();
            //       console.log('ackErr INAPP>>>>', ackErr);
          }
        }
      },
    );

    purchaseErrorSubscription = RNIap.purchaseErrorListener(async error => {
      console.log('purchaseErrorListener INAPP>>>>', error);
      await CheckPurchases();
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
      <View style={{ marginBottom: 0 }}>
        <View style={{ marginTop: 20 }}>
          <Text
            style={{ fontFamily: font.bold, fontSize: 30, color: Colors.black }}>
            Get Access to more Features
          </Text>
        </View>

        <View style={{ marginTop: 25 }}>
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

  const pkgView = ({ item, index }) => {
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
                style={{ height: 50, width: 50 }}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text
                    style={{
                      fontFamily: font.bold,
                      fontSize: 16,
                      textTransform: 'capitalize',
                    }}>
                    {item.duration}
                  </Text>
                  {!!purchasedSKUs.find(x => (x == item?.sku[0])) && (
                    <View style={{ marginLeft: 5 }}>
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

              <View style={{ marginLeft: 10 }}>
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
              <View style={{ padding: 10 }}>
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
        translucent={false}
      />

      <Header title="Subscription Plans" navigation={props.navigation} />

      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <Loader enable={loading} />
        {(!loading || pkgList.length != 0) && (
          <>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 1 }}>
                <FlatList
                  keyExtractor={(item, index) => {
                    return item._id;
                  }}
                  data={pkgList}
                  ListHeaderComponent={FlatListHeader()}
                  renderItem={pkgView}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  ListFooterComponent={<TouchableOpacity onPress={restorePurchase} style={{ alignSelf: "center", marginTop: 20, justifyContent: "flex-end" }}>
                    <Text style={{ textDecorationLine: "underline", fontFamily: "Pangram-Medium" }}>Restore Purchase</Text>
                  </TouchableOpacity>}
                />
              </View>

              {/* <TouchableOpacity onPress={restorePurchase} style={{ alignSelf: "center" , marginBottom: 10}}>
                <Text style={{ textDecorationLine: "underline", fontFamily: "Pangram-Medium" }}>Restore Purchase</Text>
              </TouchableOpacity> */}

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
                    <View style={{ height: 50, width: 50 }} />
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
                        style={{
                          height: 20,
                          width: 20,
                          tintColor: Colors.white,
                        }}
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
    description: [
      'Unlimited Habits',
      'Unlimited time for Habits',
      'Reminder',
      'Remove Ads',
    ],
    price: 2.99,
    type: 'star',
    duration: 'monthly',
    sku: Platform.OS == "ios" ? ['habittracker.monthly'] : ['habits.monthly.subscription'],
    isSubscription: true,
  },
  {
    _id: '2',
    name: 'Meditations',
    service: ['meditation'],
    description: [
      'Access to all tracks',
      'Download & listen without internet',
      'Remove Ads',
    ],
    price: 2.99,
    type: 'star',
    duration: 'monthly',
    sku: Platform.OS == "ios" ? ['meditation.monthly'] : ['meditation.monthly.subscription'],
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
      'Remove Ads',
    ],
    price: 4.99,
    type: 'diamond',
    duration: 'monthly',
    sku: Platform.OS == "ios" ? ['allinone.monthly'] : ['all_in_one.monthly.subscription'],
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
      'Remove Ads',
    ],
    price: 44.99,
    type: 'crown',
    duration: 'lifetime',
    sku: Platform.OS == "ios" ? ['betterme.lifetime'] : ['lifetime.purchase'],
    isSubscription: false,
  },
];
