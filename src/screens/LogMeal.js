import React from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  Alert,
  StyleSheet,
  ListView,
  View,
  TouchableHighlight,
  TouchableOpacity,
  TextInput,
  Keyboard,
  AsyncStorage,
  Modal
} from "react-native";
import { Body, Button, Icon, List, ListItem, Right, Text } from "native-base";
import * as mealActions from "../redux/meal/actions";
import * as appActions from "../redux/app/actions";
import * as navigatorStyles from "../styles/NavigatorStyles";
import * as formatting from "../utils/formatting";
import MealDisplay from "../components/food/MealDisplay";
import MetricsBox from "../components/dashboard/MetricsBox";
import * as commonCss from "../styles/CommonStyles";
import ListFoodByGroup from '../components/food/ListFoodByGroup';
import PopupDialog, {
  DialogTitle,
  SlideAnimation,
  DialogButton
} from "react-native-popup-dialog";
import { isIphoneX } from "react-native-iphone-x-helper";
import * as storageKeys from "../constants/storageKeys";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  mainMetricsContainer: {
    padding: 7,
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderColor: "#4996AD50"
  },
  button: {
    justifyContent: "center",
    backgroundColor: "#5786CE",
    height: 50
  }
});

class LogMeal extends React.Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    drawUnderNavBar: false
  };

  static navigatorButtons = {
    rightButtons: [{}]
  };

  static foodKeyExtractor(item) {
    return item.key;
  }

  constructor(props) {
    super(props);

    this.state = {
      favName: "",
      foodListModalVisible: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    this.dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });

    this.onTrash = this.onTrash.bind(this);
    this.logMeal = this.logMeal.bind(this);
    this.onLogMeal = this.onLogMeal.bind(this);
    this.onAddFoodSelected = this.onAddFoodSelected.bind(this);
    this.openCustomCarbsScreen = this.openCustomCarbsScreen.bind(this);
    this.isDoubleTap = this.isDoubleTap.bind(this);
    this.saveLogAsFavorite = this.saveLogAsFavorite.bind(this);
    this.guid = this.guid.bind(this);
    this.openFavoriteModal = this.openFavoriteModal.bind(this);
    //this.toggleFoodListModal = this.toggleFoodListModal.bind(this);
  }


  openFavoriteModal() {
    this.toggleFoodListModal(true);
  }

  
  toggleFoodListModal(modalVisible){
    console.log("modal change " + modalVisible);
    this.setState({foodListModalVisible : modalVisible})
    
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        this.props.navigator.pop();
        break;
      default:
        break;
    }
  }

  guid() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return (
      s4() +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      "-" +
      s4() +
      s4() +
      s4()
    );
  }

  async saveLogAsFavorite() {
    console.log("Saving favorite");
    const payload = {
      carbEquivalent: this.sumCarbs(),
      isFavorite: true,
      foodGroupName: this.state.favName,
      foodId: "0",
      imageurl: "",
      foods: this.props.meal.tempMealData,
      name: this.state.favName,
      qty: this.sumCarbs(),
      dbId: this.guid()
    };

    let savedItems = [];
    savedItems = await AsyncStorage.getItem(storageKeys.SAVED_MEAL_FAVORITES);

    if (savedItems === null) {
      savedItems = [];
    } else {
      savedItems = JSON.parse(savedItems);
    }

    savedItems.push(payload);

    try {
      await AsyncStorage.setItem(
        storageKeys.SAVED_MEAL_FAVORITES,
        JSON.stringify(savedItems)
      );
      console.log(await AsyncStorage.getItem(storageKeys.SAVED_MEAL_FAVORITES));
      Alert.alert(
        "Favorit sparad",
        "Du hittar dina favoriter under favoritsektionen i lägg till mat, eller i beräkna kolhydrater."
      );
      this.setState({ favName: "" });
    } catch (error) {
      // failed to save
    }
  }
  setFavName(text) {
    this.setState({ favName: text });
  }

  onAddFoodSelected() {
    if (this.isDoubleTap()) return;
    this.props.navigator.push({
      title: "Lägg till mat",
      screen: "diabetesNinja.AddFood",
      overrideBackPress: true,
      passProps: {}
    });
  }

  onTrash(key) {
    if (this.isDoubleTap()) return;
    this.props.mealActions.removeCarbFromMeal(key);
  }

  onLogMeal() {
    Alert.alert(
      "Har du lagt till alla kolhydrater?",
      null,
      [{ text: "Ja", onPress: () => this.logMeal() }, { text: "Nej" }],
      { cancelable: true }
    );
  }

  getLatestBloodSugarValue() {
    if (!this.props.bloodsugar.lastValue) return { value: "-,-" };

    const { lastValue } = this.props.bloodsugar;

    return {
      key: moment(lastValue.date).format("YYYYMMDDHHmmss"),
      timestamp: `Loggad kl. ${moment(lastValue.date).format("HH:mm")}`,
      value: formatting.toDecimalString(lastValue.value)
    };
  }

  openCustomCarbsScreen() {
    if (this.isDoubleTap()) return;

    this.props.navigator.push({
      title: "Lägg till övriga kolhydrater",
      screen: "diabetesNinja.AddCustomCarbs",
      overrideBackPress: true,
      passProps: {}
    });
  }

  logMeal() {
    this.props.mealActions.submitMeal({
      carbSum: this.sumCarbs(),
      mealDetails: this.props.meal.tempMealData
    });
    this.props.navigator.pop();
  }

  sumCarbs() {
    return this.props.meal.tempMealData.reduce(
      (a, b) => a + b.carbEquivalent,
      0
    );
  }

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1000) {
      return true;
    }
    this.lastTap = now;
    return false;
  }

  render() {
    const isX = isIphoneX;
    const sumCarb = this.sumCarbs();
    const disabled = this.props.meal.tempMealData.length === 0;
    const favHasName = this.state.favName.length > 0;
    const favoriteFoodGroup = { foodGroupId: -1, name: 'Mina favoriter' };

    return (
      <View style={styles.container}>
        <View style={styles.mainMetricsContainer}>
          <MetricsBox
            loading={
              this.props.bloodsugar.currentlyLoggingValue ||
              this.props.userlog.currentlyRetrievingValue
            }
            textGrayed
            useDecimal
            small
            metricsTitle="Blodsocker"
            metricsTimestamp={null}
            metricsValue={this.getLatestBloodSugarValue().value}
          />
          <MetricsBox
            loading={
              this.props.meal.currentlyLoggingCarbValue ||
              this.props.userlog.currentlyRetrievingValue
            }
            useDecimal={false}
            small
            metricsTimestamp={null}
            metricsTitle="Summa kolhydrater"
            metricsValue={sumCarb}
            onPress={this.onAddFoodSelected}
          />
        </View>

        <View style={{ flex: 1 }}>
          <List>
            <ListItem key={1} onPress={this.onAddFoodSelected}>
              <Body>
                <Text>Lägg till mat</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem key={2} onPress={this.openCustomCarbsScreen}>
              <Body>
                <Text>Lägg till övriga kolhydrater</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            <ListItem key={3} onPress={this.openFavoriteModal}>
              <Body>
                <Text>Lägg till favoriter</Text>
              </Body>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>

          <List
            dataSource={this.dataSource.cloneWithRows(
              this.props.meal.tempMealData
            )}
            renderRow={item => (
              <MealDisplay
                isShowingFavDetails={false}
                item={item}
                onTrash={() => this.onTrash(item.key)}
              />
            )}
            renderRightHiddenRow={() => (
              <Button danger>
                <Icon active name="trash" />
              </Button>
            )}
            rightOpenValue={-75}
            disableLeftSwipe
            disableRightSwipe
            enableEmptySections
          />
        </View>

        <View style={{ padding: 0, opacity: disabled ? 0.5 : 1}}>
          <TouchableHighlight
            style={[styles.button, { backgroundColor: "#009688", borderTopRightRadius:10, borderTopLeftRadius:10 }]}
            underlayColor="#777"
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            onPress={() => {
              this.popupDialog.show();
              this.editFavName.focus();
            }}
          >
            <Text style={commonCss.default.buttontext}>SPARA SOM FAVORIT</Text>
          </TouchableHighlight>
        </View>

        <View style={{ padding: 0, opacity: disabled ? 0.5 : 1}}>
          <TouchableHighlight
            style={[
              styles.button,
              {
                height: isX() ? 65 : 50,
                paddingBottom: isX() ? 10 : 0,
                marginBottom: 0,
                marginRight: 0,
                marginLeft: 0,                         
              }
            ]}
            underlayColor="#777"
            activeOpacity={disabled ? 1 : 0.7}
            disabled={disabled}
            onPress={this.onLogMeal}
          >
            <Text style={commonCss.default.buttontext}>LOGGA</Text>
          </TouchableHighlight>
        </View>

        <PopupDialog
          dialogTitle={
            <DialogTitle
              titleStyle={{ backgroundColor: "#5786CE" }}
              titleTextStyle={{ color: "#FFF", fontWeight: "bold" }}
              title="Spara som favorit"
            />
          }
          onDismissed={() => {
            Keyboard.dismiss();
          }}
          dialogStyle={{ transform: [{ translateY: isX() ? -190 : -140 }] }}
          height={isX() ? 0.2 : 0.25}
          width={0.9}
          ref={popupDialog => {
            this.popupDialog = popupDialog;
          }}
        >
          <View style={{ margin: 0, justifyContent: "center", flex: 1 }}>
            <TextInput
              ref={editFavName => {
                this.editFavName = editFavName;
              }}
              placeholderTextColor="#555555"
              placeholder="Ange ett namn"
              underlineColorAndroid="#00000000"
              style={{ fontSize: 25 }}
              textAlign="center"
              value={this.state.favName}
              returnKeyType="done"
              onSubmitEditing={() => {
                this.saveLogAsFavorite();
                this.popupDialog.dismiss();
                Keyboard.dismiss();
              }}
              onDismissed={() => this.setState({ favName: "" })}
              onChangeText={text => this.setFavName(text)}
            />
          </View>

          <View
            style={{ flexDirection: "row", justifyContent: "space-around" }}
          >
            <View>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    marginBottom: 0,
                    backgroundColor: "transparent",
                    borderWidth: 0
                  }
                ]}
                underlayColor="#777"
                onPress={() => {
                  this.popupDialog.dismiss();
                  this.setState({ favName: "" });
                }}
              >
                <Text style={{ color: "#5786CE", fontWeight: "bold" }}>
                  AVBRYT
                </Text>
              </TouchableOpacity>
            </View>

            <View opacity={favHasName ? 1 : 0.5}>
              <TouchableOpacity
                style={[
                  styles.button,
                  {
                    marginBottom: 0,
                    backgroundColor: "transparent",
                    borderWidth: 0
                  }
                ]}
                underlayColor="#777"
                disabled={!favHasName}
                onPress={() => {
                  this.saveLogAsFavorite();
                  this.popupDialog.dismiss();
                  Keyboard.dismiss();
                }}
              >
                <Text style={{ color: "#5786CE", fontWeight: "bold" }}>
                  SPARA
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </PopupDialog>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.foodListModalVisible}
          onRequestClose={() => {
            this.toggleFoodListModal(false);
          }}
        >
          <ListFoodByGroup
            foodGroup={favoriteFoodGroup}           
            onCancel={() => {
              this.toggleFoodListModal(false);
            }}
            popBackToLog = {() => {
              this.toggleFoodListModal(false);
            }}
          />
        </Modal>
      </View>
    );
  }
}

LogMeal.defaultProps = {
  mealActions: null,
  meal: null,
  userlog: null,
  bloodsugar: null
};

LogMeal.propTypes = {
  navigator: PropTypes.object.isRequired,
  mealActions: PropTypes.object,
  meal: PropTypes.object,
  userlog: PropTypes.object,
  bloodsugar: PropTypes.object
};

function mapStateToProps(state) {
  return {
    bloodsugar: state.bloodsugar,
    meal: state.meal,
    userlog: state.userlog
  };
}

function mapDispatchToProps(dispatch) {
  return {
    mealActions: bindActionCreators(mealActions, dispatch),
    globalActions: bindActionCreators(appActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LogMeal);
