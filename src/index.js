
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Flatpickr from 'flatpickr';
import moment from 'moment';

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
const momentObject = moment();

const DefaultRanges = {
  'Today': [moment().valueOf(), moment().valueOf()],
  'Yesterday': [moment().subtract(1, 'days').valueOf(), moment().subtract(1, 'days').valueOf()],
  'Last 7 Days': [moment().subtract(6, 'days').valueOf(), moment().valueOf()],
  'Last 30 Days': [moment().subtract(29, 'days').valueOf(), moment().valueOf()],
  'Last Week': [moment().subtract(1, 'week').startOf('week').valueOf(), moment().subtract(1, 'week').endOf('week').valueOf()],
  'Last Month': [moment().subtract(1, 'month').startOf('month').valueOf(), moment().subtract(1, 'month').endOf('month').valueOf()],
  'This Month': [moment().startOf('month').valueOf(), moment().valueOf()],
}
const Months = {
  'Jan': [momentObject.utc().startOf('year').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Feb': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').endOf('day').valueOf()],
  'Mar': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Apr': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'May': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Jun': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Jul': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Aug': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Sep': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Oct': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Nov': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
  'Dec': [momentObject.utc().add(1,'month').startOf('month').valueOf(), momentObject.utc().endOf('month').endOf('day').valueOf()],
}

function compareDefaultRanges(selectedRanges, rangesList) {
  let match = '';
  for (let range in rangesList) {
    if (selectedRanges.toString() === rangesList[range].toString()) {
      match = range;
    }
  }
  return match;
}

/**
 * Polyfill for parents method
 * @param {*} selector
 */
function parents(selector) {
  const elements = [];
  let elem = this;
  const ishaveselector = selector !== undefined;

  while ((elem = elem.parentElement) !== null) { //eslint-disable-line
    if (elem.nodeType !== Node.ELEMENT_NODE) {
      continue; //eslint-disable-line
    }

    if (!ishaveselector || elem.matches(selector)) {
      elements.push(elem);
    }
  }

  return elements;
}

Element.prototype.parents = parents;


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
      dateStr: ''
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

    if (options.mode && options.mode === 'range') {
      options.inline = true;
    }

    this.flatpickr = new Flatpickr(this.node, options)

    if (this.props.hasOwnProperty('value')) {
      this.flatpickr.setDate(this.props.value, false)
    }

    if (document.addEventListener) {
      document.body.addEventListener('click', this.onClickOfDOM);
    } else if (document.attachEvent) {
      document.body.attachEvent('click', this.onClickOfDOM);
    }
  }


  componentWillUnmount() {
    this.flatpickr.destroy()

    if (document.removeEventListener) {
      document.body.removeEventListener('click', this.onClickOfDOM);
    } else if (document.detachEvent) {
      document.body.detachEvent('click', this.onClickOfDOM);
    }
  }

  onChange = (selectedDates, dateStr, instance) => {
    if (this.props.options.onChange) {
      if (!(this.props.options.mode === 'range' && (selectedDates.length === 1 || !selectedDates.length)))
        this.props.options.onChange(selectedDates, dateStr, instance);
      this.setState({ dateStr });
    }
  }

  onClickOfDateRanges = (e) => {
    const ranges = e.target.dataset.rangeValue.split(',').map(v => Number(v));
    const dateStr = `${this.flatpickr.formatDate(new Date(ranges[0]), (this.props.options.dateFormat || defaultFormat))} to ${this.flatpickr.formatDate(new Date(ranges[1]), (this.props.options.dateFormat || defaultFormat))}`;
    if (this.props.options.onChange) {
      this.props.options.onChange(
        ranges,
        dateStr,
        this.flatpickr,
      );
    }
    this.setState({ showCalendar: false, showPicker: false, showBillingCycle: false, dateStr });
  }
  onClickOfMonth = (e) => {
    const ranges = e.target.dataset.rangeValue.split(',').map(v => Number(v));
    const dateStr = moment(ranges[0]).format('MMM');
    if (this.props.options.onChange) {
      this.props.options.onChange(
        ranges,
        dateStr,
        this.flatpickr,
      );
    }
    this.setState({ showCalendar: false, showPicker: false, dateStr });
  }

  onClickOfCustom = () => {
    this.setState({ showCalendar: true, showBillingCycle: false });
  }

  onClickOfBillingCyclle = () => {
    this.setState({ showBillingCycle: true, showCalendar: false });
  }
  onClickOfChildren = () => {
    this.setState({ showPicker: !this.state.showPicker });
  }

  onClickOfDOM = (e) => {
    if (!e.target.parents('.daterangepicker').length && this.state.showPicker) {
      this.setState({ showPicker: false });
    }
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
      const active = (value && compareDefaultRanges(value, ranges)) ||  (options.defaultValue && compareDefaultRanges(options.defaultValue, ranges)) || '';
      const monthActive = (value && compareDefaultRanges(value, Months)) ||  (options.defaultValue && compareDefaultRanges(options.defaultValue, monthActive)) || '';
      const custom = options.defaultValue && !active;
      return (
        <Fragment>
          <div onClick={this.onClickOfChildren}> {children} </div>
          <div className={`daterangepicker dropdown-menu opensright ltr ${this.state.showCalendar || custom ? 'show-calendar' : ''} ${this.state.showBillingCycle ? 'show-month' : ''} ${this.state.showPicker ? '' : 'hide'}`}>
            <div className="ranges">
              <ul>
                {
                  ranges && [
                    Object.keys(ranges).map((key) => <li key={key} data-range-key={key} data-range-value={ranges[key]} onClick={this.onClickOfDateRanges} className={active === key ? 'active' : ''}> {key} </li>),
                    <li key={'custom'} data-range-key={'custom'} onClick={this.onClickOfCustom} className={`${custom ? 'active' : ''} ${this.state.showCalendar ? 'is-focused' : ''}`}>Custom </li>,
                    <li key={'billingcycle'} data-range-key={'billingcycle'} onClick={this.onClickOfBillingCyclle} className={`${this.state.showBillingCycle ? 'is-focused' : ''}`}>Invoices</li>
                  ]
                }
              </ul>
            </div>
            <div className="hasrange">
              <div className="daterangepicker_input" {...props} ref={node => { this.node = node }}>
                <input className="input-mini" value={options.defaultValue || this.state.dateStr} readOnly={true} />
              </div>
              
            <div className="calender-monthview">
                <ul>
                {
                  Months && [
                    Object.keys(Months).map((key) => <li key={key} data-range-key={key} data-range-value={Months[key]} onClick={this.onClickOfMonth} className={`${monthActive === key && 'active'} ${(moment(Months[key][0]).valueOf() < moment().subtract(3, 'month').startOf('month').valueOf() || moment(Months[key][0]).valueOf() > moment().endOf('month').valueOf()) && 'disabled'}` }> {key} </li>),
                    
                  ]
                }
                </ul>
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