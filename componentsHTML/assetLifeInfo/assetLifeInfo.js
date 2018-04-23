import React from 'react';
import ReactDOM from 'react-dom';


    class AssetLifeInfo extends React.Component {
		constructor(props) {
			super(props);
			//this.handleLoad = this.handleLoad.bind(this);
			this.state = {
				sensorData : [{id: "SV01", "name":"Vibration Sensor", "data":[20,30,70,50,40,90], // Actual Data X,Actual Data Y,Actual Data Z, Threshold Data X, Threshold Data Y ...
							"valueNames": ["xAxis","yAxis","zAxis"], "dataType": ["Hz","Hz","Hz"]}]
				}
			  // binding this to event-handler functions
			  /*this.onMarkerClick = this.onMarkerClick.bind(this);
			  this.onMapClicked = this.onMapClicked.bind(this);*/
			}
       render() {
			var tmp = this.state.sensorData;
			var sensorList = function(data, valueNames, dataType){
				var _arrayHalf = data.length/2,
					_actualData = data.slice(0,_arrayHalf),
					_thresholdData = data.slice(_arrayHalf, data.length),
					_width = {width: (100 / _arrayHalf)+"%"},
					_height = function(actual, threshold){
						return {height: ((actual * 100) / threshold)+"%"}
					},
					_positionTop = function(actual, threshold){
						return {bottom: ((actual * 100) / threshold)+"%"}
					};
				return <div className="sensorValues">
						{_actualData.map((value, key) => (
							<div className="flex-item" key={key} style={_width}>
								<div className="sensorBarWrapper">
									<div className="sensorBar"  style={_height(value, _thresholdData[key])}></div>
									<div className="lowerThreshold">0 {dataType[key]}</div>
									<div className="thresholdValue">{_thresholdData[key]} {dataType[key]}</div>
									<div className="actualValue" style={_positionTop(value, _thresholdData[key])}>{value} {dataType[key]}</div>
								</div>
								<div className="sensorValueName">{valueNames[key]}</div>
							</div>
						))}
						</div>;
			  }
            return (
				<div id = "assetHealthInfo"  ref="assetHealthInfo">
					<div className="legendDiv">
						<ul className="legend">
						<li><span className="currentVal" /> Current Value</li>
						<li><span className="thresoldVal" /> Threshold</li>
						</ul>
					</div>
					<div id="flex-container">
					{tmp.map((item,key) => (
						<div className="sensorValue" key="key" data-keyname="key">
						{sensorList(item.data, item.valueNames, item.dataType)}
						<h2>{item.name}</h2>
						</div>
					))}
					</div>
				</div>
            );
        };
    
    }

module.exports = AssetLifeInfo;
