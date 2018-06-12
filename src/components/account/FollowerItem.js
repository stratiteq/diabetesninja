import React from 'react';
import { Text, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { Button, Icon, ListItem, Right, Body } from 'native-base';

const styles = StyleSheet.create({
  nameLabel: {
    fontSize: 20,
  },
});

class FollowerItem extends React.PureComponent {
  onPress = () => {
    this.props.onPressItem(this.props.user);
  };

  render() {
    return (
      <ListItem>
        <Body>
          <Text style={styles.nameLabel}>{this.props.user.firstName}</Text>
        </Body>
        <Right>
          <Button danger onPress={this.onPress} >
            <Icon active name="trash" />
          </Button>
        </Right>
      </ListItem>
    );
  }
}

FollowerItem.propTypes = {
  user: PropTypes.object.isRequired,
  onPressItem: PropTypes.func.isRequired,
};

export default FollowerItem;
