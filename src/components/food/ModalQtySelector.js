import React from 'react';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Keyboard, TextInput, View, TouchableHighlight } from 'react-native';
import { Button, Header, Left, Icon, Body, Title, Tab, Tabs, Text, Right } from 'native-base';
import * as commonCss from '../../styles/CommonStyles';
import FoodQtyItem from './FoodQtyItem';
import * as mealActions from '../../redux/meal/actions';
import FoodStyle from '../../styles/FoodStyles';

class ModalQtySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isGramMode: false,
      manualCarbEntry: '100',
      calculatedCarbs: this.safeCalculatedCarbs('100'),
      chosenOption: {
        value: 0,
        carbEquivalent: 0,
      },
    };

    this.safeParseTextToFloat = this.safeParseTextToFloat.bind(this);
    this.safeCalculatedCarbs = this.safeCalculatedCarbs.bind(this);
    this.onChangeTab = this.onChangeTab.bind(this);
    this.onOKPressed = this.onOKPressed.bind(this);
    this.onCancelPressed = this.onCancelPressed.bind(this);
  }

  componentWillMount() {
    if (this.props.selectedFood.unitName === 'none') {
      this.setState({
        isGramMode: true,
      });
    }
  }

  onOKPressed() {
    if (
      this.state.isGramMode &&
      this.safeParseTextToFloat(this.state.manualCarbEntry) <= 0
    ) {
      // this.showErrorFor5Seconds('Du måste skriva ett nummer större än 0');
    } else if (!this.state.isGramMode && this.state.chosenOption.value === 0) {
      // this.showErrorFor5Seconds(
      //   `Du måste välja ${this.props.selectedFood.unitName}`
      // );
    } else {
      const payload = {
        isGramMode: this.state.isGramMode,
        foodId: this.props.selectedFood.key,
        name: this.props.selectedFood.name,
        foodGroupId: this.props.selectedFood.foodGroupId,
        foodGroupName: this.props.selectedFood.foodGroupName,
        imageurl: this.props.selectedFood.imageurl,
        qty: this.state.isGramMode
          ? parseFloat(this.state.manualCarbEntry)
          : this.state.chosenOption.value,
        qtyUnit: this.state.isGramMode
          ? 'Gram'
          : this.props.selectedFood.unitName,
        carbEquivalent: this.state.isGramMode
          ? this.state.calculatedCarbs
          : Math.ceil(this.state.chosenOption.carbEquivalent, 0),
      };

      this.props.mealActions.addCarbToMeal(payload);
      this.props.onSubmitModal();
    }
  }

  onCancelPressed() {
    this.props.onCancelModal();
  }

  onChangeTab(tabIndex) {
    this.setState({
      isGramMode:
        tabIndex.i === 1 || this.props.selectedFood.unitName === 'none',
    });
    Keyboard.dismiss();
  }

  setQty(chosenQty) {
    const chosenOption = chosenQty;
    chosenOption.carbEquivalent = Math.ceil(chosenOption.carbEquivalent, 0);

    this.setState({
      chosenOption,
    });
  }


  safeParseTextToFloat(text) {
    const floatVal = parseFloat(text);
    if (!Number.isNaN(floatVal)) return floatVal;
    return 0;
  }

  safeCalculatedCarbs(inputCarbs) {
    const numCarbs = parseFloat(inputCarbs);
    if (!Number.isNaN(numCarbs)) {
      if (this.props.selectedFood.gramCarbs !== null) {
        return Math.round(numCarbs * this.props.selectedFood.gramCarbs, 0);
      }
    }
    return 0;
  }

  render() {
    if (!this.state.chosenOption.value) {
      this.state.chosenOption = {
        ...this.state.chosenOption,
        value: this.props.selectedFood.foodQty[1].value,
        carbEquivalent: Math.ceil(
          this.props.selectedFood.foodQty[1].carbEquivalent,
          0,
        ),
      };
    }

    const optionsList = this.props.selectedFood.foodQty.map(data => (
      <FoodQtyItem
        onSetQty={qty => this.setQty(qty)}
        isSelected={this.state.chosenOption.value === data.value}
        item={data}
        key={`fqi_${data.value.toString().replace('.', '_')}`}
      />
    ));

    return (
      <View style={FoodStyle.modalQtySelectorModal}>
        <Header style={FoodStyle.modalQtySelectorModalHeader}>
          <Left>
            <Button transparent onPress={this.onCancelPressed}>
              <Icon name="md-close" style={FoodStyle.modalQtySelectorModalCloseIcon} />
            </Button>
          </Left>
          <Body>
            <Title style={FoodStyle.modalQtySelectorModalTitle}>Ange mängd</Title>
          </Body>
          <Right />
        </Header>
        <Text style={FoodStyle.modalQtySelectorHeader}>{this.props.selectedFood.name}</Text>
        <Text style={FoodStyle.modalQtySelectorDescription}>
          Ange mängd eller välj hur mycket livsmedlet väger i gram.
        </Text>

        <Tabs
          tabBarUnderlineStyle={FoodStyle.modalQtySelectorTabBarUnderlineStyle}
          initialPage={0}
          onChangeTab={i => this.onChangeTab(i)}
        >
          {this.props.selectedFood.unitName !== 'none' && (
            <Tab
              heading={this.props.selectedFood.unitName}
              activeTextStyle={FoodStyle.modalQtySelectorActiveTextStyle}
            >
              <View style={FoodStyle.modalQtySelectorTabContent}>
                <View style={FoodStyle.modalQtySelectorQuantityContainer}>
                  <View style={FoodStyle.modalQtySelectorWrappableQtyContainer}>
                    {optionsList.slice(0, 3)}
                  </View>
                  <View style={FoodStyle.modalQtySelectorWrappableQtyContainer}>
                    {optionsList.slice(3)}
                  </View>
                </View>

                <Text style={FoodStyle.modalQtySelectorWrappableQtyText}>
                  {this.state.chosenOption.value}{' '}
                  {this.props.selectedFood.unitName}
                  {' = '}
                  {this.state.chosenOption.carbEquivalent}
                  {'g KH'}
                </Text>

                <TouchableHighlight
                  style={[commonCss.default.buttonView, FoodStyle.modalQtySelectorButton]}
                  underlayColor="#777"
                  onPress={this.onOKPressed}
                >
                  <Text style={commonCss.default.buttontext}>Lägg till</Text>
                </TouchableHighlight>
              </View>
            </Tab>
          )}
          {this.props.selectedFood.gramCarbs !== 0 && (
            <Tab
              heading="Gram"
              activeTextStyle={FoodStyle.modalQtySelectorActiveTextStyle}
            >
              <View style={FoodStyle.modalQtySelectorTabContent}>
                <TextInput
                  style={FoodStyle.modalQtySelectorInputCommon}
                  keyboardType="numeric"
                  autoFocus
                  selectTextOnFocus
                  multiline={false}
                  maxLength={5}
                  underlineColorAndroid="#00000000"
                  textAlign="center"
                  value={this.state.manualCarbEntry}
                  onChangeText={(textEntry) => {
                    this.setState({
                      manualCarbEntry: textEntry,
                      calculatedCarbs: this.safeCalculatedCarbs(textEntry),
                    });
                  }}
                />
                <Text style={FoodStyle.modalQtySelectorWrappableQtyText}>
                  {this.state.manualCarbEntry}
                  {' gram = '}
                  {this.state.calculatedCarbs}
                  {'g KH'}
                </Text>
                <TouchableHighlight
                  style={[commonCss.default.buttonView, FoodStyle.modalQtySelectorButton]}
                  underlayColor="#777"
                  onPress={this.onOKPressed}
                >
                  <Text style={commonCss.default.buttontext}>Lägg till</Text>
                </TouchableHighlight>
              </View>
            </Tab>
          )}
        </Tabs>
      </View>
    );
  }
}

ModalQtySelector.defaultProps = {
  mealActions: null,
  selectedFood: null,
};

ModalQtySelector.propTypes = {
  mealActions: PropTypes.object,
  onSubmitModal: PropTypes.func.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  selectedFood: PropTypes.object,
};

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    mealActions: bindActionCreators(mealActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ModalQtySelector);

