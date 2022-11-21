import {Platform, StyleSheet, Dimensions} from 'react-native';
import Colors from './Colors';
import {font} from './font';
import {isIphoneX} from 'react-native-iphone-x-helper';

const screen = Dimensions.get('screen');

export const _styleTrackPlayer = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  posterView: {
    flex: 0.5,
    transform: [{scaleX: 2}],
    borderBottomStartRadius: 200,
    borderBottomEndRadius: 200,
    overflow: 'hidden',
    backgroundColor: Colors.gray02,
  },
  posterImageView: {
    flex: 1,
    transform: [{scaleX: 0.5}],
  },

  backButtonView: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 40 / 2,
    marginLeft: 10,
  },
  backButtonIcon: {
    height: 25,
    width: 25,
  },
  backButton2Icon: {
    height: 20,
    width: 20,
    tintColor: Colors.black,
  },
  controlsAndTextView: {
    flex: 0.5,
    justifyContent: 'space-between',
    marginBottom: '15%',
    marginTop: '10%',
  },
  TextView: {marginHorizontal: 35, marginTop: -20},
  favButtonView: {
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignSelf: 'flex-end',
    marginLeft: 5,
  },
  favButtonIcon: {
    width: 20,
    height: 20,
  },
  trackName: {
    fontFamily: font.xbold,
    fontSize: 21,
    includeFontPadding: false,
    color: Colors.black,
    marginTop: 5,
  },
  trackCategory: {
    fontFamily: font.bold,
    fontSize: 18,
    includeFontPadding: false,
    color: Colors.gray12,
    marginTop: 5,
  },
  trackDescription: {
    fontFamily: font.bold,
    fontSize: 14,
    includeFontPadding: false,
    color: Colors.gray05,
    marginTop: 5,
  },
  controlView: {marginHorizontal: 35, marginTop: 10},
  playerButtonsView: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'center',
  },
  downloadButtonView: {
    alignItems: 'center',
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    justifyContent: 'center',
    alignSelf: 'flex-end',
  },
  previosAndNextButtonView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideButtons: {
    flex: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previosAndNextButtonIcon: {width: 22, height: 22, tintColor: Colors.primary},

  playPauseButtonView: {
    flex: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPauseButtonInnerView: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.lightPrimary,
    borderWidth: 7,
  },
  playPauseButtonIcon: {width: 22, height: 22, tintColor: Colors.white},
});

export const mainStyles = StyleSheet.create({
  MainView: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  MainViewForBottomTabScreens: {
    flex: 1,
    backgroundColor: Colors.background,
    // marginBottom: 50,
    // backgroundColor: 'pink',
  },
  innerView: {
    paddingHorizontal: 20,
    flex: 1,
  },
});

export const FAB_style = StyleSheet.create({
  View: {
    height: 50,
    width: 50,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: Platform.OS == 'ios' ? (isIphoneX() ? 0 : 20) : 20,
    right: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,

    elevation: 4,
  },
  image: {
    height: 20,
    width: 20,
    tintColor: Colors.white,
  },
});

export const other_style = StyleSheet.create({
  labelText: {
    color: Colors.black,
    fontFamily: font.bold,
    letterSpacing: 0,
  },
});

export const chooseHabit_style = StyleSheet.create({
  addButton: {
    borderRadius: 20,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.gray02,
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  addButtonText: {
    fontFamily: font.medium,
    fontSize: 16,
    marginLeft: 10,
  },
  addButtonIcon: {height: 20, width: 20},
});

export const createHabit_styles = StyleSheet.create({
  typeButton: {
    // flexDirection: 'row',
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray02,
    flex: 1,
    width: screen.width * 0.5,
    height: (screen.width * 0.5) / 2,

    margin: 5,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  selectedButton: {
    backgroundColor: Colors.lightPrimary,
    // borderColor: Colors.primary,
  },
  typeButtonText: {
    fontFamily: font.medium,
    fontSize: 14,
    marginLeft: 5,
    marginTop: 15,
  },
  typeButtonIcon: {
    height: 25,
    width: 25,
  },

  weekButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray02,
    paddingVertical: 10,
    margin: 5,
    borderRadius: 10,
    flex: 1,

    backgroundColor: Colors.white,
  },
  weekButtonText: {
    fontFamily: font.medium,
    fontSize: 14,
    textTransform: 'capitalize',
    // backgroundColor:"pink",
    includeFontPadding: false,
  },

  timeButton: {
    // paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.gray02,
    padding: 30,
    borderRadius: 10,
    marginTop: 15,
    alignItems: 'center',
    backgroundColor: Colors.white,
    // marginBottom: 20,
  },
  timeButtonTextHeader: {
    fontFamily: font.bold,
    color: Colors.black,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
  },
  timeButtonText1: {
    fontFamily: font.regular,
    textAlign: 'center',
    marginTop: 10,
  },
  timeButtonText2: {
    fontFamily: font.bold,
    color: Colors.primary,
    fontSize: 16,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  selectTimeButtion: {
    borderWidth: 1,
    alignSelf: 'center',
    borderColor: Colors.primary,
    borderRadius: 10,
    marginTop: 15,
  },

  reminderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginTop: 15,
    marginTop: 15,
    borderWidth: 1,
    borderColor: Colors.gray02,
    borderRadius: 10,
    padding: 10,
    backgroundColor: Colors.white,
  },
});

export const HabitStats_style = StyleSheet.create({
  statItemtext1: {
    color: Colors.placeHolder,
    fontFamily: font.medium,
    fontSize: 12,
  },
  statItemtext2: {
    color: Colors.black,
    fontFamily: font.bold,
    fontSize: 20,
  },
  statItemView: {
    flex: 1,
    alignItems: 'center',
  },
  statRow: {
    // marginVertical: 50,
    marginTop: 30,
    flexDirection: 'row',

    // justifyContent:"space-around"
    // justifyContent: 'space-evenly',
  },
  statOuterItem: {
    backgroundColor: '#BDC3C744',
    // padding: 10,
    borderRadius: 10,
    // flex:1,
    // marginHorizontal:10
    height: 50,
    width: 90,
    justifyContent: 'center',
    // alignItems:"center"
  },
  typeText: {
    fontFamily: font.medium,
    padding: 10,
    color: Colors.placeHolder,
    textTransform: 'capitalize',
  },
  selectedTypeText: {
    color: Colors.primary,
  },
});

export const stat_styles = StyleSheet.create({
  lableView: {
    paddingVertical: 10,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
  },
  filterView: {
    padding: 20,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderColor: Colors.gray02,
    borderWidth: 1,
    // marginTop: 10,
    marginHorizontal: 20,
  },
  filterButtonView: {
    backgroundColor: Colors.background,
    // padding: 15,
    paddingHorizontal: 15,
    height: 45,
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  filterButtonIcon: {
    height: 18,
    width: 18,
  },
  filterButtonText: {
    fontFamily: font.medium,
  },

  listView: {
    // margin: 10,
    marginBottom: 15,
    alignItems: 'center',
    // padding: 10,
    borderRadius: 20,

    borderColor: Colors.gray02,
    borderWidth: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    // height: 130,
    flex: 1,
    overflow: 'hidden',
  },
  listImageView: {
    height: '100%',
    width: 120,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray02,
    alignSelf: 'flex-start',
  },
  listImage: {height: '100%', width: 120},
  listDetailView: {marginLeft: 10, flex: 1, justifyContent: 'center'},
  listTitle: {
    fontFamily: font.bold,
    fontSize: 16,
    includeFontPadding: false,
    color: Colors.black,
  },
  listTargetDateView: {marginTop: 5},
  listTargetDateText: {
    fontFamily: font.medium,
    color: Colors.text,
    fontSize: 12,
  },
  listCreatedAtView: {marginTop: 2},
  listCreatedAtText: {
    fontFamily: font.medium,
    color: Colors.text,
    fontSize: 12,
  },
  listWeekView: {flexDirection: 'row', marginTop: 10},
  weekItemView: {
    // borderWidth: 1,
    borderColor: Colors.placeHolder,
    borderRadius: 4,
    marginHorizontal: 1,
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listProgressBarView: {flex: 1},

  collapseButtonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -15,
    marginVertical: -15,
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  collapseButtonInnerView: {flexDirection: 'row'},
  appliedFilterView: {
    backgroundColor: Colors.lightPrimary,
    marginLeft: 10,
    padding: 3,
    paddingHorizontal: 8,
    margin: -3,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.gray02,
  },
  appliedFilterText: {
    color: Colors.primary,
    fontFamily: font.medium,
    includeFontPadding: false,
  },
  collapseArrow: {
    height: 15,
    width: 15,
    tintColor: Colors.placeHolder,
  },
});

export const allHabit_styles = StyleSheet.create({
  itemView: {
    marginBottom: 15,
    alignItems: 'center',
    borderRadius: 20,
    borderColor: Colors.gray02,
    borderWidth: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingVertical: 10,
    marginHorizontal: 20,
    flex: 1,
    overflow: 'hidden',
  },
  imageView: {
    // height: 110,
    aspectRatio: 1,
    // height: '100%',
    width: 115,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.gray02,
    alignSelf: 'center',
  },
  itemImage: {height: '100%', width: 115},
  detailView: {marginLeft: 10, flex: 1, justifyContent: 'center'},
  title: {
    fontFamily: font.bold,
    fontSize: 16,
    includeFontPadding: false,
    color: Colors.black,
  },
  targetDateView: {marginTop: 10},
  targetDate: {
    fontFamily: font.medium,
    color: Colors.text,
    fontSize: 12,
  },
  reminderText: {
    fontFamily: font.medium,
    color: Colors.text,
    fontSize: 12,
  },
  reminderView: {marginTop: 2},
  weekView: {flexDirection: 'row', marginTop: 10},
  weekDayView: {
    borderColor: Colors.placeHolder,
    borderRadius: 4,
    marginHorizontal: 3,
    flex: 1,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hiddenView: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginHorizontal: 20,
    backgroundColor: Colors.delete,
    borderRadius: 20,
    borderBottomEndRadius: 20,
    paddingRight: 20,
    marginBottom: 15,
    flex: 1,

    margin: 2,
  },
  hiddenIcon: {height: 25, width: 25, tintColor: Colors.white},
});

export default StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
