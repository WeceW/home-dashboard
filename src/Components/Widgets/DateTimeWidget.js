import React, {Component} from 'react';
import styled from 'styled-components';

const WidgetContainer = styled.div`
  display: ${props => props.flexOrd ? 'flex' : 'none'};
  order:   ${props => props.flexOrd};
  width:   ${props => props.width*28}vw;
  height:  ${props => props.height*22}vh;
  flex-flow: column nowrap;
  justify-content: space-around;
`

const Clock = styled.div`
  font-size: 10vh;
`

const Day = styled.div`
  font-size: 4vh;
`

export default class DateTimeWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date().toLocaleDateString("fi-FI"),
      time: new Date().toLocaleTimeString("fi-FI"),
      day: new Date().getDay()
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervallID);
  }

  tick() {
    this.setState({
      date: new Date().toLocaleDateString("fi-FI"),
      time: new Date().toLocaleTimeString("fi-FI"),
      day: new Date().getDay()
    });
  }

  render() {
    const {date, time, day} = this.state;

    let weekday = "";
    if (day === 0)
      weekday = "Sunnuntai";
    else if (day === 1)
      weekday = "Maanantai";
    else if (day === 2)
      weekday = "Tiistai";
    else if (day === 3)
      weekday = "Keskiviikko";
    else if (day === 4)
      weekday = "Torstai";
    else if (day === 5)
      weekday = "Perjantai";
    else if (day === 6)
      weekday = "Lauantai";

    return(
      <WidgetContainer 
        className="widget" 
        width={this.props.width} 
        height={this.props.height}
        flexOrd={this.props.flexOrd}
      >
        <Day>{weekday} {date.split('.')[0]}.{date.split('.')[1]}.</Day>
        <Clock>{time}</Clock>
        <Day>&nbsp;</Day>
      </WidgetContainer>
    )
  }
}
