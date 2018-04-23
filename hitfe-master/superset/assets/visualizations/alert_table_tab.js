import React from 'react';
import ReactDOM from 'react-dom';
import { Panel, Form, FormGroup, FormControl, Checkbox, Tabs, Tab, TabContainer, TabContent, TabPane } from 'react-bootstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import $ from 'jquery';
import {bindActionCreators} from 'redux';
import _ from 'lodash';
import DateRangePicker from 'react-daterange-picker';
import AlertDetail from './alert_detail';
// import Moment from 'moment';
// import { extendMoment } from 'moment-range';

// const moment = extendMoment(Moment);

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);
import './react-bootstrap-table-all.min.css';
import './react-calendar.css';
import './alert_table.css';
import './alert_detail.css';


function alertTableTabViz(slice, payload) {
    
    const container = document.querySelector(slice.selector);

    const json = payload.data.data;

    const user = payload.form_data.user;
    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Alerts'; 

    let vizData = { 
        alertsTableData:[
            {
                id: "HIT98",
                status: "Critical",
                dateTime: "02/12/2018",
                activeTime: "14 Hrs.",
                description: "Down-time Loss",
                parameter: "Performance",
                assetName: "Compressor",
                location: "Location"
            }
        ],
        downTimeTableData: [
            {
                id: "HIT98",
                startDate: "01/12/2018",
                startTime: "14:37",
                activeTime: "14 Hrs.",
                downTimeRC: "Air Compressor Breakdown",
                edit: ""
            }
        ]
    };

    var alertLength = json.length;

    var alertObj = {};
    if(alertLength > 0){
        vizData.alertsTableData = dataObj(json);
    }

    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];
	
    function dataObj(json){
        var dataArr = [];
        var alertObj = {};
        for (var i in json){
            alertObj = {
                id: json[i].Alert_ID,
                status: json[i].Alert_Status,
                dateTime: json[i].Date_Time,
                activeTime: json[i].Active_Time,
                completedTime: json[i].Completed_Time,
                description: json[i].Alert_Description,
                parameter: json[i].Alert_Parameter,
                assetName: json[i].Asset_Name,
                location: json[i].Production_Line_Name,
                sensorId: json[i].Sensor_ID,
                assignTo: json[i].Assign_Type,
                alertPriority: json[i].Alert_Priority
            };
            dataArr.push(alertObj);
        }
        return dataArr;
    }

    vizData.downTimeTableData = [];

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    var assetId = getParameterByName('ast') != null ? getParameterByName('ast') : 'ASST01';    

    $.ajax({
        url: "/superset/selectData/2/Down_Time/",
        method: "GET",
        data: { 
            selectCol : "*",
            whereClause : "Asset_ID='"+assetId+"'"
        },
        success: function(data){

            var downTimeJson = JSON.parse(data);

            var downTimeLength = downTimeJson.length;

            var downTimeObj = {};
            if(downTimeLength > 0){
                vizData.downTimeTableData = [];
                for (var i=0; i<downTimeLength; i++){
                    downTimeObj = {
                        id: downTimeJson[i].Alert_ID,
                        startDate: downTimeJson[i].Start_DateTime,
                        startTime: downTimeJson[i].Completed_DateTime,
                        activeTime: downTimeJson[i].Active_Time,
                        downTimeRC: downTimeJson[i].Description,
                        edit: ""
                    };
                    vizData.downTimeTableData.push(downTimeObj);
                }
            }
        }
    });
    var refreshData = null;

    class DataTableComponent extends React.Component {

        constructor(props) {
          super(props);
          this.options = {
              showSearchTool: this.showSearchTool.bind(this),
              editRowData : this.editRowData.bind(this),
              responsive: true,
              defaultSortName: 'dateTime',  // default sort column name
              defaultSortOrder: 'desc'  // default sort order
          };
          var alertDataInterval = "";
          this.optionsDowntime = {
            showSearchTool: this.showSearchTool.bind(this),
            editRowData : this.editRowData.bind(this),
            responsive: true,
            defaultSortName: 'startDate',  // default sort column name
            defaultSortOrder: 'desc'  // default sort order
          };
          this.state = {
              activeTabKey: 1,
              isSearchEnabled: true,
              isFilterEnabled: true,
              isCalendarEnabled: true,
              isGeneralOverlayEnabled: false,
              isDateFilterCleared: false,
              responsive: true,
              alertInfoId:[],
              isDetailEnabled:false,
              data : vizData,
              dateValue: null,
              filterItem : []
          };
          this.state.filteredData = this.state.data.alertsTableData;
          this.state.downTimeTableFilteredData = this.state.data.downTimeTableData;
      
          this.showHideFilterTool = this.showHideFilterTool.bind(this);
          this.showHideCalendarTool = this.showHideCalendarTool.bind(this);
          this.handleFilterData = this.handleFilterData.bind(this);
          this.handleDateSelect = this.handleDateSelect.bind(this);
          this.handleTabView = this.handleTabView.bind(this);
          this.updateCellData = this.updateCellData.bind(this);
          this.clearFilter = this.clearFilter.bind(this);
          this.removeOverlay = this.removeOverlay.bind(this);
          this.openAlertDetail = this.openAlertDetail.bind(this);
          this.alertDetail = this.alertDetail.bind(this);
          
          let {filterData} = []; 
          filterData = _.uniq(_.map(this.state.data.alertsTableData, 'status'));
          this.filterData =  _.map(filterData, function(value, key){
              return {
                  value: value,
                  checked: false
              };
          });
      
          let {parameterData} = []; 
          parameterData = _.uniq(_.map(this.state.data.alertsTableData, 'parameter'));
          this.parameterData =  _.map(parameterData, function(value, key){
              return {
                  value: value,
                  checked: false
              };
          });
          this.updateTableData = this.updateTableData.bind(this);
        }

        triggerAjax(){
            var that = this;
            $.ajax({
                url: url,
                method: 'GET',
                data : {
                    form_data : JSON.stringify(formData)
                },
                success: function(data){
                    let json = data.data.data;
                    if(json.length > 0){
                        var _setData = dataObj(json);
                        that.setState({
                            filteredData: _setData,
                            isDetailEnabled: false
                        });
                        // that.handleLoad();
                    }
                },
            });
        }

        updateTableData(alertData) {
            // console.log(alertData);
            this.triggerAjax();
        }
      
        showSearchTool(el) { 
          const {isSearchEnabled} = this.state;
          this.setState({
              isSearchEnabled: true,
              isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled,
              isDetailEnabled: false
          });
        }
        openAlertDetail(cell, row, index){
          this.setState({
              isDetailEnabled: true,
              alertInfoId: [cell, row, index],
          });
      
        }
      
        alertDetail(cell, row, enumObject, index){
            return (<a className='alertId' onClick={(e) => this.openAlertDetail.call(this, cell, row, index)}>{cell}</a>)
        }

        changeTimeFormat(cell, row){
            var _value = moment(cell).format('DD/MM/YY HH:mm ');
            return _value; 
         }
        
         timeTakenFormat(cell, row){
            var _d = row.completedTime;
            if(!row.completedTime){
                _d = new Date();
            }
            var now = moment(_d),
               end = moment(row.dateTime),
               duration = moment.duration(now.diff(end)),
               hours = duration._data.hours +":"+ duration._data.minutes +" hrs";
           return hours; 
       }
       isResolved(cell, row){
            var resolved = '<div class="alertResolved resolved"></div>';
            if(!row.completedTime){
                resolved = '<div class="alertResolved unResolved"></div>'; 
            }
            return resolved; 
        }
        isPriority(cell, row){
            var resolved = '<div class="isPriority arrow down"></div>';
            if(row.alertPriority == "High"){
                resolved = '<div class="isPriority arrow top"></div>'; 
            }
            return resolved; 
        }

       timeTakenFormatDowntime(cell, row){
        if(!row.startDate){
            row.startDate = new Date();
        }
       var now = moment(row.completedTime),
           end = moment(row.dateTime),
           duration = moment.duration(now.diff(end)),
           hours = duration._data.hours +":"+ duration._data.minutes +" hrs";
       return hours; 
   }
        
        setStatusStyle(cell, row){
           let styleClassName = '';
            if(cell.toLowerCase() == 'critical'){
              styleClassName = 'critical';
            } else if(cell.toLowerCase() == 'normal'){
              styleClassName = 'normal';
            } else if(cell.toLowerCase() == 'warning'){
              styleClassName = 'warning';
            }
            //return `<i class='fa fa-circle statusMarker ${ styleClassName }' ></i> ${cell}`; 
            return `<div class='fa alert-statusCircle statusMarker ${ styleClassName }' ></div>`; 
        }
      
        setEditIcon(cell, row) {
          return (<i className='fa fa-pencil-alt' onClick={(e) => this.editRowData.call(this, cell, row)}></i>);
        }
      
        setBlankField(cell, row){
          if(!cell) {
              return '<input type="text" placeholder="Add description" class="addDescInput"/>';
          } 
          return `${cell}`;
        }
      
        showHideFilterTool(){
          this.setState({ isFilterEnabled: !this.state.isFilterEnabled ,
               isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled,
               isDetailEnabled: false});
        }
      
        showHideCalendarTool(){
          this.setState({ isCalendarEnabled: !this.state.isCalendarEnabled,
              isGeneralOverlayEnabled: !this.state.isGeneralOverlayEnabled, isDetailEnabled: false});
        }
      
        handleFilterData(checkedType, e) {
          let filterItems = this.state.filterItem;
          let newFilteredData = [];
      
          let index = _.findIndex(filterItems, {value :e.target.value});
      
          if(e.target.checked){
              if(index == -1){
                  filterItems.push({
                      type: checkedType,
                      value:e.target.value
                  });
              }
          } 
          else {
              filterItems.splice(index, 1);
          }
      
          this.updateFilteredData();
          if(this.state.dateValue) {
              this.handleDateSelect(this.state.dateValue, false);
          }
        }
      
        removeFilterItem(item, e){
          let filterItems = this.state.filterItem;
          let index = _.findIndex(filterItems, {value :item.value});
          if(item.type == 'status'){
              let itemInFilterData = _.findIndex(this.filterData, {value: item.value});
              this.filterData[itemInFilterData].checked = false;
          } else {
              let itemInFilterData = _.findIndex(this.parameterData, {value: item.value});
              this.parameterData[itemInFilterData].checked = false;
          }    
          document.getElementById(item.value).checked =false;
          filterItems.splice(index, 1);
          this.updateFilteredData();
        }
      
        removeDateFilter(e){
          this.setState({
              dateValue : moment.range(moment(new Date()), moment(new Date())),
              isDateFilterCleared : true,
              isDetailEnabled: false
          }, function(){
              this.updateFilteredData();
          });
        }
      
        clearFilter(){
          let filterData = this.filterData;
          let parameterData = this.parameterData;
          let filterItem = this.state.filterItem;
          filterData.map((item, i) => {
              let itemIndex = _.findIndex(filterItem, {value :item.value});
              filterItem.splice(itemIndex, 1);
              item.checked = false;
              document.getElementById(item.value).checked =false;
          });
          parameterData.map((item, i) => {
              let itemIndex = _.findIndex(filterItem, {value :item.value});
              filterItem.splice(itemIndex, 1);
              item.checked = false;
              document.getElementById(item.value).checked =false;
          });
          this.setState({
              filterItem : filterItem,
              parameterData : parameterData,
              dateValue : moment.range(moment(new Date()), moment(new Date())),
              isDateFilterCleared : true
          }, function(){
              this.updateFilteredData();
          });
        }
      
        handleTabView(activeTab){
          this.setState({
            downTimeTableFilteredData: this.state.data.downTimeTableData,
            activeTabKey: activeTab,
            isDetailEnabled: false
          }, function(){
              if(!this.state.isDateFilterCleared && this.state.dateValue){
                  this.handleDateSelect(this.state.dateValue, false);
              }
          });
        }
      
        handleDateSelect(range, fromDatePicker) {
          const startDate = new Date(range.start._i).getTime();
          const endDate = new Date(range.end._i).getTime();
      
          let newFilteredData = [];
          let data = this.state.activeTabKey == 1 ? this.state.data.alertsTableData : this.state.data.downTimeTableData;
          if(this.state.filterItem.length > 0 ) {
              newFilteredData  = data.filter( (entry) => {
                const result = []; 
                for (let i = 0; i < this.state.filterItem.length; i+=1) {
                  if(this.state.filterItem[i].value == entry[this.state.filterItem[i].type]){
                    result.push(this.state.filterItem[i]);
                  }
                }        
                return  result.length > 0 ? true :  false; 
              })
          } else {
              newFilteredData = data;
          }
           
          this.setState({ 
              dateValue: range,
              isDateFilterCleared : false,
              isDetailEnabled: false
          }, function(){
              //if(fromDatePicker == false){
              //     newFilteredData = data;
              // } else {
                  newFilteredData  = newFilteredData.filter((entry) => {
                      const entryDate = this.state.activeTabKey == 1 ? new Date(entry.dateTime).getTime() : new Date(entry.startDate).getTime();
                      return entryDate >= startDate && entryDate <= endDate;
                  })
              // }
      
              if(this.state.activeTabKey == 1){
                  this.setState({
                      filteredData : newFilteredData,
                      isDetailEnabled: false
                  });
              } else {
                  this.setState({
                      downTimeTableFilteredData :  newFilteredData,
                      isDetailEnabled: false
                  });
              }
          });        
        }
      
        updateFilteredData(){
          let filterItems = this.state.filterItem;
          let newFilteredData = [], newDownTimeTableFilteredData = [], gridData = [];
      
          if(filterItems.length > 0 ) {
              if(this.state.dateValue){
                  gridData = this.state.filteredData;
              } else {
                  gridData = this.state.data.alertsTableData;
              }
              newFilteredData  = gridData.filter( (entry) => {
                const result = []; 
                for (let i = 0; i < filterItems.length; i+=1) {
                  if(filterItems[i].value == entry[filterItems[i].type]){
                    result.push(filterItems[i]);
                  }
                }        
                return  result.length > 0 ? true :  false; 
              })
          } else {
              newFilteredData = this.state.data.alertsTableData;
              newDownTimeTableFilteredData = this.state.data.downTimeTableData;
          }
        
          this.setState({
              filterItem: filterItems,
              filteredData : newFilteredData,
              downTimeTableFilteredData : newDownTimeTableFilteredData,
              isDetailEnabled: false
          });
        }
      
        updateCellData(value, row){
          // If this function return an object, you got some ability to customize your error message
          //const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
          if (value.length < 3) {
           
              $("input.form-control").css("border", "1px solid red");
              $(".s-alert-wrapper").hide();
              return false;
            //   response.notification.type = 'error';
            //   response.notification.msg = 'Value must have 10+ characters';
            //   response.notification.title = 'Invalid Value';
          }
          else{
              return true;
          }
          
          if(response.isValid){
            $.ajax({
                url: "/superset/update_table/2/Down_Time/",
                method: "POST",
                data: {col:"Description", val: "'"+value+"'", key: "Alert_ID", keyValue: "'"+ row.id +"'"},
                success: function(data){
                    console.log(data);
                }
            });
          }
          return response;
        }
      
      
        editRowData(cell, row){
          alert("Edit Done");
          const response = { isValid: true, notification: { type: 'success', msg: 'Done', title: 'Edit' } };
          return response;
        }
      
      
        removeOverlay(){
          this.setState({
              isSearchEnabled: true,
              isFilterEnabled: true,
              isCalendarEnabled: true,
              isGeneralOverlayEnabled: false,
              isDetailEnabled: false
          });
        }
      
        componentDidMount() {
            var that = this;
            clearInterval(refreshData);
            refreshData = setInterval(function(){ 
                if(that.state.isDetailEnabled == false && that.state.activeTabKey == 1){
                    that.triggerAjax();
                }
            }, 15000);
        }

        componentWillUnmount() {
            clearInterval(refreshData);
        }
      
       render() {
        const { data, isSearchEnabled, isFilterEnabled, isCalendarEnabled, isDateFilterCleared, dateValue, filterItem, filteredData, downTimeTableFilteredData, activeTabKey} = this.state; 
        return ( 
        <Panel id="tableGridPanel">
            <div className="component_hd xs-mb-10"><img className="xs-mr-10" src = "/static/assets/images/icon-alert.png"></img><span>{vizLabel}</span></div>
            <div id="overLay" onClick={(e) => this.removeOverlay()} className={classNames('generalOverlay',{
                                            'generalOverlayShow': this.state.isGeneralOverlayEnabled,
                                            'generalOverlayHide': !this.state.isGeneralOverlayEnabled
                                            })}></div>
            {/* <Panel.Heading>
                <i className="fa fa-exclamation-triangle tableTools"></i> 
                <span>Alerts</span>
            </Panel.Heading> */}
        
            {/* <Panel.Body> */}
              <div className="pull-left selectedTags">
                  {this.state.filterItem && this.state.filterItem.map((item, i) =>
                      <span key={i} className="filterItemTag">{item.value}
                          <i className="fa fa-times filterItemTagClose" onClick={(e) => this.removeFilterItem(item, e)}></i> 
                      </span>
                  )}
                  {this.state.dateValue && !this.state.isDateFilterCleared && 
                      <span className="filterItemTag">
                          {moment(this.state.dateValue.start).format("MM/DD/YYYY")} to {moment(this.state.dateValue.end).format("MM/DD/YYYY")}
                          <i className="fa fa-times filterItemTagClose" onClick={(e) => this.removeDateFilter(e)}></i> 
                      </span>                    
                  }
                  {(this.state.filterItem.length >0 || (this.state.dateValue && !this.state.isDateFilterCleared) ) && <span className="clearTag" onClick={this.clearFilter}>Clear tag</span>}
              </div>
              <div className="tableAndFilterContainer withTabs">
                  <div className="filterIcons">
                      <i className="fa fa-calendar pull-right tableTools" onClick={this.showHideCalendarTool}></i>       
                      <i className="fa fa-filter pull-right tableTools" onClick={this.showHideFilterTool}></i> 
                      <i className="fab fa-sistrix pull-right tableTools" 
                          onClick={(e) => this.options.showSearchTool(e)}></i>
                      <div ref = "filternav" className={classNames('filterOverlay',{
                                              'filterOverlayHide': isFilterEnabled,
                                              'filterOverlayShow': !isFilterEnabled
                                              })} >
                          <div>
                              <div className="groupHeader"> Status </div>
                              {this.filterData && this.filterData.map((entry, i) =>
                                  <div key={i}>                            
                                      <input type="checkbox" id={entry.value} className="styled-checkbox" 
                                      onChange={(e) => this.handleFilterData('status',e)} value={entry.value}/>
                                      <label htmlFor={entry.value}>{entry.value}</label>
                                  </div>
                              )}
                          </div>
                          <div>
                              <div className="groupHeader"> Parameter </div>
                              {this.parameterData && this.parameterData.map((entry, i) =>
                                  <div key={i}>
                                      <input type="checkbox" id={entry.value} className="styled-checkbox" 
                                      onChange={(e) => this.handleFilterData('parameter',e)} value={entry.value}/>
                                      <label htmlFor={entry.value}>{entry.value}</label>
                                  </div>
                              )}
                          </div>
                      </div>
                      <DateRangePicker  className={classNames('calendarOverlay',{
                                          'calendarOverlayHide': isCalendarEnabled,
                                          'calendarOverlayShow': !isCalendarEnabled
                                          })}
                          firstOfWeek={1}
                          numberOfCalendars={1}
                          minimumDate={new Date()}
                          value={this.state.dateValue}
                          onSelect={this.handleDateSelect}
                          minimumDate={new Date("01-01-2010")}
                          maximumDate={moment().add(2, 'years').toDate()}
                          selectionType='range'
                      />
                  </div>
                  {/* </Panel.Body> */}
                  <input type="hidden" value={this.state.activeTabKey} />
                  <Tabs defaultActiveKey={this.state.activeTabKey} animation={false} id="noanim" onSelect={this.handleTabView}>
                      <Tab eventKey={1} title="Alerts">
                          <BootstrapTable ref='alertsTable' containerClass="alertsTable" data={filteredData} striped hover bordered={ false } search={isSearchEnabled} multiColumnSearch options={ this.options }> 
                              <TableHeaderColumn isKey dataSort dataField='id' width='70px' dataFormat={ this.alertDetail }>ID</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='status' width='70px' dataFormat={ this.setStatusStyle }>Status</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='dateTime' dataFormat={ this.changeTimeFormat }>Date &amp; Time</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='activeTime' width='70px' dataFormat={ this.timeTakenFormat}>Active Time</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='activeTime' width='70px' dataFormat={ this.isResolved}>Resolved</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='alertPriority' width='70px' dataFormat={ this.isPriority}>Priority</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='parameter'>Parameter</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='description'>Description</TableHeaderColumn>
                          </BootstrapTable>
                      </Tab>
                      <Tab eventKey={2} title="Down-Time">
                          <BootstrapTable ref='downTimeTable' containerClass="downTimeTable" data={downTimeTableFilteredData} cellEdit={{mode:"click", blurToSave: true}} striped hover bordered={ false } search={isSearchEnabled} multiColumnSearch options={ this.optionsDowntime }> 
                              <TableHeaderColumn isKey dataSort dataField='id' editable={ false }>ID</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='startDate' dataFormat={ this.changeTimeFormat } editable={ false }>Start Time</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='activeTime' dataFormat={ this.timeTakenFormat} editable={ false }>Active Time</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='alertPriority' width='70px' dataFormat={ this.isPriority}>Priority</TableHeaderColumn>
                              <TableHeaderColumn dataSort dataField='downTimeRC' dataFormat={this.setBlankField}  editable={{validator: this.updateCellData}}>Downtime Root Cause</TableHeaderColumn>
                              <TableHeaderColumn dataField='edit' width="7%" dataFormat={ this.setEditIcon } editable={ false }></TableHeaderColumn>
                          </BootstrapTable> {/* formatExtraData={ } } */}
                      </Tab>
                  </Tabs>
              </div>
            <AlertDetail isDetailEnabled={this.state.isDetailEnabled} alertInfoId={this.state.alertInfoId} updateData={this.updateTableData}></AlertDetail>
        </Panel>
          );
        }
       
      }
    
    ReactDOM.render(<DataTableComponent />, container);
    
}

module.exports = alertTableTabViz;