import { StyleSheet, Platform } from 'react-native';

export const CommonStyles = StyleSheet.create({
  container: {
    backgroundColor: '#EFEFEF',
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#5786CE',
    padding: Platform.OS === 'ios' ? 10 : 0,
    margin: 5,
    marginBottom: 10,
  },
  buttonView: {
    justifyContent: 'center',
    backgroundColor: '#5786CE',
    borderWidth: 1,
    borderColor: '#5786CE',
    height: 40,
    borderRadius: 5,
    marginBottom: 20,
    margin: 5,
  },
  buttontext: {
    fontWeight: 'bold',
    textAlign: 'center',
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  buttonCancelView: {
    backgroundColor: '#DDD',
    borderColor: '#EFEFEF',
  },
  buttonCancelText: {
    color: '#555',
  },
  tabStyle: {
    backgroundColor: '#5786CE',
  },
  tabUnderlineStyle: {
    backgroundColor: '#FFFFFF',
  },
  logoImageContainer: {
    flex: 1,
    backgroundColor: '#5786CE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  formAreaContainer: {
    flex: 1,
    marginTop: 1,
    padding: 30,
    zIndex: 1,
  },
  inputLabel: {
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#5786CE',
  },
  modalHeader: {
    backgroundColor: '#5786CE',
  },
  modalTitle: {
    color: '#FFF',
  },
  modalIcon: {
    color: '#FFF',
  },
  list: {
    backgroundColor: '#FFF',
    paddingTop: 10,
    paddingBottom: 10,
  },
  listWithHeader: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  listItemHeader: {
    backgroundColor: 'transparent',
  },
  listItem: {
    marginLeft: 0,
    paddingLeft: 17,
    backgroundColor: '#FFF',
  },
});

export { CommonStyles as default };
