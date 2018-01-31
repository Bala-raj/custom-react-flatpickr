import React from 'react';

import DataPicker from '../src/index';
import './style.css';

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

                <div>
                    <label> Date Range Picker </label>
                    <DataPicker options={{ mode: "range", inline: true, maxDate: Date.now(), onChange: this.onChange, defaultValue: this.state.dateRange }} >
                        <input type="text" value={this.state.dateStr} style={{ height: '25px' }} />
                    </DataPicker>
                </div>
                <div>
                    <label> Date Picker </label>
                    <DataPicker options={{ dateFormat: "Y-m-d H:i", maxDate: Date.now(), onChange: this.onChange }} >
                        <input type="text" value="" style={{ height: '25px' }} />
                    </DataPicker>
                </div>
                <div>
                    <label> Date and Time Picker </label>
                    <DataPicker options={{ enableTime: true, maxDate: Date.now() }} >
                        <input type="text" value="" style={{ height: '25px' }} />
                    </DataPicker>
                </div></div>
        )
    }
}

export default Example;