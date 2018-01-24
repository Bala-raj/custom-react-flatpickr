import React from 'react';

// import 'flatpickr/dist/themes/material_green.min.css'
import DataPicker from '../src/index';

class Example extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            address: '',
            value: ''
        }
        
        this.onClick = this.onClick.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onClick() {
        this.setState({address: this.state.value });
    }

    onChange(e) {
        this.setState({value: e.target.value });
    }

    render() {
        return (
            <div style={{  }}>                               
                <DataPicker options={{ mode:"range", inline: true  }} > 
                    <input type="text" value="" style={{height: '25px'}} />
                </DataPicker>
            </div>
        )
    }
}

export default Example;