import React from 'react';
import { PropTypes } from 'prop-types';
import { View } from 'react-native';
import moment from 'moment';
import { connect } from 'react-redux';
import * as formatting from '../../utils/formatting';
import MetricsContainer from './MetricsContainer';
import ChartBox from './ChartBox';
import TimeSpanBar from './TimeSpanBar';
import * as logTypeConst from '../../constants/logTypes';
import DashboardStyle from '../../styles/DashboardStyles';

class DashboardOverview extends React.Component {
  constructor(props) {
    super(props);

    const timeSpanOptions = [3, 6, 12, 24];

    this.state = {
      timeSpanOptions,
      activeTimeSpanIndex: 0,
    };

    this.bloodSugarMetricPress = this.bloodSugarMetricPress.bind(this);
    this.carbsMetricPress = this.carbsMetricPress.bind(this);
    this.setTimeSpan = this.setTimeSpan.bind(this);
  }

  setTimeSpan(activeTimeSpanIndex) {
    this.setState({
      activeTimeSpanIndex,
    });
  }

  getLatestBloodSugarEvent() {
    if (!this.props.lastBloodsugarValue) return { value: '-.-' };

    const lastValue = this.props.lastBloodsugarValue;

    return {
      key: moment(lastValue.date).format('YYYYMMDDHHmmss'),
      timestamp: `Loggad kl. ${moment(lastValue.date).format('HH:mm')}`,
      value: formatting.toDecimalString(lastValue.value),
    };
  }

  getLatestExternalUserData() {
    if (!this.props.externalUserData.lastExternalValue) return { value: '-.-' };

    const lastValue = this.props.externalUserData.lastExternalValue;

    return {
      key: moment(lastValue.date).format('YYYYMMDDHHmmss'),
      timestamp: `Uppmätt ${moment(lastValue.date).format('HH:mm')}`,
      value: formatting.toDecimalString(lastValue.value),
    };
  }

  getLatestCarbEvent() {
    if (this.props.userLogEntries.length === 0) return { value: '--' };

    const filteredCarbonHydrateArray = [
      ...this.props.userLogEntries.filter(event =>
        moment(event.date) > moment(new Date()).add(-1, 'day') &&
        event.logType === logTypeConst.LOGTYPE_CARBONHYDRATE),
    ];

    if (filteredCarbonHydrateArray.length === 0) return { value: '---' };

    const lastValue = filteredCarbonHydrateArray[0];

    return {
      key: moment(lastValue.date).format('YYYYMMDDHHmmss'),
      timestamp: `Loggad kl. ${moment(lastValue.date).format('HH:mm')}`,
      value: lastValue.value.toString(),
    };
  }

  carbsMetricPress() {
    this.props.onMetricPress(1); // Navigates to Log Meal
  }

  bloodSugarMetricPress() {
    this.props.onMetricPress(0); // Navigates to LogBloodSugar
  }

  render() {
    const latestBloodSugar = this.getLatestBloodSugarEvent();
    const latestExternalUserData = this.getLatestExternalUserData();
    const latestCarb = this.getLatestCarbEvent();

    return (
      <View style={DashboardStyle.containerDashboardOverview}>
        <MetricsContainer
          loadingBloodSugar={
            this.props.currentlyLoggingValue ||
            this.props.currentlyRetrievingValue
          }
          loadingCarbs={
            this.props.currentlyLoggingCarbValue ||
            this.props.currentlyRetrievingValue
          }
          bloodSugarMetric={latestBloodSugar.value}
          bloodSugarMetricTimestamp={latestBloodSugar.timestamp}
          bloodSugarMetricPress={this.bloodSugarMetricPress}
          externalUserDataMetric={latestExternalUserData.value}
          externalUserDataMetricTimestamp={latestExternalUserData.timestamp}
          carbsMetric={latestCarb.value}
          carbsMetricTimestamp={latestCarb.timestamp}
          carbsMetricPress={this.carbsMetricPress}
        />
        <TimeSpanBar
          timeSpanOptions={this.state.timeSpanOptions}
          activeTimeSpanIndex={this.state.activeTimeSpanIndex}
          onTimeSpanSwitch={this.setTimeSpan}
        />
        <ChartBox
          minBSValue={this.props.settings.lowerBSLimit}
          maxBSValue={this.props.settings.upperBSLimit}
          userlogEntries={this.props.userLogEntries}
          externalUserDataEntries={
            this.props.externalUserData.externalDataEntries
          }
          timeRange={this.state.timeSpanOptions[this.state.activeTimeSpanIndex]}
        />
      </View>
    );
  }
}

DashboardOverview.defaultProps = {
  userLogEntries: [],
  onMetricPress: null,
  externalUserData: null,
  currentlyLoggingCarbValue: false,
  currentlyRetrievingValue: false,
  currentlyLoggingValue: false,
  lastBloodsugarValue: null,
  settings: null,
};

DashboardOverview.propTypes = {
  userLogEntries: PropTypes.array,
  onMetricPress: PropTypes.func,
  externalUserData: PropTypes.object,
  currentlyLoggingCarbValue: PropTypes.bool,
  currentlyRetrievingValue: PropTypes.bool,
  currentlyLoggingValue: PropTypes.bool,
  lastBloodsugarValue: PropTypes.object,
  settings: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    currentlyLoggingValue: state.bloodsugar.currentlyLoggingValue,
    currentlyRetrievingValue: state.userlog.currentlyRetrievingValue,
    currentlyLoggingCarbValue: state.meal.currentlyLoggingCarbValue,
    userLogEntries: state.userlog.userLogEntries,
    lastBloodsugarValue: state.bloodsugar.lastValue,
    externalUserData: state.externalUserData,
    settings: state.settings,
  };
}

export default connect(mapStateToProps)(DashboardOverview);
