import moment from 'moment';
import React from 'react';
import { PropTypes } from 'prop-types';
import { Dimensions, View, Platform } from 'react-native';
import { VictoryChart, VictoryAxis, VictoryLine, VictoryScatter } from 'victory-native';
import * as logTypeConst from '../../constants/logTypes';
import DashboardStyle from '../../styles/DashboardStyles';

const androidFix = Platform.OS === 'ios' ? 0 : 10;
const chartHeight = (Dimensions.get('window').height / 2) - androidFix;
const chartLabelDisplacement = Platform.OS === 'ios' ? 0 : -21;

class ChartBox extends React.Component {
  static getChartData(data) {
    const chartArray = [...data].map(bs => ({
      x: moment(bs.date).toDate(),
      y: bs.value,
    }));

    return chartArray;
  }

  static getStrictChartData(startDate, data) {
    if (!data || data.length === 0) {
      return [];
    }

    const newArray = [
      ...data.filter(item => moment(item.x) > moment(startDate)),
    ];

    return newArray;
  }

  shouldComponentUpdate(nextProps) {
    const willRender =
      this.userlogEntriesHasNewData(nextProps) ||
      this.externalDataEntriesHasNewData(nextProps);

    return willRender;
  }

  getExternalUserData() {
    if (
      !this.props.externalUserDataEntries ||
      this.props.externalUserDataEntries.length === 0
    ) {
      return [];
    }

    const yesterDay = moment(new Date()).add(-1, 'day');
    const result = [
      ...this.props.externalUserDataEntries.filter(event => moment(event.date) > yesterDay),
    ].map(dd => ({
      key: moment(dd.date).format('YYYYMMDDHHmmss'),
      date: dd.date,
      type: dd.logType,
      value: dd.value,
    }));

    return result;
  }

  getBloodSugarEvents() {
    const yesterday = moment(new Date()).add(-1, 'day');
    const entries = [
      ...this.props.userlogEntries.filter(entry =>
        moment(entry.date) > yesterday &&
        entry.logType === logTypeConst.LOGTYPE_BLOODGLUCOSE),
    ].map(bsEntry => ({
      key: moment(bsEntry.date).format('YYYYMMDDHHmmss'),
      date: bsEntry.date,
      type: bsEntry.logType,
      value: bsEntry.value,
    }));

    return entries;
  }

  userlogEntriesHasNewData(nextProps) {
    if (!nextProps.userlogEntries) return false;
    if (!nextProps.userlogEntries[0]) return false;

    if (
      this.props.userlogEntries.length === 0 &&
      nextProps.userlogEntries.length === 0
    ) {
      return false;
    }

    if (
      this.props.userlogEntries.length === 0 &&
      nextProps.userlogEntries.length !== 0
    ) {
      return true;
    }

    const hasNewData =
      nextProps.userlogEntries[0].date !== this.props.userlogEntries[0].date ||
      nextProps.timeRange !== this.props.timeRange;

    return hasNewData;
  }

  externalDataEntriesHasNewData(nextProps) {
    if (!nextProps.externalUserDataEntries) return false;
    if (!nextProps.externalUserDataEntries[0]) return false;

    if (
      this.props.externalUserDataEntries.length === 0 &&
      nextProps.externalUserDataEntries.length === 0
    ) {
      return false;
    }

    if (
      this.props.externalUserDataEntries.length === 0 &&
      nextProps.externalUserDataEntries.length !== 0
    ) {
      return true;
    }

    const hasNewData =
      nextProps.externalUserDataEntries[0].date !==
        this.props.externalUserDataEntries[0].date ||
      nextProps.timeRange !== this.props.timeRange;

    return hasNewData;
  }

  render() {
    const timeNow = new Date();
    const timeStart = moment(new Date())
      .add(-1 * this.props.timeRange, 'hour')
      .toDate();

    const chartData = ChartBox.getChartData(this.getBloodSugarEvents());
    const chartDataStrict = ChartBox.getStrictChartData(timeStart, chartData);

    const minBSChartData = [
      { x: timeStart, y: this.props.minBSValue },
      { x: timeNow, y: this.props.minBSValue },
    ];
    const maxBSChartData = [
      { x: timeStart, y: this.props.maxBSValue },
      { x: timeNow, y: this.props.maxBSValue },
    ];
    const externalUserChartData = ChartBox.getChartData(this.getExternalUserData());

    return (
      <View style={DashboardStyle.chartContainer}>
        <VictoryChart
          padding={{
            left: 35,
            right: 50,
            bottom: 50,
            top: 8,
          }}
          style={DashboardStyle.chart}
          height={chartHeight}
        >
          {externalUserChartData.length > 1 && (
            <VictoryLine
              domain={{
                x: [timeStart, timeNow],
                y: [0, 21],
              }}
              animate={{
                duration: 250,
                onLoad: { duration: 0 },
              }}
              style={{
                data: {
                  stroke: '#75B027',
                  strokeWidth: 2,
                  strokeLinecap: 'round',
                },
              }}
              data={externalUserChartData}
            />
          )}
          {chartData.length > 1 &&
            externalUserChartData.length === 0 && (
              <VictoryLine
                domain={{
                  x: [timeStart, timeNow],
                  y: [0, 21],
                }}
                animate={{
                  duration: 250,
                  onLoad: { duration: 0 },
                }}
                style={{
                  data: {
                    stroke: '#F792CC',
                    strokeWidth: 3,
                    strokeLinecap: 'round',
                  },
                }}
                data={chartData}
              />
            )}
          <VictoryLine
            domain={{
              x: [timeStart, timeNow],
              y: [0, 21],
            }}
            animate={{
              duration: 250,
              onLoad: { duration: 0 },
            }}
            style={{
              data: {
                stroke: '#7F0000',
                strokeWidth: 0.5,
                strokeLinecap: 'round',
                strokeDasharray: '5,5',
              },
            }}
            data={minBSChartData}
          />
          <VictoryLine
            domain={{
              x: [timeStart, timeNow],
              y: [0, 21],
            }}
            animate={{
              duration: 250,
              onLoad: { duration: 0 },
            }}
            style={{
              data: {
                stroke: '#0094FF',
                strokeWidth: 0.5,
                strokeDasharray: '5,5',
                strokeLinecap: 'round',
              },
            }}
            data={maxBSChartData}
          />
          {chartData.length > 0 && (
            <VictoryScatter
              domain={{
                x: [timeStart, timeNow],
                y: [0, 21],
              }}
              animate={{
                duration: 250,
                onLoad: { duration: 0 },
              }}
              size={5}
              style={{
                data: {
                  fill: '#F792CC',
                },
              }}
              data={chartDataStrict}
            />
          )}
          <VictoryAxis
            paddingLeft={100}
            scale={{ x: 'time' }}
            domain={[timeStart, timeNow]}
            tickFormat={x => moment(new Date(x).getTime()).format('HH:mm')}
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: {
                fontSize: 12,
              },
            }}
          />
          <VictoryAxis
            crossAxis
            dependentAxis
            offsetX={50}
            domain={[0, 21]}
            standalone
            orientation="right"
            style={{
              ticks: { stroke: 'grey', size: 5 },
              tickLabels: {
                fontSize: 12,
                dy: chartLabelDisplacement,
              },
            }}
          />
        </VictoryChart>
      </View>
    );
  }
}

ChartBox.defaultProps = {
  externalUserDataEntries: [],
};

ChartBox.propTypes = {
  userlogEntries: PropTypes.array.isRequired,
  timeRange: PropTypes.number.isRequired,
  externalUserDataEntries: PropTypes.array,
  minBSValue: PropTypes.number.isRequired,
  maxBSValue: PropTypes.number.isRequired,
};

export default ChartBox;
