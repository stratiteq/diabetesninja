import React from 'react';
import { StyleSheet, Image } from 'react-native';

const styles = StyleSheet.create({
  bottomGraphic: {
    position: 'absolute',
    width: '150%',
    alignSelf: 'flex-end',
  },
});

class BottomGraphic extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <Image
        style={styles.bottomGraphic}
        source={require('../../img/Image_Abstract.png')}
      />
    );
  }
}

export default BottomGraphic;
