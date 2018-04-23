import React from 'react';
import ReactDOM from 'react-dom';

import ProgressBar from 'react-progressbar.js';

const Circle = ProgressBar.Circle;

function progressBarCircleViz(slice, payload) {
    const container = document.querySelector(slice.selector);
    const json = payload.data;

    const hasData = json.data && json.data.length > 0;

    var progressData = 0;
    if(hasData){
        progressData = json.data[0][0] / 100;
    }

    var formData = payload.form_data;

    var stroke_width = formData.stroke_width ? parseFloat(formData.stroke_width) : 2.1;
    var trail_width = formData.trail_width ? parseFloat(formData.trail_width) : 0.8;

    var progress_bar_label = formData.progress_bar_label ? formData.progress_bar_label + "<br>" : "";

    class App extends React.Component{

        constructor(props) {
            super(props);
            this.state = {
                progress: 0.1,
                options: {
                    // Stroke color.
                    // Default: '#555'
                    //color: '#3a3a3a',
                
                    // Color for lighter trail stroke
                    // underneath the actual progress path.
                    // Default: '#eee'
                    // trailColor: '#f4f4f4',
                
                    // Width of the stroke.
                    strokeWidth: stroke_width,
                
                    // If trail options are not defined, trail won't be drawn
                
                    // Width of the trail stroke. Trail is always centered relative to
                    // actual progress path.
                    // Default: same as strokeWidth
                    trailWidth: trail_width,
                    
                    // Fill color for the shape. If null, no fill.
                    // Default: null
                    // fill: 'rgba(0, 0, 0, 0.5)',
                
                    // Duration for animation in milliseconds
                    // Default: 800
                    // duration: 1200,
                
                    // Easing for animation. See #easing section.
                    // Default: 'linear'
                    // easing: 'easeOut',
                
                    // If true, some useful console.warn calls will be done if it seems
                    // that progressbar is used incorrectly
                    // Default: false
                    // warnings: false
                }
            };
        }
            
        render() {

            // For demo purposes so the container has some dimensions.
            // Otherwise progress bar won't be shown
            var containerStyle = {
                width: '200px',
                height: '200px'
            };
    
            return (
                <Circle
                    progress={this.state.progress}
                    text={progress_bar_label + this.state.progress * 100 + '%'}
                    options={this.state.options}
                    initialAnimate={this.state.initialAnimate}
                    containerStyle={containerStyle}
                    containerClassName={'.progressbar'} />
            );
        };
    
        // render: function() {
        //     return <Circle initialAnimate={this.state.initialAnimate} options={this.state.options} progress={this.state.progress} />;
        // },
    
        componentDidMount() {
            var self = this;
            setTimeout(function() {
                self.setState({
                    progress: progressData
                });
            }, 1000);
    
            setTimeout(function() {
                self.setState({
                    initialAnimate: true,
                    progress: 1
                });
            }, 500);
    
        }
    };

    ReactDOM.render(<App />, container);
}

module.exports = progressBarCircleViz;



