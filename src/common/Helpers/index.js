import React, { Component } from 'react'
import { Icon, Spin, message, Modal, Form, Input } from 'antd'
import qs from 'qs'
import moment from 'moment'
import * as Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import Filters from './Filters'
import Events from './Events'
import Cache from './Cache'

export { default as Cache } from './Cache'
export { default as Events } from './Events'
export { default as Filters } from './Filters'

// validator
export function validator(name, label, input, rules = [], initialValue) {
  const { form } = this.props
  const options = { rules }
  if (initialValue) options.initialValue = initialValue
  if (this.state && this.state.data && this.state.data[name]) options.initialValue = this.state.data[name]
  if (this.constructor.name === '_Filter') options.initialValue = Filters.value(name)
  if (input.props && input.props.prefixCls && ['ant-checkbox'].includes(input.props.prefixCls)) options.valuePropName	= 'checked'
  return (
    <Form.Item className={`form__item-${name}`} key={name}>
      {label && <h4>{label}</h4>}
      {form.getFieldDecorator(name, options)(input)}
    </Form.Item>
  )
}

// onFilter
export function onFilter(values) {
  const filters = Filters.prepare(values)
  this.setState({ filters }, this.fetch)
}

// on change table pagination
export function handleTableChange({ current: page }, filters, { columnKey, order }) {
  const sort = order == 'ascend' ? columnKey : `-${columnKey}`
  const pagination = { ...this.state.pagination, current: page, sort }
  this.setState({ pagination }, this.fetch)
}

export function handleFilterSubmit() {
  this.props.form.validateFields((err, values) => {
    this.props.onSubmit(clean(values))
  })
}

const Helpers = {

  errorHandler: (e) => {
    if (e && e.response && e.response.data && Array.isArray(e.response.data)) {
      e.response.data.forEach(error => {
        message.error(error.message)
      })
    } else {
      message.error('Произошла ошибка')
    }
  },

  checkTicketMessages: () => {
    const user_id = Cookies.get('user_id')

    api.get('/v1/ticket-messages', {
      params: {
        'q[status][equal]': 'unread',
        'q[user_id][not_equal]': user_id
      }
    })
      .then((response) => {
        window.store.dispatch({
          type: 'USER_SET_DATA',
          params: { tickets_unread_messages: parseInt(response.headers['x-pagination-total-count']) }
        })
      })
  },

  checkUserNotifications: () => {
    const user_id = Cookies.get('user_id')
    api.get('/v1/notifications?fields=id')
      .then(response => {
        window.store.dispatch({
          type: 'USER_SET_DATA',
          params: { notifications: parseInt(response.headers['x-pagination-total-count']) }
        })
      })
  },

  // установка заголовка в шапке
  setTitle: (title, html) => {
    // console.log(typeof title, title);
    window.store.dispatch({
      type: 'CONFIG_SET',
      params: {
        title: html || title
      }
    })
    document.title = `${t(title)} - Cpa Bro`
  },

  emptyText: () => <div className='notfound'>{t('emptyText')}</div>,

  spinner: (type = '', spinning = false) => {
    const indicator = <Icon type='loading' style={{ fontSize: 20 }} spin />
    if (type == 'table') return { indicator, spinning: spinning }
    return (<div className='spinner'><Spin indicator={indicator} /></div>)
  },

  renderStatus: (status, statuses) => {
    let color = ''
    switch (status) {
      case 'confirmed':
      case 'active':
      case 'success':
        color = 'green'
        break
      case 'moderate':
      case 'pending':
      case 'waiting':
        color = 'orange'
        break
      case 'error':
        color = 'red'
        break
    }
    const text = statuses[status]
    return <span className={`color__${color}`}>{text || status}</span>
  },

  renderCurrency: (currency_id) => {
    const { currencies } = window.store.getState().config
    return currencies[currency_id] && (currencies[currency_id].symbol || currencies[currency_id].code) || ''
  },

  getPopupContainer: () => {
    return document.getElementById('content')
  },

  time_offset: () => {
    const { time_offset } = window.store.getState().user
    return parseInt(time_offset)
  }
}

export default Helpers

/* import api from '../Api'
import React, { Component } from 'react'
import { Icon, Spin, message, Modal, Form, Input } from 'antd'
import { Button } from 'bro-team-ui'
import { connect } from 'react-redux'
import qs from 'qs'
import moment from 'moment'
import axios from 'axios'
import * as Cookies from 'js-cookie'
import { Link } from 'react-router-dom'
import RcTreeSelect, { TreeNode } from 'but1head-rc-tree-select'
import store from '../../reducers'
import * as Feather from 'react-feather'
import Filters from './Filters';
import Events from './Events';
import Cache from './Cache'

export { default as Cache } from './Cache'
export { default as Events } from './Events'
export { default as Filters } from './Filters'
export { default as SearchSelect } from './SearchSelect'

const Helpers = {

  checkUserData: (cb) => {
    const user_id = Cookies.get('user_id')
    api.get(`/v1/user-data/${user_id}?expand=user,personalManager`)
    .then((response) => {
      const balance = response.data && response.data.balance || 0.00
      const hold = response.data && response.data.hold || 0
      const { personalManager } = response.data

      if(!Cookies.get('time_offset')) Cookies.set('time_offset', response.data.time_offset, { expires: 365 })

      window.store.dispatch({
        type: "USER_SET_DATA",
        params: {
          user_id: user_id,
          balance: +balance,
          hold: +hold,
          email: response.data.user && response.data.user.email || null,
          name: response.data.name,
          default_revshare_percent: response.data.default_revshare_percent,
          avatar_image: response.data.avatar_image || '/img/avatar.svg',
          manager: {
            avatar: personalManager.avatar_image || '/img/avatar.svg',
            name: personalManager.name,
            contacts: personalManager.contacts,
          },
          tariff_level: response.data.tariff_level,
          tariff_name: response.data.tariff_name,
          time_offset: response.data.time_offset,
          currency_id: response.data.currency_id,
          confirmed: response.data.confirmed,

          banned: response.data.banned,
          reason_of_ban: response.data.reason_of_ban,

          ...pick(response.data, 'global_postback_method', 'global_postback_url'),
        }
      })
    })
    .catch(e => {
      console.log(e);
      api.post(`/v1/user-data`, qs.stringify({ ref_id: Cookies.get('rid') }))
      .then((response) => {
        Helpers.checkUserData()
      })
    })
  },

  checkUserBills: () => {
    window.dispatchEvent(new Event('checkUserBills.pending'))
    const user_id = Cookies.get('user_id')
    const _user = () => api.get(`/v1/user-data/${user_id}?fields=balance,hold`)
    const _balance = () => api.get('v1/user-bills')
    const _holds = () => api.get('v1/user-bills/hold')
    axios.all([_user(), _balance(), _holds()])
    .then(axios.spread((user, balance, hold) => {
      window.store.dispatch({
        type: "USER_SET_DATA",
        params: {
          balance: user.data.balance,
          hold: user.data.hold,
          bills: {
            hold: hold.data,
            balance: balance.data,
          }
        }
      })
      window.dispatchEvent(new Event('checkUserBills.success'))
    }))
  },

  checkUserPlatforms: () => {
    api.get(`/v1/platforms`, {
      params: {
        'per-page': 999,
        'sort': '-id'
      }
    })
    .then(response => {
      window.store.dispatch({
        type: "USER_SET_DATA",
        params: {
          platforms: response.data
        }
      })
    })
  },

  checkUserWallets: () => {
    api.get(`/v1/wallets`, {
      params: {
        'per-page': 999,
        'sort': '-id'
      }
    })
    .then(response => {
      window.store.dispatch({
        type: "USER_SET_DATA",
        params: {
          wallets: response.data
        }
      })
    })
  },

  prepareLeadsFilters: (filters, type, row) => {
    const group = filters.group
    const value = row[group]
    console.log('prepareLeadsFilters', group, value, row, type);

    // подмена q[created_at][between] для групировок по датам
    if(group === 'action_day' && value) {
      const tmp = moment.unix(value).utcOffset(Helpers.time_offset())
      const start = tmp.startOf('day').unix()
      const end = tmp.endOf('day').unix()
      filters[`q[created_at][between]`] = `${start},${end}`
    } else if(group === 'action_week' && value) {
      const tmp = moment.unix(value).utcOffset(Helpers.time_offset())
      const start = tmp.startOf('day').unix()
      const end = tmp.add(6, 'days').endOf('day').unix()
      filters[`q[created_at][between]`] = `${start},${end}`
    } else if(group === 'action_month' && value) {
      const tmp = moment.unix(value).utcOffset(Helpers.time_offset())
      const start = tmp.startOf('month').unix()
      const end = tmp.endOf('month').unix()
      filters[`q[created_at][between]`] = `${start},${end}`
    } else {
      filters[`q[${group}][equal]`] = value
    }

    delete filters.group
    delete filters.expand

    if(['confirmed', 'pending', 'rejected'].includes(type)) {
      filters['q[lead_type][equal]'] = 'conversion'
      filters['type'] = type
    } else {
      filters['q[lead_type][equal]'] = type
    }

    return filters
  }

}
export default Helpers

// language translations
export const t = (key) => {
  const { language: { current, translations } } = window.store.getState().config
  return translations[current] && translations[current][key] || key
}

// get specifed keys from object (default:custom)
export const pick = (o, ...props) => Object.assign({}, ...props.map(prop => ({
  [prop.includes(':') ? prop.split(':')[1] : prop]: o[prop.includes(':') ? prop.split(':')[0] : prop]
 })))

// clean undefined from object/array
export const clean = (values) => {
  Object.keys(values).forEach(key => (values[key] === undefined || Array.isArray(values[key]) && values[key].length == 0) && delete values[key])
  return values
}

export const queryParams = () => {
  const tmp = qs.parse(window.location.search.substr(1), {
    plainObjects: true,
    depth: -2,
    ignoreQueryPrefix: true,
    allowDots: true,
    parseArrays: false
  })

  if(tmp['q']) {
    const keys = Object.keys(tmp['q'])
    Object.keys(tmp['q']).forEach(key => {
      tmp[`q${key}`] = tmp['q'][key]
    })
    delete tmp['q']
  }

  return tmp
}
export const disabledDate = (current) => {

  const time_offset =  Helpers.time_offset()
  //console.log(current.format('DD.MM.YYYY HH:mm ZZ'), moment().endOf('day').utcOffset(time_offset).format('DD.MM.YYYY HH:mm ZZ'), ' ---- ', moment().endOf('day').format('DD.MM.YYYY HH:mm ZZ'))
  //console.log(123);
  //console.log(time_offset);

  // тут баг после обновления даты - не меняется все это говно
  return current && current.utcOffset(time_offset) > moment().endOf('day').utcOffset(time_offset)
}

// custom tree-select
class _TreeSelect extends RcTreeSelect {
  renderTopControlNode() {
    const { value } = this.state
    const props =  this.props
    const { children, placeholder, choiceTransitionName, prefixCls, maxTagTextLength } = props

    let selectedValueNodes = [];

    if(value.length) {
      let content = null
      if(value.length == 1) {
        content = value[0].label
      } else if(value.length == 2) {
        content = `${value[0].label}, ${value[1].label}`
      } else if(value.length > 2 && value.length < children.length) {
        content = `${value.length} из ${children.length}`
      } else if(value.length == children.length) {
        content = `Все`
      }
      selectedValueNodes.push(<li className={`custom__select-tree-selected`} style={{ float: 'left' }} key="test">{content}</li>)
    }

    selectedValueNodes.push(
      <li className={`${prefixCls}-search ${prefixCls}-search--inline`} key="__input">
        {this.getInputElement()}
      </li>
    )

    const className = `${prefixCls}-selection__rendered`
    return (<ul className={className}>{selectedValueNodes}</ul>)
  }
}
export const TreeSelect = (props) => {
  const options = {
    allowClear: true,
    treeCheckable: (<span className={`ant-select-tree-checkbox-inner`} />),
    prefixCls: "ant-select",
    className: "ant-select-custom ant-select-lg",
    dropdownClassName: `ant-select-tree-dropdown`,
    ...props,
    //showSearch: false,
    //filterTreeNode: false,
  }
  delete options.values

  const values = props.values && props.values.map((item, i) => <TreeNode value={item.id && item.id.toString()} title={item.name} key={i} />) || null
  return <_TreeSelect {...options} >{values}</_TreeSelect>
}
export class TreeSelectRemote extends Component {

  constructor(props) {
    super(props)

    let data = props.data
    if(!Array.isArray(data) && typeof data === 'object') {
      const tmp = Object.keys(data).map(key => {
        return { id: key, name: data[key] }
      })
      data = tmp
    }

    this.state = {
      data: data || [],
      isLoading: false,
    }
  }

  componentDidMount = () => {
    const { value } = this.props
    if(value) this._onClick()
  }

  componentWillReceiveProps = (nextProps) => {
    const { offer_id, country_id } = this.props

    if(offer_id) {
      const next_offer_id = nextProps.offer_id
      if(next_offer_id == offer_id) return
      this.setState({ data: [] }, this._onClick)
    }

    if(country_id) {
      const next_country_id = nextProps.country_id
      if(next_country_id == country_id) return
      this.setState({ data: [] }, this._onClick)
    }

  }

  _onClick = () => {
    let { filter, target, offer_id, country_id } = this.props
    const { data, isLoading } = this.state
    if(isLoading || data.length > 0) return
    this.setState({ isLoading: true })

    if(target === '/v1/countries') {
      this.setState({ data: Cache.get(`global.countries`), isLoading: false })
      return
    }

    const params = {
      'per-page': 500,
    }

    if(filter && filter.includes('sub_id_')) {
      params.sub_id_number = filter.slice(-1)
      filter = 'sub-id'
    }

    let url = filter && `v1/statistic-light-filters/${filter}` || target

    if(this.props.id == 'offer_id') params['have_access'] = 1
    if(offer_id) params[`q[offer_id][in]`] = offer_id.join(',')
    if(country_id) params[`q[country_id][in]`] = country_id.join(',')

    if(window.location.pathname == '/stats/e-commerce') params['q[offer_type][equal]'] = 1
    if(window.location.pathname == '/stats/gambling') params['q[offer_type][equal]'] = 2

    api.get(url, {
      params: params
    })
    .then(response => {
      if(!Array.isArray(response.data) && typeof response.data === 'object') {
        const tmp = Object.keys(response.data).map(key => {
          return { id: key, name: response.data[key] }
        })
        response.data = tmp
      }

      if(this.props.id == 'action_id') {
        response.data = response.data.map(item => {
          item.name = `#${item.id} ${item.name}`
          return item
        })
      }

      this.setState({ data: response.data, isLoading: false })
    })
    .catch(e => {
      this.setState({ isLoading: false })
    })
  }

  render() {
    const { data, isLoading } = this.state
    return (
      <TreeSelect
        onClick={this._onClick}
        values={data}
        notFoundContent={isLoading ? Helpers.spinner() : Helpers.emptyText()}
        placeholder={t('field.all')}
        dropdownMatchSelectWidth={false}
        getPopupContainer={Helpers.getPopupContainer}
        searchPlaceholder="Поиск..."
        filterTreeNode={(input, option) => option.props.title.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        {...this.props}
      />
    )
  }

}

// offer request access button
class _OfferAccessButton extends Component {

  constructor(props) {
    super(props)
    this.state = {
      isVisible: false,
      isSended: false,
      iconLoading: false,
    }
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { form, id } = this.props
    form.validateFieldsAndScroll((err, values) => {
      this.setState({ iconLoading: true })
      const params = {
        ...clean(values),
        offer_id: id
      }
      api.post(`/v1/user-offer-access-requests`, qs.stringify(params))
      .then(response => {
        this.setState({
          iconLoading: false,
          isSended: true,
          isVisible: false,
        })
        message.success(`Ваш запрос принят и будет обработан в ближайшее время!`)
      })
      .catch(e => {
        this.setState({ iconLoading: false })
        Helpers.errorHandler(e)
      })
    })
  }

  validator = (name, label, input) => {
    const { getFieldDecorator } = this.props.form
    const options = { }
    return (
      <Form.Item className={`form__field-${name}`}>
        <h4>{label}</h4>
        {getFieldDecorator(name, options)(input)}
      </Form.Item>
    )
  }

  _toggle = () => this.setState({ isVisible: !this.state.isVisible })

  render() {
    const { id, have_access, access_request } = this.props
    const { isVisible, isSended, iconLoading } = this.state
    if(have_access) return (<Link to={`/tools/streams?q[offer_id][in]=${id}`} className="btu__button btu__button-small btu__button-orange">Получить ссылку</Link>)
    if(access_request || isSended) return (<Button disabled={true} size="small">Доступ запрошен</Button>)

    return (
      <div>
        <Button type="blue" onClick={this._toggle}>Запросить доступ</Button>
        <Modal
          visible={isVisible}
          footer={null}
          onCancel={this._toggle}>
          <h1>Запрос доступа</h1>
          <p>Для прохождения модерации, расскажите пожалуйста об источниках трафика, с которыми Вы работаете и Вашем опыте в этом направлении.</p>
          <Form onSubmit={this.handleSubmit}>
            {this.validator('message', '', <Input.TextArea size="large" />)}
            <Form.Item className="form__item-last">
              <Button type="primary" htmlType="submit" size="large" loading={iconLoading}>{t('button.send')}</Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )

  }
}
export const OfferAccessButton = Form.create()(_OfferAccessButton)
*/
