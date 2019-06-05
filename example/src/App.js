import React, { Component } from 'react'
//import { Table, Input, Button, Icon } from 'antd';
import { Badge, Table } from 'bro-team-ui'
import axios from 'axios'
import { Router, BrowserRouter, Route, Redirect, withRouter, Switch, NavLink, Link } from 'react-router-dom';
import Routes, { history, Page404 } from './Router'

import ru from 'moment/locale/ru';
import moment from 'moment';


//import * as BroTeamUi from 'bro-team-ui'
//import { Helpers } from 'bro-team-ui'

//console.log(BroTeamUi);
//console.log('Helpers', Helpers);

window.moment = moment
console.log(moment().format('DD MMMM YYYY'));

const api = axios.create({
  baseURL: `https://webmaster.api.cpabro.vip`
})

api.interceptors.request.use(config => {
  config.headers['Authorization'] = `Bearer 1fd27f0b494c761399af9f0c0c05f6acaf76d870`
  config.headers['Accept-Language'] = 'ru' // Cookies.get('lang')
  return config
}, error => {
  return Promise.reject(error)
})

window.api = api


const svg = (
  <svg className="btu__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.5 2C9.5 1.17157 10.1716 0.5 11 0.5H14C14.8284 0.5 15.5 1.17157 15.5 2V15.5H9.5V2ZM0.5 8C0.5 7.17157 1.17157 6.5 2 6.5H5C5.82843 6.5 6.5 7.17157 6.5 8V15.5H0.5V8Z" fill="#F3F5F7" stroke="#BBC1CB"/>
</svg>
)

export default class App extends Component {
  render () {
    const content = Routes.map((route, i) => <Route ref={route.component && route.component.name} key={i} {...route} />)

    return (
      <BrowserRouter>
        <Router history={history}>
          <div className="wrapper">


            <div className="sidebar">
              <div className="sidebar__header">
                <Link to="/" className="h__logo">logo</Link>
              </div>
              <ul className="sidebar__menu">
                <li><NavLink to="/" exact><i>{svg}</i>Таблицы</NavLink></li>
                <li><NavLink to="/icons" exact><i>{svg}</i>Иконки</NavLink></li>
                <li><NavLink to="/page" exact><i>{svg}</i>Страница с скроллом</NavLink></li>
              </ul>
              <div className="sidebar__copyright">
                CPA Bro
                <br/> LLC BLACKMEDIA 2018
              </div>
            </div>

            <div className="content" id="content">
              <header>
                <div className="h__title">Инструменты</div>
              </header>
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
