import React from 'react';
import PropTypes from 'prop-types';
import { Keyboard, StyleSheet, View, Modal, Image, Text } from 'react-native';
import { Container, List, Spinner } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import SearchBox from '../components/SearchBox';
import * as navigatorStyles from '../styles/NavigatorStyles';
import * as foodActions from '../redux/food/actions';
import FoodSelectionItem from '../components/food/FoodSelectionItem';
import ModalQtySelector from '../components/food/ModalQtySelector';
import FoodSearcher from '../utils/FoodSearcher';
import FoodGroupItem from '../components/food/FoodGroupItem';
import ListFoodByGroup from '../components/food/ListFoodByGroup';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});

class AddFoodScreen extends React.Component {
  static navigatorStyle = {
    ...navigatorStyles.default,
    drawUnderNavBar: false,
  };

  constructor(props) {
    super(props);

    this.state = {
      searching: false,
      currentSearchText: '',
      foods: [],
      modalVisible: false,
      foodListModalVisible: false,
      selectedFood: null,
      selectedFoodGroup: null,
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
    this.onFind = this.onFind.bind(this);
    this.onAddFood = this.onAddFood.bind(this);
    this.onCancelModal = this.onCancelModal.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.onSubmitFood = this.onSubmitFood.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.renderList = this.renderList.bind(this);
    this.onFoodGroupPress = this.onFoodGroupPress.bind(this);
    this.onFoodGroupModalSelect = this.onFoodGroupModalSelect.bind(this);
    this.onFoodGroupModalCancel = this.onFoodGroupModalCancel.bind(this);
    this.popBackToLog = this.popBackToLog.bind(this);
  }

  componentWillMount() {
    this.props.foodActions.getFoodGroups();
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'backPress':
        this.props.navigator.pop();
        break;
      default:
        break;
    }
  }

  onFind(text) {
    Keyboard.dismiss();
    this.setState({
      searching: true,
      currentSearchText: text,
    });

    if (text.length === 0) {
      this.setState({
        foods: [],
        searching: false,
      });
    } else {
      FoodSearcher.SearchArticles(text, (resp) => {
        this.setState({
          foods: resp.results,
          searching: false,
        });
      });
    }
  }

  onFoodGroupPress(item) {
    this.setState({
      selectedFoodGroup: item,
    });

    this.toggleFoodListModal(true);
  }

  onFoodGroupModalSelect(item) {
    this.setState({ selectedFood: item });
    this.toggleFoodListModal(false);
    this.toggleModal(true);
  }

  onFoodGroupModalCancel() {
    this.toggleFoodListModal(false);
  }

  onSubmitFood() {
    this.toggleModal(false);
    this.props.navigator.pop();
  }

  onCancelModal() {
    this.toggleModal(false);
  }

  onAddFood(item) {
    this.setState({ selectedFood: item });
    this.toggleModal(true);
  }

  toggleModal(visible) {
    this.setState({ modalVisible: visible });
  }

  toggleFoodListModal(visible) {
    this.setState({ foodListModalVisible: visible });
  }

  popBackToLog() {
    this.props.navigator.pop();
  }

  renderLoading() {
    return (
      <Spinner color="#5786CE" style={{ marginTop: 50 }} />
    );
  }

  renderList() {
    if (this.state.foods.length === 0 && this.state.currentSearchText.length > 0) {
      return (
        <Container>
          <View style={{
              flex: 1,
              padding: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Image
              source={require('../../img/noDataSearch.png')}
              style={{
                width: 200,
                height: 200,
                resizeMode: Image.resizeMode.contain,
                marginBottom: 20,
              }}
            />

            <Text
              style={{
                textAlignVertical: 'center',
                fontWeight: 'bold',
                fontSize: 20,
                color: '#696969',
              }}
            >Hittade inget...
            </Text>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 15,
                marginTop: 5,
                marginBottom: 60,
                color: '#A8A8A8',
              }}
            >Din sökning gav inga resultat, saknar du en måltid?
            Du tipsar enklast genom att gå med i vår facebookgrupp som heter samma som appen.
            </Text>
          </View>
        </Container>
      );
    }
    if (this.state.foods.length === 0) {
      return this.renderFoodGroup();
    }

    return (
      <Container>
        <List
          dataArray={
            this.state.currentSearchText === ''
              ? this.props.food.popularFoodList
              : this.state.foods
          }
          renderRow={this.renderFoodSelectionLine}
          keyExtractor={this.foodKeyExtractor}
        />
      </Container>
    );
  }

  renderFoodGroup() {
    return (
      <Container>
        <List
          dataArray={this.props.food.foodGroupList}
          renderRow={this.renderFoodGroupItem}
        />
      </Container>
    );
  }

  renderFoodSelectionLine = item => (
    <FoodSelectionItem
      imageurl={item.imageurl}
      itemkey={item.key}
      name={item.name}
      group={item.group}
      onFoodSelected={this.onAddFood}
      item={item}
    />
  );

  renderFoodGroupItem = item => (
    <FoodGroupItem item={item} onFoodGroupPress={this.onFoodGroupPress} />
  );

  render() {
    return (
      <View style={styles.container}>
        <SearchBox onFind={this.onFind} buttonSize={50} />
        {this.state.searching ? this.renderLoading() : this.renderList()}

        <Modal
          animationType="slide"
          transparent
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.toggleModal(false);
          }}
        >
          <ModalQtySelector
            selectedFood={this.state.selectedFood}
            onSubmitModal={this.onSubmitFood}
            onCancelModal={this.onCancelModal}
          />
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.foodListModalVisible}
          onRequestClose={() => {
            this.toggleFoodListModal(false);
          }}
        >
          <ListFoodByGroup
            foodGroup={this.state.selectedFoodGroup}
            onSelect={this.onFoodGroupModalSelect}
            onCancel={this.onFoodGroupModalCancel}
            popBackToLog={this.popBackToLog}
          />
        </Modal>
      </View>
    );
  }
}

AddFoodScreen.defaultProps = {
  foodActions: null,
  food: null,
};

AddFoodScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
  foodActions: PropTypes.object,
  food: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    food: state.food,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    foodActions: bindActionCreators(foodActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AddFoodScreen);
