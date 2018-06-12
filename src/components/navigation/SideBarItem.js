import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { Body, Icon, Left, ListItem, Right } from 'native-base';
import * as navigatorStyles from '../../styles/NavigatorStyles';

class SideBarItem extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.state = {
    };

    this.onItemPress = this.onItemPress.bind(this);
  }

  onItemPress() {
    this.props.onItemPress();
  }

  render() {
    return (
      <ListItem drawer-toggle icon onPress={this.onItemPress}>
        <Left>
          <Icon name={this.props.icon} />
        </Left>
        <Body>
          <Text style={{ fontWeight: this.props.currentTab === this.props.tabName ? 'bold' : 'normal' }}>
            {this.props.title}
          </Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}

SideBarItem.propTypes = {
  title: PropTypes.string.isRequired,
  currentTab: PropTypes.string.isRequired,
  tabName: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  onItemPress: PropTypes.func.isRequired,
};

export default SideBarItem;
