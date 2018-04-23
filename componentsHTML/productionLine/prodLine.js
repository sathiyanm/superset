import React from 'react';
import { ReactDOM } from 'react-dom';
import classNames from 'classnames';
import $ from 'jquery';
    
var outputObject = {};

class ProdLine extends React.Component {

	constructor(props) {
    super(props);
    this.handleLoad = this.handleLoad.bind(this);

    this.state = {
        prodLineID: "PRD01",
        isProdOneEnabled: true,
        assets : {
            "compressor1":["Compressor 1","critical","45.34","critical","20","critical","85","warning","95","normal", 1], 
            "conveyorBelt1":["Conveyor Belt 1","warning","75.2","warning","90.2","normal","73","warning","75","warning", 2]
        }
        /*assets : {
            "compressor2":["Compressor 2","critical","45.34","critical","20","critical","85","warning","95","normal","2"], 
            "conveyorBelt2":["Conveyor Belt 2","warning","75.2","warning","90.2","normal","73","warning","75","warning","1"],
            "cnc1":["CNC 1","critical","45.34","critical","20","critical","85","warning","95","normal","3"], 
            "cnc2":["CNC 2","warning","75.2","warning","90.2","normal","73","warning","75","warning","1"],
            "cnc3":["CNC 3","critical","45.34","critical","20","critical","85","warning","95","normal","2"], 
            "roboarm1":["Robotic Arm 1","warning","75.2","warning","90.2","normal","73","warning","75","warning","4"]
        }*/
    };
  }

  handleLoad(){
    var element = this.refs.productionLine;
    var assets = $(".asset"),
        that = this.state,
        data = this.state.assets;
        assets.each(function(i, asset){
            var _data = data[$(asset).attr("data-assetid")];
            $(asset).find(".assetSelect").addClass(_data[1]);
            $(asset).find(".roundMarker").addClass(_data[1]);
            if(_data[1] != "normal"){
                $(asset).find(".roundMarker span").html(_data[10]);
            }
        });
        assets.hover(function(e){
            e.stopPropagation();
            var curObject = $(e.target).parent(),
                _data = data[curObject.attr("data-assetid")],
                infoCard = $(".info");
                infoCard.show();
                
                infoCard.find(".selected h2 span").html(_data[0]); // Asset Name
                var _dec = (_data[2] + "").split(".");
                infoCard.find(".selected .oeeVal .number").html(_dec[0]); // Asset OEE
                infoCard.find(".selected .leftsection .percBar .perc").width(_dec[0]+"%"); // Asset OEE Graph
                infoCard.find(".selected .oeeVal .decimal").html("."+_dec[1]+"%"); // Asset OEE
                if(!_dec[1]){
                    infoCard.find(".selected .oeeVal .decimal").html("%"); // Asset OEE
                }
                infoCard.find(".selected .leftsection .percBar, .selected .rightsection .percBar").removeClass("critical warning normal");
                infoCard.find(".selected .leftsection .percBar").addClass(_data[3]); // Criticality of OEE
                infoCard.find(".selected .rightsection .availability .percBar .perc").width(_data[4]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .availability .value").html(_data[4]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .availability .percBar").addClass(_data[5]); // Criticality of Availability

                infoCard.find(".selected .rightsection .performance .percBar .perc").width(_data[6]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .performance .value").html(_data[6]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .performance .percBar").addClass(_data[7]); // Criticality of Availability

                infoCard.find(".selected .rightsection .quality .percBar .perc").width(_data[8]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .quality .value").html(_data[8]+"%"); // Asset Availability
                infoCard.find(".selected .rightsection .quality .percBar").addClass(_data[9]); // Criticality of Availability
                
        }).mouseout(function(e){
            $(".info").hide();
        });
  }

  componentDidMount() {
    this.handleLoad();
  }


   render() {
      return (
        <div id="productionLine" ref="productionLine">
        { this.state.isProdOneEnabled
                ? <div className="innerImage">
                    <img src="images/prd01.png" className="prodLineImage"/>                    
                    <div className="asset compressorOne"  data-assetid="compressor1">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/1999/xlink" width="99" height="106" viewBox="0 0 99 106">
                            <path fillRule="evenodd" d="M89.94 41.356c.009.05.016.097.023.145-1.28-7.783-5.414-12.213-9.237-14.834l2.105-1.11-.082-2.698c4.193-2.233 10.289-5.448 11.394-5.858 1.714-.635 1.565.721 1.57 1.66l.089 16.019c.02 3.753-.448 3.756-1.382 4.282l-4.48 2.394zm4.998 11.448c2.026 4.188.152 7.787-5.566 10.697-1.164.593-3.579 1.914-6.827 3.723l-2.874-9.238 6.175-3.623s2.218-1.56 3.493-4.94c1.053.136 4.329.755 5.599 3.38zM39.57 81.326l30.47-17.71 4.641 8.019c-9.54 5.378-21.895 12.412-32.29 18.343l-2.82-8.652zm-11.153-50.77c-2.56-1.62-2.188-3.417-1.675-4.692.512-1.274 3.645-3.123 5.457-4.116 1.813-.992 21.173-10.811 21.173-10.811S65.973 4.062 66.77 3.702c.797-.36 1.438-.97 2.06-.593.62.379.496 1.014.497 1.268.002.255-.038 4.396-.038 4.396l.13.063-11.315 5.983.036 6.626c-1.997-1.028-4.753-1.655-7.793-1.639-6.078.033-10.991 2.629-10.974 5.797.001.125.012.247.028.37h-.026l.041 7.422-2.655 1.493c-2.706-1.315-6.76-3.329-8.344-4.331zm61.79 14.369c6.54-3.13 8.03-5.005 8.246-5.71.549-1.786.555-3.44.545-5.317-.01-1.876-.09-16.124-.093-16.888-.005-.764.102-2.711-2.4-3.427-2.502-.716-3.863.09-5.381.863-.817.416-4.897 2.577-8.494 4.486l-.101-3.368-9.527-4.982-.035-6.308c-.005-.806.1-3.422-3.25-4.138-2.913-.623-5.145 1.064-6.437 1.731-.872.45-12.584 6.54-12.584 6.54-.453.234-16.315 8.53-20.265 10.634-3.949 2.103-6.828 3.94-7.622 7.152-.594 2.402 1.494 5.547 2.898 6.332.882.493 4.339 2.542 7.621 4.294l-17.173 9.662c-3.6 2.023-9.901 5.968-11.428 6.928C.845 55.239-1.268 60.386.82 68.545c.526 2.052 1.349 4.175 2.421 6.244l-1.674 4.735 3.83 2.152 1.56-.609.129-.47c4.052 4.887 9.576 8.514 15.764 8.512 2.602-.001 4.494-.773 5.867-1.974l1.061-.567 4.476 8.056c-6.052 3.457-10.584 6.05-12.115 6.92l-3.767 1.9c-.288.16-.8.572-.171 1.777.555 1.065 1.209.786 1.443.61.208-.157 5.203-2.95 5.203-2.95s.021-.044.046-.118l10.653-6.087 3.498 1.999.004.015.012-.006.01.005-.003-.009 5.288-2.679-1.197-3.67c10.563-6.029 23.267-13.263 32.997-18.747l3.24 1.538 4.686-2.956-.803-2.58c3.538-1.973 6.172-3.417 7.401-4.043 9.287-4.725 8.174-10.593 6.685-13.671-1.758-3.638-6.122-4.525-7.396-4.723a14.987 14.987 0 0 0 .239-2.224z"/>
                        </svg>
                    </div>
                    <div className="asset conveyorBeltOne"  data-assetid="conveyorBelt1">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="158" height="124" viewBox="0 0 158 124">
                            <path fillRule="evenodd" d="M.75 73.806C84.48 25.17 126.656.73 127.28.486c.936-.367 2.873-.88 5.992 0 3.119.879 20.288 10.155 20.817 10.427.53.272 4.052 2.465 3.616 7.563-.292 3.4-1.975 6.186-5.05 8.36v14.892l-2.328 1.195-1.894-.855V29.485l-23.114 13.438-.301 14.9-1.883 1.513-2.063-.87V45.586l-23.36 13.751v14.47l-2.128 1.664-1.854-1.034V61.644L70.304 75.47v14.55l-2.163 1.37-1.82-1.028V77.87L43.158 91.39v14.534l-2.437 1.497-1.744-.742V93.897l-23.272 13.925v14.267l-2.436 1.825-1.77-1.27v-12.401c-1.103.46-1.942.76-2.517.903-.576.143-2.507-.799-5.796-2.825v3.804l-2.436 1.326V73.806z"/>
                        </svg>
                    </div>
                </div>
                : <div className="innerImage">
                    <img src="images/prd02.png" className="prodLineImage"/>                    
                    <div className="asset compressorTwo"  data-assetid="compressor2">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="63" height="66" viewBox="0 0 63 69">
                            <path fillRule="evenodd" d="M57.37 28.334zm-.126-1.034l.015.109c-.811-5.034-3.444-7.89-5.877-9.581l1.343-.72-.052-1.74c2.664-1.44 6.539-3.515 7.24-3.778 1.09-.41.996.465.999 1.07l.056 10.334c.013 2.421-.285 2.422-.878 2.762L57.244 27.3zm3.175 7.385c1.288 2.701.097 5.023-3.537 6.9-.74.383-2.275 1.235-4.34 2.402l-1.826-5.96 3.925-2.336s1.407-1.008 2.218-3.187c.662.086 2.75.48 3.56 2.18zM25.233 53.084l19.364-11.425 2.948 5.173a4918.161 4918.161 0 0 0-20.518 11.833l-1.794-5.581zm-7.087-32.75c-1.627-1.045-1.39-2.204-1.065-3.027.326-.822 2.317-2.015 3.468-2.655 1.153-.64 13.456-6.974 13.456-6.974s8.007-4.435 8.513-4.667c.507-.232.914-.627 1.31-.383.394.245.315.654.316.818 0 .165-.024 2.836-.024 2.836l.082.041-7.19 3.859.023 4.274c-1.27-.663-3.021-1.067-4.953-1.056-3.863.02-6.985 1.695-6.974 3.739 0 .08.014.158.024.238h-.022l.025 4.787-1.687.964c-1.719-.849-4.296-2.147-5.302-2.794zm39.267 9.268c4.156-2.018 5.102-3.228 5.24-3.682.348-1.153.353-2.22.346-3.43l-.06-10.895c-.002-.493.066-1.749-1.524-2.21-1.59-.463-2.456.058-3.42.556-.519.268-3.11 1.662-5.397 2.894l-.065-2.173v.001l-6.055-3.215c0-.002-.018-3.549-.022-4.069-.002-.518.065-2.206-2.064-2.669-1.852-.401-3.27.687-4.092 1.117-.553.29-7.996 4.22-7.996 4.22-.288.15-10.369 5.502-12.878 6.859-2.51 1.356-4.34 2.54-4.844 4.613-.378 1.55.949 3.578 1.841 4.085.561.317 2.758 1.638 4.844 2.77L10.3 30.637h.001c-2.348 1.343-6.417 3.932-7.26 4.47C.609 36.309-.71 39.613.609 44.838c.334 1.321.864 2.686 1.543 4.017l-1.068 3.067 2.434 1.388.992-.393.083-.308c2.575 3.154 6.084 5.497 10.016 5.495 1.636 0 2.822-.494 3.692-1.253l.711-.386 2.845 5.197c-3.846 2.23-6.726 3.902-7.7 4.464l-2.393 1.225c-.183.104-.508.369-.11 1.147.353.686.77.507.918.392.132-.1 3.307-1.902 3.307-1.902s.013-.028.028-.076c1.374-.795 3.78-2.191 6.771-3.927l2.222 1.29.003.009.008-.004.006.004-.002-.005 3.36-1.73-.76-2.367a4885.9 4885.9 0 0 1 20.97-12.093l2.058.993 2.978-1.907-.51-1.665c2.248-1.272 3.922-2.203 4.703-2.608 5.902-3.047 5.195-6.833 4.248-8.819-1.12-2.35-3.9-2.92-4.702-3.046.13-.715.188-1.516.134-2.408.04.605.02.973.02.973z"/>
                        </svg>
                    </div>
                    <div className="asset conveyorBeltTwo"  data-assetid="conveyorBelt2">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="158" height="124" viewBox="0 0 158 124">
                            <path fillRule="evenodd" d="M.75 73.806C84.48 25.17 126.656.73 127.28.486c.936-.367 2.873-.88 5.992 0 3.119.879 20.288 10.155 20.817 10.427.53.272 4.052 2.465 3.616 7.563-.292 3.4-1.975 6.186-5.05 8.36v14.892l-2.328 1.195-1.894-.855V29.485l-23.114 13.438-.301 14.9-1.883 1.513-2.063-.87V45.586l-23.36 13.751v14.47l-2.128 1.664-1.854-1.034V61.644L70.304 75.47v14.55l-2.163 1.37-1.82-1.028V77.87L43.158 91.39v14.534l-2.437 1.497-1.744-.742V93.897l-23.272 13.925v14.267l-2.436 1.825-1.77-1.27v-12.401c-1.103.46-1.942.76-2.517.903-.576.143-2.507-.799-5.796-2.825v3.804l-2.436 1.326V73.806z"/>
                        </svg>
                    </div>
                    <div className="asset cncOne"  data-assetid="cnc1">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="75" height="83" viewBox="0 0 75 87">
                            <path fillRule="evenodd" d="M29.163 43.316a.019.019 0 0 0-.004-.006l.004.002v.004zM73.991 54.42V21.65c0-2.875-.855-4.27-.855-4.27-.571-1.602-3.217-3.188-3.681-3.41-.464-.223-21.456-12.594-21.783-12.76-.328-.168-.592-.52-1.314-.465-.721.055-2.185.986-2.91 1.43C42.72 2.62.717 26.828.717 26.828l.013.007c-.401.226-.653.679-.653 1.34v36.915c0 1.431 1.148 3.273 2.553 4.092l3.87 2.255.069 3.077 20.414 11.978 44.252-26.125v-1.684c.232-.141.415-.253.532-.327 2.907-1.816 2.223-2.977 2.223-3.935z"/>
                        </svg>
                    </div>
                    <div className="asset cncTwo"  data-assetid="cnc2">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="75" height="83" viewBox="0 0 75 87">
                            <path fillRule="evenodd" d="M29.163 43.316a.019.019 0 0 0-.004-.006l.004.002v.004zM73.991 54.42V21.65c0-2.875-.855-4.27-.855-4.27-.571-1.602-3.217-3.188-3.681-3.41-.464-.223-21.456-12.594-21.783-12.76-.328-.168-.592-.52-1.314-.465-.721.055-2.185.986-2.91 1.43C42.72 2.62.717 26.828.717 26.828l.013.007c-.401.226-.653.679-.653 1.34v36.915c0 1.431 1.148 3.273 2.553 4.092l3.87 2.255.069 3.077 20.414 11.978 44.252-26.125v-1.684c.232-.141.415-.253.532-.327 2.907-1.816 2.223-2.977 2.223-3.935z"/>
                        </svg>
                    </div>
                    <div className="asset cncThree"  data-assetid="cnc3">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="75" height="83" viewBox="0 0 75 87">
                            <path fillRule="evenodd" d="M45.701 43.34a.019.019 0 0 1-.003.006v-.004l.003-.001zM74.13 26.866l.012-.007S32.14 2.651 31.413 2.206c-.726-.444-2.19-1.375-2.91-1.43-.722-.055-.987.297-1.314.464-.327.166-21.32 12.537-21.783 12.76-.463.223-3.109 1.809-3.681 3.41 0 0-.855 1.395-.855 4.271v32.77c0 .958-.683 2.12 2.222 3.935l.533.328v1.683L47.876 86.52l20.416-11.977.068-3.077 3.87-2.256c1.404-.819 2.554-2.66 2.554-4.092V28.204c0-.66-.252-1.113-.654-1.339z"/>
                        </svg>
                    </div>
                    <div className="asset roboarmOne"  data-assetid="roboarm1">
                        <div className="assetHover">
                            <div className="roundMarker">
                                <div className="arrow bottom"></div>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                        <svg className="assetSelect" xmlns="http://www.w3.org/2000/svg" width="150" height="112" viewBox="0 0 150 121">
                            <path fillRule="evenodd" d="M97.731 53.719c-.742.34-4.003 2.55-6.388 4.191l-6.051-16.865a3.91 3.91 0 0 0 1.27-.306l5.795-2.421c.274-.114.538-.26.794-.422l5.02 15.636c-.15.059-.297.121-.44.187zM83.84 29.054c.034-.092.068-.175.104-.244a.992.992 0 0 1 .271-.28c-.136.17-.26.345-.375.524zm-11.37-6.11c-.464.994-.803 1.931-1.042 2.8l-13.952-8.2c.487-.32.896-.591 1.167-.772l.016-.01.003-.003c.184-.121.31-.207.338-.227.127-.092.326-.169.492-.47.645-.745.283-1.266.283-1.685 0-.43-.023-1.158-.057-2.01l14.204 8.347a9.887 9.887 0 0 0-1.453 2.23zM1.68 37.557c.401-.205.89-.462 1.446-.764l.003.046-1.449.718zm112.365 28.956c0-.445-.002-.868-.005-1.26l.006-.825c0-.07-.014-.13-.016-.2a27.914 27.914 0 0 0-.03-1.08c-.016-.278-.203-.704-.471-1.18-.617-1.409-1.57-2.176-1.57-2.176l-.005.002c-.411-.464-.816-.855-1.136-1.054-.584-.364-2.88-1.712-5.055-2.971l-9.228-29.242-.696-.773c-.064-.636-.348-1.119-.792-1.419l.086-.027s-5.26-4.043-6.751-4.946c-.804-.487-1.71-.418-2.452-.209l.004-.005s-2.943-1.942-4.52-2.382c-.075-.054-.138-.116-.22-.164L53.804.505c-1.53-.9-3.853-.565-5.164.741-.353.352-.59.74-.73 1.137-.24.354-.388.728-.444 1.102l-4.253 2.754.006.006c-.596.353-.975 1.074-.975 2.082v3.09l-16.56 9.612c-.299-.156-.52-.274-.605-.322-.36-.205-1.243.04-1.685.368-.44.327-4.82 3.45-5.02 3.696l.009.002c-.259.168-.422.482-.422.921v4.919l-1.181.693-.748.166-2.773-1.51-.334.787H7.213C4.713 35.07.24 37.788.24 37.788l.238.364v1.94l2.74-1.287.017-.807.025.286s4.757-2.735 6.907-3.16c2.15-.424 4.053-.845 4.57.674-.613 1.018-4.288 3.347-6.6 4.747l-.276-.114L6.1 41.47v.933l.137.09v.247l1.29.396s7.295-4.108 11.2-3.74v-1.911s.198-1.323.317-1.893a.478.478 0 0 1 .121-.218v1.297c.502.049 1.212-.654 1.402-1.08.14-.313.009-.752-.07-.96l.132-.654-.024-.014.267-.04 2.291 1.18c.166.087.323.133.474.159l-.001.008.749.164 1.624-1.038c1.483-.915 3.62-2.246 4.006-2.562l.642-.531V28.33l15.072-9.099 2.606 1.272c.118.097.237.195.379.279l26.84 15.773 11.324 31.56-32.163 18.74v5.72l46.901 27.932 47.443-28.044.453-5.926-35.466-20.026z"/>
                        </svg>
                    </div>
                </div>
            }
        <div className="info">
            <div className="unselected">
                <h1>Please Select An Asset!</h1>
            </div>
            <div className="selected">
                <h2>Asset Name: <span>Motor 29</span></h2>
                <div className="leftsection">
                    <h3>OEE</h3>
                    <div className="oeeVal"><span className="number">57</span><span className="decimal">.37%</span></div>
                    <div className="percBar"><div className="perc"></div></div>
                </div>
                <div className="rightsection">
                    <div className="critRow availability">
                        <div className="leftBar">
                            <div className="critTitle">Availability</div>
                            <div className="percArea">
                                <div className="percBar"><div className="perc"></div></div>
                            </div>
                        </div>
                        <div className="value">85%</div>
                    </div>
                    <div className="critRow quality">
                        <div className="leftBar">
                            <div className="critTitle">Quality</div>
                            <div className="percArea">
                                <div className="percBar"><div className="perc"></div></div>
                            </div>
                        </div>
                        <div className="value">85%</div>
                    </div>
                    <div className="critRow performance">
                        <div className="leftBar">
                            <div className="critTitle">Performance</div>
                            <div className="percArea">
                                <div className="percBar"><div className="perc"></div></div>
                            </div>
                        </div>
                        <div className="value">85%</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
      );
   }
}

module.exports = ProdLine;