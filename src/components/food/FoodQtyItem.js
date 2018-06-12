import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { PropTypes } from 'prop-types';
import FoodStyle from '../../styles/FoodStyles';

class FoodQtyItem extends React.Component {
  constructor(props) {
    super(props);

    this.onSetQty = this.onSetQty.bind(this);
  }

  onSetQty() {
    this.props.onSetQty(this.props.item);
  }

  render() {
    let qtyKey = this.props.item.value.toString();
    qtyKey = qtyKey.replace('.', '_');

    return (
      <TouchableOpacity
        style={FoodStyle.foodQtycontainer}
        key={`btnqty_${qtyKey}`}
        onPress={this.onSetQty}
      >
        <View
          style={[
            FoodStyle.foodQtyInnerView,
            {
              backgroundColor: this.props.isSelected ? '#5786CE' : '#FFF',
            },
          ]}
          key={`viewqty_${qtyKey}`}
        >
          <Text
            key={`textqty_${qtyKey}`}
            style={[
              FoodStyle.foodQtyText,
              {
                color: this.props.isSelected ? '#FFF' : '#5786CE',
              },
            ]}
          >
            {this.props.item.value.toString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  }
}

FoodQtyItem.defaultProps = {
  isSelected: false,
};

FoodQtyItem.propTypes = {
  onSetQty: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  isSelected: PropTypes.bool,
};

export default FoodQtyItem;
