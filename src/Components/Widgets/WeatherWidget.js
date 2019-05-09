import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {parseString} from 'xml2js';

const WidgetContainer = styled.div`
  display: ${props => props.flexOrd ? 'flex' : 'none'};
  order:   ${props => props.flexOrd};
  width:   ${props => props.width*28}vw;
  height:  ${props => props.height*22}vh;
  line-height: ${props => props.height*22}vh;
  background-image: url(${props => props.bgimage});
  background-size: ${props => props.height*1.5*22}vh;
  background-repeat: no-repeat;
  background-position: center center;
  justify-content: space-between;
`

const Temp = styled.div`
  font-size: 16vh;
`

const Windspeed = styled.div`
  font-size: 4vh;
  padding: 20px;
`

const CurrentState = styled.span`
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  vertical-align: middle;
  width: 30%;
  line-height: normal;
  text-shadow: 1px 1px 10px #000;
`

const Forecast = styled.table`
  display: block;
  float: right;
  height: 100%;
  overflow: auto;
  ${'' /* margin: auto 20px; */}
  padding: 0px;
  font-size: 1.5em;
  line-height: normal;
  text-shadow: 1px 1px 10px #000;

  tr {
    td {
      padding: 0px 4px;
      text-align: left;
    }

    td.time {
      font-size: 14px;
    }
  }
`

export default class DateTimeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      temp: "",
      windspeed: "",
      temps: {},
      winds: {},
      symbols: {}
    }
    this.getWeatherInfo();
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.getWeatherInfo(),
      1000*60*5 // 5min
    );
  }
      
  componentWillUnmount() {
    clearInterval(this.intervallID);
  }
  
  getWeatherInfo() {
    axios.get('http://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&' + 
              'request=getFeature' +
              '&storedquery_id=fmi::forecast::hirlam::surface::point::timevaluepair' +
              '&place=' + this.props.city +
              '&parameters=temperature,windspeedms,WeatherSymbol3' + 
              '&timestamp='+new Date().getTime()+'&')
      .then(response => parseString(response.data, (err, result) => {
        let temperature = 0;
        let windspeedms = 1;
        let WeatherSymbol3 = 2;
        let temps = result['wfs:FeatureCollection']['wfs:member'][temperature]['omso:PointTimeSeriesObservation'][0]['om:result'][0]['wml2:MeasurementTimeseries'][0]['wml2:point'];
        let winds = result['wfs:FeatureCollection']['wfs:member'][windspeedms]['omso:PointTimeSeriesObservation'][0]['om:result'][0]['wml2:MeasurementTimeseries'][0]['wml2:point'];
        let symbols = result['wfs:FeatureCollection']['wfs:member'][WeatherSymbol3]['omso:PointTimeSeriesObservation'][0]['om:result'][0]['wml2:MeasurementTimeseries'][0]['wml2:point'];
        let nextTemp = temps[0]['wml2:MeasurementTVP'][0]['wml2:value'][0];
        let nextWindspeed = winds[0]['wml2:MeasurementTVP'][0]['wml2:value'][0];
        let nextSymbol = symbols[0]['wml2:MeasurementTVP'][0]['wml2:value'][0];
        this.setState({
          temp: Math.round(parseFloat(nextTemp)),
          windspeed: Math.round(parseFloat(nextWindspeed)),
          symbol: parseInt(nextSymbol),
          temps: temps,
          winds: winds,
          symbols: symbols
        });
      }));
    // TODO: Get observations instead of the forecast for the "current" states
  }

  getForecastDataAsTableRows(temps, winds, symbols) {
    let forecast = [];
    for (let i = 1; i < temps.length; i++) {
      forecast.push([
        new Date(temps[i]['wml2:MeasurementTVP'][0]['wml2:time'][0]).toLocaleTimeString('fi-FI'),
        Math.round(parseFloat(temps[i]['wml2:MeasurementTVP'][0]['wml2:value'][0])),
        Math.round(parseFloat(winds[i]['wml2:MeasurementTVP'][0]['wml2:value'][0])),
        parseInt(symbols[i]['wml2:MeasurementTVP'][0]['wml2:value'][0])
      ]);
    }
    return forecast.map((weather, i) => {
      let symbolUrl = "./weather-symbols/"+weather[3]+".svg";
      return (
        <tr key={i}>
          <td className="time" key={i+"-1"}>{weather[0].split('.')[0]}:00</td>
          <td key={i+"-2"}>
            <img src={symbolUrl} alt="" />
          </td>
          <td key={i+"-3"}>{weather[1]}&#8451;</td>
          <td className="time" key={i+"-4"}>{weather[2]} m/s</td>
        </tr>
      )
    });
  }

  render() {
    const {temp, windspeed, symbol, temps, winds, symbols} = this.state
    let forecast = this.getForecastDataAsTableRows(temps, winds, symbols);
    let weatherSymbolUrl = "./weather-symbols/"+symbol+".svg";
    return(
      <WidgetContainer 
        className="widget" 
        width={this.props.width} 
        height={this.props.height} 
        bgimage={weatherSymbolUrl}
        flexOrd={this.props.flexOrd}
      >
        <CurrentState>
          <Windspeed>{this.props.city}</Windspeed>
          <Temp>{temp}&#8451;</Temp>
          <Windspeed>{windspeed} m/s</Windspeed>
        </CurrentState>
        <Forecast>
          <tbody>{forecast}</tbody>
        </Forecast>
      </WidgetContainer>
    )
  }
}
