import React, { Component } from 'react';
import styled from 'styled-components';
import './App.css';
import Header from './Components/Header';
import Dashboard from './Components/Dashboard';


const AppContainer = styled.div`
  height: 100%;
  margin: auto;
`

class App extends Component {
  render() {
    return (
      <AppContainer>
        {/* <Header /> */}
        <Dashboard />
      </AppContainer>
    );
  }
}

export default App;
