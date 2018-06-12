import React from 'react';
import { PropTypes } from 'prop-types';
import { ListItem, Text, Left, Body, Right, Icon } from 'native-base';
import { Image } from 'react-native';
import DashboardStyle from '../../styles/DashboardStyles';

const bloodSugarImageSource = require('../../../img/Icon_Log_Blood_Sugar.png');
const mealImageSource = require('../../../img/Icon_Register_Food.png');

class EventRow extends React.PureComponent {
  constructor(props) {
    super(props);

    this.getIcon = this.getIcon.bind(this);
    this.openLogInfo = this.openLogInfo.bind(this);
  }

  getIcon() {
    if (this.props.item.type === 'BS') {
      return <Image source={bloodSugarImageSource} />;
    } else if (this.props.item.type === 'CH') {
      return <Image source={mealImageSource} />;
    }
    return <Icon style={DashboardStyle.iconClipBoard} name="clipboard" />;
  }

  openLogInfo(item) {
    this.props.openLogInfo(item);
  }

  render() {
    return (
      <ListItem
        icon
        onPress={() => { this.openLogInfo(this.props.item); }}
        key={this.props.item.date}
      >
        <Left style={{ width: 50 }}>{this.getIcon()}</Left>
        <Body>
          {this.props.item.type === 'LOG' &&
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={DashboardStyle.eventNoteText}
            >{this.props.item.value}
            </Text>}
          <Text>
            {this.props.item.type === 'LOG' ? '' : this.props.item.value}
            {this.props.item.type === 'CH' ? 'g KH' : ''}
          </Text>
        </Body>
        <Right>
          <Text note>{this.props.item.date}</Text>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}

EventRow.defaultProps = {
  item: null,
  openLogInfo: null,
};

EventRow.propTypes = {
  item: PropTypes.object,
  openLogInfo: PropTypes.func,
};

export default EventRow;
