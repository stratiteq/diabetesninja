import React from 'react';
import { PropTypes } from 'prop-types';
import { Body, Icon, Left, ListItem, Right, Text, Thumbnail } from 'native-base';
import * as images from '../../utils/FoodGroupImages';

class FoodDisplayItem extends React.Component {
  constructor(props) {
    super(props);

    this.onFoodGroupPress = this.onFoodGroupPress.bind(this);
  }

  onFoodGroupPress() {
    this.props.onFoodGroupPress(this.props.item);
  }

  render() {
    return (
      <ListItem icon onPress={this.onFoodGroupPress}>
        <Left>
          {this.props.item.foodGroupId === -1 &&
            <Thumbnail square small source={require('../../../img/foodicons/foodgroup--1.png')} />}
          {this.props.item.foodGroupId === -2 &&
            <Thumbnail square small source={require('../../../img/foodicons/foodgroup--1.png')} />}
          {this.props.item.foodGroupId > -1 &&
            <Thumbnail square small source={images.ImageFoodGroups[this.props.item.foodGroupId]} />}
        </Left>
        <Body>
          <Text>{this.props.item.name}</Text>
        </Body>
        <Right>
          <Icon name="arrow-forward" />
        </Right>
      </ListItem>
    );
  }
}

FoodDisplayItem.defaultProps = {
  onFoodGroupPress: null,
  item: null,
};

FoodDisplayItem.propTypes = {
  onFoodGroupPress: PropTypes.func,
  item: PropTypes.object,
};

export default FoodDisplayItem;
