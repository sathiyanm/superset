import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './factory_floor_map.css';
	
function factoryFloorMapViz(slice, payload) {
    const container = document.querySelector(slice.selector);

    const json = payload.data.data;

    const user = payload.form_data.user;

    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Factory Floor Map';

    let vizData = {
        "PL01":["Production Line 1","critical","90","critical","2"], 
        "PL02":["Production Line 2","critical","85","critical","5"],
        "PL03":["Production Line 3","normal","65","normal","0"],
        "PL04":["Production Line 4","warning","90","warning","2"], 
        "PL05":["Production Line 5","warning","85","warning","5"],
        "PL06":["Production Line 6","normal","65","normal","0"]
    };
     
    var factoryLength = json.length;
    if(factoryLength > 0){
        vizData = dataObj(json);
        
    }

    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

    function dataObj(json){
        var _data = {}; 
        for (var i=0; i<factoryLength; i++){
            _data[json[i].Line_ID] = [
                json[i].Production_Line_Name,
                json[i].OEE_Status.toLowerCase(), json[i].OEE_Percentage, 
                json[i].OEE_Status.toLowerCase()
            ];

        }
        return _data;
    }
    
    var outputObject = {};

    var refreshData = null;
    class FactoryFloor extends React.Component {

        constructor(props) {
            super(props);
            this.handleLoad = this.handleLoad.bind(this);

            this.state = {
                factory : vizData,
            };
        }

        handleLoad(){
            var element = this.refs.factoryView;
            var assets = $(".asset"),
                that = this.state,
                data = this.state.factory,
                markers = $(".roundMarker, .roundMarker span");
                markers.each(function(i, asset){
                    var _elem = $(asset);
                    if(!_elem.attr("data-prodlineid")){
                        _elem = $(asset).parent();
                    }
                    var _data = data[_elem.attr("data-prodlineid")];
                    _elem.addClass(_data[3]);
                });
                markers.mouseover(function(e){
                    e.stopPropagation();
                    var curObject = $(e.target);
                        if(!curObject.attr("data-prodlineid")){
                            curObject = $(e.target).parent();
                        }
                        var _data = data[curObject.attr("data-prodlineid")],
                        top = curObject.position().top,
                        left = curObject.position().left,
                        infoCard = $(".infoCard");
                        infoCard.find("h2").html(_data[0]); // Asset Name
                        infoCard.find("h4").html(_data[2]+"%"); // OEE Val
                        infoCard.find(".percArea .percBar").removeClass("critical warning normal");
                        infoCard.find(".percArea .percBar").addClass(_data[1]); // Perc bar
                        infoCard.find(".percBar .perc").width(_data[2]+"%"); // Asset Availability
                        var _left = (left - 110); 
                        if(top >= 300){
                            top = 100;
                        }
                        if(_left < 110){
                            _left = "110";
                        }
                        infoCard.show().css({ 'top': (top+ 30)+'px','left':_left+'px' });   
            }).mouseout(function(e){
                $(".infoCard").hide();
            }).click(function(e){
                var curObject = $(e.target);
                if(!curObject.attr("data-prodlineid")){
                    curObject = $(e.target).parent();
                }
                
                var queryParam = '';
                if(window.location.href.split("?")[1]){
                    queryParam = window.location.href.split("?")[1] + "&";
                }
                queryParam = queryParam + "prod=" + curObject.attr("data-prodlineid");
                window.location = '/superset/dashboard/productionline/?' + queryParam;
                // window.location = '/superset/dashboard/productionline/?prod='+curObject.attr("data-prodlineid");
            });
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
                                factory: _setData
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


        render() {
        return (
            <div id="factoryView" ref="factoryView">
            	<div className="component_hd xs-m-15"><img className="xs-mr-10" src = "/static/assets/images/icon-map.png"></img><span>{vizLabel}</span></div>
            <div className="controls">
                {/* <ul>
                    <li className="fullScreen" onclick='controlHandler("fullscreen")'><span className="glyphicon glyphicon glyphicon-fullscreen"></span></li>
                    <li className="zoomIn" onclick='controlHandler("zoomin")'><span className="glyphicon glyphicon-zoom-in"></span></li>
                    <li className="zoomOut" onclick='controlHandler("zoomout")'><span className="glyphicon glyphicon-zoom-out"></span></li>
                    <li className="rightMove"  onclick='controlHandler("right")'><span className="glyphicon glyphicon glyphicon-chevron-right"></span></li>
                    <li className="leftMove"  onclick='controlHandler("left")'><span className="glyphicon glyphicon glyphicon-chevron-left"></span></li>
                    <li className="topMove"  onclick='controlHandler("top")'><span className="glyphicon glyphicon-chevron-up"></span></li>
                    <li className="bottomMove"  onclick='controlHandler("bottom")'><span className="glyphicon glyphicon-chevron-down"></span></li>
                </ul> */}
            </div>
            <div className="imageInfoContainer">
                <div className="innerImage">
                    <img src="/static/assets/images/factoryMap.png" className="factoryMapImage"/>
                    {/*<div className="roundMarker prodline1" data-prodlineid="PL06">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>*/}
                    <div className="roundMarker prodline2" data-prodlineid="PL03">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline3" data-prodlineid="PL02">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline4" data-prodlineid="PL04">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline5" data-prodlineid="PL05">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline6" data-prodlineid="PL01">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="infoCard">
                        <h2>Production Line 1</h2>
                        <h3>OEE</h3>
                        <h4>56%</h4>
                        <div className="percArea">
                            <div className="percBar"><div className="perc"></div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            );
        }
    }
    
    ReactDOM.render(<FactoryFloor />, container);
    
}

module.exports = factoryFloorMapViz;