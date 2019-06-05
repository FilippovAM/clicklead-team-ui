import React, { Component } from 'react'
//import { Table, Input, Button, Icon } from 'antd';
import { Badge, Table } from 'bro-team-ui'
import { Router, BrowserRouter, Route, Redirect, withRouter, Switch, NavLink, Link } from 'react-router-dom';
import Routes, { history, Page404 } from './Router'

export default class App extends Component {
  render () {
    const content = Routes.map((route, i) => <Route ref={route.component && route.component.name} key={i} {...route} />)

    return (
      <BrowserRouter>
        <Router history={history}>
          <div className="wrapper">


            <div className="sidebar">
              <ul className="sidebar__menu">
                <li><NavLink to="/">Таблицы</NavLink></li>
              </ul>
            </div>

            <div className="content" id="content">
              <Switch>
                {content}
              </Switch>
            </div>


          </div>
        </Router>
      </BrowserRouter>
    )
  }
}

/*
<Badge text="active" statuses={{ active: 'активен', deleted: 'deleted' }}/>
<Badge text="active" />
<Badge text="test123" type="error" />
<Badge text="test535353" />
<Badge text="test535353" type="pending"/>
*/
