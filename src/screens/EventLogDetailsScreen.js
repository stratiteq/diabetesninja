import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { Body, Container, Content, Left, List, ListItem, Right, Text, Thumbnail } from 'native-base';
import { StyleSheet, View, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as commonCss from '../styles/CommonStyles';
import * as userLogActions from '../redux/userlog/actions';
import * as images from '../utils/FoodGroupImages';
import * as navigatorStyles from '../styles/NavigatorStyles';

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    marginRight: 20,
    marginLeft: 20,
    marginBottom: 10,
    backgroundColor: '#5786CE',
    height: 40,
    borderRadius: 5,
    margin: 5,
  },
  editButton: {
    padding: 10,
    backgroundColor: '#5786CE',
    borderRadius: 5,
    height: 40,
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  container: {
    padding: 20,
  },
  valueHeader: {
    fontWeight: 'bold',
    color: '#888',
    marginBottom: 3,
  },
  input: {
    flex: 1,
    marginTop: 0,
    marginLeft: 0,
    padding: 5,
    fontSize: 20,
  },
});

class EventLogDetailsScreen extends React.Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    drawUnderNavBar: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      date: moment(this.props.userLogItem.fullDate),
      value: this.props.userLogItem.value,
      editing: false,
      isDateTimePickerVisible: false,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.deleteLogItem = this.deleteLogItem.bind(this);
    this.editLogItemDone = this.editLogItemDone.bind(this);
    this.renderDate = this.renderDate.bind(this);
    this.renderBsValue = this.renderBsValue.bind(this);
    this.onBsChanged = this.onBsChanged.bind(this);
    this.updateLogItem = this.updateLogItem.bind(this);
    this.editSaveBs = this.editSaveBs.bind(this);
    this.logItemUpdated = this.logItemUpdated.bind(this);
    this.addZero = this.addZero.bind(this);
  }

  componentWillMount() {
    this.props.userLogActions.getLoggedMeal(
      Number(this.props.userLogItem.userLogId),
    );
  }

  componentWillUnmount() {
    this.props.userLogActions.ClearLoggedMeal();
  }

  onBsChanged(text) {
    this.setState({ value: text });
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      default:
      // console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  getValue() {
    switch (this.props.userLogItem.type) {
      case 'CH':
        return (
          <View style={{ padding: 20 }}>
            <Text>
              {`Summa kolhydrater: ${this.props.userLogItem.value}g KH`}
            </Text>
            {this.renderDate(20)}
          </View>
        );
      case 'BS':
        return (
          <View style={styles.container}>
            {this.renderBsValue()}
            {this.renderDate(20)}
          </View>
        );
      default:
        return (
          <View style={{ padding: 20 }}>
            <Text>{this.props.userLogItem.value}</Text>
            {this.renderDate(20)}
          </View>
        );
    }
  }

  updateLogItem(date) {
    let logType = 0;
    let dateToLog = date;
    if (date == null) {
      dateToLog = this.state.date.toISOString();
    } else {
      dateToLog = date;
    }

    switch (this.props.userLogItem.type) {
      case 'CH':
        logType = 1;
        break;
      case 'BS':
        logType = 0;
        if (Number.isNaN(this.state.value)) {
          this.setState({ value: this.props.userLogItem.value });
          Alert.alert('Var god ange ett värde.');
          return;
        }

        if (this.state.value > 30) {
          Alert.alert('Värdet är för stort', 'Maxvärde: 30');
          this.setState({ value: this.props.userLogItem.value });
          return;
        }

        if (this.state.value < 0.1) {
          Alert.alert('Värdet är för lågt.');
          this.setState({ value: this.props.userLogItem.value });
          return;
        }
        break;
      default:
        logType = 2;
        break;
    }

    const item = {
      date: dateToLog,
      // eslint-disable-next-line eqeqeq
      bloodSugar: logType == 0 ? parseFloat(this.state.value.replace(',', '.')) : null,
      id: this.props.userLogItem.userLogId,
    };

    this.props.userLogActions.updateLogItem(item, this.logItemUpdated);
  }

  handleDatePicked = (d) => {
    this.hideDateTimePicker();
    this.setState({ date: moment(d) });
    this.props.navigator.setTitle({
      title: `${this.addZero(d.getHours())}:${this.addZero(d.getMinutes())}`,
    });

    this.updateLogItem(d);
  };

  editSaveBs() {
    this.setState({ editing: !this.state.editing });
    if (this.state.editing) this.updateLogItem();
  }

  showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

  hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

  logItemUpdated(success) {
    if (success) {
      this.props.userLogActions.resetUserLogFromApi(
        moment(new Date()).add(-7, 'day'),
      );
    } else {
      this.props.navigator.setTitle({
        title: this.props.userLogItem.date,
      });
      this.setState({
        date: moment(this.props.userLogItem.fullDate),
        value: this.props.userLogItem.value,
      });
    }
  }

  addZero(i) {
    if (i < 10) {
      // eslint-disable-next-line no-param-reassign
      i = `0${i}`;
    }
    return i;
  }

  deleteLogItem() {
    Alert.alert(
      'Är du säker på att du vill ta bort loggen?',
      null,
      [{ text: 'Ja', onPress: () => this.deleteLogItemFull() }, { text: 'Nej' }],
      { cancelable: true },
    );
  }

  deleteLogItemFull() {
    this.setState({ loading: true });
    this.props.userLogActions.deleteLogItem(
      this.props.userLogItem.userLogId,
      this.editLogItemDone,
    );
  }

  editLogItemDone(success) {
    this.setState({ loading: false });

    if (success) {
      this.props.navigator.pop();
      this.props.userLogActions.resetUserLogFromApi(
        moment(new Date()).add(-7, 'day'),
      );
    } else {
      Alert.alert(
        'Ett fel Uppstod',
        'Kunde inte ta bort loggat värde...',
        [
          {
            text: 'OK',
            onPress: () => {
              this.props.navigator.pop();
            },
          }],
      );
    }
  }

  renderBsValue() {
    return (
      <View style={styles.rowContainer}>
        {this.state.editing ? (
          <TextInput
            style={[commonCss.default.input, styles.input]}
            keyboardType="numeric"
            autoFocus
            selectTextOnFocus
            multiline={false}
            onChangeText={text => this.onBsChanged(text)}
            value={this.state.value}
            maxLength={4}
            onSubmitEditing={() => this.editSaveBs()}
            underlineColorAndroid="#00000000"
          />
        ) : (
          <View>
            <Text style={styles.valueHeader}>BLODSOCKER</Text>
            <Text>{this.state.value} mmol/L</Text>
          </View>
        )}
        <TouchableOpacity style={styles.editButton} onPress={this.editSaveBs}>
          <Text style={styles.buttonText}>
            {this.state.editing ? 'SPARA' : 'ÄNDRA'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderSpinner() {
    return (
      <ActivityIndicator
        color="#ffffff"
        size="small"
        animating
        style={{
          position: 'absolute',
          right: 15,
        }}
      />
    );
  }

  renderDate(padding) {
    const d = this.state.date.toDate();
    return (
      <View style={[styles.rowContainer, { marginTop: padding }]}>
        <View>
          <Text style={styles.valueHeader}>DATUM</Text>
          <Text>
            {`${d.toLocaleDateString()} ${this.addZero(d.getHours())}:${this.addZero(d.getMinutes())}`}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={this.showDateTimePicker}
        >
          <Text style={styles.buttonText}>ÄNDRA</Text>
        </TouchableOpacity>
      </View>
    );
  }

  renderFoodItem(item) {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail
            square
            small
            source={images.ImageFoodGroups[item.foodGroupId]}
          />
        </Left>
        <Body>
          <Text>{item.foodName}</Text>
          <Text note>{item.foodGroupName}</Text>
        </Body>
        <Right style={{ flexDirection: 'column' }}>
          <Text>{`${item.qty} ${item.unitDesc}`}</Text>
          <Text note>{`${item.mealDetailCarb} g KH`}</Text>
        </Right>
      </ListItem>
    );
  }

  render() {
    return (
      <Container>
        <Content>
          {this.getValue()}
          <List
            dataArray={this.props.foodlist}
            renderRow={this.renderFoodItem}
          />
          <TouchableOpacity
            onPress={this.deleteLogItem}
            style={{ marginTop: 10 }}
          >
            <View
              style={[styles.button, { backgroundColor: '#e54c4c' }]}
              elevation={3}
            >
              <Text style={commonCss.CommonStyles.buttontext}>TA BORT</Text>
              {this.state.loading ? this.renderSpinner() : <View />}
            </View>
          </TouchableOpacity>
        </Content>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode="datetime"
          confirmTextIOS="Spara"
          cancelTextIOS="Avbryt"
          date={this.state.date.toDate()}
        />
      </Container>
    );
  }
}

EventLogDetailsScreen.defaultProps = {
  userLogItem: null,
  navigator: null,
  userLogActions: null,
  foodlist: [],
};

EventLogDetailsScreen.propTypes = {
  userLogItem: PropTypes.object,
  navigator: PropTypes.object,
  userLogActions: PropTypes.object,
  foodlist: PropTypes.array,
};

function mapStateToProps(state) {
  return {
    foodlist: state.userlog.foodList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogActions: bindActionCreators(userLogActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  EventLogDetailsScreen,
);
