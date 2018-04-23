import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

import './oee_values.css';
	
function oeeValuesViz(slice, payload) {

    const container = document.querySelector(slice.selector);

    const json = payload.data.data;

    const user = payload.form_data.user;

    let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Production Line OEE Values';

    let vizData = [
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
    ];
     
    var factoryLength = json.length;
    if(factoryLength > 0){
        vizData = dataObj(json);
        
        // console.log(vizData);
    }

    var formData = payload.form_data;
    var dts = formData.datasource.split("__");
    let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

    function dataObj(json){
        var _data = []; 
        var factObj = {};
        for (var i=0; i<factoryLength; i++){
            factObj = {};
            factObj.id = json[i].Line_ID;
            factObj.value = [json[i].Production_Line_Name, json[i].OEE_Status.toLowerCase(), json[i].OEE_Percentage, 0]
            _data.push(factObj);
        }
        return _data;
    }

    var outputObject = {};
    var refreshData = null;

    class ProdLineOEE extends React.Component {

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
            queryParam = queryParam + "prod=" + name;
            window.location = '/superset/dashboard/productionline/?' + queryParam;
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
                <div id="productionLineOEE" ref="productionLineOEE">
                	<div className="component_hd xs-mb-15"><img className="xs-mr-10" src = "/static/assets/images/icon-percentage.png"></img><span>{vizLabel}</span></div>
                    <div className="prodLineList">
                        {tmp.map((item,key) => (
                            <div key={item.id} data-cardid={item.id} className="prodLineCard" onClick={() => this.navigateToPage(item.id)}>
                                <div className="content">
                                    <h2>{item.value[0]}</h2>
                                    <div className="bottomBlock">
                                        <div className="leftSection">
                                            <div className={["colorDot "+item.value[1]]}></div>
                                            <div className="oeeVal">{item.value[2]}%</div>
                                        </div>
                                        {/* <div className="rightSection">
                                            {this.alertText(item.value[3])}
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }
    
    ReactDOM.render(<ProdLineOEE />, container);
    
}

module.exports = oeeValuesViz;