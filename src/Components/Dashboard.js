import React, {Component} from 'react'
import styled from 'styled-components'
import DateTimeWidget from './Widgets/DateTimeWidget'
import WeatherWidget from './Widgets/WeatherWidget'
import TransportWidget from './Widgets/TransportWidget'
import QuoteWidget from './Widgets/QuoteWidget'

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faCloudSun, faQuoteRight, faBusAlt, faToggleOn, faToggleOff} from '@fortawesome/free-solid-svg-icons'
library.add(faClock, faCloudSun, faQuoteRight, faBusAlt, faToggleOn, faToggleOff)

const DashboardContainer = styled.div`
  color: white;
  margin: 0px;
`

const WidgetArea = styled.div`
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  height: 100%;
`

const Menu = styled.ul`
  list-style: none;
  padding-inline-start: 0px;
  margin-block-start: 0;
  margin-block-end: 0;
  background: rgba(0,0,0,0.8);
  float: left;
  width: 80px;
  height: 100vh;
`

const MenuSuperItems = styled.div`
  background: rgba(255,0,0,0.3);
  color: black;
`

const MenuItem = styled.div`
  position: relative;
  background: ${props => props.active ? 'rgba(0,0,0,0.5)' : ''};
  width: 80px;
  height: 80px;
  line-height: 80px;
  font-size: 40px;
  text-align: center;

  &:hover {
    cursor: pointer;
    background: rgba(0,0,0,0.3);
  }
`

const MenuItemOrderNo = styled.span`
  position: absolute;
  top: 56px;
  left: 56px;
  background: rgba(255,0,0,0.25);
  color: white;
  border-radius: 10px;
  display: ${props => props.disp ? 'inline-block' : 'none'};
  height: 20px;
  width: 20px;
  font-size: 12px;
  font-weight: bold;
  line-height: 20px;
  text-align: center;
`

export default class Dashboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      widgetIcons: ['clock', 'cloud-sun', 'bus-alt', 'quote-right'],
      itemsOrder: [0,0,0,0],
      visibleItems: 0,
    }
  }

  openWidget = (i) => {
    this.setState(state => {
      let itemsOrder = state.itemsOrder;
      const itemIsRemoved = itemsOrder[i];
      itemsOrder[i] = itemsOrder[i] === 0 ? this.state.visibleItems+1 : 0;

      if (itemIsRemoved) {
        itemsOrder = itemsOrder.map((item, j) => {
          if (item > itemIsRemoved) {
            return item-1;
          }
          return item;
        })
      }

      const visibleItems = state.visibleItems + (itemIsRemoved ? -1 : 1);



      return {
        itemsOrder,
        visibleItems,
      }
    });
  };

  showAll = () => {
    this.setState(state => {
      let visibleItems = this.state.visibleItems;
      const itemsOrder = state.itemsOrder.map((item, i) => {
        return item === 0 ? ++visibleItems : item;
      });

      return {
        itemsOrder,
        visibleItems,
      }
    });
  }

  hideAll = () => {
    this.setState({
      itemsOrder: new Array(this.state.itemsOrder.length).fill(0),
      visibleItems: 0,
    });
  }

  toggleWidgets = () => {
    this.state.itemsOrder.includes(0) ? this.showAll() : this.hideAll();
  }

  render () {
    return (
      <DashboardContainer>

        <Menu>
          <MenuSuperItems>
            <MenuItem id='toggleWidgets' onClick={() => this.toggleWidgets()}>
              <FontAwesomeIcon icon={this.state.itemsOrder.includes(0) ? 'toggle-off' : 'toggle-on' } />
            </MenuItem>
          </MenuSuperItems>
          {this.state.itemsOrder.map((item, index) => (
            <MenuItem id={index} onClick={() => this.openWidget(index)} active={item}>
              {/* <div>{this.state.itemsName[index]}</div> */}
              <FontAwesomeIcon icon={this.state.widgetIcons[index]} />
              <MenuItemOrderNo disp={item}>{item}</MenuItemOrderNo>
            </MenuItem>
          ))}
        </Menu>

        <WidgetArea>
          <DateTimeWidget  id={0} flexOrd={this.state.itemsOrder[0]} width={1} height={2} />
          <WeatherWidget   id={1} flexOrd={this.state.itemsOrder[1]} width={2} height={2} city="Tampere" />
          <TransportWidget id={2} flexOrd={this.state.itemsOrder[2]} width={2} height={2} />
          <QuoteWidget     id={3} flexOrd={this.state.itemsOrder[3]} width={1} height={2} />
        </WidgetArea>

      </DashboardContainer>
    )
  }
}
