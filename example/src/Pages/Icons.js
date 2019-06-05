import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Badge, Table, Button, Icons } from 'bro-team-ui'


export default class Page extends Component {
  render () {
    return (
      <div className="content__inner" style={{ display: 'block' }}>
        {Object.keys(Icons).map(key => Icons[key])}



      </div>
    )
  }
}
