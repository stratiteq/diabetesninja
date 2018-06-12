import React from 'react';
import { Header, Item, Input, Icon, Button, Text } from 'native-base';
import { PropTypes } from 'prop-types';

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.fetchResults = this.fetchResults.bind(this);
  }

  fetchResults() {
    this.props.onFind(this.state.searchText);
  }

  render() {
    return (
      <Header searchBar rounded>
        <Item>
          <Icon name="ios-search" />
          <Input
            placeholder="Sök"
            clearButtonMode="always"
            onChangeText={(textEntry) => {
              this.setState({ searchText: textEntry });
            }}
            onSubmitEditing={this.fetchResults}
          />
          <Icon name="nutrition" />
        </Item>
        <Button onPress={this.fetchResults} transparent>
          <Text>Sök</Text>
        </Button>
      </Header>
    );
  }
}

SearchBox.propTypes = {
  onFind: PropTypes.func.isRequired,
};

export default SearchBox;
