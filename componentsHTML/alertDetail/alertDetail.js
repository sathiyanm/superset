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

    $(".assignalert.button.button-highpriority").hover(function(){
        $("#alertDetail .buttonBar .nameSelection").fadeToggle();
    });
    $("#alertDetail .buttonBar .nameSelection li").click(function(e){
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

  getRemainder(val){
    var _dec = (val + "").split(".");
    return _dec;
  }

  componentDidMount() {
    this.handleLoad();
  }

  dateFormate(date){
      var _newDate = new Date(date);
      var _date = _newDate.getMonth()+1 + "/" + _newDate.getDate() + "/" + _newDate.getFullYear();
      var _dateTime = _newDate.getHours()+":"+_newDate.getMinutes();
    return [_date,_dateTime];
  }

  deprioritize(alertId){
      console.log(alertId);
  }
   render() {
    var tmp = this.state.data;
      return (
        <div id="alertDetail" ref="alertDetail">
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
                <div className="assignalert button button-highpriority"><span>Assign Alert</span>
                    <div className='nameSelection'>
                        <h2>Assign To:</h2>
                        <ul>
                            <li data-refName="Me">Me</li>
                            <li data-refName="Line Operator">Line Operator</li>
                            <li data-refName="Factory Operator">Factory Operator</li>
                        </ul>
                    </div>
                </div>
                <div className="deprioritize button button-lowpriority" onClick={(e) => this.deprioritize(this.state.data.alertInfo[0])}>Deprioritize</div>
            </div>
        </div>
    );
   }
}

module.exports = AlertDetail;