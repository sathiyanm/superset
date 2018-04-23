import React from 'react';
import { ReactDOM } from 'react-dom';
import $ from 'jquery';
    
var outputObject = {};

class AssetAvatar extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);

    this.state = {
        assetID:"ASST02",
        imageMapping: {
            "ASST01":"compressor.jpg",
            "ASST02":"conveyorBelt.jpg",
            "ASST03":"cncMachine.jpg",
            "ASST04":"cncMachine.jpg",
            "ASST05":"cncMachine.jpg",
            "ASST06":"conveyorBelt.jpg",
            "ASST07":"roboticArm.jpg"
            },
        /*values: [ // ASS01
            {'name':"vibration", 'value':["140","120","critical", "Hz"]} 
        ]
        values: [ // ASS02
            {'name':"temperature", 'value':["250","120","normal", "F"]},
            {'name':"camera", 'value':["80","70","normal", "%"]},
            {'name':"rfid", 'value':["70","58","warning", "%"]}
        ]*/
    };
  }

  handleLoad(){
    var element = this.refs.assetAvatar;
    var sensors = $(".sensor"),
        that = this.state;
        sensors.each(function(i, sensor){
            var sensorType = $(sensor).attr("type"),
                currSequence = $(sensor).attr("data-sequence");
            $(sensor).addClass(that.values[currSequence].value[2]);
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
            infoCard.show().css({ 'top': (top+ 50)+'px','left':(left - 110)+'px' });
        }).mouseout(function(e){
            $(".info").hide();
        });
  }

  componentDidMount() {
    this.handleLoad();
  }


   render() {
    var tmp = this.state.values;
      return (
    		<div id="assetAvatar" ref="assetAvatar">
                <div className="innerImage" style={{backgroundImage:'url(images/assets/'+this.state.imageMapping[this.state.assetID]+')'}}>
                {tmp.map((item,key) => (
                    <div key={item.name} data-sequence={key} className={["sensor "+item.name+ " " + this.state.assetID]} type={item.name} data-valueType={item.value[3]}></div>
                ))}
                
                    <div className="info">
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

module.exports = AssetAvatar;