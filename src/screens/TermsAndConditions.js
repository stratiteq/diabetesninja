import React from "react";
import { StyleSheet, Text, ScrollView } from "react-native";
import * as navigatorStyles from "../styles/NavigatorStyles";

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "flex-start",
    backgroundColor: "#FFF",
    padding: 10
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    paddingTop: 5,
    paddingBottom: 5
  },
  breadText: {
    color: "#333",
    fontSize: 16,
    paddingBottom: 20
  }
});
class TermsAndConditions extends React.Component {
  static navigatorStyle = navigatorStyles.default;

  constructor(props) {
    super(props);

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "backPress":
        this.props.navigator.pop();
        break;
      default:
      // console.log("PushedScreen", `Unknown event ${event.id}`);
    }
  }

  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.breadText} note>
          Dessa Användarvillkor är tillämpliga på innehåll i och användning av
          appen DiabetesNinja.
        </Text>
        <Text style={styles.breadText} note>
          Ägare till appen DiabetesNinja är Föreningen "Farföräldrar med vänner
          mot barndiabetes", c/o Jan-Erik Hansson, V Ljungbyvägen 105, 269 72
          Förslöv, org nr 802512-7633
        </Text>
        <Text style={styles.headerText}>1. Definitioner</Text>
        <Text style={styles.breadText} note>
          Nedanstående uttryck ska ha följande betydelse i dessa
          användarvillkor.
        </Text>
        <Text style={styles.breadText} note>
          DiabetesNinja avser den tjänst som tillhandahålls genom appen
          DiabetesNinja.
        </Text>
        <Text style={styles.breadText} note>
          Diabetiker avser det barn eller den ungdom som har typ 1-diabetes och
          som appen avser att supporta.
        </Text>
        <Text style={styles.breadText} note>
          Följare avser den person i Diabetikerns närmaste krets, såsom
          förälder, lärare, syskon etc, som har tillgång till DiabetesNinja för
          Diabetikerns räkning och som är ansluten till Diabetikerns konto.
        </Text>
        <Text style={styles.breadText} note>
          Användare avser nyttjare av DiabetesNinja som godkänt dessa
          användarvillkor. Användare kan vara Diabetikern eller följaren.
        </Text>
        <Text style={styles.breadText} note>
          Användarvillkor avser dessa användarvillkor.
        </Text>
        <Text style={styles.breadText} note>
          Föreningen avser Föreningen "Farföräldrar med vänner mot
          barndiabetes".
        </Text>
        <Text style={styles.headerText}>2. Användning av DiabetesNinja</Text>
        <Text style={styles.breadText} note>
          En Diabetiker kan efter registrering utnyttja DiabetesNinja genom att
          mata in information om sig själv i en databas med hjälp av appen
          DiabetesNinja. En Följare kan koppla upp sig till Diabetikerens konto.
          Tjänsten kan därefter tillhandahålla en sammanställning av den av
          Användarna lämnade information, vilken kan användas som analysunderlag
          av Användarna.
        </Text>
        <Text style={styles.headerText}>3. Ansvarsbegränsning</Text>
        <Text style={styles.breadText} note>
          Användarna hänvisas till Vårdgivaren, t ex ditt Diabetesteam, för
          diagnos samt behandling. Föreningen tar inget ansvar för innehåll och
          effekt av eventuella analysunderlag, påminnelser, notifieringar eller
          motsvarande från DiabetesNinja, eller uteblivna sådana. Föreningens
          strävan är att DiabetesNinja alltid ska vara tillgänglig, men ansvarar
          inte för eventuella avbrott i tjänsten.
        </Text>
        <Text style={styles.headerText}>
          4. Registrering och insamling av information för DiabetesNinja
        </Text>
        <Text style={styles.breadText} note>
          Vi samlar in information från dig när du registrerar dig på vår
          webbplats. Den insamlade informationen inkluderar ditt namn och din
          e-postadress. Du får tillgång till DiabetesNinja när du registrerat
          dig och godkänt dessa Användarvillkor. Användaren ansvarar själv för
          all utrustning som krävs för att kunna använda DiabetesNinja samt för
          de kommunikationskostnader som uppstår vid användning av DiabetsNinja.
          Diabetikerens kolhydrater och blodsocker lagras centralt i en databas.
          All data är krypterad och kan inte läsas av någon som inte har
          tillgång till inloggat konto.
        </Text>
        <Text style={styles.headerText}>5. Användarens åtagande</Text>
        <Text style={styles.breadText} note>
          Användaren ansvarar själv för att de uppgifter som han eller hon matar
          in i databasen och som ligger till grund för tjänsten är korrekta.
          Användaren är ansvarig för att lösenordet för DiabetesNinja hanteras
          på ett betryggande sätt så att obehöriga inte kan ta del av hans eller
          hennes användarkonto. Användaren får inte söka otillåten åtkomst till
          någon del av tjänsten eller appen DiabetesNinja eller de system eller
          nätverk som är kopplade därtill, genom hackning eller på annat sätt.
          Användaren får inte heller på annat sätt störa tjänsten.
        </Text>
        <Text style={styles.headerText}>6. Behandling av personuppgifter</Text>
        <Text style={styles.breadText} note>
          Samtliga aktiva Användare för ett Diabetikerkonto ges tillgång till de
          uppgifter som matas in i DiabetesNinja för detta konto. Föreningen är
          personuppgiftsansvarig för all behandling av personuppgifter inom
          ramen för tillhandahållande av DiabetesNinja.
        </Text>
        <Text style={styles.headerText}>7. Immateriella rättigheter</Text>
        <Text style={styles.breadText} note>
          Alla varumärken (DiabetesNinja), logotyper, bilder, fotografier,
          animationer, videoklipp, användarvillkor och text som publiceras i
          samband med tillhandahållande av DiabetesNinja utgör/innehåller
          immateriella rättigheter som tillhör Föreningen eller som Föreningen
          genom licens har rätt att nyttja. Inga sådana immateriella rättigheter
          får kopieras, reproduceras, publiceras, användas eller visas utan
          uttryckligt godkännande från Föreningen. Överträdelser beivras genom
          rättsliga åtgärder av Föreningen eller andra rättighetsinnehavare.
        </Text>
        <Text style={styles.breadText} note>
          Applikationen är utvecklad som öppen källkod under GNU General Public
          License version 2 (GNU GPLv2). Var vänlig läs relevant licens
          dokumentation innan du använder, kopierar, modifierar eller
          distribuerar applikation eller kod. Källkoden finns tillgänglig på
          GitHub.
        </Text>
        <Text style={styles.headerText}>8. Utlämnande till tredje part</Text>
        <Text style={styles.breadText} note>
          Vi säljer, handlar eller på annat sätt överför inte personligt
          identifierbar information till utomstående parter. Detta inkluderar
          inte betrodd tredjepart som hjälper oss att driva vår webbplats, med
          kravet att dessa parter godkänner att hålla informationen
          konfidentiell. Vi anser att det är nödvändigt att dela information i
          syfte att undersöka, förhindra eller vidta åtgärder mot illegala
          aktiviteter, misstänkt bedrägeri, situationer som medför en potentiell
          risk för en persons fysiska säkerhet, brott mot våra användarvillkor
          eller andra tillfällen då lagen kräver så. Allmänna uppgifter kan dock
          delas vidare till utomstående parter för marknadsföring,
        </Text>
        <Text style={styles.headerText}>9. Informationsskydd</Text>
        <Text style={styles.breadText} note>
          Vi vidtar en rad olika säkerhetsåtgärder för att skydda dina
          personliga uppgifter. Vi använder oss av avancerade krypteringsmetoder
          för att skydda känsliga uppgifter som överförs över internet. Endast
          medarbetare som ska uträtta ett specifikt jobb får tillgång till
          personligt identifierbar information. De datorer/servrar som används
          för att lagra personligt identifierbar information lagras i en säker
          miljö.
        </Text>
        <Text style={styles.headerText}>10. Revision av användarvillkoren</Text>
        <Text style={styles.breadText} note>
          Användarvillkoren kan komma att revideras. Sådana reviderade
          Användarvillkor träder i kraft en (1) månad efter det att information
          om revideringen har lämnats via DiabetesNinja. Inget meddelande lämnas
          i övrigt till Användaren. Om ändring eller tillägg är till nackdel för
          Användaren och denna nackdel inte endast är av ringa betydelse, har
          Användaren rätt att senast vid de nya villkorens ikraftträdande säga
          upp DiabetesNinja med omedelbar verkan i enlighet med punkt 11 nedan.
          Om sådan uppsägning inte sker anses Användaren ha godkänt de nya
          villkoren
        </Text>
        <Text style={styles.headerText}>11. Uppsägning av DiabetesNinja</Text>
        <Text style={styles.breadText} note>
          En Användare av DiabetesNinja har rätt att när som helst säga upp
          tjänsten. Observera att du aktivt måste avsluta kontot genom att fylla
          i vårt supportformulär med hjälp av ”Avsluta mitt konto” och skriva
          ditt användarnamn. All data kommer då att tas bort. Detta formulär
          finns på diabetesninja.se.
        </Text>
        <Text style={styles.headerText}>
          12. Jurisdiktion och tillämplig lagstiftning
        </Text>
        <Text style={styles.breadText} note>
          Dessa Användarvillkor samt tvister med anledning därav ska regleras
          och tolkas enligt svensk rätt. Eventuella tvister med anledning av
          dessa Användarvillkor ska avgöras av svensk allmän domstol.
        </Text>
        <Text style={styles.headerText}>13. Samtycke</Text>
        <Text style={styles.breadText} note>
          Genom att använda vår webbplats godkänner du vår integritetspolicy.
        </Text>
        <Text style={styles.breadText} note>
          2018-01-18
        </Text>
        <Text style={styles.breadText} note>
          Version 1.0
        </Text>
      </ScrollView>
    );
  }
}

export default TermsAndConditions;
