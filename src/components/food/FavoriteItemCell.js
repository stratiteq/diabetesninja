import React from 'react';
import { PropTypes } from 'prop-types';
import { ListItem, Body, Button, Icon, Right, Text, View } from 'native-base';
import FoodStyle from '../../styles/FoodStyles';

class FavoriteItemCell extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

  render() {
    return (
      <ListItem onPress={() => this.props.itemTapped(this.props.item)}>
        <Body style={FoodStyle.body}>
          <View>
            <Text key={`food_l1_${this.props.item.key}`}>
              {this.props.item.name}
            </Text>
            {this.props.item.foodGroupName !== 'Övrigt' && (
              <Text note key={`food_l4_${this.props.item.key}`}>
                {this.props.item.carbEquivalent} KH
              </Text>
            )}
          </View>
        </Body>
        <Right>
          <Button info onPress={() => this.props.showInfoTapped(this.props.item)}>
            <Icon active name="information-circle" />
          </Button>
        </Right>
        <Right>
          <Button danger onPress={() => this.props.onDeleteFavorite(this.props.item)} >
            <Icon active name="trash" />
          </Button>
        </Right>
      </ListItem>
    );
  }
}

FavoriteItemCell.defaultProps = {
  showInfoTapped: null,
  onDeleteFavorite: null,
  itemTapped: null,
};

FavoriteItemCell.propTypes = {
  item: PropTypes.object.isRequired,
  showInfoTapped: PropTypes.func,
  onDeleteFavorite: PropTypes.func,
  itemTapped: PropTypes.func,
};

export default FavoriteItemCell;
