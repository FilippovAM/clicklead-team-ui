import React, { Component } from 'react'
import { Icon, Spin, message, Modal, Form, Button } from 'antd'
import qs from 'qs'
import moment from 'moment'

const getCurrentLanguage = () => window.store.getState().config.language.current

export default {
  set: (key, data) => {
    const currentLanguage = getCurrentLanguage()
    console.log('Cache.set:', `cache.${currentLanguage}.${key}`)
    localStorage.setItem(`cache.${currentLanguage}.${key}`, JSON.stringify(data))
  },
  get: (key) => {
    const currentLanguage = getCurrentLanguage()
    const data = localStorage.getItem(`cache.${currentLanguage}.${key}`)
    return data ? JSON.parse(data) : null
  }
}
