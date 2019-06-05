import qs from 'qs'
import moment from 'moment'

const Filters = {

  parse: () => {
    const tmp = qs.parse(window.location.search.substr(1), {
      plainObjects: true,
      depth: -2,
      ignoreQueryPrefix: true,
      allowDots: true,
      parseArrays: false
    })

    if (tmp['q']) {
      const keys = Object.keys(tmp['q'])
      Object.keys(tmp['q']).forEach(key => {
        tmp[`q${key}`] = tmp['q'][key]
      })
      delete tmp['q']
    }

    return tmp
  },

  prepare: (values, custom = {}) => {
    const skip = ['group']
    const filters = {}
    const keys = Object.keys(values)
    if (!keys.length) return filters
    keys.forEach(key => {
      const val = values[key]
      const isArray = Array.isArray(val)
      if (!val || skip.includes(key) || isArray && !val.length) return
      if (isArray) {
        if (['created_at', 'date'].includes(key)) {
          /* const start = val[0] && val[0].startOf('day').unix()
          const end = val[1] && val[1].endOf('day').unix()
          if(start && end) filters[`q[${key}][between]`] = `${start},${end}` */
          filters[`q[${key}][between]`] = val.join(',')
        } else {
          filters[`q[${key}][in]`] = val.join(',')
        }
      } else {
        switch (key) {
          case (custom && Object.keys(custom).includes(key) && key):
            let value = val
            const type = custom[key]
            if (isArray && ['in', 'not_in', 'between', 'not_between', 'or'].includes(type)) value = val.join(',')
            filters[`q[${key}][${type}]`] = value
            break
          case 'name':
          case 'url':
            filters[`q[${key}][like]`] = val
            break
          default:
            filters[`q[${key}][equal]`] = val
        }
      }
    })
    return filters
  },

  value: (name, initialFilter = {}) => {
    const _params = Filters.parse()
    const params = Object.keys(_params).length && _params || initialFilter
    if (name == 'group') return params[name]
    let key, value, type
    const tmp = Object.keys(params)
    tmp.forEach(tmp_k => {
      key = tmp_k.includes(`q[${name}]`) && tmp_k
      if (!key) return
      value = params[key]
      type = key.split(`q[${name}]`)[1]
      if (type) {
        type = type.replace('[', '').replace(']', '')
        if (['in', 'not_in', 'between', 'not_between', 'or'].includes(type)) value = value.split(',')
        /* if(['created_at', 'date'].includes(name)) {
          if(type == 'between') {
            //const start = value[0] && moment.unix(value[0]).utcOffset(Helpers.time_offset())
            //const end = value[1] && moment.unix(value[1]).utcOffset(Helpers.time_offset())
            //if(start && end) value = [start, end]
            console.log(value);
          } else if(type == 'equal') {
            value = moment.unix(value)
          }
        } */
      }
    })
    // console.log(value);
    return value
  },

  toUrl: (filters) => {
    let tmp = qs.stringify(filters, { encode: false })
    /* if(!tmp && window.location.search || tmp) {
      if(window.location.search.substring(1) === tmp) return
      window.history.pushState('', '', (tmp && `?${tmp}` || window.location.pathname))
    } */
    window.history.pushState('', '', (tmp && `?${tmp}` || window.location.pathname))
  }

}

export default Filters
