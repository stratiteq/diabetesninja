import { StyleSheet } from 'react-native';

export const DashboardStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  containerDashboardOverview: {
    flex: 1,
    flexDirection: 'column',
  },
  eventContainer: {
    flex: 20,
    backgroundColor: '#FFF',
  },
  chartContainer: {
    paddingBottom: 70,
    flex: 18,
  },
  chart: {
    marginTop: 0,
    paddingTop: 0,
  },
  datePickerView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#EFEFEF',
  },
  datePickerText: {
    color: '#555',
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  datePickerArrows: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 20,
    paddingRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sumContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#CCC',
    paddingTop: 10,
    paddingBottom: 10,
  },
  sumField: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#696969',
  },
  eventRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
  },
  eventNoteText: {
    paddingTop: 15,
  },
  iconClipBoard: {
    fontSize: 25,
    color: '#5786CEBB',
    padding: 2,
  },
  metricsBox: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsButton: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsValue: {
    fontSize: 30,
    fontWeight: '300',
    backgroundColor: 'transparent',
  },
  metricsTitle: {
    fontSize: 18,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
  metricsTimestamp: {
    fontSize: 10,
    fontWeight: '300',
    color: '#888',
    backgroundColor: 'transparent',
  },
  blackText: {},
  grayText: {
    color: '#CCC',
  },
  mainMetricsContainer: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingBottom: 0,
  },
  mainMetricsContainerBackground: {
    position: 'absolute',
    width: '100%',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  timeSpanBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    paddingTop: 0,
    marginTop: 7,
  },
  timeSpanButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSpanButtonActive: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timeSpanButtonText: {
    fontSize: 12,
    fontWeight: '600',
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 12,
    paddingRight: 12,
  },
  timeSpanButtonActiveText: {
    backgroundColor: '#5786CE',
    color: '#FFF',
    borderRadius: 5,
  },
});

export { DashboardStyles as default };
