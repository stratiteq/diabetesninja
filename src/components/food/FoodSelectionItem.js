import React from 'react';
import { ListItem, Body, Text, View } from 'native-base';
import { PropTypes } from 'prop-types';

class FoodSelectionItem extends React.Component {
  constructor(props) {
    super(props);

    this.onFoodSelected = this.onFoodSelected.bind(this);
  }

  onFoodSelected() {
    this.props.onFoodSelected(this.props.item);
  }

  render() {
    return (
      <ListItem onPress={this.onFoodSelected}>
        <Body>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text key={`food_l1_${this.props.item.key}`}>
              {this.props.item.name}
            </Text>
            <Text note key={`food_l2_${this.props.item.key}`}>
              {this.props.item.foodGroupName}
            </Text>
          </View>
        </Body>
      </ListItem>
    );
  }
}

FoodSelectionItem.propTypes = {
  onFoodSelected: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
};

export default FoodSelectionItem;
