import React from 'react';
import { PropTypes } from 'prop-types';
import { List } from 'native-base';
import { View, RefreshControl } from 'react-native';
import EventRow from './EventRow';
import DashboardStyle from '../../styles/DashboardStyles';

class EventContainer extends React.Component {
  constructor(props) {
    super(props);

    this.openLogInfo = this.openLogInfo.bind(this);
    this.isDoubleTap = this.isDoubleTap.bind(this);
  }

  openLogInfo(item) {
    if (this.isDoubleTap()) return;

    this.props.navigator.push({
      title: item.date,
      screen: 'diabetesNinja.EventLogDetailsScreen',
      overrideBackPress: true,
      passProps: {
        userLogItem: item,
      },
    });
  }

  isDoubleTap() {
    const now = new Date().getTime();
    if (this.lastTap && now - this.lastTap < 1500) {
      return true;
    }

    this.lastTap = now;
    return false;
  }

  render() {
    return (
      <View style={DashboardStyle.eventContainer}>
        <List
          refreshControl={
            <RefreshControl
              tintColor="#888"
              colors={['#888']}
              refreshing={this.props.loading}
            />
          }
          dataArray={this.props.data}
          renderRow={item => (
            <EventRow item={item} openLogInfo={this.openLogInfo} />
          )}
        />
      </View>
    );
  }
}

EventContainer.defaultProps = {
  loading: false,
};

EventContainer.propTypes = {
  navigator: PropTypes.object.isRequired,
  loading: PropTypes.bool,
  data: PropTypes.array.isRequired,
};

export default EventContainer;
