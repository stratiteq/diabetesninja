
import { StyleSheet } from 'react-native';

const CalculateInsulinStyles = StyleSheet.create({
  content: {
    padding: 20,
  },
  infoText: {
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    flex: 2,
    marginRight: 20,
    fontWeight: 'bold',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    fontSize: 20,
  },
  section: {
    backgroundColor: '#ECECEC',
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
  },
  sectionDescription: {
    marginBottom: 10,
    // color: '#666',
  },
  sectionHelp: {
    marginBottom: 10,
  },
  ruleContainer: {
    marginBottom: 20,
  },
  ruleLabel: {
    fontWeight: 'bold',
  },
  ruleValue: {
    marginTop: 5,
  },
});

export default CalculateInsulinStyles;
