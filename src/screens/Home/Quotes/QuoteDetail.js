import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Pressable,
    Image,
    Dimensions,
    TouchableOpacity,
    TouchableHighlight,
    ActivityIndicator,
    Platform,
    ScrollView,
    ToastAndroid,
} from 'react-native';

import Colors from '../../../Utilities/Colors';
import { font } from '../../../Utilities/font';
import { fileURL, deepLinkQuote } from '../../../Utilities/domains';
import Clipboard from '@react-native-clipboard/clipboard';
import CustomImage from '../../../Components/CustomImage';
import ImageZoomer from '../../../Components/ImageZoomer';
import { useContext } from 'react';
import Context from '../../../Context';
import invokeApi from '../../../functions/invokeAPI';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import Header from '../../../Components/Header';
import { mainStyles } from '../../../Utilities/styles';
import Share from 'react-native-share';
import axios from 'axios';
import _ from 'buffer';
import LoginAlert from '../../../Components/LoginAlert';
import kFormatter from '../../../functions/kFormatter';
import analytics from '@react-native-firebase/analytics';
import debounnce from '../../../functions/debounce';

//ICONS
import Fav from '../../../Assets/Icons/fav.png';
import notFav from '../../../Assets/Icons/notfav.png';
import ic_share from '../../../Assets/Icons/share.png';
import ic_download from '../../../Assets/Icons/ic_download.png';
import AsyncStorage from '@react-native-async-storage/async-storage';

let user = {};
const QuoteDetail = (props) => {
    const { params } = props.route;
    const { Token, downloadQuote, dashboardData, setDashBoardData } = useContext(Context)
    const win = Dimensions.get("window");
    const [modalImage, setModalImage] = useState(null);
    const [isLoading, setisLoading] = useState(false);
    const [isSharing, setIsSharing] = useState(null);
    const [quote, setQuoteDetail] = useState(null);

    useEffect(() => {
        callQuoteDetailApi()
        return () => { };
    }, []);

    const callQuoteDetailApi = async () => {
        await getUserID();
        setisLoading(true);
        quoteDetailApi();
    }

    const getUserID = async () => {
        await AsyncStorage.getItem('@user').then(val => {
            if (val != null) {
                user = JSON.parse(val)
                console.log(user, "User...")
            }
        });
    };

    const quoteDetailApi = async () => {
        let res;
        if (Token) {
            res = await invokeApi({
                path: 'api/quotes/quotes_detail_for_app/' + params?._id,
                method: 'POST',
                postData: {
                    'user_id': user?.user_id?._id,
                },
                navigation: props.navigation,
            });
        } else {
            res = await invokeApi({
                path: 'api/quotes/quotes_detail_for_app/' + params?._id,
                method: 'POST',
                postData: {
                    'user_id': '',
                },
                navigation: props.navigation,
            });
        }

        if (res) {
            setisLoading(false);
            if (res.code == 200) {
                console.log('response', res);
                setQuoteDetail(res.quotes);
            } else {
                showToast(res.message);
            }
        }
    };

    const showImageModal = async (image) => {
        await setModalImage(image);
    };

    const hideImageModal = () => {
        setModalImage(null);
    };

    const copyText = async text => {
        console.log("yes...")
        try {
            await Clipboard.setString(text);
            ToastAndroid.show('Text Copied', ToastAndroid.SHORT);
        } catch (e) {
            console.log(e, 'copyText...');
        }
    };

    const favUnFavFunction = async (item) => {
        if (Token) {
            api_favOrUnfavQuote(!item?.is_favourite_by_me, item._id);
            toggleLike(!item?.is_favourite_by_me, item._id);
            if (!item?.is_favourite_by_me) {
                await analytics().logEvent(`LIKE_QUOTE_EVENT`);
            }
        } else {
            LoginAlert(props.navigation, props.route?.name);
        }
    };

    const api_favOrUnfavQuote = async (val, id) => {
        let res = await invokeApi({
            path: 'api/quotes/favourite_quotes/' + id,
            method: 'POST',
            headers: {
                'x-sh-auth': Token,
            },
            postData: {
                favourite: val,
            },
            navigation: props.navigation,
        });
        if (res) {
            if (res.code == 200) {
                favQuotesOfTheDay(val, id)
            } else {
                showToast(res.message);
                toggleLike(!val, id);
                favQuotesOfTheDay(!val, id)
            }
        }
    };

    const toggleLike = async (val, id) => {
        let newObj = quote;
        console.log(newObj, "new obj...")
        newObj.is_favourite_by_me = val;

        if (newObj.is_favourite_by_me) {
            newObj.favourite = newObj.favourite + 1;
        } else {
            newObj.favourite = newObj.favourite - 1;
        }

        await setQuoteDetail({ ...newObj })
    };

    const favQuotesOfTheDay = async (val, id) => {
        let newObj = dashboardData.quoteOfTheDay;
        if (id == newObj._id) {
            newObj.is_favourite_by_me = val;

            if (newObj.is_favourite_by_me) {
                newObj.favourite = newObj.favourite + 1;
            } else {
                newObj.favourite = newObj.favourite - 1;
            }
        }
        dashboardData.quoteOfTheDay = newObj;
        await setDashBoardData({
            ...dashboardData,
        })
    }

    const download = item => {
        debounceDownload(item);
    };

    const debounceDownload = debounnce(async item => {
        console.log('download');
        await downloadQuote(item?.images?.large, item?._id);
        await analytics().logEvent('QUOTE_DOWLOAD_EVENT');
    }, 500);

    const shareQuote = async item => {
        setIsSharing(item._id);
        try {
            let image = item?.images?.large;
            let description = !!item?.description ? item?.description.trim() : '';
            let res = await GetBase64(fileURL + image);
            let ext = await image.split('.')[image.split('.').length - 1];
            if (ext == 'jpg') {
                ext = 'jpeg';
            }
            let file = `data:image/${ext};base64,${res}`;

            setIsSharing(null);
            let objShare = {
                title: 'Better.Me | Quotes',
                message: description + '\n' + deepLinkQuote,
                url: file,
            };
            console.log('objShare', objShare);
            await Share.open(objShare)
                .then(async res => {
                    await analytics().logEvent('QUOTE_SHARE_EVENT');
                    console.log('res', res);
                })
                .catch(err => {
                    console.log('error', err);
                });
        } catch (e) {
            console.log('error1', e);
            setIsSharing(null);
        }
    };

    const GetBase64 = async url => {
        return await axios
            .get(url, {
                responseType: 'arraybuffer',
            })
            .then(response =>
                _.Buffer.from(response.data, 'binary').toString('base64'),
            )
            .catch(err => console.log('Error', err));
    };

    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />

            <Header
                navigation={props.navigation}
                title={'Quote Detail'}
            />

            <View style={{ flex: 1 }}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 30 }}>

                    {isLoading == false && <View
                        style={{
                            overflow: "hidden",
                            borderColor: Colors.gray02,
                            borderWidth: 1,
                            backgroundColor: Colors.white,
                            marginTop: 20,
                            borderRadius: 20,
                            marginHorizontal: 15,
                            paddingBottom: 10
                        }}>


                        <Pressable onPress={() => showImageModal(quote?.images?.large)}
                            style={{
                                overflow: "hidden",
                                borderTopStartRadius: 20,
                                borderTopEndRadius: 20,
                            }}>
                            <CustomImage
                                source={{ uri: fileURL + quote?.images?.large }}
                                style={{
                                    width: '100%',
                                    aspectRatio:
                                        !!quote?.image_height != 0
                                            ? quote?.image_width / quote?.image_height
                                            : 1,
                                }}
                            />
                        </Pressable>

                        {!!quote?.description &&
                            <TouchableHighlight
                                disabled={Platform.OS == 'ios'}
                                onLongPress={() => copyText(quote?.description.trim())}
                                delayLongPress={500}
                                underlayColor={Colors.gray01}
                                style={{}}>
                                <Text
                                    selectable={Platform.OS == 'ios' ? true : false}
                                    style={{
                                        fontSize: 14,
                                        fontFamily: font.regular,
                                        paddingHorizontal: 5,
                                        paddingVertical: 10,
                                    }}>
                                    {quote?.description.trim()}
                                </Text>
                            </TouchableHighlight>
                        }

                        <View
                            style={{
                                flexDirection: 'row',
                                backgroundColor: '#FFF',
                            }}>
                            <TouchableOpacity
                                onPress={() => favUnFavFunction(quote)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                    flexDirection: 'row',
                                }}>
                                <Image
                                    source={quote?.is_favourite_by_me ? Fav : notFav}
                                    style={{
                                        height: 20,
                                        width: 20,
                                        tintColor: quote?.is_favourite_by_me
                                            ? Colors.primary
                                            : Colors.placeHolder,
                                    }}
                                />
                                <Text
                                    style={{
                                        marginLeft: 5,
                                        fontFamily: font.medium,
                                        color: Colors.placeHolder,
                                        letterSpacing: 1,
                                        includeFontPadding: false,
                                    }}>
                                    {kFormatter(quote?.favourite)}
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => download(quote)}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                }}>
                                <Image
                                    source={ic_download}
                                    style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                disabled={isSharing != null}
                                onPress={async () => {
                                    await shareQuote(quote);
                                }}
                                style={{
                                    flex: 1,
                                    alignItems: 'center',
                                    height: 50,
                                    justifyContent: 'center',
                                }}>
                                {isSharing != quote?._id ?
                                    (
                                        <Image
                                            source={ic_share}
                                            style={{ height: 20, width: 20, tintColor: Colors.placeHolder }}
                                        />
                                    ) : (
                                        <ActivityIndicator color={Colors.placeHolder} size="small" />
                                    )
                                }
                            </TouchableOpacity>



                        </View>

                    </View>}

                </ScrollView>
            </View>

            <Loader enable={isLoading} />

            <ImageZoomer
                closeModal={hideImageModal}
                visible={!!modalImage}
                url={modalImage}
            />
        </SafeAreaView>
    )
}

export default QuoteDetail;