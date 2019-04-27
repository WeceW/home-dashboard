import React, {Component} from 'react';
import styled from 'styled-components';

const Title = styled.span`
    font-size: 20px;
    font-weight: bold;
    color: ${props => props.col};
    ${'' /* float: ${props => props.loc2}; */}
`

export default class PageTitle extends Component {
    render() {
        const {loc, title, subtitle} = this.props;
        return (
            <Title 
                loc2={loc} 
                col="cyan"
            >
                {title} - {subtitle}
            </Title>
        )
    }
} 