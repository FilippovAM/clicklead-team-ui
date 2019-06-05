import React, { Component } from 'react'
import Icons from '../Icons'

const loadingIcon = (
  <svg width={15} height={15} viewBox='0 0 1024 1024' className='anticon-spin' data-icon='loading' fill='currentColor' aria-hidden='true'><path d='M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 0 0-94.3-139.9 437.71 437.71 0 0 0-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z' /></svg>
)

const arrowDown = (
  <svg width='1em' height='1em' viewBox='0 0 6 4' fill='none'>
    <path
      d='M5.566 0H.434a.425.425 0 0 0-.338.691l2.566 3.15a.438.438 0 0 0 .676 0L5.904.69A.425.425 0 0 0 5.566 0z'
      fill='#C1C9D9'
    />
  </svg>
)

export default class Button extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { type, rounded, icon, trigger, loading, active, ...props } = this.props
    let className = `btu__button`
    if (type) className += ` btu__button-${type}`
    if (rounded) className += ` btu__button-rounded`
    if (trigger) className += ` btu__button-trigger-${trigger}`
    if (icon && !props.children) {
      props.children = icon
      className += ` btu__button-only-icon`
    } else if (icon || loading) {
      if (loading) icon = loadingIcon
      props.children = [<span className='btu__button-icon'>{icon}</span>, props.children]
      className += ` btu__button-with-icon`
    }
    if (active) className += ` active`
    if (props.size && props.size === 'small') className += ` btu__button-small`

    return (
      <button type='button' className={className} {...props} />
    )
  }
}
