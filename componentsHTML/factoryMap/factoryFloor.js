import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
    
var outputObject = {};

class factoryFloor extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);

    this.state = {
        factory : {
            "prodline1":["Production Line 1","critical","90","critical","2"], 
            "prodline2":["Production Line 2","critical","85","critical","5"],
            "prodline3":["Production Line 3","normal","65","normal","0"],
            "prodline4":["Production Line 4","warning","90","warning","2"], 
            "prodline5":["Production Line 5","warning","85","warning","5"],
            "prodline6":["Production Line 6","normal","65","normal","0"]
        },
    };
  }

  handleLoad(){
    var element = this.refs.factoryView;
    var assets = $(".asset"),
        that = this.state,
        data = this.state.factory,
        markers = $(".roundMarker span");
            markers.parent().each(function(i, asset){
                var _data = data[$(asset).attr("data-prodlineid")];
                $(asset).addClass(_data[3]);
            });
            markers.mouseover(function(e){
                e.stopPropagation();
                var curObject = $(e.target).parent(),
                    _data = data[curObject.attr("data-prodlineid")],
                    top = $(e.target).parent().position().top,
                    left = $(e.target).parent().position().left,
                    infoCard = $(".infoCard");
                    infoCard.find("h2").html(_data[0]); // Asset Name
                    infoCard.find("h4").html(_data[2]+"%"); // OEE Val
                    infoCard.find(".percArea .percBar").removeClass("critical warning normal");
                    infoCard.find(".percArea .percBar").addClass(_data[1]); // Perc bar
                    infoCard.find(".percBar .perc").width(_data[2]+"%"); // Asset Availability
                    var _left = (left - 110); 
                    if(top >= 300){
                        top = 110;
                    }
                    if(_left < 110){
                        _left = "110";
                    }
                    infoCard.show().css({ 'top': (top+ 30)+'px','left':_left+'px' });   
        }).mouseout(function(e){
            $(".infoCard").hide();
        });
  }

  componentDidMount() {
    this.handleLoad();
  }


   render() {
      return (
        <div id="factoryView" ref="factoryView">
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
                    <img src="images/factoryMap.png" className="factoryMapImage"/>
                    <div className="roundMarker prodline1" data-prodlineid="prodline1">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline2" data-prodlineid="prodline2">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline3" data-prodlineid="prodline3">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline4" data-prodlineid="prodline4">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline5" data-prodlineid="prodline5">
                        <div className="arrow bottom"></div>
                        <span>&nbsp;</span>
                    </div>
                    <div className="roundMarker prodline6" data-prodlineid="prodline6">
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

module.exports = factoryFloor;