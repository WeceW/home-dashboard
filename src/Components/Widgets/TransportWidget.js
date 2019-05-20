import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';

const KUOKKAMAANTIE1 = '3003';
const KUOKKAMAANTIE2 = '3004';
const VIINIKKA       = '3500';
const KESKUSTORI1    = '0001';
const KESKUSTORI2    = '0002';
const KESKUSTORI3    = '0003';
const stopNos = [KUOKKAMAANTIE1,KUOKKAMAANTIE2,VIINIKKA,
                 KESKUSTORI1, KESKUSTORI2, KESKUSTORI3, '2001', '2002', '3001', '5005'
];

const WidgetContainer = styled.div`
  display:     ${props => props.flexOrd ? 'flex' : 'none'};
  order:       ${props => props.flexOrd};
  width:       ${props => props.width*28}vw;
  height:      ${props => props.height*22}vh;
  line-height: ${props => props.height*22}vh;
  flex-flow: row wrap;
  justify-content: space-evenly;
  background-image: url(${props => props.bgimage});
  background-size: 450px 450px;
  background-repeat: no-repeat;
  background-position: center center;
  overflow: auto;
`

const Schedules = styled.div`
  display: block;
  line-height: normal;
  font-style: normal;
  text-align: left;
`

const Stop = styled.table`
  margin: 0px 8px;
  padding: 0px;
  font-size: 1em;
  text-align: center;
  border-collapse: collapse;

  td {
    padding: 4px;
  }
`

const StopNo = styled.h1`
  display: block;
  ${'' /* border-bottom: 1px solid white; */}
  margin: 5px 0 0 0;
  padding: 0px;
  font-size: 1.5em;
  text-align: center;
`

const Line = styled.td`
  background: white;
  color: black;
  border-radius: 4px 0 0 4px;
  width: 20%;
  opacity: 0.8;
`

const Time = styled.td`
  background: ${props => props.bg};
  color: white;
  border-radius: 0 4px 4px 0;
  opacity: 0.8;
`


export default class TransportWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stops: [],
    }
    this.getSchedule();
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.getSchedule(),
      1000*10 // 10s
    );
  }
      
  componentWillUnmount() {
    clearInterval(this.intervallID);
  }
  
  getSchedule() {
    axios.get('https://cors-anywhere.herokuapp.com/'+'http://data.itsfactory.fi/journeys/api/1/stop-monitoring?stops='+stopNos.join(',')+'&timestamp=' + new Date().getTime() + '&')
      .then(response => this.setState({
        stops: response.data.body,
      }))
  }

  renderArrivalTimes(stops) {
    if (stops.length === 0) {
      return (<div>Ladataan...</div>);
    }

    console.log(stops);

    return stopNos.map((stop, i) => {
      let lines = <tr><td>Ei tietoja.</td></tr>;
      try {
        lines = stops[stop].map((line, j) => {
          let time = line.call.expectedArrivalTime ? line.call.expectedArrivalTime : line.call.expectedDepartureTime;
          if (!line.call.expectedArrivalTime) {
            time = line.call.expectedDepartureTime;
          }
          time = new Date(line.call.expectedArrivalTime);
          time = time.toTimeString().substr(0,5);
          const bgColor = () => {
            if (line.call.vehicleAtStop)
              return 'pink';
            if (line.call.arrivalStatus === 'delayed')
              return 'darkred';
            if (line.call.arrivalStatus === 'early')
              return 'green';
            if (line.call.arrivalStatus === 'onTime')
              return 'darkgreen';
            return 'black';
          }
          return (
            <tr key={j}>
              <Line>{line.lineRef}</Line>
              <Time bg={bgColor}>{time}</Time>
            </tr>
          );
        });
      } catch (TypeError) {
        console.log("TypeError!");
      }

      return (
        <Schedules key={stop}>
            <StopNo>{stop}</StopNo>
            <Stop key={stop}>
              <tbody>
                {lines}
              </tbody>
            </Stop>
        </Schedules>
      );
    })
  }

  render() {
    const {stops} = this.state;
    let arrivalTimes = this.renderArrivalTimes(stops);

    return(
      <WidgetContainer 
        className="widget" 
        width={this.props.width} 
        height={this.props.height} 
        bgimage=""
        flexOrd={this.props.flexOrd}
      >
        {arrivalTimes}
      </WidgetContainer>
    )
  }
}
