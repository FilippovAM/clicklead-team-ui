import React, {Component} from 'react'
import moment from 'moment'
import Icons from '../Icons'

import 'react-dates/initialize'
import ReactDates from 'react-dates'

const DateRangePicker = ReactDates.DateRangePicker

class RangePicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      focusedInput: null,
      id: this.props.id,
      startDate: null,
      endDate: null
    }
  }

  componentDidMount = () => {
    const {value} = this.props
    if (value && Array.isArray(value) && value.length) {
      this.setState({
        startDate: moment.unix(value[0]).startOf('day'),
        endDate: moment.unix(value[1]).endOf('day')
      })
    }
  }

  onChange = ({startDate, endDate}) => {
    this.setState({startDate, endDate})
  }

  onClose = ({startDate, endDate}) => {
    console.log('values', this.props.value)
    console.log('current', startDate, endDate)

    //
    const prevStartDate = this.props.value ? this.props.value[0] : null
    let _startDate = startDate ? startDate.unix() : null
    const prevEndDate = this.props.value ? this.props.value[1] : null
    let _endDate = endDate ? endDate.unix() : null

    //
    if (!_startDate && _endDate || _startDate && !_endDate) {
      this.setState({startDate: null, endDate: null})
      _startDate = null
      _endDate = null
    }

    if (prevStartDate !== _startDate && prevEndDate !== _endDate) {
      console.log('даты изменились, onSubmit()')
      this.props.onChange([_startDate, _endDate])
    }
  }

  onClearDates = (test) => {
    console.log('onClearDates', test)
  }

  render() {
    const {id, startDate, endDate} = this.state
    const showClearDates = this.props.showClearDates || true
    return (
      <DateRangePicker
        {...this.props}

        startDate={startDate}
        startDateId={`picker_start_${id}`}
        startDatePlaceholderText='От'

        endDate={endDate}
        endDateId={`picker_end_${id}`}
        endDatePlaceholderText='До'

        displayFormat='DD.MM.YY'
        // isOutsideRange={() => false}

        onClose={this.onClose}
        onDatesChange={this.onChange}
        focusedInput={this.state.focusedInput}

        onClearDates={this.onClearDates}

        onFocusChange={focusedInput => this.setState({focusedInput})}
        hideKeyboardShortcutsPanel
        customArrowIcon={<div>&#8212;</div>}
        showClearDates={showClearDates}
        firstDayOfWeek={1}
        transitionDuration={0}
        minimumNights={0}
        noBorder
        daySize={32}
        navPrev={Icons.ArrowLeft}
        navNext={Icons.ArrowRight}
        customCloseIcon={Icons.delete2}
      />
    )
  }
}

export default RangePicker
