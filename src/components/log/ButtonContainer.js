import React from 'react';
import { PropTypes } from 'prop-types';
import { Text, View, TouchableHighlight } from 'react-native';
import * as commonCss from '../../styles/CommonStyles';

class ButtonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View>
        <TouchableHighlight
          style={commonCss.default.buttonView}
          underlayColor="#777"
          onPress={this.props.tapped}
        >
          <Text style={commonCss.default.buttontext}>{this.props.text}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

ButtonContainer.propTypes = {
  tapped: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
};

export default ButtonContainer;
