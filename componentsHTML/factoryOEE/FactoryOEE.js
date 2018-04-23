import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
    
var outputObject = {};

class FactoryOEE extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);

    this.state = {
        prodline : [
            {'id':"FACT01", 'value':["Factory 1","critical","65","Miami"]},
            {'id':"FACT02", 'value':["Factory 2","warning","85","Bangalore"]},
            {'id':"FACT03", 'value':["Factory 3","normal","95","San Jose"]},
            {'id':"FACT04", 'value':["Factory 4","critical","65","Santa Clara"]},
            {'id':"FACT05", 'value':["Factory 5","warning","85","New York"]}
        ]
    };
  }

  handleLoad(){
    var element = this.refs.productionLine;
  }
  navigateToPage(name){
    window.location = '/assetView/'+name;
  }

  alertText(count){
    var output = "";
        if(count>0){
            output = count + " Alerts";
        }
    return output;
  }

  componentDidMount() {
    this.handleLoad();
  }


   render() {
    var tmp = this.state.prodline;
      return (
        <div id="factoryOEE" ref="factoryOEE">
        {tmp.map((item,key) => (
            <div key={item.id} data-cardid={item.id} className="prodLineCard" onClick={() => this.navigateToPage(item.id)}>
                <div className="content">
                    <h2>{item.value[0]}</h2>
                    <h4>{item.value[3]}</h4>
                    <div className="bottomBlock">
                        <div className="leftSection">
                            <div className={["colorDot "+item.value[1]]}></div>
                            <div className="oeeVal">{item.value[2]}%</div>
                        </div>
                    </div>
                </div>
            </div>
        ))}
        </div>
      );
   }
}

module.exports = FactoryOEE;