import {
    View,
    Text,
    SafeAreaView,
    StatusBar,
    Pressable,
    Image,
    Alert,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import React, { useState, useCallback } from 'react';
import Header from '../../../Components/Header';
import Colors from '../../../Utilities/Colors';
import { mainStyles } from '../../../Utilities/styles';
import { screens } from '../../../Navigation/Screens';
// fro API calling
import { useContext } from 'react';
import Context from '../../../Context';
import showToast from '../../../functions/showToast';
import Loader from '../../../Components/Loader';
import EmptyView from '../../../Components/EmptyView';
import SwipeableFlatList from 'react-native-swipeable-list';
import LoginAlert from '../../../Components/LoginAlert';
import invokeApi from '../../../functions/invokeAPI';
import MoodListItem from './components/ListItem';
import MoodsFilterModal from './components/MoodsFilterModal';
import moment from 'moment';


const limit = 10;
let pageNumber = 0;
let canLoadMore = false;

const AllMoodJournals = props => {
    const { Token, allMoodJournals, setAllMoodJournals, updateAllMoodJournals } = useContext(Context);
    const { params } = props.route;
    const [isLoading, setisLoading] = useState(false);
    const [allJounals, setAllJounals] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isLoadingMore, setisLoadingMore] = useState(false);

    const [filterObj, setFilterObbj] = useState({
        startDate: '',
        endDate: '',
        moods: []
    })

    const updateData = updation => setFilterObbj({ ...filterObj, ...updation });


    const toggleModal = () => {
        setIsModalVisible(!isModalVisible);
    };


    const btn_add = () => {
        if (Token) {
            props.navigation.navigate(screens.moodTracker);
        } else {
            LoginAlert(props.navigation, props.route?.name);
        }
    };

    React.useEffect(() => {
        if (Token) {
            pageNumber = 0;
            canLoadMore = false;
            callAllMoodJournalsApi();
        } else {
            setAllJounals([]);
        }
    }, []);


    const callAllMoodJournalsApi = () => {
         api_allMoodJournalsList({
            start_date:'',
            end_date:'',
            moods: ''
        });
    };

    const api_allMoodJournalsList = async body => {
        setisLoading(true);
        let res = await invokeApi({
            // path: 'api/mood/all_moods',
            path: `api/mood/all_moods?page=0&limit=${limit}`,
            method: 'POST',
            postData: body,
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        setisLoadingMore(false);
        if (res) {
            if (res.code == 200) {
                console.log('response', res);
                await setAllJounals(res?.all_moods);
                pageNumber = 1;
                if (res?.all_moods.length < res.count) {
                    canLoadMore = true;
                } else {
                    canLoadMore = false;
                }
            } else {
                showToast(res.message);
            }
        }
    }

    const api_MoodsJounalsMore = async body => {
        setisLoadingMore(true);
        canLoadMore = false;
        let res = await invokeApi({
            path: `api/mood/all_moods?page=${pageNumber}&limit=${limit}`,
            method: 'POST',
            postData: body,
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        setisLoadingMore(false);
        if (res) {
            if (res.code == 200) {
                let total = allJounals.length + res?.all_moods.length;
                setAllJounals([...allJounals, ...res?.all_moods]);
                pageNumber++;
                if (total < res.count) {
                    canLoadMore = true;
                } else {
                    canLoadMore = false;
                }
            } else {
                showToast(res.message);
            }
        }
    };

    async function updateMoodLocally(item) {
        let newArray = [...allJounals];
        let index = newArray.findIndex(x => x._id == item._id);
        newArray.splice(index, 1, item);
        await setAllJounals(newArray);
    }


    const api_deleteMood = async id => {
        setisLoading(true);
        let res = await invokeApi({
            path: 'api/mood/delete_mood/' + id,
            method: 'DELETE',
            headers: {
                'x-sh-auth': Token,
            },
            navigation: props.navigation,
        });
        setisLoading(false);
        if (res) {
            if (res.code == 200) {
                await removeMoodFromList(id);
                removeMoodFromGlobalList(id);
                showToast(
                    'Mood Journal has been deleted successfully',
                    'Mood Journal deleted',
                    'success',
                );
            } else {
                showToast(res.message);
            }
        }
    };

    const removeMoodFromList = async id => {
        let newArray = [...allJounals];
        let index = newArray.findIndex(x => x._id == id);
        newArray.splice(index, 1);
        await setAllJounals(newArray);
    };

    const removeMoodFromGlobalList = async id => {
        let newArray = [...allMoodJournals];
        let index = newArray.findIndex(x => x._id == id);
        if (index != -1) {
            newArray.splice(index, 1);
            await setAllMoodJournals(newArray);
        }
    };

    const renderAllMoodsList = useCallback(({ item, index }) => {
        return (
            <MoodListItem
                onPress={() => {
                    props.navigation.navigate(screens.moodDetail,
                        {
                            id: item._id,
                            updateMood: updateMoodLocally,
                            removeMoodFromPreviousScreenList: removeMoodFromList,
                        }
                    );
                }}
                item={item}
                allMoods={true}
            />

        );
    })


    return (
        <SafeAreaView style={mainStyles.MainView}>
            <StatusBar
                barStyle={'dark-content'}
                backgroundColor={Colors.background}
            />
            <Header
                navigation={props.navigation}
                title={'Your Mood Journals'}
                rightIcon={require('../../../Assets/Icons/filter.png')}
                rightIcononPress={() => {
                    if (Token) {
                        toggleModal()
                    } else {
                        LoginAlert(props.navigation, props.route?.name);
                    }
                }
                }
            />

            <View style={{ flex: 1 }}>

                <View style={{ flex: 1 }}>
                    <SwipeableFlatList
                        contentContainerStyle={{ paddingVertical: 10 }}
                        showsVerticalScrollIndicator={false}
                        data={allJounals}
                        renderItem={renderAllMoodsList}
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
                                            'Delete Mood Journal',
                                            'Are you sure, you want to delete this mood journal?',
                                            [
                                                { text: 'No' },
                                                { text: 'Yes', onPress: () => api_deleteMood(item._id) },
                                            ],
                                            {cancelable: true},
                                        )
                                    }
                                    style={allMoodJournals_styles.hiddenView}>
                                    <Image
                                        source={require('../../../Assets/Icons/trash.png')}
                                        style={allMoodJournals_styles.hiddenIcon}
                                    />
                                </Pressable>
                            );
                        }}
                        ListEmptyComponent={() =>
                            isLoading == false &&
                            allJounals.length == 0 && (
                                <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
                                    <EmptyView title={'No Mood Journals Yet '} noSubtitle />
                                    <TouchableOpacity onPress={btn_add}
                                        style={{
                                            backgroundColor: Colors.lightPrimary,
                                            height: 40,
                                            width: 160,
                                            borderRadius: 10,
                                            alignItems: "center",
                                            justifyContent: "center",
                                            marginTop: 20
                                        }}>
                                        <Text style={{ color: Colors.primary, fontWeight: "bold" }}>Create Mood Journal   </Text>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        onEndReached={() => {
                            if (canLoadMore) {
                                api_MoodsJounalsMore({
                                    start_date: filterObj.startDate,
                                    end_date: filterObj.endDate,
                                    moods: filterObj.moods.length != 0 ? JSON.stringify(filterObj.moods) : "",
                                });
                            }
                        }}
                        ListFooterComponent={
                            isLoadingMore && (
                                <View style={{ height: 100, justifyContent: 'center' }}>
                                    <ActivityIndicator color={Colors.primary} size="small" />
                                </View>
                            )
                        }
                    />
                </View>

                {isModalVisible &&
                    <View>
                        <MoodsFilterModal
                            visible={isModalVisible}
                            filterMoodApi = {api_allMoodJournalsList}
                            filter={updateData}
                            previousFilterData={filterObj}
                            onCancel={toggleModal}
                        />
                    </View>
                }
            </View>
            <Loader enable={isLoading} />
        </SafeAreaView>
    );
};

export default AllMoodJournals;

const allMoodJournals_styles = StyleSheet.create({
    hiddenView: {
        justifyContent: 'center',
        alignItems: "flex-end",
        overflow: "hidden",
        marginHorizontal: 12,
        backgroundColor: Colors.delete,
        borderRadius: 20,
        borderBottomEndRadius: 20,
        paddingRight: 20,
        marginTop: 15,
        marginBottom: 20,
        flex: 1,
        borderColor: Colors.background,
        borderWidth: 1,
    },

    hiddenIcon: { height: 25, width: 25, tintColor: Colors.white },
});