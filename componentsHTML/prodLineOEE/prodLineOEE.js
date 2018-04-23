import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
    
var outputObject = {};

class ProdLineOEE extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);

    this.state = {
        prodline : [
            {'id':"prodLine1", 'value':["prod Line 1","critical","65","0"]},
            {'id':"prodLine2", 'value':["prod Line 2","warning","85","2"]},
            {'id':"prodLine3", 'value':["prod Line 3","normal","95","7"]},
            {'id':"prodLine4", 'value':["prod Line 1","critical","65","3"]},
            {'id':"prodLine5", 'value':["prod Line 2","warning","85","2"]},
            {'id':"prodLine6", 'value':["prod Line 3","normal","95","7"]},
            {'id':"prodLine7", 'value':["prod Line 1","critical","65","3"]},
            {'id':"prodLine8", 'value':["prod Line 2","warning","85","2"]},
            {'id':"prodLine9", 'value':["prod Line 3","normal","95","7"]},
            {'id':"prodLine10", 'value':["prod Line 1","critical","65","3"]},
            {'id':"prodLine11", 'value':["prod Line 2","warning","85","2"]},
            {'id':"prodLine12", 'value':["prod Line 3","normal","95","7"]}
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
        <div id="productionLineOEE" ref="productionLineOEE">
        {tmp.map((item,key) => (
            <div key={item.id} data-cardid={item.id} className="prodLineCard" onClick={() => this.navigateToPage(item.id)}>
                <div className="content">
                    <h2>{item.value[0]}</h2>
                    <div className="bottomBlock">
                        <div className="leftSection">
                            <div className={["colorDot "+item.value[1]]}></div>
                            <div className="oeeVal">{item.value[2]}%</div>
                        </div>
                        <div className="rightSection">
                            {this.alertText(item.value[3])}
                        </div>
                    </div>
                </div>
            </div>
        ))}
        </div>
      );
   }
}

module.exports = ProdLineOEE;