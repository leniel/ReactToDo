import React, { Component } from 'react';
import ResponsiveDrawer from './ResponsiveDrawer'

export default class Header extends Component
{
    render()
    {
        return (

            <div className="header">

            <ResponsiveDrawer />

            </div>
        );
    }
}