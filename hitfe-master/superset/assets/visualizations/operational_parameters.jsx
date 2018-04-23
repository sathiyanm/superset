import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Chart from 'chart.js';

import './operational_parameters.css';

function operationalParametersViz(slice, payload) {

    const container = document.querySelector(slice.selector);

    const json = payload.data.data;

    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Operational Parameters';

    let vizData = {
        "oee":[55.3, "critical", -3], 
        "availability":[96, "normal", 2],
        "performance":[76, "warning", -3],
        "quality":[65, "critical", 1]
    }

    if(json.length > 0){
        vizData = dataObj(json);
    }
    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

    function dataObj(json){
        return {
            "oee": [json[0].OEE_Percentage, json[0].OEE_Status.toLowerCase(), json[0].OEE_Variance],
            "availability": [json[0].Availability_Percentage, json[0].Availability_Status.toLowerCase(), json[0].Availability_Variance],
            "performance": [json[0].Performance_Percentage, json[0].Performance_Status.toLowerCase(), json[0].Performance_Variance],
            "quality": [json[0].Quality_Percentage, json[0].Quality_Status.toLowerCase(), json[0].Quality_Variance]
        };
    }

    var outputObject = {};
    var refreshData = null;

    class OeeCard extends React.Component {

        constructor(props) {
            super(props);
            this.handleLoad = this.handleLoad.bind(this);

            this.state = {
                oeeCardData :vizData
            };
        }

    handleLoad(){
        let element = this.refs.oeeCard;
        let ctx = document.getElementById("myChart").getContext('2d');
        let backgroundColors = ['rgb(204, 0, 0)','rgba(0, 0, 0, 0.1)'];
        let _data = [this.state.oeeCardData.oee[0], (100 - Number(this.state.oeeCardData.oee[0]))];
            if(this.state.oeeCardData.oee[1] == "critical"){
                backgroundColors[0] = 'rgb(204, 0, 0)';
            }else if(this.state.oeeCardData.oee[1] == "warning"){
                backgroundColors[0] = 'rgb(249,220,51)';
            }else{
                backgroundColors[0] = 'rgb(56, 141, 60)';
            }
            var doughnutData = {
                datasets: [{
                    data: _data,
                    backgroundColor: backgroundColors
                }],
                labels: [
                    'OEE',
                    'Remaining'
                ]
            };
            var chartOptions =  {
                legend: {
                        display: false,
                        labels: {
                            fontColor: 'rgb(255, 99, 132)',
                            display: false
                        }
                    },
                    tooltips:{
                        display:false
                    },
                    borderWidth:5,
                    cutoutPercentage:80
                };
            var myDoughnutChart = new Chart(ctx, {
                    type: 'doughnut',
                    data: doughnutData,
                    options: chartOptions
                });
    }

    getPosNeg(val){
        let _data = [0,"top"];
        if(val < 0){
            _data[0] = -1 * val;
            _data[1] = "bottom";
        }else{
            _data[0] = val;
            _data[1] = "top";
        }
        return _data;
    }

    getRemainder(val){
        var _dec = (val + "").split(".");
        return _dec;
    }

    componentDidMount() {
        window.addEventListener("resize", this.handleLoad);
        this.handleLoad();
        var that = this;
        var d = new Date();
        clearInterval(refreshData);
        refreshData = setInterval(function(){
            $.ajax({
                url: url,
                method: 'GET',
                data : {
                    form_data : JSON.stringify(formData),
                    dt : d.getTime()
                },
                success: function(data){
                    let json = data.data.data;
                    if(json.length > 0){
                        var _setData = dataObj(json);
                        that.setState({
                            oeeCardData: _setData
                        });
                        that.handleLoad();
                    }
                },
            });
        },15000);
    }

    componentWillUnmount() {
        clearInterval(refreshData);
        window.removeEventListener("resize", this.handleLoad);		
    }

    styleOptions(style){
        var _style = {
            width: style+"%"
        };
        return _style;
    }

    render() {
        var tmp = this.state.oeeCardData;
        return (
            <div id="oeeCard" ref="oeeCard">
            	<div className="component_hd xs-m-15"><img className="xs-mr-10" src = "/static/assets/images/icon-percentage.png"></img><span>{vizLabel}</span></div>
            <div className="panelCard oeeVals">
                <div className="doughnutGraph">
                    <div className="oeeMainVal">
                        <h2>OEE</h2>
                        <h3><span className="percValue">{this.getRemainder(tmp.oee[0])[0]}</span><span className="remValue">.{this.getRemainder(tmp.oee[0])[1]}%</span></h3>
                    </div>
                    <canvas id="myChart" width="115" height="115"></canvas>
                </div>
                <div className="valueInfo centerAlign">
                    <div className={"arrow "+ this.getPosNeg(tmp.oee[2])[1]}></div>
                    <div className="valueContent" ><span>{this.getPosNeg(tmp.oee[2])[0]}%</span> in past 7 days</div>
                </div>
            </div>
            <div className="panelCard horizontalCard availability">
                <h3>Availability</h3>
                <h2>{tmp.availability[0]}%</h2>
                <div className="percArea">
                    <div className={["percBar "+tmp.availability[1]]}><div className="perc" style={this.styleOptions(tmp.availability[0])}></div></div>
                </div>
                <div className="valueInfo">
                    <div className={"arrow "+ this.getPosNeg(tmp.availability[2])[1]}></div>
                    <div className="valueContent"><span>{this.getPosNeg(tmp.availability[2])[0]}%</span> in past 7 days</div>
                </div>
            </div>
            <div className="panelCard horizontalCard performance">
                <h3>Performance</h3>
                <h2>{tmp.performance[0]}%</h2>
                <div className="percArea">
                    <div className={["percBar "+tmp.performance[1]]}><div className="perc" style={this.styleOptions(tmp.performance[0])}></div></div>
                </div>
                <div className="valueInfo">
                    <div className={"arrow "+ this.getPosNeg(tmp.performance[2])[1]}></div>
                    <div className="valueContent"><span>{this.getPosNeg(tmp.performance[2])[0]}%</span> in past 7 days</div>
                </div>
            </div>
            <div className="panelCard horizontalCard quality">
                <h3>Quality</h3>
                <h2>{tmp.quality[0]}%</h2>
                <div className="percArea">
                    <div className={["percBar "+tmp.quality[1]]}><div className="perc" style={this.styleOptions(tmp.quality[0])}></div></div>
                </div>
                <div className="valueInfo">
                    <div className={"arrow "+ this.getPosNeg(tmp.quality[2])[1]}></div>
                    <div className="valueContent"><span>{this.getPosNeg(tmp.quality[2])[0]}%</span> in past 7 days</div>
                </div>
            </div>
        </div>
        );
    }
    }

    ReactDOM.render(<OeeCard />, container);
}

module.exports = operationalParametersViz;



