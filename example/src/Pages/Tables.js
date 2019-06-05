import React, { Component } from 'react'
import ReactDOM from 'react-dom';
import { Route, Redirect, NavLink } from 'react-router-dom';
import { Badge, Table, Button, Icons, RemoteMultiSelect, Select, RangePicker } from 'bro-team-ui'
import { Form, Input, message, Popover, Checkbox } from 'antd'
import _ from 'lodash'
import axios from 'axios'



const columns = [{
    title: 'Name',
    dataIndex: 'name',
    width: 150
  }, {
    title: 'Age',
    dataIndex: 'age',
    width: 150,
    sorter: true,
  }, {
    title: 'Address',
    dataIndex: 'address',
}];

const data = []
for (var i = 0; i < 1; i++) {
  data.push({ key: i, name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' })
}

const clean = (values) => {
  Object.keys(values).forEach(key => (values[key] === undefined || !values[key] || Array.isArray(values[key]) && !values[key].length) && delete values[key])
  return values
}

class _Filter extends Component {

  constructor(props) {
    super(props)
  }

  handleSubmit = (e) => {
    console.log('handleSubmit');
    this.props.form.validateFieldsAndScroll((err, values) => {
      //Object.keys(values).forEach(key => (values[key] === undefined || !values[key]) && delete values[key])
      //this.props.onSubmit(values)
      console.log(values);
    })
  }

  validator = (name, label, input, rules = [], initialValue) => {
    const { form } = this.props;
    const options = { rules };
    if (initialValue) options.initialValue = initialValue;
    if (this.state && this.state.data && this.state.data[name]) options.initialValue = this.state.data[name];
    // if (this.constructor.name === '_Filter') options.initialValue = Filters.value(name);
    if (input.props && input.props.prefixCls && ['ant-checkbox'].includes(input.props.prefixCls)) options.valuePropName	= 'checked';
    if(name === 'created_at') {
      /* options.initialValue = [
        //moment.unix(1543622400).startOf('day'),
        //moment.unix(1543795200).endOf('day'),
        1543622400,
        1544227200
      ] */
    }

    return (
      <Form.Item className={`form__item-${name}`} key={name}>
        {label && <h4>{label}</h4>}
        {form.getFieldDecorator(name, options)(input)}
      </Form.Item>
    )
  }

  _onFieldChange = (v, t) => {
    console.log('onFieldChange', v, t);
    //this.handleSubmit()
  }

  componentDidUpdate = (prevProps, prevState, snapshot) => {
    console.log('componentDidUpdate, handleSubmit ->')
    // this.handleSubmit()
  }

  render() {

    const { form, type } = this.props
    const values = form.getFieldsValue()
    const disable_actions = !values.offer_id || values.offer_id == undefined || values.offer_id.length == 0
    //console.log('values', values);
    return (
      <div className="filter filter__tickets">
        <Form>
          {this.validator('created_at', 'Дата', <RangePicker showClearDates /> )}

          {this.validator('name', 'test', <Input size="large" />, [{ required: true }] )}
          {this.validator('name2', 'Группировка по2', (
            <Select>
              <Select.Option value="1">Select.Option 1</Select.Option>
              <Select.Option value="2">Select.Option 2</Select.Option>
              <Select.Option value="3">Select.Option 3</Select.Option>
            </Select>
          ) )}

          {this.validator('offer_id', 'Офферы', <RemoteMultiSelect filter="offers" hideIds  /> )}
          {this.validator('action_id', 'Цели', <RemoteMultiSelect filter="actions" disabled={disable_actions} params={{ 'q[offer_id][in]': Array.isArray(values.offer_id) ? values.offer_id.join(',') : values.offer_id  }} /> )}

          <div>
            <h4>Фильтры</h4>
            <div className="btn-group">
              <Button icon={Icons.Grid} active={true} />
              <Button icon={Icons.Filter} />
              <Button icon={Icons.Folder} />
            </div>
          </div>

          <div>
            <h4>Вид</h4>
            <div className="btn-group">
              <Button icon={Icons.Grid} />
              <Button icon={Icons.Grid} />
            </div>
          </div>



          <Form.Item>
            <h4>&nbsp;</h4>
            <Button  type="primary" size="large" onClick={this.handleSubmit}>Показать</Button>
          </Form.Item>
        </Form>
      </div>
    )
  }
}
const Filter = Form.create()(_Filter)


export default class Tables extends Component {
  render () {
    return (
      <div className="content__inner">
        <div className="tabs">
          <NavLink to="/test">Агрегированная</NavLink>
          <NavLink to="/">Товарка / e-commerce</NavLink>
          <NavLink to="/test">Test3</NavLink>
          <NavLink to="/test">Test4</NavLink>
          <span></span>
          <NavLink to="/test">Детализация лидов</NavLink>
        </div>
        <Filter  />

          <Table columns={columns} dataSource={data} />

      </div>
    )
  }
}
