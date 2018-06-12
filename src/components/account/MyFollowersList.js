import React from 'react';
import { View, FlatList, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import FollowerItem from '../account/FollowerItem';

class MyFollowersList extends React.Component {
  onPressItem = (user) => {
    this.props.removeFollower(user);
  };

  render() {
    return (
      <View>
        <FlatList
          data={this.props.followers}
          renderItem={({ item }) => (
            <FollowerItem
              key={`user-${item.userId}`}
              user={item}
              onPressItem={this.onPressItem}
            />
          )}
        />
        <ActivityIndicator style={{ opacity: this.props.loading ? 1 : 0 }} />
      </View>
    );
  }
}

MyFollowersList.defaultProps = {
  followers: [],
};

MyFollowersList.propTypes = {
  followers: PropTypes.array,
  removeFollower: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default MyFollowersList;
