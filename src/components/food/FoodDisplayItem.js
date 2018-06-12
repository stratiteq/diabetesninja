import React from 'react';
import { View } from 'react-native';
import { PropTypes } from 'prop-types';
import { Text } from 'native-base';
import FoodStyle from '../../styles/FoodStyles';

class FoodDisplayItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <View style={FoodStyle.foodDisplayOuterView}>
        <View style={FoodStyle.foodDisplayInnerView}>
          <Text key={`food_l1_${this.props.itemkey}`}>{this.props.name}</Text>
          <Text note key={`food_l2_${this.props.itemkey}`}>
            {this.props.group}
          </Text>
        </View>
      </View>
    );
  }
}

FoodDisplayItem.propTypes = {
  itemkey: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  group: PropTypes.string.isRequired,
};

export default FoodDisplayItem;
