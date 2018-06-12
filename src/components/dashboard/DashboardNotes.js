import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import { View, TouchableHighlight, Text } from 'react-native';
import * as formatting from '../../utils/formatting';
import EventContainer from './EventContainer';
import DashboardStyle from '../../styles/DashboardStyles';

class DashboardNotes extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showingDate: new Date(),
    };

    this.backDate = this.backDate.bind(this);
    this.forwardDate = this.forwardDate.bind(this);
  }

  getLogType(bs) {
    switch (bs.logType) {
      case 0:
        return 'BS';
      case 1:
        return 'CH';
      default:
        return 'LOG';
    }
  }

  getLogTypeValue(bs) {
    switch (bs.logType) {
      case 0:
        return formatting.toDecimalString(bs.value);
      case 1:
        return bs.value.toString();
      default:
        return bs.value;
    }
  }

  getEvents() {
    const filteredEvents = [
      ...this.props.userlog.userLogEntries.filter(event =>
        moment(this.state.showingDate).format('YYYYMMDD') ===
        moment(event.date).format('YYYYMMDD'))].map(bs => ({
      userLogId: bs.id,
      key: moment(bs.date).format('YYYYMMDDHHmmss'),
      date: moment(bs.date).format('HH:mm'),
      fullDate: bs.date,
      type: this.getLogType(bs),
      value: this.getLogTypeValue(bs),
    }));

    return filteredEvents;
  }

  getBSAverage(logEvents) {
    let bs = 0;
    let count = 0;
    for (let i = 0; i !== logEvents.length; i++) {
      if (logEvents[i].type === 'BS') {
        bs += parseFloat(logEvents[i].value, 10);
        count++;
      }
    }
    return count !== 0 && bs !== 0 ? Math.round((bs / count) * 10) / 10 : 0;
  }

  getSumCarbs(logEvents) {
    let carbs = 0;
    for (let i = 0; i !== logEvents.length; i++) {
      if (logEvents[i].type === 'CH') {
        carbs += parseFloat(logEvents[i].value, 10);
      }
    }
    return carbs;
  }

  backDate() {
    this.setState({
      showingDate: moment(this.state.showingDate).add(-1, 'day'),
    });
  }

  forwardDate() {
    this.setState({
      showingDate: moment(this.state.showingDate).add(1, 'day'),
    });
  }

  render() {
    const logEvents = this.getEvents();
    return (
      <View style={DashboardStyle.container}>
        <View style={DashboardStyle.datePickerView}>
          <TouchableHighlight
            disabled={
              moment(this.state.showingDate).format('YYYY-MM-DD') ===
              moment(new Date())
                .add(-7, 'day')
                .format('YYYY-MM-DD')
            }
            style={DashboardStyle.datePickerArrows}
            underlayColor="#DDD"
            onPress={this.backDate}
          >
            <Icon
              style={{
                color:
                  moment(this.state.showingDate).format('YYYY-MM-DD') ===
                  moment(new Date())
                    .add(-7, 'day')
                    .format('YYYY-MM-DD')
                    ? '#EFEFEF'
                    : '#888',
              }}
              name="ios-arrow-back"
            />
          </TouchableHighlight>

          <Text style={DashboardStyle.datePickerText}>
            {moment(this.state.showingDate).format('YYYY-MM-DD')}
          </Text>
          <View>
            <TouchableHighlight
              style={DashboardStyle.datePickerArrows}
              underlayColor="#DDD"
              onPress={this.forwardDate}
              disabled={
                moment(this.state.showingDate).format('YYYY-MM-DD') ===
                moment(new Date()).format('YYYY-MM-DD')
              }
            >
              <Icon
                style={{
                  color:
                    moment(this.state.showingDate).format('YYYY-MM-DD') ===
                    moment(new Date()).format('YYYY-MM-DD')
                      ? '#EFEFEF'
                      : '#888',
                }}
                name="ios-arrow-forward"
              />
            </TouchableHighlight>
          </View>
        </View>
        <View style={DashboardStyle.sumContainer}>
          <View style={{ alignItems: 'center' }}>
            <Text style={DashboardStyle.sumField}>{this.getBSAverage(logEvents)} mmol/l</Text>
            <Text style={{ color: '#A8A8A8' }}>Medel</Text>
          </View>

          <View style={{ alignItems: 'center' }}>
            <Text style={DashboardStyle.sumField}>{this.getSumCarbs(logEvents)} g KH</Text>
            <Text style={{ color: '#A8A8A8' }}>Totalt</Text>
          </View>
        </View>
        <EventContainer
          loading={this.props.userlog.currentlyRetrievingValue}
          data={logEvents}
          navigator={this.props.navigator}
        />
      </View>
    );
  }
}

DashboardNotes.defaultProps = {
  userlog: null,
};

DashboardNotes.propTypes = {
  navigator: PropTypes.object.isRequired,
  userlog: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    userlog: state.userlog,
  };
}

export default connect(mapStateToProps)(DashboardNotes);
