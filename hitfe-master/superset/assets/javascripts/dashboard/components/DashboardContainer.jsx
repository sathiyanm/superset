import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as dashboardActions from '../actions';
import * as chartActions from '../../chart/chartAction';
import Dashboard from './Dashboard';

function mapStateToProps({ charts, dashboard, impressionId }) {
  return {
    initMessages: dashboard.common.flash_messages,
    timeout: dashboard.common.conf.SUPERSET_WEBSERVER_TIMEOUT,
    dashboard: dashboard.dashboard,
    slices: charts,
    datasources: dashboard.datasources,
    filters: dashboard.filters,
    refresh: !!dashboard.refresh,
    userId: dashboard.userId,
    userRole: dashboard.userRole,
    dashboardId: dashboard.dashboardId,
    isStarred: !!dashboard.isStarred,
    editMode: dashboard.editMode,
    impressionId,
  };
}

function mapDispatchToProps(dispatch) {
  const actions = { ...chartActions, ...dashboardActions };
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
