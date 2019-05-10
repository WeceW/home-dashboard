import React, {Component} from 'react';
import styled from 'styled-components';

const weekdays = ['Sunnuntai',
                  'Maanantai', 
                  'Tiistai', 
                  'Keskiviikko', 
                  'Torstai', 
                  'Perjantai', 
                  'Lauantai'];

const WidgetContainer = styled.div`
  display: ${props => props.flexOrd ? 'flex' : 'none'};
  order:   ${props => props.flexOrd};
  width:   ${props => props.height*22}vh;
  height:  ${props => props.height*22}vh;
  flex-flow: column nowrap;
  justify-content: space-around;
  
  border-radius: 100%;
  background: rgba(255,255,255,0.6);
  color: black;
  border: 10px solid rgba(0,0,0,1);
  box-sizing: border-box;
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
    return(
      <WidgetContainer 
        className="widget" 
        width={this.props.width} 
        height={this.props.height}
        flexOrd={this.props.flexOrd}
      >
        <Day>{weekdays[day]} {date.split('.')[0]}.{date.split('.')[1]}.</Day>
        <Clock>{time}</Clock>
        <Day>&nbsp;</Day>
      </WidgetContainer>
    )
  }
}
