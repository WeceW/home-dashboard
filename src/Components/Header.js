import React, { Component } from 'react';
import styled from 'styled-components';
import ActionButton from './ActionButton';
import PageTitle from './PageTitle';

const HeaderContainer = styled.div`
    background: rgba(0,0,0,0.8);
    padding: 10px;
    color: white;
    text-align: center;
`

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 1,
            subTitle: ""
        }
        this.callMe = this.callMe.bind(this);
    }

    callMe(event) {
        event.preventDefault()
        event.stopPropagation()
        this.setState(state => ({
            count: this.state.count*2,
            subTitle: "Click " + this.state.count
        }));
    }

    render() {
        return (
            <HeaderContainer>
                {/* <Title loc="right" onClick={this.callMe}>Dashboard - {this.state.subTitle}</Title> */}
                <PageTitle title="Dashboard" loc="middle" subtitle={this.state.subTitle}/>
                <ActionButton 
                    text="Push here" 
                    action={this.callMe}
                    loc="left"
                />
                <ActionButton 
                    text="Push here" 
                    action={this.callMe}
                    loc="right"
                />
            </HeaderContainer>
        )
    }
}