
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'flatpickr';
import moment from 'moment';

//import 'flatpickr/dist/themes/material_green.css';
import './style.scss';

const hooks = [
  'onChange',
  'onOpen',
  'onClose',
  'onMonthChange',
  'onYearChange',
  'onReady',
  'onValueUpdate',
  'onDayCreate'
]

const defaultFormat = 'm/d/Y';

const DefaultRanges = {
  'Today': [moment().valueOf(), moment().valueOf()],
  'Yesterday': [moment().subtract(1, 'days').valueOf(), moment().subtract(1, 'days').valueOf()],
  'Last 7 Days': [moment().subtract(6, 'days').valueOf(), moment().valueOf()],
  'Last 30 Days': [moment().subtract(29, 'days').valueOf(), moment().valueOf()],
  'Last Week': [moment().subtract(1, 'week').startOf('week').valueOf(), moment().subtract(1, 'week').endOf('week').valueOf()],
  'Last Month': [moment().subtract(1, 'month').startOf('month').valueOf(), moment().subtract(1, 'month').endOf('month').valueOf()],
  'This Month': [moment().startOf('month').valueOf(), moment().valueOf()],
}

function compareDefaultRanges(selectedRanges, rangesList) {
  let match = '';
  for(let range in rangesList) {    
    if(selectedRanges.toString() === rangesList[range].toString()){
      match = range;
    }
  }
  return match;
}

class DateTimePicker extends Component {
  static propTypes = {
    defaultValue: PropTypes.string,
    options: PropTypes.object,
    onChange: PropTypes.func,
    onOpen: PropTypes.func,
    onClose: PropTypes.func,
    onMonthChange: PropTypes.func,
    onYearChange: PropTypes.func,
    onReady: PropTypes.func,
    onValueUpdate: PropTypes.func,
    onDayCreate: PropTypes.func,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.array,
      PropTypes.object,
      PropTypes.number
    ]),
    children: PropTypes.node
  }

  static defaultProps = {
    options: {}
  }

  constructor() {
    super();

    this.state = {
      showCalendar: false,
      showPicker: false,
    }
  }

  componentWillReceiveProps(props) {
    const { options } = props
    const prevOptions = this.props.options

    // Add prop hooks to options
    hooks.forEach(hook => {
      if (props.hasOwnProperty(hook)) {
        options[hook] = props[hook]
      }
      // Add prev ones too so we can compare against them later
      if (this.props.hasOwnProperty(hook)) {
        prevOptions[hook] = this.props[hook]
      }
    })

    const optionsKeys = Object.getOwnPropertyNames(options)

    for (let index = optionsKeys.length - 1; index >= 0; index--) {
      const key = optionsKeys[index]
      let value = options[key]

      if (value !== prevOptions[key]) {
        // Hook handlers must be set as an array
        if (hooks.indexOf(key) !== -1 && !Array.isArray(value)) {
          value = [value]
        }

        this.flatpickr.set(key, value)
      }
    }

    if (props.hasOwnProperty('value') && props.value !== this.props.value) {
      this.flatpickr.setDate(props.value, false)
    }

    if (props.options.defaultValue && props.options.defaultValue !== this.props.options.defaultValue) {
      this.flatpickr.setDate(props.options.defaultValue, false)
    }
  }

  componentDidMount() {
    const options = {
      onClose: () => {
        this.node.blur && this.node.blur();
        this.setState({ showCalendar: false, showPicker: false });
      },
      ...this.props.options,
      onChange: this.onChange,
    }

    // Add prop hooks to options
    hooks.forEach(hook => {
      if (this.props[hook]) {
        options[hook] = this.props[hook]
      }
    })

    this.flatpickr = new Flatpickr(this.node, options)

    if (this.props.hasOwnProperty('value')) {
      this.flatpickr.setDate(this.props.value, false)
    }
  }
  

  componentWillUnmount() {
    this.flatpickr.destroy()
  }

  onChange = (selectedDates, dateStr, instance) => {
    if (this.props.options.onChange) {
      this.props.options.onChange(selectedDates, dateStr, instance);
    }
  }

  onClickOfDateRanges = (e) => {
    if (this.props.options.onChange){
      const ranges = e.target.dataset.rangeValue.split(',').map(v => Number(v));
      this.props.options.onChange(
        ranges,
        `${this.flatpickr.formatDate(new Date(ranges[0]), ( this.props.options.dateFormat ||defaultFormat))} to ${this.flatpickr.formatDate(new Date(ranges[1]), ( this.props.options.dateFormat ||defaultFormat))}`,
        this.flatpickr,
      );
    }    
    this.setState({ showCalendar: false, showPicker: false });
  }

  onClickOfCustom = () => {
    this.setState({ showCalendar: true });
  }

  onClickOfChildren = () => {
    this.setState({ showPicker: !this.state.showPicker });
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { options, defaultValue, value, children, ...props } = this.props

    // Don't pass hooks to dom node
    hooks.forEach(hook => {
      delete props[hook]
    })

    if (options.mode && options.mode === 'range') {
      const ranges = options.ranges || DefaultRanges;
      const active = compareDefaultRanges(options.defaultValue, ranges );
      const custom = options.defaultValue && !active;
      return (
        <Fragment>
          <div onClick={this.onClickOfChildren}> {children} </div>
          <div className={`daterangepicker dropdown-menu opensright ltr ${this.state.showCalendar || custom ? 'show-calendar' : ''} ${this.state.showPicker ? '' : 'hide'}`}>
            <div className="ranges">
              <ul>               
                {
                  ranges && [
                    Object.keys(ranges).map((key) => <li key={key} data-range-key={key} data-range-value={DefaultRanges[key]} onClick={this.onClickOfDateRanges} className={active === key ? 'active': ''}> {key} </li>),
                    <li key={'custom'} data-range-key={'custom'} onClick={this.onClickOfCustom} className={ custom ? 'active': ''  }>Custom </li>
                  ]
                }
              </ul>
            </div>
            <div className="hasrange">
              <div className="daterangepicker_input" {...props} ref={node => { this.node = node }}>
                <input className="input-mini" defaultValue={options.defaultValue} />
              </div>
            </div>
          </div>
        </Fragment>
      );
    }

    if (options.wrap) {
      return (
        <div {...props} ref={node => { this.node = node }}>
          {children}
        </div>
      );
    }

    // return (<div className="calendar opensright hastime"> <div className="daterangepicker_input" {...props} ref={node => { this.node = node }} >{children}</div></div>);   
    return (<input {...props} ref={node => { this.node = node }} defaultValue={defaultValue} />);
  }
}

export default DateTimePicker