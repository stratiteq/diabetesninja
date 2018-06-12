import { StyleSheet } from 'react-native';

const NavigationStyles = StyleSheet.create({
  container: {
    backgroundColor: '#5786CE',
    height: 50,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    color: '#FFF',
  },
  viewContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  headerContainer: {
    flex: 2,
    backgroundColor: '#5786CE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#FFF',
  },
  listContainer: {
    flex: 8,
    backgroundColor: '#FFF',
  },
});

export default NavigationStyles;
