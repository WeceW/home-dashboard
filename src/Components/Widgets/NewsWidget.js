import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {parseString} from 'xml2js';

const WidgetContainer = styled.div`
  display:     ${props => props.flexOrd ? 'block' : 'none'};
  order:       ${props => props.flexOrd};
  width:       ${props => props.width*28}vw;
  height:      ${props => props.height*22}vh;
  line-height: ${props => props.height*22}vh;
`

const Title = styled.span`
  background: rgba(0,0,0,0.5);
  border-radius: 16px 16px 0 0;
  display: block;
  height: 15%;
  height: 15%;
  font-style: normal;
  line-height: normal;
  font-weight: bold;
  font-size: 1.2em;
  text-transform: uppercase;

  span {
    display: inline-block;
    margin-top: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`

const News = styled.span`
  display: block;
  line-height: normal;
  font-size: 0.9em;
  font-weight: normal;
  height: 85%;
  overflow: auto;
`

const Headline = styled.div`
  padding: 5px;
  margin-top: 5px 0px;
  border-top: 1px solid rgba(255,255,255,0.2);
  text-align: left;

  .timestamp {
    background: rgba(255,255,255,1);
    color: black;
    display: inline-block;
    border-radius: 8px;
    padding: 0px 4px;
    margin-right: 8px;
    font-weight: bold;
  }
`

export default class NewsWidget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentType: 'recent',
      currentTitle: 'Ladataan...',
      currentNews: '',

      mainTitle: '',
      mainNews: {},

      recentTitle: '',
      recentNews: {},

      mostReadTitle: '',
      mostReadNews: {},

      sportsTitle: '',
      sportsNews: {},
      
    }
    this.getQuote();
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.getQuote(),
      1000*60*5 // 5min
    );
  }
      
  componentWillUnmount() {
    clearInterval(this.intervallID);
  }
  
  getQuote() {
    axios.get('https://cors-anywhere.herokuapp.com/https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_UUTISET.rss')
      .then(response => parseString(response.data, (err, result) => {
        let news = result['rss']['channel'][0]['item'];
        this.setState({
          mainTitle: result['rss']['channel'][0]['category'], 
          mainNews: news,
          // Set initial "tab" values
          currentType: 'main',
          currentTitle: result['rss']['channel'][0]['category'] + ' (1/4)', 
          currentNews: news,
        });
      }));

    axios.get('https://cors-anywhere.herokuapp.com/https://feeds.yle.fi/uutiset/v1/recent.rss?publisherIds=YLE_UUTISET')
      .then(response => parseString(response.data, (err, result) => {
        let news = result['rss']['channel'][0]['item'];
        this.setState({
          recentTitle: result['rss']['channel'][0]['category'], 
          recentNews: news,
        });
      }));

    axios.get('https://cors-anywhere.herokuapp.com/https://feeds.yle.fi/uutiset/v1/mostRead/YLE_UUTISET.rss')
      .then(response => parseString(response.data, (err, result) => {
        let news = result['rss']['channel'][0]['item'];
        this.setState({
          mostReadTitle: result['rss']['channel'][0]['category'], 
          mostReadNews: news,
        });
      }));

    axios.get('https://cors-anywhere.herokuapp.com/https://feeds.yle.fi/uutiset/v1/mostRead/YLE_UUTISET.rss')
      .then(response => parseString(response.data, (err, result) => {
        let news = result['rss']['channel'][0]['item'];
        this.setState({
          mostReadTitle: result['rss']['channel'][0]['category'], 
          mostReadNews: news,
        });
      }));
    axios.get('https://cors-anywhere.herokuapp.com/https://feeds.yle.fi/uutiset/v1/majorHeadlines/YLE_URHEILU.rss')
      .then(response => parseString(response.data, (err, result) => {
        let news = result['rss']['channel'][0]['item'];
        this.setState({
          sportsTitle: 'Sport: ' + result['rss']['channel'][0]['category'], 
          sportsNews: news,
        });
      }));
  }

  changeNewsType() {
    let type = 'main';
    let title = this.state.mainTitle + ' (1/';
    let news = this.state.mainNews;

    switch (this.state.currentType) {
      case 'main':
        type = 'recent';
        title = this.state.recentTitle + ' (2/';
        news = this.state.recentNews;
        break;
      case 'recent':
        type = 'mostRead';
        title = this.state.mostReadTitle + ' (3/';
        news = this.state.mostReadNews;
        break;
      case 'mostRead':
        type = 'sports';
        title = this.state.sportsTitle + ' (4/';
        news = this.state.sportsNews;
        break;
      default:
        break;
    }
    title = title + '4)';

    this.setState({
      currentType: type,
      currentTitle: title,
      currentNews: news,
    });
  }

  renderNews(news) {
    let timestamps = [];
    let headlines = [];
    for (let i = 0; i < news.length-20; i++) {
      let time = new Date(news[i]['pubDate']);
      time = time.toTimeString().substr(0,5);
      timestamps.push(time);
      headlines.push(news[i]['title']);
    }
    return headlines.map((headline, i) => {
      return (
        <Headline key={i}>
          <span class='timestamp'>{timestamps[i] + ' '}</span>
          {headline}
        </Headline>
      );
    });
  }

  render() {
    const {currentTitle, currentNews} = this.state;
    let headlines = this.renderNews(currentNews);

    return(
      <WidgetContainer 
        className="widget" 
        width={this.props.width} 
        height={this.props.height} 
        flexOrd={this.props.flexOrd}
      >
        <Title onClick={() => this.changeNewsType()}>
          <span>{currentTitle}</span>
        </Title>
        <News>
          {headlines}
        </News>
      </WidgetContainer>
    )
  }
}
