import React from 'react';
import { PropTypes } from 'prop-types';
import { View, TouchableHighlight, Text } from 'react-native';
import DashboardStyle from '../../styles/DashboardStyles';

class TimeSpanBar extends React.Component {
  constructor(props) {
    super(props);

    this.getOptionComponents = this.getOptionComponents.bind(this);
    this.onTimeSpanSwitch = this.onTimeSpanSwitch.bind(this);
  }

  onTimeSpanSwitch(index) {
    this.props.onTimeSpanSwitch(index);
  }

  getOptionComponents() {
    const optionArray = [];

    for (let index = 0; index < this.props.timeSpanOptions.length; index++) {
      if (index === this.props.activeTimeSpanIndex) {
        optionArray.push(this.renderActiveTimeSpanOption(index));
      } else {
        optionArray.push(this.renderTimeSpanOption(index));
      }
    }

    return optionArray;
  }

  renderActiveTimeSpanOption(index) {
    return (
      <View
        style={DashboardStyle.timeSpanButtonActive}
        key={index}
      >
        <Text
          style={[
            DashboardStyle.timeSpanButtonText,
            DashboardStyle.timeSpanButtonActiveText,
          ]}
        >
          {`${this.props.timeSpanOptions[index]} h`}
        </Text>
      </View>
    );
  }

  renderTimeSpanOption(index) {
    return (
      <TouchableHighlight
        key={index}
        underlayColor="#FFF"
        onPress={() => this.onTimeSpanSwitch(index)}
        style={DashboardStyle.timeSpanButton}
      >
        <Text style={DashboardStyle.timeSpanButtonText}>
          {`${this.props.timeSpanOptions[index]} h`}
        </Text>
      </TouchableHighlight>
    );
  }

  render() {
    return <View style={DashboardStyle.timeSpanBar}>{this.getOptionComponents()}</View>;
  }
}

TimeSpanBar.propTypes = {
  timeSpanOptions: PropTypes.array.isRequired,
  activeTimeSpanIndex: PropTypes.number.isRequired,
  onTimeSpanSwitch: PropTypes.func.isRequired,
};

export default TimeSpanBar;
