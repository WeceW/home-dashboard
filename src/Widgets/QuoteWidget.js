import React, {Component} from 'react';
import styled from 'styled-components';
import axios from 'axios';

const WidgetContainer = styled.div`
    width: ${props => (props.width*300)+((props.width-1)*60)}px;
    height: ${props => (props.height*110)}px;
    line-height: ${props => (props.height*110)}px;
`

const Quote = styled.span`
    display: inline-block;
    vertical-align: middle;
    line-height: normal;
    margin: 30px;
    font-size: 1em;
    font-weight: normal;
    font-style: italic;
`

const Author = styled.span`
    display: block;
    padding-top: 10px;
    font-style: normal;
    font-weight: bold;
`

export default class QuoteWidget extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quote: "",
            author: "",
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
        axios.get('https://thesimpsonsquoteapi.glitch.me/quotes?count=1&timestamp=' + new Date().getTime() + '&')
            .then(response => this.setState({
                quote: response['data'][0]['quote'],
                author: response['data'][0]['character']
            }))
    }

    render() {
        const {quote, author} = this.state
        return(
            <WidgetContainer 
                className="widget" 
                width={this.props.width} 
                height={this.props.height} 
            >
                <Quote>
                    {quote}
                    <Author>- {author} -</Author>
                </Quote>
            </WidgetContainer>
        )
    }
}
