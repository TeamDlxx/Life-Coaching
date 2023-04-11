import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Pressable,
    Image,
    Alert,
    TouchableOpacity,
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles, allGratitudes_styles } from '../../../Utilities/styles';
import { screens } from '../../../Navigation/Screens';
// fro API calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import EmptyView from '../../../Components/EmptyView';
import SwipeableFlatList from 'react-native-swipeable-list';
import LoginAlert from '../../../Components/LoginAlert';
import ListItem from './components/listItem';
import invokeApi from '../../../functions/invokeAPI';


const AllGratitudes = props => {
    const { params } = props.route;
    const { Token, gratitudesList, setGratitudesList , setGratitudeExist} = useContext(Context);
    const [isLoading, setisLoading] = useState(false);
    const [allGratitudes, setAllGratitudes] = useState([]);

    const btn_add = () => {
        if (Token) {
            props.navigation.navigate(screens.addGratitude);
        } else {
            LoginAlert(props.navigation, props.route?.name);
        }
    };

    React.useEffect(() => {
        console.log("all gratitudes.....")
        if (Token) {
            callAllGratitudesListApi();
        } else {
            setAllGratitudes([]);
        }
    }, []);


    const callAllGratitudesListApi = () => {
        setisLoading(true);
        api_allGratitudesList();
    };

    async function api_allGratitudesList() {
        let res = await invokeApi({
            path: 'api/gratitude/get_all_gratitude',
            method: 'GET',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
                console.log('response', res);
                await setAllGratitudes(res?.gratitude);
            } else {
                showToast(res.message);
            }
        }
    }

    async function updateGratitudeLocally(item) {
        let newArray = [...allGratitudes];
        let index = newArray.findIndex(x => x._id == item._id);
        newArray.splice(index, 1, item);
        await setAllGratitudes(newArray);
    }


    const api_deleteGratitude = async id => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/gratitude/delete_gratitude/' + id,
            method: 'DELETE',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
               await removeGratitudeFromList(id);
                removeGratitudeFromGlobalList(id);
                showToast(
                    'Gratitude has been deleted successfully',
                    'Gratitude deleted',
                    'success',
                );
            } else {
                showToast(res.message);
            }
        }
    };

    const removeGratitudeFromList = async id => {
        let newArray = [...allGratitudes];
        let index = newArray.findIndex(x => x._id == id);
        newArray.splice(index, 1);
        await setAllGratitudes(newArray);
    };

    const removeGratitudeFromGlobalList = async id => {
        let newArray = [...gratitudesList];
        let index = newArray.findIndex(x => x._id == id);
        if (index != -1) {
            newArray.splice(index, 1);
            await setGratitudesList(newArray);
        }

        if(gratitudesList.length == 0){
            setGratitudeExist(false)
        }
    };

    const renderAllGratitudeList = ({ item, index }) => {
        let extraImg = item.images.length - 3;
        return (
            <ListItem
                onPress={() => {
                    props.navigation.navigate(screens.gratitudeDetail,
                        {
                            id: item._id,
                            updateGratitude: updateGratitudeLocally,
                            removeGratitudeFromPreviousScreenList: removeGratitudeFromList,
                        }
                    );
                }}
                item={item}
                extraImg={extraImg}
            />
        );
    }


    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header navigation={props.navigation} title={'Your Gratitudes'} />

            <View style={{ flex: 1 }}>
                <Loader enable={isLoading} />
                <View style={{ flex: 1 }}>
                    <SwipeableFlatList
                        contentContainerStyle={{ paddingVertical: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={allGratitudes}
                        renderItem={renderAllGratitudeList}
                        shouldBounceOnMount={true}
                        maxSwipeDistance={70}
                        keyExtractor={item => {
                            return item._id;
                        }}

                        renderQuickActions={({ item, index }) => {
                            return (
                                <Pressable
                                    key={item._id}
                                    onPress={() =>
                                        Alert.alert(
                                            'Delete Gratitude',
                                            'Are you sure you want to delete this Gratitude',
                                            [
                                                { text: 'No' },
                                                { text: 'Yes', onPress: () => api_deleteGratitude(item._id) },
                                            ],
                                        )
                                    }
                                    style={allGratitudes_styles.hiddenView}>
                                    <Image
                                        source={require('../../../Assets/Icons/trash.png')}
                                        style={allGratitudes_styles.hiddenIcon}
                                    />
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={() =>
                            isLoading == false &&
                            allGratitudes.length == 0 && (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                    <EmptyView title={'No Gratitudes Yet '} noSubtitle />
                                    <TouchableOpacity onPress={btn_add} style={{ backgroundColor: Colors.lightPrimary, height: 40, width: 160, borderRadius: 10, alignItems: "center", justifyContent: "center", marginTop: 20 }}>
                                        <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Create Gratitude    </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                    />
                </View>

            </View>
        </SafeAreaView>
    );
};

export default AllGratitudes;