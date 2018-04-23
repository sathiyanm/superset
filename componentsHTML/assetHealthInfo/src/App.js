import React, { Component } from 'react';
import './App.css';

	class App extends Component {
    state = { loading: false };

    componentDidMount() {
		
		var orientation = "to top";
		var humidityColor = "#0f8b8d";
		var humidityValuePercent="55"; // pass the value coming from DB
		var temperatureValuePercent="40"; // pass the value coming from DB
		var vibrationValuePercent="20"; // pass the value coming from DB
	
		var tempRedValue = "25"; // pass this from DB as of now i made it 40 as per VD
		var vibrationRedValue = "30";
		var humidityRedValue = "10";
		
		var colorTwo = "#ffffff 10%";
		var colorThree="#ffffff 100%";		
			
		//var element = document.getElementById('humidityDiv');	
		var addRule = (function (style) {
		var sheet = document.head.appendChild(style).sheet;
		return function (selector, css) {
			var propText = typeof css === "string" ? css : Object.keys(css).map(function (p) {
				return p + ":" + (p === "content" ? "'" + css[p] + "'" : css[p]);
			}).join(";");
			sheet.insertRule(selector + "{" + propText + "}", sheet.cssRules.length);
		};
		})(document.createElement("style"));

		//For media Queries
		var x = window.matchMedia("(max-width: 1024px) and (min-width: 768px) and (orientation:landscape)")
		lanscapeFunction(x) // Call listener function at run time
		x.addListener(lanscapeFunction) // Attach listener function on state changes
		
		
		
		var y = window.matchMedia("(min-device-width: 481px) and (max-device-width: 1024px) and (orientation:portrait)")
		portraitFunction(y) // Call listener function at run time
		y.addListener(portraitFunction) // Attach listener function on state changes
		//Red Values
		//document.getElementById("tempRedValue").innerHTML = tempRedValue+"%";
		//document.getElementById("vibrationRedValue").innerHTML = vibrationRedValue+"%";
		//document.getElementById("humidityRedValue").innerHTML = humidityRedValue+"%";
		
		//added now - 2/23/2018:4:54pm
				
		function lanscapeFunction(x) {
			if (x.matches) { // If media query matches
			//alert("X matches in IFF");
				addRule("div.humidityDiv:before", {
					display: "block",
					/*background:"brown",*/
					height: "80vh",
					position: "absolute",
					width: "75%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+humidityValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//temperature Div
				
				addRule("div.temperatureDiv:before", {
					display: "block",
					/*background:"brown",*/
					height: "80vh",
					position: "absolute",
					width: "75%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+temperatureValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				addRule("div.vibrationDiv:before", {
					display: "block",
					/*background:"brown",*/
					height: "80vh",
					position: "absolute",
					width: "75%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+vibrationValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				addRule("span.humidityValue:before", {
					position: "absolute",
					/*background:"brown",*/
					float:"right",
					bottom:humidityValuePercent-2+"%",
					left:"90%",
					content: humidityValuePercent+"%",
					color:"#0f8b8d"
				});	
				
				//added now - 2/23/2018:4:54pm
				addRule("span.humidityRedline:before", {
					position: "absolute",
					/*background:"brown",*/
					"border-bottom": "2px dotted #cc0000",
					bottom:humidityRedValue-2+"%",
					width:70+"%",
					content: humidityRedValue+"%",
					color:"#cc0000"
					
				});	
				
				
			} 
			else
			{
				//alert("X matches in ELSEE");
				addRule("div.humidityDiv:before", {
				display: "block",				
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+humidityValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				//alert("tempppppppp"+temperatureValuePercent);
				//temperature Div
				addRule("div.temperatureDiv:before", {
				display: "block",				
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+temperatureValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//VibrationDiv
				
				addRule("div.vibrationDiv:before", {
				display: "block",				
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+vibrationValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
					
				//alert("humidityValuePercent--"+humidityValuePercent);
				//alert("temp--"+temperatureValuePercent);
				//alert("vibraValuePercent--"+vibrationValuePercent);
				//Humidity DB Value
				addRule("span.humidityValue:before", {
					position: "absolute",					
					float:"right",
					bottom:humidityValuePercent-4+"%",
					left:"74%",
					content: humidityValuePercent+"%",
					color:"#0f8b8d"
				});	
				//Temperature DB Value
				addRule("span.temperatureValue:before", {
					position: "absolute",					
					float:"right",
					bottom:temperatureValuePercent-4+"%",
					left:"74%",
					content: temperatureValuePercent+"%",
					color:"#0f8b8d"
				});	
				
				//Vibration DB Value
				addRule("span.vibrationValue:before", {
					position: "absolute",					
					float:"right",
					bottom:vibrationValuePercent-4+"%",
					left:"74%",
					content: vibrationValuePercent+"%",
					color:"#0f8b8d"
				});	
				
				//Humidity Threshold limit red line
				addRule("span.humidityRedline:before", {
					position: "absolute",
					float:"right", 
					/*background:"brown",*/
					"border-bottom": "2px dotted #cc0000",
					bottom:humidityRedValue-2+"%",
					width:70+"%",
					content: humidityRedValue+"%",
					color:"#cc0000"
					
				});	
				//Humidity Threshold red limit value
				addRule("span.humidityRedValue:before", {
					position: "absolute",
					float:"right", 
					/*background:"brown",*/
					"border-bottom": "2px dotted #cc0000",
					bottom:humidityRedValue-2+"%",
					width:70+"%",
					content: humidityRedValue+"%",
					color:"#cc0000"
					
				});	
				
				//temperature
				
				addRule("span.tempRedline:before", {
					position: "absolute",
					float:"right", 
					/*background:"brown",*/
					"border-bottom": "2px dotted #cc0000",
					bottom:tempRedValue-2+"%",
					width:70+"%",
					content: tempRedValue+"%",
					color:"#cc0000"
					
				});	
				
				addRule("span.vibrationRedline:before", {
					position: "absolute",
					float:"right", 
					/*background:"brown",*/
					"border-bottom": "2px dotted #cc0000",
					bottom:vibrationRedValue-2+"%",
					width:70+"%",
					content: vibrationRedValue+"%",
					color:"#cc0000"
					
				});	
				
				/*addRule("span.humidityRedValue:before", {
					position: "absolute",
					
					"border-bottom": "2px dotted #cc0000",
					bottom:humidityRedValue-2+"%",
					width:70+"%",
					content: humidityRedValue+"%",
					color:"#cc0000"
					
				});	*/
			
			}
		}
		
		function portraitFunction(y) {
			if (y.matches) { // If media query matches
			//alert("Y Matches in IFF");
				addRule("div.humidityDiv:before", {
					display: "block",
					/*background:"pink",*/
					height: "80vh",
					position: "absolute",
					width: "90%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+humidityValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//temperature div
				addRule("div.temperatureDiv:before", {
					display: "block",
					/*background:"pink",*/
					height: "80vh",
					position: "absolute",
					width: "90%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+temperatureValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//vibration div
				addRule("div.vibrationDiv:before", {
					display: "block",
					/*background:"pink",*/
					height: "80vh",
					position: "absolute",
					width: "90%",
					opacity: "0.75",
					content: "''",
					background: "linear-gradient("+orientation+","+humidityColor+" "+vibrationValuePercent+"%,"+colorTwo+","+colorThree+")"	
									//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				addRule("span.humidityValue:before", {
					position: "absolute",
					/*background:"gold",*/
					float:"right",
					bottom:humidityValuePercent-2+"%",
					left:"100%",
					content: humidityValuePercent+"%",
					color:"#0f8b8d"
				});	
			}
			else
			{
				//alert("Yes this Else");
				//alert("X matches in ELSEE");
				addRule("div.humidityDiv:before", {
				display: "block",
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+humidityValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//temperature Div
				addRule("div.temperatureDiv:before", {
				display: "block",
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+temperatureValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				//vibration Div
				addRule("div.vibrationDiv:before", {
				display: "block",
				height: "80vh",
				position: "absolute",
				width: "66%",
				opacity: "0.75",
				content: "''",
				background: "linear-gradient("+orientation+","+humidityColor+" "+vibrationValuePercent+"%,"+colorTwo+","+colorThree+")"	
							//linear-gradient("to top,#0f8b8d 55%,#ffffff 50%,#ffffff 100%)
				});
				
				
				addRule("span.humidityValue:before", {
					position: "absolute",
					float:"right",
					bottom:humidityValuePercent-4+"%",
					left:"74%",
					content: humidityValuePercent+"%",
					color:"#0f8b8d"
				});	
			}
			
			
				
		}

    
	}
  render() {
    return (
       <div>
				<title>Order Fulfillment</title>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="stylesheet" href="asset.css" />
				<div className="legendDiv">
				  <ul className="legend">
					<li><span className="currentVal" /> Current Value</li>
					<li><span className="thresoldVal" /> Threshold</li>
				  </ul>
				</div>
				<div id="flex-container">
				  <div className="flex-item">
					<div className="humidity">
					  <div className="mainDiv">
						<div id="humidityDiv" className="humidityDiv">
						  <span id="humidityValuePercent" className="humidityValue" />
						  <span id="humidityRedline" className="humidityRedline"><label id="humidityRedValue" className="humidityRedValue" /></span>
						</div>
						<div className="humidityVal">
						  <div id="minValue" className="minValue">0%</div>			
						</div>
					  </div>
					  <div className="bar-hd">Humidity</div>
					</div>
				  </div>
				  <div className="flex-item">
					<div className="humidity">
					  <div className="mainDiv">
						<div id="humidityDiv" className="temperatureDiv">
						  <span id="temperatureValuePercent" className="temperatureValue" />
						  <span id="tempRedline" className="tempRedline"><label id="tempRedValue" className="tempRedValue" /></span>
						</div>
						<div className="humidityVal">
						  <div id="minValue" className="minValue">0%</div>			
						</div>
					  </div>
					  <div className="bar-hd">Temperature</div>
					</div>
				  </div>
				  <div className="flex-item">
					<div className="humidity">
					  <div className="mainDiv">
						<div id="humidityDiv" className="vibrationDiv">
						  <span id="vibrationValuePercent" className="vibrationValue" />
						  <span id="vibrationRedline" className="vibrationRedline"><label id="vibrationRedValue" className="vibrationRedValue" /></span>
						</div>
						<div className="humidityVal">
						  <div id="minValue" className="minValue">0%</div>			
						</div>
					  </div>
					  <div className="bar-hd">Vibration</div>
					</div>
				  </div>
				</div>
			  </div>			
			);
    
  }
}

export default App;
