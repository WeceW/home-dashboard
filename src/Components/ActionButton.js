import React, { Component } from 'react';
import styled from 'styled-components';

const Button = styled.button`
    cursor: pointer;
    padding: 4px 8px;
    background-color: darkcyan;
    border-radius: 4px;
    border: none;
    outline: none;
    float: ${props => props.loc};

    &:hover {
        background-color: orange;
    }

    &:active {
        background-color: red;
    }

`

export default class ActionButton extends Component {
    render() {
        const {text, action} = this.props;
        return (
            <Button onClick={action} loc={this.props.loc}>{text}</Button>
        )
    }
}