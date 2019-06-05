import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route, Redirect } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory'

import Tables from './Pages/Tables.js'
import Page from './Pages/Page.js'
import Icons from './Pages/Icons.js'

export const history = createHistory()
export const Page404 = () => (
  <div>
    <h3>Страница не найдена</h3>
  </div>
)

const routes = [
  {
    path: '/',
    component: Tables,
    exact: true
  },
  {
    path: '/page',
    component: Page,
    exact: true
  },
  {
    path: '/icons',
    component: Icons,
    exact: true
  },
]

export default routes
