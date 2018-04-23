import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import classNames from 'classnames';
import Chart from 'chart.js';
    
var outputObject = {};

var sensorDataInterval = "";

class AlertDetail extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.barChart;
    this.state = {
        isMenuEnabled: false,
        isDetailEnabled: false,
        isPopupReady: false,
        alertData:[],
        deprioritizeClass: '',
        resolvedClass: '',
        assignedToUser: "Assign Alert",
        data : {
            "alertInfo":[], 
            "dateStamp":[],
            "sensorInfo":{"name":"Humidity","sensorValues":[]}
        }
    };
  }

  handleLoad(){
    let element = this.refs.oeeCard;

    $("#alertDetail .buttonBar .button-highpriority").on("click", function(e){
        console.log("hover");
        $("#alertDetail .buttonBar .nameSelection").fadeToggle();
    });
    $("#alertDetail .buttonBar .nameSelection li").on("click", function(e){
        var _curObj = $(e.target);
        var _val = _curObj.attr("data-refName");
        $(".assignalert.button.button-highpriority span").html(_val);
    });
    
  }
  
  onMouseoverEvent(){
    this.setState({
        isMenuEnabled: true
    });
  }
  getRemainder(val){
    var _dec = (val + "").split(".");
    return _dec;
  }

  componentDidMount() {
    this.handleLoad();
    var _popup = $("#alertDetail");
        if(!this.state.isPopupReady){
            $(".alertDetailPopup").remove();
            $("body").append(_popup);
        }
        this.setState({
            isPopupReady:true
        });
            
    }
  removePopup(){
    clearInterval(sensorDataInterval);    
    this.props.updateData();    
    this.barChart.destroy();
    this.setState({
        isDetailEnabled: false,
        assignedToUser: "Assign Alert",
    });
  }

  componentWillReceiveProps(nextProps) { 
      if(nextProps){
        this.updateComponentView(nextProps.isDetailEnabled);
        this.getDataFromURL(nextProps.alertInfoId, nextProps.isDetailEnabled);
        if(nextProps.alertInfoId.length > 0){
            this.assigntoUser(nextProps.alertInfoId[1].assignTo, nextProps.alertInfoId[1].id, true);
            var _deprioritizeClass = nextProps.alertInfoId[1].alertPriority == 'Low' ? 'prioritize' : '';
            var _resolvedClass = nextProps.alertInfoId[1].completedTime ? 'resolved-disabled' : '';
            
            this.setState({
                alertData: nextProps.alertInfoId,
                deprioritizeClass: _deprioritizeClass,
                resolvedClass: _resolvedClass
            });
        }
        
        
    }
  }
  getDataFromURL(alertInfo, isDetailEnabled){
      var _setData = this.state.data;
      if(alertInfo.length > 0){
        var vizData = {
            "dateStamp":["Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)","Wed Oct 18 2017 12:51:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:01:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:05:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:21:34 GMT+0000 (UTC)"],
            "sensorInfo":{"sensorValues":[
                // {"name":"Humidity","data":[63.27, 54.12,32.1,12.3,55.77], "valueType":"%"},
                // {"name":"Temperature","data":[25.8,23.2,14.2,33.2,20.1], "valueType":"F"},
                // {"name":"Dew Point","data":[16.3,11.2,19.2,20.2,11.1], "valueType":"Temp"}
            ]}
        };
        _setData.alertInfo[0] = alertInfo[1].id;
        _setData.alertInfo[1] = alertInfo[1].description;
        _setData.alertInfo[2] = alertInfo[1].parameter;
        _setData.alertInfo[3] = alertInfo[1].location;
        _setData.alertInfo[4] = alertInfo[1].assetName;
        _setData.alertInfo[5] = alertInfo[1].activeTime;
        _setData.alertInfo[6] = alertInfo[1].assignTo;
        _setData.alertInfo[7] = alertInfo[1].alertPriority;
        _setData.dateStamp = vizData.dateStamp;
        _setData.sensorInfo = vizData.sensorInfo;
        this.setState({
            data: _setData
        });
        
        if(isDetailEnabled){
            let ctx = document.getElementById("graphCanvas").getContext('2d');
            let colorArray = ['rgba(80, 227, 194, 0.6)','rgba(15, 139, 141, 0.6)','rgba(65, 117, 5, 0.6)'];
            let graphData = {"datasets":[],"labels":[],"yAxis":[]};
            clearInterval(sensorDataInterval);    
            if(this.barChart){this.barChart.destroy();}

            var that = this;
            function getSensorData(){
                var _dataSet = that.state.data.sensorInfo.sensorValues;
                var sensorId = alertInfo[1].sensorId;
                var labels = [];
                var yAxes = [];
                graphData.labels = [];
                graphData.datasets = [];
                graphData.yAxis = [];
                for(var i = 0; i<_dataSet.length; i++){
                    var tempData = {
                            label: "",
                            data: [],
                            backgroundColor: colorArray[0],
                            borderWidth: 0,
                            yAxisID: ""
                        };
                        tempData.label = _dataSet[i].name + " " +_dataSet[i].valueType;
                        tempData.data = _dataSet[i].data;
                        tempData.backgroundColor = colorArray[i];
                        if(sensorId != "SC01"){
                            tempData.yAxisID = _dataSet[i].name.replace(" ","-");
                            graphData.yAxis.push({"id":_dataSet[i].name.replace(" ","-")});
                        }
                        graphData.datasets.push(tempData);
                }
                if(sensorId == "SC01"){
                    graphData.yAxis.push({stacked:true});
                }

                    for(var j=0; j<that.state.data.dateStamp.length; j++){
                        var _newDate = new Date(that.state.data.dateStamp[j]);
                        graphData.labels.push((_newDate.getMonth() + 1) + '/' + _newDate.getDate() + " " +_newDate.getHours()+':'+_newDate.getMinutes());
                    }
            }
            getSensorData();    
            
            /* Dynamic Vars */
            var planetData = {
                labels: graphData.labels,
                datasets: graphData.datasets
            };
            /* Dynamic Vars */

            var chartOptions = {
                scales: {
                    xAxes: [{
                        barPercentage: 1,
                        categoryPercentage: 0.6
                    }],
                    yAxes: graphData.yAxis
                }
            };

            this.barChart = new Chart(ctx, {
                type: 'line',
                data: planetData,
                options: chartOptions
            });
            /* Graph Plot Logic Ends */

            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
            
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
            
                return [year, month, day].join('-');
            }
            var sensorType = "%";
            var sensorAjax = function(sensorType){
                var currDate = new Date(alertInfo[1].dateTime);
                var nextDate = new Date(alertInfo[1].dateTime);
                nextDate.setDate(nextDate.getDate() + 1);
                currDate = formatDate(currDate);
                nextDate = formatDate(nextDate);
                var sensorId = alertInfo[1].sensorId;

                var request = new XMLHttpRequest();
                request.open('GET', "http://18.216.179.11:8080/AssetDataService/getSensorData?sensorID="+sensorId+"&startTime="+currDate+"&endTime="+nextDate, true);
                request.onreadystatechange = function() {
                    if (request.readyState==4){
                        var json = JSON.parse(request.responseText);
                        json = json.data;
                        
                        var sensorDataLength = json.length;
                        var _dataArray = {};
    
                        if(sensorDataLength > 0){
                            vizData.dateStamp = [];
                            vizData.sensorInfo = {};
                            vizData.sensorInfo.sensorValues = [];
                            for (var i=0; i<sensorDataLength; i++){
                                vizData.dateStamp.push(json[i].timestamp);
                                json[i].value = JSON.parse(json[i].value);
                                for(var key in json[i].value){
                                    if(_dataArray[key]){
                                        _dataArray[key].push(json[i].value[key]);
                                    }else{
                                        _dataArray[key] = [json[i].value[key]];
                                    }
                                }
                            }
                            for(var j in _dataArray){
                                vizData.sensorInfo.sensorValues.push({"name":j,"data":_dataArray[j], "valueType":sensorType});    
                            }
                        }

                        _setData.dateStamp = vizData.dateStamp;
                        _setData.sensorInfo = vizData.sensorInfo;
                        that.setState({
                            data: _setData
                        });
                        // console.log(that.state.data);
                        getSensorData();
                        /* Dynamic Vars */
                        var planetData = {
                            labels: graphData.labels,
                            datasets: graphData.datasets
                        };
                        /* Dynamic Vars */

                        var chartOptions = {
                            scales: {
                                xAxes: [{
                                    barPercentage: 1,
                                    categoryPercentage: 0.6
                                }],
                                yAxes: graphData.yAxis
                            }
                        };

                        this.barChart = new Chart(ctx, {
                            type: 'line',
                            data: planetData,
                            options: chartOptions
                        });
                    };
                };
                request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                request.send();
            }

            $.ajax({
                    url: '/superset/selectData/2/Sensor_Details/',
                    method: 'GET',              
                    data: {
                        selectCol : "Sensor_Value_Type as type",
                        whereClause : "Sensor_ID = '"+alertInfo[1].sensorId+"'"
                    },                                        
                    success: function(data) {
                        data = JSON.parse(data);
                        sensorType = data[0].type;
                        sensorAjax(sensorType);
                    }
            });
            sensorDataInterval = setInterval(function(){ 
                sensorAjax(sensorType);
            }, 15000);
          }
      } 
  }
  updateComponentView(value){
    this.setState({
        isDetailEnabled: value
    });
  }

  dateFormate(date){
      var _newDate = new Date(date);
      var _date = _newDate.getMonth()+1 + "/" + _newDate.getDate() + "/" + _newDate.getFullYear();
      var _dateTime = ('0'  + _newDate.getHours()).slice(-2)+':'+('0' + _newDate.getMinutes()).slice(-2);
    return [_date,_dateTime];
  }
  assigntoUser(user, id, firstCall){
    // var that = this;
    
    if(!firstCall){
        this.state.alertData[1].assignTo = user;
        $.ajax({
            url: "/superset/update_table/2/Alert_Details/",
            method: "POST",
            data: {col:"Assign_Type", val: "'"+user+"'", key: "Alert_ID", keyValue: "'"+ id +"'"},
            success: function(data){
                // that.props.updateData(_data);
            }        
        });
    }
          
    if(user && user.trim() != 'NULL'){
        this.setState({
            assignedToUser: user,
            isMenuEnabled: false
        });
    }else{
        this.setState({
            assignedToUser: "Assign To",
            isMenuEnabled: false
        });
    }
  }
  deprioritize(alertId, alertPriority){
    if(this.state.alertData[1].completedTime){
        return false;
    }

    alertPriority = alertPriority == 'High' ? 'Low' : 'High'; 
    
    var _deprioritizeClass = alertPriority == 'Low' ? 'prioritize' : '';
    
    this.setState({
        deprioritizeClass: _deprioritizeClass
    });
    
    // var that = this;
    this.state.data.alertInfo[7] = alertPriority;
    this.state.alertData[1].alertPriority = alertPriority;
    $.ajax({
        url: "/superset/update_table/2/Alert_Details/",
        method: "POST",
        data: {col:"Alert_Priority", val: "'"+alertPriority+"'", key: "Alert_ID", keyValue: "'"+ alertId +"'"},
        success: function(data){
            
        }        
    });
      
     // console.log(alertInfo);
  }
  resolved(alertId){
    if(this.state.alertData[1].completedTime){
        return false;
    }

    var d = new Date();
    d = d.toISOString().split('.')[0];
    this.state.alertData[1].completedTime = d;
    this.setState({
        resolvedClass: 'resolved-disabled'
    });

    $.ajax({
        url: "/superset/update_table/2/Alert_Details/",
        method: "POST",
        data: {col:"Completed_Time", val: "'"+d+"'", key: "Alert_ID", keyValue: "'"+ alertId +"'"},
        success: function(data){
        }        
    });
    
  }
   render() {
    var tmp = this.state.data;
      return (
        <div id="alertDetail" ref="alertDetail" className={"alertDetailPopup "+classNames({
            'isDetailShow': this.state.isDetailEnabled,
            'isDetailHide': !this.state.isDetailEnabled
            })}>
        <div className="overLay" onClick={(e) => this.removePopup()}></div>
            <div className="popupContainer">
                <h1>Alert Details</h1>
                <div className="sections">
                    <div className="leftSection">
                        <ul>
                            <li><p className="title">Alert ID:</p><p className="content">{tmp.alertInfo[0]}</p></li>
                            <li><p className="title">Alert Description:</p><p className="content">{tmp.alertInfo[1]}</p></li>
                            <li><p className="title">Parameter:</p><p className="content">{tmp.alertInfo[2]}</p></li>
                        </ul>
                    </div>
                    <div className="rightSection">
                            <ul>
                                <li><p className="title">Location:</p><p className="content">{tmp.alertInfo[3]} > {tmp.alertInfo[4]}</p></li>
                                <li><p className="title">Date:</p><p className="content">{this.dateFormate(tmp.alertInfo[5])[0]}</p></li>
                                <li><p className="title">Time:</p><p className="content">{this.dateFormate(tmp.alertInfo[5])[1]}</p></li>
                            </ul>
                    </div>
                </div>
                <div className="dataChart">
                    {/* <h3>{tmp.alertInfo[4]} Health</h3> */}
                    <h3>Sensor Readings</h3>
                    <canvas id="graphCanvas" width="660" height="200"></canvas>
                </div>
                <div className="buttonBar">
                    <div className="assignalert button button-highpriority" onClick={(e) => this.onMouseoverEvent()}><span>{this.state.assignedToUser}</span></div>
                    <div className={"resolved button button-resolved "+ this.state.resolvedClass} onClick={(e) => this.resolved(this.state.data.alertInfo[0])}>Resolved</div>
                    <div className={"deprioritize button button-lowpriority "+ this.state.deprioritizeClass + " " + this.state.resolvedClass} onClick={(e) => this.deprioritize(this.state.data.alertInfo[0], this.state.data.alertInfo[7])}>Deprioritize</div>
                </div>
                <div className={classNames("assignedToBar", {
                    'isMenuShow': this.state.isMenuEnabled,
                    'isMenuHide': !this.state.isMenuEnabled
                    })} >
                    <ul>
                        <li data-refName="Me" onClick={(e) => this.assigntoUser("Me", this.state.data.alertInfo[0], false)}>Me</li>
                        <li data-refName="Jane Doe" onClick={(e) => this.assigntoUser("Jane Doe", this.state.data.alertInfo[0], false)}>Jane Doe</li>
                        <li data-refName="John Smith" onClick={(e) => this.assigntoUser("John Smith", this.state.data.alertInfo[0], false)}>John Smith</li>
                        <li data-refName="Jack Brown" onClick={(e) => this.assigntoUser("Jack Brown", this.state.data.alertInfo[0], false)}>Jack Brown</li>
                    </ul>
                </div>
            </div>
        </div>
    );
   }
}

module.exports = AlertDetail;