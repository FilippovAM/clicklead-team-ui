import React, { Component } from 'react'
import { Select } from 'antd'
import Icons from '../Icons'

class Wrapper extends Component {
  render() {
    const { children, ...props } = this.props
    if (!props.hasOwnProperty('dropdownMatchSelectWidth ')) props.dropdownMatchSelectWidth = true
    if (!props.hasOwnProperty('allowClear')) props.allowClear = true
    return <Select placeholder='Все' suffixIcon={Icons.ArrowDown} {...props}>{children}</Select>
  }
}

Wrapper.Option = Select.Option

export default Wrapper
