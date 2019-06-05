import React, { Component } from 'react'

export default class Badge extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    let { text, statuses, type } = this.props
    const _text = statuses && typeof statuses === 'object' && statuses[text] || text
    if (!type) {
      type = 'grey'
      switch (text) {
        case 'confirmed':
        case 'active':
        case 'success':
          type = 'success'
          break
        case 'moderate':
        case 'pending':
        case 'waiting':
          type = 'pending'
          break
        case 'error':
          type = 'error'
          break
      }
    }

    return (
      <div className={`badge badge-${type}`}>{_text}</div>
    )
  }
}
