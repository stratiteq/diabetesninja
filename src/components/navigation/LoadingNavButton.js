import React from 'react';
import { PropTypes } from 'prop-types';
import moment from 'moment';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Icon } from 'native-base';
import * as userLogActions from '../../redux/userlog/actions';
import * as externalUserDataActions from '../../redux/externalUserData/actions';
import NavigationStyle from '../../styles/NavigationStyles';

class LoadingNavButton extends React.Component {
  constructor(props) {
    super(props);

    this.updateAllData = this.updateAllData.bind(this);
  }

  updateAllData() {
    const fromDate = moment(new Date()).add(-7, 'day');
    this.props.userLogActions.resetUserLogFromApi(fromDate);
    this.props.externalUserDataActions.resetExternalDataFromApi();
  }

  isDataLoading() {
    return this.props.userLog.currentlyRetrievingValue;
  }

  render() {
    const loading = this.isDataLoading();

    return (
      <View style={NavigationStyle.container}>
        {loading && <ActivityIndicator size="large" color="#FFF" />}
        {!loading && (
          <TouchableOpacity
            style={NavigationStyle.refreshButton}
            onPress={this.updateAllData}
          >
            <Icon name="refresh" style={NavigationStyle.refreshIcon} />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

LoadingNavButton.defaultProps = {
  userLogActions: null,
  externalUserDataActions: null,
  userLog: null,
};

LoadingNavButton.propTypes = {
  externalUserDataActions: PropTypes.object,
  userLogActions: PropTypes.object,
  userLog: PropTypes.object,
};

function mapStateToProps(state) {
  return {
    userLog: state.userlog,
    bloodsugar: state.bloodsugar,
    note: state.note,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userLogActions: bindActionCreators(userLogActions, dispatch),
    externalUserDataActions: bindActionCreators(externalUserDataActions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingNavButton);
