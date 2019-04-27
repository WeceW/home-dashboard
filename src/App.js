import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import Header from './Components/Header';
import DateTimeWidget from './Widgets/DateTimeWidget';
import WeatherWidget from './Widgets/WeatherWidget';
import TransportWidget from './Widgets/TransportWidget';
import QuoteWidget from './Widgets/QuoteWidget';


const AppContainer = styled.div`
  height: 100%;
  margin: auto;
`

const Dashboard = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  padding: 10px;
`

class App extends Component {
  render() {
    return (
      <AppContainer>
        <Header />
        <Dashboard>
          <DateTimeWidget width={1} height={2} />
          <WeatherWidget width={2} height={2} city="Tampere" />
          <TransportWidget width={2} height={3} />
          <QuoteWidget width={1} height={3} />
        </Dashboard>
      </AppContainer>
    );
  }
}

export default App;
