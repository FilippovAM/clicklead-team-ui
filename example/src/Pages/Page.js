import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Badge, Table, Button, Icons } from 'bro-team-ui'


export default class Page extends Component {
  render () {
    return (
      <div className="content__inner" style={{ display: 'block' }}>


        <Button size="small">Кнопка</Button>
        <Button size="small" type="violet">Длинная кнопка</Button>
        <Button size="small" type="delete">Загрузка</Button>
        <Button size="small" type="green">Загрузка</Button>
        <Button size="small" type="orange">Загрузка</Button>
        <Button size="small" type="orange" disabled>Загрузка</Button>
        <div className="separator" />

        <Button disabled>Кнопка</Button>
        <Button icon={Icons.Grid}>Длинная кнопка</Button>
        <Button loading>Загрузка</Button>
        <div className="separator" />

        <Button type="primary">Кнопка</Button>
        <Button type="primary" icon={Icons.Grid}>Длинная кнопка</Button>
        <Button type="primary" loading>Загрузка</Button>
        <div className="separator" />

        <Button rounded>Кнопка</Button>
        <Button icon={Icons.Folder} rounded>Длинная кнопка</Button>
        <Button loading rounded>Загрузка</Button>
        <div className="separator" />

        <Button type="primary" rounded>Кнопка</Button>
        <Button type="primary" icon={Icons.Filter} rounded>Длинная кнопка</Button>
        <Button type="primary" loading rounded>Загрузка</Button>
        <Button type="delete" rounded>Загрузка</Button>
        <div className="separator" />

        <Button type="violet" rounded>Кнопка</Button>
        <Button type="violet" icon={Icons.Info} rounded>Длинная кнопка</Button>
        <Button type="violet" loading rounded>Загрузка</Button>
        <div className="separator" />

        <Button icon={Icons.Grid} />
        <Button icon={Icons.Wallet} />
        <Button icon={Icons.Grid} type="primary" />
        <Button icon={Icons.Wallet} type="primary" />
        <Button icon={Icons.Delete} type="delete" />

          <div style={{ background: 'red', marginBottom: '24px', height: '804px', minHeight: '64px' }}>filters</div>
        fwefwefwfwefwewfe
        <br/>
        <div style={{ background: 'red', height: '804px', minHeight: '64px' }}>filters</div>
      </div>
    )
  }
}
