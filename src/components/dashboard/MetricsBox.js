import React from 'react';
import { PropTypes } from 'prop-types';
import { Image, Text, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as formatting from '../../utils/formatting';
import DashboardStyle from '../../styles/DashboardStyles';

class MetricsBox extends React.Component {
  static getFormattedMetricsValue(useDecimal, metricsValue) {
    if (!metricsValue) {
      return '---';
    }
    if (useDecimal) {
      return formatting.toDecimalString(metricsValue);
    }
    return metricsValue.toString();
  }

  constructor(props) {
    super(props);

    this.onMetricBoxPress = this.onMetricBoxPress.bind(this);
  }

  onMetricBoxPress() {
    if (this.props.onPress) {
      this.props.onPress();
    }
  }

  renderLoading() {
    return (
      <ActivityIndicator
        color={this.props.textGrayed ? '#CCC' : '#888'}
        size="large"
        style={{ marginTop: 10 }}
      />
    );
  }

  renderValue() {
    return (
      <Text
        style={[
          DashboardStyle.metricsValue,
          !this.props.textGrayed ? DashboardStyle.blackText : DashboardStyle.grayText,
          { fontSize: this.props.small ? 20 : 30 },
        ]}
      >
        {MetricsBox.getFormattedMetricsValue(
          this.props.useDecimal,
          this.props.metricsValue,
        )}
      </Text>
    );
  }

  render() {
    return (
      <View style={DashboardStyle.metricsBox}>
        <TouchableOpacity
          style={DashboardStyle.metricsButton}
          onPress={this.onMetricBoxPress}
        >
          {this.props.imageSrc && <Image source={this.props.imageSrc} />}

          {this.props.loading ? this.renderLoading() : this.renderValue()}

          <Text
            style={[
              DashboardStyle.metricsTitle,
              !this.props.textGrayed ? DashboardStyle.blackText : DashboardStyle.grayText,
              { fontSize: this.props.small ? 14 : 18 },
            ]}
          >
            {this.props.metricsTitle}
          </Text>

          {this.props.metricsTimestamp !== null && (
            <Text
              style={[
                DashboardStyle.metricsTimestamp,
                !this.props.textGrayed ? DashboardStyle.blackText : DashboardStyle.grayText,
              ]}
            >
              {this.props.metricsTimestamp}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

MetricsBox.defaultProps = {
  textGrayed: false,
  metricsValue: null,
  metricsTimestamp: '',
  loading: false,
  imageSrc: null,
  onPress: null,
  small: false,
};

MetricsBox.propTypes = {
  imageSrc: PropTypes.number,
  useDecimal: PropTypes.bool.isRequired,
  textGrayed: PropTypes.bool,
  loading: PropTypes.bool,
  metricsValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  metricsTitle: PropTypes.string.isRequired,
  metricsTimestamp: PropTypes.string,
  onPress: PropTypes.func,
  small: PropTypes.bool,
};

export default MetricsBox;
