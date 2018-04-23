import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './asset_avatar.css';
   
function assetAvatarViz(slice, payload) {
    const container = document.querySelector(slice.selector);

    const json = payload.data.data;

    const user = payload.form_data.user;

    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Asset Avatar';

    var assetId = 'ASST02';
    let _maxClass = "";

    if(window.location.search.indexOf("ASST03") != -1){
        _maxClass = "maxClass";
    }

    let vizData = [ // ASST02
        {'name':"temperature", 'value':["250","120","normal", "F"]},
        {'name':"camera", 'value':["80","70","normal", "%"]},
        {'name':"rfid", 'value':["70","58","warning", "%"]}
    ];

    // [ // ASST01
    //     {'name':"vibration", 'value':["140","120","critical", "Hz"]} 
    // ]

   var sensorLength = json.length;
    if(sensorLength > 0){
        vizData = dataObj(json);
    }

    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

    function dataObj(json){
        var dataArr = []; 
        var sensorObj = {};
        for (var i=0; i<sensorLength; i++){
            sensorObj = {
                name: json[i].Sensor_Name,
                value:[json[i].Threshold_Value, json[i].Current_Value, json[i].Sensor_Status.toLowerCase(), json[i].Sensor_Value_Type]
            };
            dataArr.push(sensorObj);
            assetId = json[i].Asset_ID;
        };
        return dataArr;
    }

    var outputObject = {};
    var refreshData = null;

    class AssetAvatar extends React.Component {
    
        constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
    
        this.state = {
            assetID: assetId,
            imageMapping: {
                "ASST01":"compressor.jpg",
                "ASST02":"conveyorBelt.jpg",
                "ASST03":"sullairCompressor.jpg",
                "ASST04":"conveyorBelt.jpg",
                "ASST05":"cncMachine.jpg",
                "ASST06":"cncMachine.jpg",
                "ASST07":"cncMachine.jpg"
                },
            values: vizData
        };
      }
    
      handleLoad(){
        var element = this.refs.assetAvatar;
        var sensors = $(".sensor"),
            that = this.state;
            sensors.each(function(i, sensor){
                var sensorType = $(sensor).attr("type"),
                    currSequence = $(sensor).attr("data-sequence");
                $(sensor).removeClass("normal warning critical").addClass(that.values[currSequence].value[2]);
            });
            sensors.hover(function(e){
                var curObject = $(e.target),
                    top = $(e.target).position().top,
                    left = $(e.target).position().left,
                    currSequence = curObject.attr("data-sequence"),
                    infoCard = $(".info"),
                    sensorType = curObject.attr("type"),
                    thresholdTitle = "Threshold "+sensorType,
                    currentTitle = "Current "+sensorType,
                    currentData = that.values[currSequence].value[1]+ " " +curObject.attr("data-valueType"),
                    thresholdData = that.values[currSequence].value[0]+ " " +curObject.attr("data-valueType"),
                    infoCardTitle = curObject.attr("type") + " Details";

                infoCard.find(".threshold .leftTitle").html(thresholdTitle);
                infoCard.find(".current .leftTitle").html(currentTitle);
                infoCard.find(".threshold .rightData").html(thresholdData);
                infoCard.find(".current .rightData").html(currentData);
                infoCard.find("h3").html(infoCardTitle);
                // infoCard.show().css({ 'top': (top+ 50)+'px','left':(left - 110)+'px' });
              
                var infoArrow = $(".arrow");
                var sensorPositionLeft = $(e.target).position().left;
                //alert("sensor position--"+sensorPositionLeft);
                if(sensorPositionLeft >220)
                {                  
                    var x = sensorPositionLeft-200;                    
                    infoCard.show().css({ 'top': (top+ 40)+'px','left':x+'px' });
                    infoArrow.css({'left':'215px'});
                }
                else{                 
                infoCard.show().css({ 'top': (top+ 40)+'px','left':sensorPositionLeft-40+'px' });        
                infoArrow.css({'left':'40px'});
                }
            }).mouseout(function(e){
                $(".info").hide();
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
                            values: _setData
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
        var tmp = this.state.values;
          return (
                <div id="assetAvatar" ref="assetAvatar">
                	<div className="component_hd xs-m-15"><img className="xs-mr-10" src = "/static/assets/images/icon-screw.png"></img><span>{vizLabel}</span></div>
                    <div className="innerImage"  style={{backgroundImage:"url(/static/assets/images/assets/" + this.state.imageMapping[this.state.assetID] + ")"}}>
                    {tmp.map((item,key) => (
                        <div key={item.name} data-sequence={key} className={["sensor "+(item.name).toLowerCase()+ " " + this.state.assetID]} type={item.name} data-valueType={item.value[3]}></div>
                    ))}
                    
                        <div className={"info "+ _maxClass}>
                            <div className="arrow top"></div>
                            <h3>Details</h3>
                            <div className="infoRow threshold">
                                <span className="leftTitle">Threshold</span>
                                <span className="rightData"></span>
                            </div>
                            <div className="infoRow current">
                                <span className="leftTitle">Current</span>
                                <span className="rightData"></span>
                            </div>
                        </div>
                    </div>
                </div>
          );
       }
    }

    ReactDOM.render(<AssetAvatar />, container);
}



module.exports = assetAvatarViz;