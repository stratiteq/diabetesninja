import React from 'react';
import { PropTypes } from 'prop-types';
import { View, Text, Image, FlatList, Alert } from 'react-native';
import { Body, Button, Content, Container, Header, Icon, Left, List, Right, Spinner, Title } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { isIphoneX } from 'react-native-iphone-x-helper';
import PopupDialog, { DialogTitle } from 'react-native-popup-dialog';
import * as foodActions from '../../redux/food/actions';
import * as mealActions from '../../redux/meal/actions';
import FoodSelectionItem from './FoodSelectionItem';
import * as commonCss from '../../styles/CommonStyles';
import FavoriteItemCell from './FavoriteItemCell';
import MealDisplay from './MealDisplay';
import FoodStyle from '../../styles/FoodStyles';

class ListFoodByGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      foodByGroup: false,
      showFavorites: false,
      favoriteItem: null,
    };

    this.onAddFood = this.onAddFood.bind(this);
    this.renderFavoriteList = this.renderFavoriteList.bind(this);
    this.renderFavoriteRow = this.renderFavoriteRow.bind(this);
    this.addFavorite = this.addFavorite.bind(this);
    this.onDeleteFavorite = this.onDeleteFavorite.bind(this);
    this.showInfo = this.showInfo.bind(this);
  }

  componentWillMount() {
    if (this.props.foodGroup.foodGroupId === -1) {
      this.setState({
        foodByGroup: false,
        showFavorites: true,
      });
      this.props.foodActions.getFavoriteFood();
    } else if (this.props.foodGroup.foodGroupId === -2) {
      this.setState({
        foodByGroup: false,
      });
      this.props.foodActions.getPopularFood();
    } else {
      this.setState({
        foodByGroup: true,
      });
      this.props.foodActions.getFoodByFoodGroupId(this.props.foodGroup.foodGroupId);
    }
  }

  onDeleteFavorite(item) {
    Alert.alert(
      'Ta bort favorit',
      'Är du säker?',
      [{ text: 'Ja', onPress: () => this.props.foodActions.deleteFavorite(item) }, { text: 'Nej' }],
      { cancelable: true },
    );
  }

  onAddFood(item) {
    this.props.onSelect(item);
  }

  addFavorite(item) {
    item.foods.forEach((favorite) => {
      this.props.mealActions.addCarbToMeal(favorite);
    });

    this.props.popBackToLog();
  }

  showInfo(item) {
    this.setState({ favoriteItem: item });
    this.popupDialog.show();
  }

  renderFavoriteRow(item) {
    return (
      <FavoriteItemCell
        imageurl={item.imageurl}
        itemkey={item.key}
        name={item.name}
        group={item.group}
        itemTapped={this.addFavorite}
        showInfoTapped={this.showInfo}
        onDeleteFavorite={this.onDeleteFavorite}
        item={item}
      />
    );
  }

  renderFoodSelectionLine = (item) => {
    return (
      <FoodSelectionItem
        imageurl={item.imageurl}
        itemkey={item.key}
        name={item.name}
        group={item.group}
        onFoodSelected={this.onAddFood}
        item={item}
      />
    );
  };

  renderFavoriteList() {
    const isX = isIphoneX;
    return (
      <Container>
        <Header style={commonCss.CommonStyles.modalHeader}>
          <Left>
            <Button transparent onPress={this.props.onCancel}>
              <Icon
                name="arrow-back"
                style={commonCss.CommonStyles.modalIcon}
              />
            </Button>
          </Left>
          <Body>
            <Title style={commonCss.CommonStyles.modalTitle}>
              {this.props.foodGroup.name}
            </Title>
          </Body>
          <Right />
        </Header>
        <Content contentContainerStyle={{ flexGrow: 1 }}>
          {this.props.food.favoriteFoodList.length > 0 && (
            <List
              dataArray={this.props.food.favoriteFoodList}
              renderRow={this.renderFavoriteRow}
            />
          )}
          {this.props.food.favoriteFoodList.length === 0 && (
            <View style={FoodStyle.noDataContainer}>
              <Image
                source={require('../../../img/noData.png')}
                style={{
                  width: 200,
                  height: 200,
                  resizeMode: Image.resizeMode.contain,
                  marginBottom: 20,
                }}
              />
              <Text style={FoodStyle.noDataTitle}>Du har inga favoriter ännu</Text>
              <Text style={FoodStyle.noDataDescription}>
                Skapa en favorit genom att lägga till måltider,
                tryck därefter på "SPARA SOM FAVORIT" och ge din favorit ett namn.
              </Text>
            </View>
          )}

          <PopupDialog
            dialogTitle={
              <DialogTitle
                titleStyle={{ backgroundColor: '#5786CE' }}
                titleTextStyle={{ color: '#FFF', fontWeight: 'bold' }}
                title={this.state.favoriteItem == null ? '' : this.state.favoriteItem.name}
              />
            }
            dialogStyle={{ transform: [{ translateY: isX() ? -70 : -60 }] }}
            height={0.5}
            width={0.9}
            ref={(popupDialog) => {
              this.popupDialog = popupDialog;
            }}
          >
            <View style={{ flex: 1 }}>
              <FlatList
                data={this.state.favoriteItem == null ? null : this.state.favoriteItem.foods}
                renderItem={({ item }) => (
                  <MealDisplay
                    isShowingFavDetails
                    item={item}
                    onTrash={() => this.onTrash(item.key)}
                  />
                )}
              />
            </View>
          </PopupDialog>
        </Content>
      </Container>
    );
  }

  render() {
    if (this.state.showFavorites) {
      return this.renderFavoriteList();
    }

    const foodList = this.state.foodByGroup
      ? this.props.food.foodList
      : this.props.food.popularFoodList;

    return (
      <Container>
        <Header style={commonCss.CommonStyles.modalHeader}>
          <Left>
            <Button transparent onPress={this.props.onCancel}>
              <Icon
                name="arrow-back"
                style={commonCss.CommonStyles.modalIcon}
              />
            </Button>
          </Left>
          <Body>
            <Title style={commonCss.CommonStyles.modalTitle}>
              {this.props.foodGroup.name}
            </Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {foodList.length === 0 && (
            <Spinner color="#5786CE" style={{ marginTop: 50 }} />
          )}

          {foodList.length !== 0 && (
            <List
              dataArray={foodList}
              renderRow={this.renderFoodSelectionLine}
              keyExtractor={this.foodKeyExtractor}
            />
          )}
        </Content>
      </Container>
    );
  }
}

ListFoodByGroup.defaultProps = {
  foodActions: null,
  mealActions: null,
  food: null,
  foodGroup: null,
  onCancel: null,
  popBackToLog: null,
  onSelect: null,
};

ListFoodByGroup.propTypes = {
  foodActions: PropTypes.object,
  mealActions: PropTypes.object,
  food: PropTypes.object,
  foodGroup: PropTypes.object,
  onCancel: PropTypes.func,
  popBackToLog: PropTypes.func,
  onSelect: PropTypes.func,
};

function mapStateToProps(state) {
  return {
    food: state.food,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    foodActions: bindActionCreators(foodActions, dispatch),
    mealActions: bindActionCreators(mealActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ListFoodByGroup);
