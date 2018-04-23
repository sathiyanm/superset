//import React, { Component } from 'react';
import React from 'react';
import ReactDOM from 'react-dom';

import './orderFulfill.css';

    function orderFulfillViz(slice, payload) {
        const container = document.querySelector(slice.selector);

        const json = payload.data.data;

        const hasData = payload.data && payload.data.length > 0;
        
        let vizLabel = payload.form_data.chart_header ? payload.form_data.chart_header : 'Order Fulfillment';
        
        let vizData = {
          "weeklyTotalCount":"150", 
          "weeklyCount":"110",
          "dailyTotalCount":"28",
          "dailyCount":"10"
      }

      if(json.length > 0){
        vizData = dataObj(json);
      }
      var formData = payload.form_data;
      var dts = formData.datasource.split("__");
      let url = "/superset/explore_json/"+ dts[1] +"/"+ dts[0] +"/?" + window.location.href.split("?")[1];

      function dataObj(json){
        return {
            "weeklyTotalCount": [json[0].Weekly_Total_Count],
            "weeklyCount": [json[0].Weekly_Count],
            "dailyTotalCount": [json[0].Daily_Total_Count],
            "dailyCount": [json[0].Daily_Count]

          };
      }

      
      var refreshData = null;

        //const App  = React.createClass({
      class App extends React.Component {
            
          constructor(props) {
              super(props);
              this.handleLoad = this.handleLoad.bind(this);
  
              this.state = {
                  appData :vizData
              };
          }

          handleLoad(){
          
            var lineWeeklyPercent = (this.state.appData.weeklyCount / this.state.appData.weeklyTotalCount) * 100;
            var lineDailyPercent = (this.state.appData.dailyCount / this.state.appData.dailyTotalCount) * 100;
            var lineWeeklyGradient = 'linear-gradient(to right,#388d3c '+ lineWeeklyPercent+'%,#D6DCE0 0%,#D6DCE0 100%)';
            var lineDailyGradient = 'linear-gradient(to right,#388d3c '+ lineDailyPercent+'%,#D6DCE0 0%,#D6DCE0 100%)';
            var circleWeeklyColor = (lineWeeklyPercent / 25);   
            //alert("Weekly----"+lineWeeklyPercent +"-------Daily"+lineDailyPercent);  
            var fakelineWeekly = document.createElement('div');
            fakelineWeekly.className = "lineWeekly";
            fakelineWeekly.id = "line";
            $(fakelineWeekly).css({
              'width' : '100%',                
              'height' : '3px',
              'background-color': '#388d3c',
              'clear' : 'both',
              'margin-top' : '0px',
              'margin-bottom' : '35px',
              'background' :  lineWeeklyGradient
           });
           for(var i = 0; i<5; i++)
           {               
              var weeklyCircle = document.createElement('div');
              weeklyCircle.className = "greyCircle";                
              if(i == 4)
              {
                weeklyCircle.className = "greyLastCircle";
              }
              $(weeklyCircle).appendTo(fakelineWeekly);                
              if(i <= circleWeeklyColor)
              {
                weeklyCircle.className = "circle";                    
                if(i == 4)
                {
                  weeklyCircle.className = "lastCircle";
                }  
              }

              if(i == 0 && circleWeeklyColor == 0)
              {
                weeklyCircle.className = "greyCircle";                    
                if(i == 4)
                {
                  weeklyCircle.className = "greyLastCircle";
                }  
              }
              
             

           }
           
                        
            var fakelineDaily = document.createElement('div');
            fakelineDaily.className = "lineDaily";
            fakelineDaily.id = "lineDaily";
            $(fakelineDaily).css({
              'width' : '100%',                
              'height' : '3px',
              'background-color': '#388d3c',
              'clear' : 'both',
              'margin-top' : '23px',
              'margin-bottom' : '0px',
              'background' :  lineDailyGradient
            });
            var dailyCircle = document.createElement('div');
            dailyCircle.className = "greyCircle";
            var dailyLastCircle = document.createElement('div');
            dailyLastCircle.className = "greyLastCircle";
            if((lineDailyPercent > 0) && (lineDailyPercent <100))
            {
              dailyCircle.className = "circle";    
            }
            if(lineDailyPercent == 100)
            {
              dailyCircle.className = "circle"; 
              dailyLastCircle.className = "lastCircle";   
            }
            $(dailyCircle).appendTo(fakelineDaily);
            $(dailyLastCircle).appendTo(fakelineDaily);
            
            $( "#fakelineweekly" ).html(fakelineWeekly);            
            $( "#fakelinedaily" ).html(fakelineDaily);
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
                                  appData: _setData
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
              var tmp = this.state.appData;
              return (
          
                <div className="mainDiv" id="orderFulfilldiv">
                 
                                 

                 	<div className="component_hd xs-mb-15"><img className="xs-mr-10" src = "/static/assets/images/icon-tick.png"></img><span>{vizLabel}</span></div>
                  <div id = "orderfulfillWeeklyWrapper" style={{clear: 'both'}}>
                    <div id = "weeklyOrdersAll" className="orders_all">
                      <div id = "weekly_order_name" className="order_name">WEEKLY ORDERS</div>
                      <div id="pending_orders_weekly" className="pending_orders">
                        <label className="no_of_orders">{tmp.weeklyCount}</label><label className="tot_pend_ordrs"><p>/  {tmp.weeklyTotalCount}</p></label> <label className="total_orders">orders pending</label>
                      </div> 
                      <div id = "fakelineweekly"></div>
                    </div>	
                  </div>	
                  <div id = "orderfulfillDailyWrapper" style={{clear: 'both'}}>	
                    <div id = "dailyOrdersAll" className="orders_all">	
                      <div id = "daily_order_name" className="order_name">DAILY ORDERS</div>
                      <div id = "pending_orders_daily" className="pending_orders">
                        <label className="no_of_orders">{tmp.dailyCount}</label><label className="tot_pend_ordrs">/  {tmp.dailyTotalCount}</label> <label className="total_orders">orders pending</label>
                      </div>
                      <div id = "fakelinedaily"></div>
                    </div>	
                  </div>
                </div>
              );
            }
          }

          ReactDOM.render(<App />, container);

        }
        module.exports = orderFulfillViz;

   