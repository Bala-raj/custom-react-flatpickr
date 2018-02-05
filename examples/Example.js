import React from 'react';

import DataPicker from '../src/index';
import './style.scss';

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            dateRange: '',
            dateStr: ''
        }
        this.onChange = this.onChange.bind(this);
    }

    onChange(selectedDates, dateStr, instance) {
        if (selectedDates.length > 1)
            this.setState({ dateRange: selectedDates, dateStr });
        window.instance = instance;
    }

    render() {
        return (
            <div style={{}}>

                <div className="datepicker range">
                    <label className="title"> Date Range Picker </label>
                    <p className="description">You can config Range Picker in calendar.</p>
                    <div className="highlight">
                        <pre>&#123;`

                        
                                        enableTime<span>:</span> <span>true</span>,
                        `&#125;
                        </pre>
                    </div>
                    <DataPicker options={{ mode: "range", inline: true, maxDate: Date.now(), onChange: this.onChange, defaultValue: this.state.dateRange }} >
                        <input type="text" value={this.state.dateStr} />
                    </DataPicker>
                </div>
                <div className="datepicker">
                    <label className="title"> Date Picker </label>
                    <DataPicker options={{ dateFormat: "Y-m-d H:i", maxDate: Date.now(), onChange: this.onChange }} >
                        <input type="text" value="" />
                    </DataPicker>
                </div>
                <div className="datepicker time">
                    <label className="title"> Date and Time Picker </label>
                    <DataPicker options={{ enableTime: true, maxDate: Date.now() }} >
                        <input type="text" value="" />
                    </DataPicker>
                </div></div>
        )
    }
}

export default Example;