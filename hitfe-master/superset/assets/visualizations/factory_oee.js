import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './factory_oee.css';
	
function factoryOeeViz(slice, payload) {

    const container = document.querySelector(slice.selector);
    const json = payload.data.data;

    const user = payload.form_data.user;

    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Factory OEE Values';

    let vizData = [
        {'id':"FACT01", 'value':["Factory 1","critical","65","Miami"]},
        {'id':"FACT02", 'value':["Factory 2","warning","85","Bangalore"]},
        {'id':"FACT03", 'value':["Factory 3","normal","95","San Jose"]},
        {'id':"FACT04", 'value':["Factory 4","critical","65","Santa Clara"]},
        {'id':"FACT05", 'value':["Factory 5","warning","85","New York"]}
    ];
     
    var factoryLength = json.length;
    if(factoryLength > 0){
        vizData = dataObj(json);
    }

    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

    function dataObj(json){
        var _data = []; 
        var factObj = {};
        for (var i=0; i<factoryLength; i++){
            factObj = {};
            factObj.id = json[i].Factory_ID;
            factObj.value = [json[i].Factory_Name, json[i].OEE_Status.toLowerCase(), json[i].OEE_Percentage, json[i].Location_Name]
            _data.push(factObj);
        }
        return _data;
    }
    
    var outputObject = {};
    var refreshData = null;

    class FactoryOEE extends React.Component {

        constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.navigateToPage = this.navigateToPage.bind(this);
    
        this.state = {
            prodline : vizData
        };
      }
    
      handleLoad(){
        var element = this.refs.productionLine;
      }
      navigateToPage(name){
        var queryParam = '';
        if(window.location.href.split("?")[1]){
            queryParam = window.location.href.split("?")[1] + "&";
        }
        queryParam = queryParam + "fac=" + name;
        window.location = '/superset/dashboard/factory/?' + queryParam;
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
                            prodline: _setData
                        });
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
        var tmp = this.state.prodline;
          return (
            <div id="factoryOEE" ref="factoryOEE">
            <div className="component_hd xs-m-15"><img className="xs-mr-10" src = "/static/assets/images/icon-percentage.png"></img><span>{vizLabel}</span></div>
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
    
    
    ReactDOM.render(<FactoryOEE />, container);
    
}

module.exports = factoryOeeViz;