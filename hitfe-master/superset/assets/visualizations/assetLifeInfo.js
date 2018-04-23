import React from 'react';
import ReactDOM from 'react-dom';
import './assetLifeInfo.css';


function assetLifeInfoViz(slice, payload) {
    

	const container = document.querySelector(slice.selector);
	
	let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Asset Health';

    //const {form_data:formData, data:json} = payload;

	const hasData = payload.data && payload.data.length > 0;
	
		
	const json = payload.data.data;
	let vizData = [{"data":[20,30,70,50,40,90], // Actual Data X,Actual Data Y,Actual Data Z, Threshold Data X, Threshold Data Y ...
					"valueNames": ["xAxis","yAxis","zAxis"], "dataType": ["Hz","Hz","Hz"], "sensorStatus":["normal","normal","normal"]}];
	
	var sensorLength = json.length;
    if(sensorLength > 0){
		vizData = dataObj(json);
		
	}
	
	var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];
	
	function dataObj(json){
        var data = []; 
		var valueNames = [];
		var dataType = [];
		var sensorStatus = [];

		for(var j in json){
			data.push(json[j].Current_Value);
			valueNames.push(json[j].Sensor_Name);
			dataType.push(json[j].Sensor_Value_Type);
			sensorStatus.push(json[j].Sensor_Status);
		}
		for(var i in json){
			data.push(json[i].Threshold_Value);
		}

		return [{"data":data, 
        	"valueNames": valueNames, "dataType": dataType, "sensorStatus": sensorStatus}]
    }

	//till here

    if(hasData){
        //progressData = json.data[0][0] / 100;
    }  
    
	var refreshData = null;

    class AssetLifeInfo extends React.Component {
			constructor(props) {
				super(props);
				this.handleLoad = this.handleLoad.bind(this);
				//this.handleLoad = this.handleLoad.bind(this);
				this.state = {
					sensorData: vizData
				};
				  // binding this to event-handler functions
				  /*this.onMarkerClick = this.onMarkerClick.bind(this);
				  this.onMapClicked = this.onMapClicked.bind(this);*/
				}
			componentDidMount() {
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
									sensorData: _setData
								});
								that.handleLoad();
							}
						},
					});
				},15000);
			}

			componentWillUnmount() {
				clearInterval(refreshData);
				this.handleLoad();				
			}

			handleLoad(){
				var element = this.refs.assetHealthInfo;
				var flexContainer = $("#flex-container .sensorValues"),
					that = this.state,
					fakeBar = '<div class="flex-item" style="width:33%">'+
									'<div class="sensorBarWrapper fakeBar">'+
										'<div class="sensorBar"></div>'+
									'</div>'+
									'<div class="sensorValueName">&nbsp;</div>'+
								'</div>';
					if(that.sensorData[0].valueNames.length < 2 && flexContainer.find('.flex-item').length < 2){
						flexContainer.append(fakeBar);
						flexContainer.prepend(fakeBar);
					}
			  }

		   render() {
				var tmp = this.state.sensorData;
				var sensorList = function(data, valueNames, dataType, sensorStatus){
					var _width = {width: (100 / (data.length/2))+"%"},
						_minClass = "",
						_arrayHalf = data.length/2,
							_actualData = data.slice(0,_arrayHalf),
							_thresholdData = data.slice(_arrayHalf, data.length),
							_bgColor = "rgba(15,139,141,.75)",
							_setBarHeight = 0;
					var _allCSS = function(actual, threshold){
						var _setThresholdHeight = 0;
							_setBarHeight = ((actual * 100) / threshold);
							if(parseInt(threshold) < parseInt(actual)){
								_bgColor = "rgba(204, 0, 0,.75)";
								_setThresholdHeight = 110 - ((threshold * 100) / actual);
								_setBarHeight = 90;
							}
							return [{top: _setThresholdHeight+"%"},{height: _setBarHeight+"%"}, {bottom: _setBarHeight+"%"}, {backgroundColor:_bgColor}] // Threshold Height, barHeight
						};
						if(tmp[0].valueNames.length < 2){
							_width = {width: "33%"};
						}
						if(tmp[0].valueNames.length > 4){
							_minClass = "shrinkBar";
						}
					return <div className="sensorValues">
							{_actualData.map((value, key) => (
								<div className={"flex-item "+ _minClass} key={key} style={_width}>
									<div className="sensorBarWrapper">
										<div className="sensorBar" style={_allCSS(value, _thresholdData[key])[1]}></div>
										<div className="lowerThreshold">0 {dataType[key]}</div>
										<div className="thresholdValue" style={_allCSS(value, _thresholdData[key])[0]}>{_thresholdData[key]} {dataType[key]}</div>
										<div className="actualValue" style={_allCSS(value, _thresholdData[key])[2]}>{value} {dataType[key]}</div>
									</div>
									<div className="sensorValueName">{valueNames[key]}</div>
								</div>
							))}
							</div>;
				  }
				return (
					<div id = "assetHealthInfo"  ref="assetHealthInfo">
						<div className="component_hd xs-m-15"><img className="xs-mr-10" src = "/static/assets/images/icon-plus.png"></img><span>{vizLabel}</span></div>
						<div className="legendDiv">
							<ul className="legend">
							<li><span className="currentVal" /> Current Value</li>
							<li><span className="thresoldVal" /> Threshold</li>
							</ul>
						</div>
						<div id="flex-container">
						{tmp.map((item,key) => (
							<div className="sensorValue" key="key" data-keyname="key">
							{sensorList(item.data, item.valueNames, item.dataType, item.sensorStatus)}
							<h2>Sensor Information</h2>
							</div>
						))}
						</div>
					</div>
				)
			}
    };

    ReactDOM.render(<AssetLifeInfo />, container);
}

module.exports = assetLifeInfoViz;
