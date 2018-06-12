import React from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { PropTypes } from 'prop-types';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    height: 40,
    flex: 1,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '300',
  },
  okButton: {
    backgroundColor: '#4776BE',
  },
  okButtonText: {
    color: '#FFF',
  },
  cancelButton: {
    backgroundColor: '#EFEFEF',
    marginLeft: 20,
  },
});

class DialogButtonContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={styles.buttonContainer}>
        <TouchableHighlight
          style={[styles.button, styles.okButton]}
          underlayColor="#777"
          onPress={this.props.onOKPressed}
        >
          <Text style={[styles.buttonText, styles.okButtonText]}>
            {this.props.OKButtonText}
          </Text>
        </TouchableHighlight>
        <TouchableHighlight
          style={[styles.button, styles.cancelButton]}
          underlayColor="#BBB"
          onPress={this.props.onCancelPressed}
        >
          <Text style={styles.buttonText}>{this.props.CancelButtonText}</Text>
        </TouchableHighlight>
      </View>
    );
  }
}

DialogButtonContainer.propTypes = {
  onOKPressed: PropTypes.func.isRequired,
  onCancelPressed: PropTypes.func.isRequired,
  OKButtonText: PropTypes.string.isRequired,
  CancelButtonText: PropTypes.string.isRequired,
};

export default DialogButtonContainer;
