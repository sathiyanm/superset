import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import classNames from 'classnames';
import Chart from 'chart.js';
    
var outputObject = {};

class AlertDetail extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);

    this.state = {
        isMenuEnabled: false,
        isDetailEnabled: false,
        assignedToUser: "Assign Alert",
        data : {
            "alertInfo":["HIT","Air compressor Failure","Quality","Production Line", "Asset 4", "Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)"], 
            "dateStamp":["Wed Oct 18 2017 12:41:34 GMT+0000 (UTC)","Wed Oct 18 2017 12:51:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:01:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:05:34 GMT+0000 (UTC)","Wed Oct 18 2017 01:21:34 GMT+0000 (UTC)"],
            "sensorInfo":{"name":"Humidity","sensorValues":[
                {"name":"Humidity","data":[63.27, 54.12,32.1,12.3,55.77], "valueType":"%"},
                {"name":"Temperature","data":[25.8,23.2,14.2,33.2,20.1], "valueType":"F"},
                {"name":"Dew Point","data":[16.3,11.2,19.2,20.2,11.1], "valueType":"Temp"}
            ]}
        }
    };
  }

  handleLoad(){
    let element = this.refs.oeeCard;
    let ctx = document.getElementById("graphCanvas").getContext('2d');
    let colorArray = ['rgba(80, 227, 194, 0.6)','rgba(15, 139, 141, 0.6)','rgba(65, 117, 5, 0.6)'];
    let graphData = {"datasets":[],"labels":[],"yAxis":[]};
    var data = this.state.data;
    console.log(data);

    $("#alertDetail .buttonBar .button-highpriority").on("click", function(e){
        console.log("hover");
        $("#alertDetail .buttonBar .nameSelection").fadeToggle();
    });
    $("#alertDetail .buttonBar .nameSelection li").on("click", function(e){
        var _curObj = $(e.target);
        var _val = _curObj.attr("data-refName");
        $(".assignalert.button.button-highpriority span").html(_val);
    });

    /* Graph Plot Logic */
    function getSensorData(){
        var _dataSet = data.sensorInfo.sensorValues;
        var labels = [];
        var yAxes = [];
        
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
                tempData.yAxisID = _dataSet[i].name.replace(" ","-");
                graphData.yAxis.push({"id":_dataSet[i].name.replace(" ","-")});
                graphData.datasets.push(tempData);
            }

            for(var j=0; j<data.dateStamp.length; j++){
                var _newDate = new Date(data.dateStamp[j]);
                graphData.labels.push((_newDate.getMonth() + 1) + '/' + _newDate.getDate() + " " +_newDate.getHours()+':'+_newDate.getMinutes());
            }

            console.log(graphData);
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

        var barChart = new Chart(ctx, {
            type: 'line',
            data: planetData,
            options: chartOptions
        });
    /* Graph Plot Logic Ends */
    
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
        $("#alertDetail").remove();
        $("body").append(_popup);
  }
  removePopup(){
    this.setState({
        isDetailEnabled: false,
        assignedToUser: "Assign Alert",
    });
  }

  componentWillReceiveProps(nextProps) { 
      if(nextProps){
        this.updateComponentView(nextProps.isDetailEnabled);
        this.getDataFromURL(nextProps.alertInfoId);
        if(nextProps.alertInfoId.length > 0){
            this.assigntoUser(nextProps.alertInfoId[1][6]);
        }
    }
  }
  getDataFromURL(alertInfo){
      var _setData = this.state.data;
      if(alertInfo.length > 0){
        _setData.alertInfo[0] = alertInfo[1].id;
        _setData.alertInfo[1] = alertInfo[1].description;
        _setData.alertInfo[2] = alertInfo[1].parameter;
        _setData.alertInfo[3] = alertInfo[1].location;
        _setData.alertInfo[4] = alertInfo[1].dateTime;
        _setData.alertInfo[5] = alertInfo[1].activeTime;
        this.setState({
            data: _setData
        });
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
      var _dateTime = _newDate.getHours()+":"+_newDate.getMinutes();
    return [_date,_dateTime];
  }
  assigntoUser(user){
      if(user){
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
  deprioritize(alertId){
      console.log(alertId);
  }
   render() {
    var tmp = this.state.data;
      return (
        <div id="alertDetail" ref="alertDetail" className={classNames({
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
                    <h3>{tmp.alertInfo[4]} Health</h3>
                    <canvas id="graphCanvas" width="660" height="200"></canvas>
                </div>
                <div className="buttonBar">
                    <div className="assignalert button button-highpriority" onMouseOver={(e) => this.onMouseoverEvent()}><span>{this.state.assignedToUser}</span>
                        <div className='nameSelection' className={classNames("nameSelection", {
            'isMenuShow': this.state.isMenuEnabled,
            'isMenuHide': !this.state.isMenuEnabled
            })} >
                            <h2>Assign To:</h2>
                            <ul>
                                <li data-refName="Me" onClick={(e) => this.assigntoUser("Me")}>Me</li>
                                <li data-refName="Line Operator" onClick={(e) => this.assigntoUser("Line Operator")}>Line Operator</li>
                                <li data-refName="Factory Operator" onClick={(e) => this.assigntoUser("Factory Operator")}>Factory Operator</li>
                            </ul>
                        </div>
                    </div>
                    <div className="deprioritize button button-lowpriority" onClick={(e) => this.deprioritize(this.state.data.alertInfo[0])}>Deprioritize</div>
                </div>
            </div>
        </div>
    );
   }
}

module.exports = AlertDetail;