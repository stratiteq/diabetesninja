import React from 'react';
import { PropTypes } from 'prop-types';
import { Image, View } from 'react-native';
import MetricsBox from './MetricsBox';
import DashboardStyle from '../../styles/DashboardStyles';

class MetricsContainer extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <View style={DashboardStyle.mainMetricsContainer}>
        <Image
          style={DashboardStyle.mainMetricsContainerBackground}
          source={require('../../../img/Image_Abstract_UpsideDown.png')}
        />
        <MetricsBox
          loading={this.props.loadingBloodSugar}
          useDecimal
          metricsTitle="mmol/l"
          metricsValue={this.props.bloodSugarMetric}
          metricsTimestamp={this.props.bloodSugarMetricTimestamp}
          onPress={this.props.bloodSugarMetricPress}
          imageSrc={require('../../../img/Icon_Blood_Sugar.png')}
        />
        {this.props.externalUserDataMetric &&
          this.props.externalUserDataMetric !== '-.-' && (
            <MetricsBox
              loading={this.props.loadingBloodSugar}
              useDecimal
              metricsTitle="mmol/l"
              metricsValue={this.props.externalUserDataMetric}
              metricsTimestamp={this.props.externalUserDataMetricTimestamp}
              onPress={null}
              imageSrc={require('../../../img/dexcom-logo-small.png')}
            />
          )}
        <MetricsBox
          loading={this.props.loadingCarbs}
          useDecimal={false}
          metricsTitle="g KH"
          metricsValue={this.props.carbsMetric}
          metricsTimestamp={this.props.carbsMetricTimestamp}
          onPress={this.props.carbsMetricPress}
          imageSrc={require('../../../img/Icon_Carbohydrates.png')}
        />
      </View>
    );
  }
}

MetricsContainer.defaultProps = {
  loadingBloodSugar: false,
  loadingCarbs: false,
  bloodSugarMetric: null,
  bloodSugarMetricTimestamp: null,
  bloodSugarMetricPress: null,
  externalUserDataMetric: null,
  externalUserDataMetricTimestamp: null,
  carbsMetric: null,
  carbsMetricTimestamp: null,
  carbsMetricPress: null,
};

MetricsContainer.propTypes = {
  loadingBloodSugar: PropTypes.bool,
  loadingCarbs: PropTypes.bool,
  bloodSugarMetric: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  bloodSugarMetricTimestamp: PropTypes.string,
  bloodSugarMetricPress: PropTypes.func,
  externalUserDataMetric: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  externalUserDataMetricTimestamp: PropTypes.string,
  carbsMetric: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  carbsMetricTimestamp: PropTypes.string,
  carbsMetricPress: PropTypes.func,
};

export default MetricsContainer;
