import { Platform, StyleSheet } from 'react-native';
import { isIphoneX } from 'react-native-iphone-x-helper';

const FoodStyles = StyleSheet.create({
  foodOuterView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 10,
  },
  foodOuterView1: {
    flex: 1,
    paddingBottom: 10,
    marginLeft: 14,
    marginRight: 14,
    marginTop: 0,
    marginBottom: 6,
  },
  foodInnerView: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 4,
  },
  body: {
    paddingLeft: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightBodyColumn: {
    alignItems: 'flex-end',
  },
  foodDisplayOuterView: {
    flex: 1,
    flexDirection: 'row',
  },
  foodDisplayInnerView: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 10,
  },
  foodQtycontainer: {
    flex: 1,
  },
  foodQtyInnerView: {
    flex: 1,
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#5786CE',
  },
  foodQtyText: {
    fontSize: 20,
    fontWeight: '600',
  },
  noDataContainer: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataTitle: {
    textAlignVertical: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#696969',
  },
  noDataDescription: {
    textAlign: 'center',
    fontSize: 15,
    marginTop: 5,
    marginBottom: 60,
    color: '#A8A8A8',
  },
  mealDisplayBody: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mealDisplayRightBodyColumn: {
    alignItems: 'flex-end',
  },


  modalQtySelectorContainer: {
    alignItems: 'center',
    backgroundColor: '#ede3f2',
    padding: 100,
  },
  modalQtySelectorHeader: {
    fontWeight: 'bold',
    fontSize: 35,
    color: '#5786CE',
    paddingLeft: 20,
    paddingRight: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  modalQtySelectorDescription: {
    marginBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    textAlign: 'center',
  },
  modalQtySelectorTabBarUnderlineStyle: {
    backgroundColor: '#5786CE',
  },
  modalQtySelectorActiveTextStyle: {
    color: '#5786CE',
  },
  modalQtySelectorTabContent: {
    padding: 20,
  },
  modalQtySelectorError: {
    textAlign: 'center',
    color: '#FF0000',
    marginBottom: 5,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalQtySelectorQuantityContainer: {
    borderWidth: 1,
    borderColor: '#5786CE',
  },
  modalQtySelectorWrappableQtyContainer: {
    flexDirection: 'row',
    height: 80,
  },
  modalQtySelectorWrappableQtyText: {
    marginTop: 5,
    color: '#5786CE',
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalQtySelectorModal: {
    marginLeft: '1%',
    marginRight: '1%',
    marginTop: isIphoneX() ? 50 : 20,
    marginBottom: '1%',
    borderColor: '#5786CE',
    borderWidth: 1,
    width: '98%',
    height: '98%',
    flexDirection: 'column',
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  modalQtySelectorModalHeader: {
    paddingTop: 0,
    backgroundColor: '#5786CE',
    borderTopWidth: 1,
    borderTopColor: '#FFF',
    borderLeftWidth: 1,
    borderLeftColor: '#FFF',
    borderRightWidth: 1,
    borderRightColor: '#FFF',
    marginBottom: 10,
  },
  modalQtySelectorModalCloseIcon: {
    color: '#FFF',
  },
  modalQtySelectorModalTitle: {
    color: '#FFF',
  },
  modalQtySelectorText: {
    color: '#3f2949',
    marginTop: 10,
  },
  modalQtySelectorInputCommon: {
    fontWeight: 'bold',
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5786CE',
    padding: Platform.OS === 'ios' ? 10 : 0,
    fontSize: 30,
  },
  modalQtySelectorButton: {
    marginTop: 20,
  },
  modalQtySelectorButtons: {
    justifyContent: 'flex-start',
    marginTop: 20,
  },

});

export default FoodStyles;
