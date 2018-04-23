Steps to build visualization (Author: Vaibhav Aggarwal - vaggarwal@deloitte.com)

	• Finalize the component - install via npm under assets folder.
	• (File:/superset/assets/visualizations/main.js) - Register your component like
	export const VIZ_TYPES = {
		-----,
		-----,
		-----,
		custom_component: 'custom_component',
	}
	const vizMap = {
		-----,
		[VIZ_TYPES.custom_component]: require('./custom_component.jsx'),     //give the file-path where you are going to build your react component
		
	}
	
	• (File:/superset/assets/visualizations/custom_component.jsx) - import component related dependencies and structure component code the way given below:

	import React from 'react';

	import ReactDOM from 'react-dom';

	import './custom_component.css';
	
	function customComponentViz(slice, payload) {
		//slice parameter will provide JSON data related to slice view.
		//payload parameter will provide the JSON data which we are going to feed in our component.

		const container = document.querySelector(slice.selector);

		class App extends React.Component {
			//your code here
		};
		
		ReactDOM.render(<App />, container);
		
	}
	
	module.exports = customComponentViz;
	
	• (File:/superset/assets/javascripts/explore/stores/visTypes.js) - in this file we are going to define which form controls (left panel under slice) need to be shown & consumed by our visualization:

	custom_component: {
		label: t('Custom Component'),
		requiresTime: true,
		controlPanelSections: [
			{
				label: t('Query'),
				expanded: true,
				controlSetRows: [
					['metric'],  //control defined under controls.jsx
				],
			},
			{
				label: t('Chart Options'),
				controlSetRows: [
					['color'], //control defined under controls.jsx
					['subheader'] //control defined under controls.jsx
				],
			},
		],
	},
	
	• (File:/superset/assets/javascripts/explore/stores/controls.jsx) - this file having the list of all form controls for feeding data to visualization, we can use predefined controls or create our own custom control by defining in this file.
	
	• Next step is to connect with DB and build the payload JSON  by defining class- (File:/superset/viz.py) 

	class CustomComponentViz(BaseViz):
		viz_type = 'custom_component'
		verbose_name = _('Custom Component')
		is_timeseries = True
		def query_obj(self):
			d = super(ProgressBarCircleViz, self).query_obj()
			metric = self.form_data.get('metric')
			if not metric:
				raise Exception(_('Pick a metric!'))
			d['metrics'] = [self.form_data.get('metric')]
			self.form_data['metric'] = metric
			return d
		def get_data(self, df):
			form_data = self.form_data
			return {
				'data': df.values.tolist(),
				'subheader': form_data.get('subheader', ''),
			}
			
	• Place thumbnail of visualization under (File:/superset/assets/images/viz_thumbnails) and rename it as viz name custom_component.png (rebuild to reflect the changes)

	Below are the custom widgets/visualizations added under folder File:/superset/assets/visualizations/:

	• Alert detail popup (alert_detail.js)
	• Alert table with downtime table (alert_table_tab.js)
	• Alert table (alert_table.js)
	• Asset Avatar (asset_avatar.jsx)
	• Asset Health (assetLifeInfo.js)
	• Factory Distribution Map (factory_distribution_map.js)
	• Factory Floor Map (factory_floor_map.js)
	• Factory OEE Values (factory_oee.js)
	• Production line OEE values (oee_values.js)
	• Operational Parameters (operational_parameters.jsx)
	• Order Fulfillment (orderFulfill.js)
	• Production Line Map (production_line_map.jsx)

	List of charts which got created out of these visualizations which will found under URL (http://18.219.62.87:8081/slicemodelview/list/), once logged in with admin:
		Chart	/ Visualization Type /	Datasource
		Head of Operations Alerts / alert_table /	Alert_Details
		Asset Alerts / alert_table_tab / Alert_Details
		Shift Supervisor Alerts / alert_table / Alert_Details
		Line Manager Alerts / alert_table / Alert_Details
		Production Line Alerts / alert_table / Alert_Details
		Production Order Fullfillment / orderFulfill / Order_Fullfilment
		Company Order Fulfillment / orderFulfill / Order_Fullfilment
		Factory Order Fulfillment / orderFulfill / Order_Fullfilment
		Asset Health / assetLifeInfo / Sensor_Details
		Company Operational Parameters / operational_parameters / Company_details
		Production Line Map / production_line_map / Asset_Details
		Asset Operational Parameter / operational_parameters / Asset_Details
		Asset Avatar / asset_avatar / Sensor_Details
		Production Line Operational Parameters / 	operational_parameters / Production_Line_details
		Factory Distribution Map / factory_distribution_map / Factory_details
		Factory OEE Values / factory_oee / Factory_details
		Factory Operational Parameters / operational_parameters / Operational_Parameters
		Factory Floor Map / factory_floor_map / Production_Line_details
		Production Line OEE Values / oee_values / Production_Line_details

		• Above charts works dynamically based on datasource selected and will query the DB table based on the parameters defined in query string.
		• To read the query string  parameters we need to define below in where clause:
		Asset_ID = '{{url_param('ast','ASST01')}}' 

	Below are the list of user roles and dashboards built on top of these charts (http://18.219.62.87:8081/dashboardmodelview/list/):

		• User (head_of_operations) have an access to Company dashboard
		• User (shift_supervisor) have an access to Factory dashboard
		• User (line_manager) have an access to Production Line dashboard
		• User redirection logic is defined under method "welcome" of  (File:/superset/views/core.py)
		if roleName == 'line_manager':
		return redirect('/superset/dashboard/productionline/?prod='+g.user.ref_id) 
		if roleName == 'shift_supervisor':
		return redirect('/superset/dashboard/factory/?fac='+g.user.ref_id)
		if roleName == 'head_of_operations':
		return redirect('/superset/dashboard/company/?comp='+g.user.ref_id)

	Below are the endpoint URL defined under (File:/superset/views/core.py) to update and select from any table:

		• To update table (/superset/update_table/<datasource_id>/<table_name>/) where datasource_id is the id of hitachiplatform DB which is "2" in our case & table_name is the name of the table like "Down_Time" and the request parameters would be 
		col: <column name for which value needs to be updated> 
		val: <value which needs to be updated for the column defined>
		key: <primary key column name for specific row value need to be updated>
		keyValue: <value for primary key column>
		
		• To select data from table (/selectData/<datasource_id>/<table_name>/) where datasource_id is the id of hitachiplatform DB which is "2" in our case & table_name is the name of the table like "Down_Time" and the request parameters would be
		selectCol: <list of column which needs to be queried separated by comma>
		whereClause: <condition which need to be defined in where clause like Asset_ID='asst01'>