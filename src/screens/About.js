import React from 'react';
import { PropTypes } from 'prop-types';
import { StyleSheet, ScrollView, Linking } from 'react-native';
import { Text } from 'native-base';
import * as navigatorStyles from '../styles/NavigatorStyles';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: '#FFF',
    padding: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5,
  },
  breadText: {
    color: '#333',
    fontSize: 16,
    paddingBottom: 20,
  },
});

// eslint-disable-next-line import/no-unresolved
const menuIcon = require('../../img/ic_menu_white.png');

class About extends React.Component {
  static navigatorStyle = navigatorStyles.default;
  static navigatorButtons = {
    leftButtons: [
      {
        id: 'menu',
        icon: menuIcon,
      },
    ],
  };
  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case 'menu':
        this.props.navigator.toggleDrawer({
          side: 'left',
          passProps: {},
        });
        break;
      default:
        // Do nothing
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        {/* eslint-disable-next-line unexpected_char_a */}
        <Text style={styles.headerText}>Vad är DiabetesNinja?</Text>
        <Text style={styles.breadText} note>
          Ninja är ett japanskt ord och kan översättas till ”dold person”. Det
          kan också tolkas som ”en person som uthärdar” eller ”en person som
          döljer” (underförstått sitt lidande). För en diabetiker är det ett
          positivt begrepp, som visar styrka och kraft.
        </Text>
        <Text style={styles.headerText}>Forget Foundation</Text>
        <Text style={styles.breadText} note>
          Insamlingsstiftelsen Forget Foundation har möjliggjort utveckling av
          appen DiabetesNinja genom en donation. Forget Foundation har som
          ändamål att stödja projekt till förmån för människors hälsa och bättre
          liv och driver sedan våren 2017 insamlingen Forget Diabetes till
          förmån för forskning och utveckling av ett läkemedel mot typ
          2-diabetes. Arbetet med insamlingen har givit stiftelsen en inblick i
          de svårigheter och utmaningar som diabetesdrabbade och deras anhöriga
          dagligen möter, oavsett form av diabetes. Läs mer på <Text note style={[styles.breadText, { color: 'blue' }]} onPress={() => Linking.openURL('http://www.forget.se')}>www.forget.se</Text>.
        </Text>
        <Text style={styles.headerText}>
          Föreningen Farföräldrar med vänner mot barndiabetes
        </Text>
        <Text style={styles.breadText} note>
          Några engagerade farföräldrar med vänner beslöt sig för att bilda
          ”Föreningen Farföräldrar med vänner mot barndiabetes” och söka bidrag
          till utvecklingen av appen DiabetesNinja. Föreningen bildades hösten
          2017 och har som syfte och mål att bedriva ideell verksamhet genom att
          stödja barn med typ1-diabetes samt deras anhöriga med särskild
          målsättning att utveckla och äga en diabetesapp (målet är dock inte
          att vara långsiktig ägare).
        </Text>
        <Text style={styles.headerText}>
          Användarvillkor
        </Text>
        <Text style={styles.breadText} note>
          Användarvillkor för DiabetesNinja hittar du på <Text note style={[styles.breadText, { color: 'blue' }]} onPress={() => Linking.openURL('http://www.diabetesninja.se/privacy')}>diabetesninja.se/privacy</Text>.
        </Text>
      </ScrollView>
    );
  }
}

About.propTypes = {
  navigator: PropTypes.object.isRequired,
};


export default About;
