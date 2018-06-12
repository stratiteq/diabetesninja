import React from 'react';
import { ListItem, Body, Button, Icon, Right, Text, View } from 'native-base';
import { PropTypes } from 'prop-types';
import FoodStyle from '../../styles/FoodStyles';

class MealDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.onTrash = this.onTrash.bind(this);
  }

  onTrash(key) {
    this.props.onTrash(key);
  }

  render() {
    return (
      <ListItem>
        <Body style={[FoodStyle.mealDisplayBody, {
          paddingLeft: this.props.isShowingFavDetails ? 0 : 25,
          }]}
        >
          <View>
            <Text key={`food_l1_${this.props.item.key}`}>
              {this.props.item.name}
            </Text>
            {this.props.item.foodGroupName !== 'Övrigt' && (
              <Text note key={`food_l2_${this.props.item.key}`}>
                {this.props.item.foodGroupName}
              </Text>
            )}
          </View>
          <View style={FoodStyle.mealDisplayRightBodyColumn}>
            {this.props.item.foodGroupName !== 'Övrigt' && (
              <Text key={`food_l3_${this.props.item.key}`}>
                {this.props.item.qty} {this.props.item.qtyUnit}
              </Text>
            )}
            <Text note key={`food_l4_${this.props.item.key}`}>
              {this.props.item.carbEquivalent} KH
            </Text>
          </View>
        </Body>
        {!this.props.isShowingFavDetails && (
        <Right>
          <Button danger onPress={() => this.onTrash(this.props.item.key)}>
            <Icon active name="trash" />
          </Button>
        </Right>
        )}
      </ListItem>
    );
  }
}

MealDisplay.defaultProps = {
  isShowingFavDetails: false,
  onTrash: null,
};

MealDisplay.propTypes = {
  item: PropTypes.object.isRequired,
  isShowingFavDetails: PropTypes.bool,
  onTrash: PropTypes.func,
};

export default MealDisplay;
