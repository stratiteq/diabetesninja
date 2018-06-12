import React from 'react';
import { PropTypes } from 'prop-types';
import { StyleSheet, ScrollView } from 'react-native';
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

class AboutDiabetesScreen extends React.Component {
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
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.headerText}>Vad är egentligen diabetes?</Text>
        <Text style={styles.breadText} note>
          Det finns olika typer av diabetes. Alla har de en sak gemensamt -
          blodsockret blir för högt. Kroppens celler behöver socker som näring
          för att kunna arbeta. Vid diabetes kommer sockret inte in i cellerna
          utan stannar i blodet. Cellerna svälter och du börjar må dåligt. Det
          höga sockret i blodet gör så att du kissar och dricker mycket.
        </Text>
        <Text style={styles.breadText} note>
          Nästan alla barn som får diabetes får sk typ 1-diabetes. Vid denna typ
          har man brist på hormonet insulin. Insulin är nödvändigt för att
          sockret ska kunna ta sig in i kroppens celler, man kan likna det med
          den nyckel som låser upp cellerna för sockret.
        </Text>
        <Text style={styles.breadText} note>
          Vid typ-1 diabetes har kroppens immunförsvar - som har till uppgift
          att försvara dig mot virus och bakterier - av någon anledning börjat
          förstöra de celler i din kropp som kallas betaceller och som har till
          uppgift att tillverka insulin. Till slut har man så lite insulin kvar
          att man får diabetes.
        </Text>
        <Text style={styles.headerText}>
          Målvärden för din diabetesbehandling
        </Text>
        <Text style={styles.breadText} note>
          HbA1c (Blodprov som mäter hur mycket glukos som är bundet till de röda
          blodkropparna, ett medelvärde på blodsockret de senaste 2-3 månaderna.)
        </Text>
        <Text style={styles.breadText} note>
          HbA1c: 48 mmol/mol eller lägre (utan för mycket känningar)
        </Text>
        <Text style={styles.breadText} note>
          Blodsocker före måltid: 4-6 mmol/l
        </Text>
        <Text style={styles.breadText} note>
          Blodsocker 2 timmar efter måltid: 4-8 mmol/l
        </Text>
        <Text style={styles.breadText} note>
          Målvärde vid sänggående: 4-8 mmol/l
        </Text>
        <Text style={styles.headerText}>Hjälpredor för att nå målen</Text>
        <Text style={styles.breadText} note>
          Kolla blodsockret före varje måltid!
        </Text>
        <Text style={styles.breadText} note>
          Hypoglykemi (blodsocker under 3,5-4 mmol/l) behandlas med druvsocker:
        </Text>
        <Text style={styles.breadText} note>
          1/2-1 tablett per 10 kg kroppsvikt beroende på hur kraftig känningen
          är. (= 1,5 - 3 g snabba kolhydrater per 10 kg kroppsvikt)
        </Text>
        <Text style={styles.breadText} note>
          Korrigeringsdos: överväg att ge extra insulin om ditt blodsocker är
          över 8 mmol/l. Följ upp blodsockret efter 2 timmar! Tänk på att du kan
          ge korrigeringsdosen i samband med att du ändå ger insulin till nästa
          måltid.
        </Text>
        <Text style={styles.headerText}>Kolhydraträkning</Text>
        <Text style={styles.breadText} note>
          Insulindosen ska anpassas till hur mycket kolhydrater det är i
          måltiden och till vilken fysisk aktivitet du ska utföra.
        </Text>
        <Text style={styles.breadText} note>
          Med hjälp av kolhydratkvoten kan man uppskatta hur mycket insulin som
          behövs till en viss mängd kolhydrat. Denna kvot kan variera under
          dagen, framför allt på frukosten, då man ofta behöver mer insulin till
          samma mängd kolhydrater.
        </Text>
        <Text style={styles.breadText} note>
          Fysisk aktivitet hjälper dig att uppnå målen. Regelbunden fysisk
          aktivitet gör blodsockret jämnare och du mår bättre på kort och lång
          sikt!
        </Text>
        <Text style={styles.headerText}>
          Råd vid lågt blodsocker, "känning"
        </Text>
        <Text style={styles.breadText} note>
          Enligt det nationella Vårdprogrammet ska man i första hand behandla
          med druvsocker, helst tillsammans med dryck. Vila tills effekten
          kommer inom 10–15 minuter. Kontrollera med nytt blodsocker. Upprepa om
          effekt uteblir.
        </Text>
        <Text style={styles.breadText} note>
          Behandla i andra hand med söt dryck. (Smörgås, mjölk, choklad och
          annat som innehåller fett bromsar glukosupptaget och är mindre
          lämpligt som första behandling.)
        </Text>
        <Text style={styles.headerText}>Hyperglykemi = högt blodsocker</Text>
        <Text style={styles.breadText} note>
          Du ska sträva efter att ha ett blodsocker mellan 4 och 6 mmol/l.
          Enstaka höga värden kommer du att ha. Ett högt värde kan korrigeras
          med extra insulin. Höga blodsocker kan bero på flera olika saker.
          Oftast rör det sig om för lite insulin till de kolhydrater du ätit.
        </Text>
        <Text style={styles.breadText} note>
          Enstaka höga värden kan också förekomma om du är arg, ledsen, rädd
          eller till exempel efter en spännande och intensiv fotbollsmatch. Det
          kan också bero på rekylfenomen, dvs en överreaktion från kroppen som
          reaktion på ett lågt blodsocker. Då brukar blodsockret sjunka spontant
          efter några timmar utan att du behöver korrigera med extra insulin.
        </Text>
        <Text style={styles.breadText} note>
          Upprepade höga blodsocker kan bero på mer allvarlig insulinbrist. Då
          är det viktigt att följa blodsockret och försöka att korrigera detta
          tills det blivit normalt igen. Då ska du också testa om du har ketoner
          (syror) i blodet eller i urinen. Ketoner är ett tecken på att kroppens
          celler inte får näring, dvs att de svälter. Ketoner och ett samtidigt
          högt blodsocker är ett tecken på en allvarlig insulinbrist och måste
          behandlas med insulin.
        </Text>
        {/* <Text style={styles.breadText} note>
          /Information från Diabetesteamet Malmö/Lund/
        </Text> */}
        <Text style={styles.breadText} note>
          Senast uppdaterad: 2018-02-13
        </Text>
      </ScrollView>
    );
  }
}

AboutDiabetesScreen.propTypes = {
  navigator: PropTypes.object.isRequired,
};

export default AboutDiabetesScreen;
