import React, { Component, } from 'react';



class clock extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time: new Date(),
            clockOn: setInterval(
                () => this.tick(),
                1000
            )
        };
    }


    componentDidMount() {

    }
    componentWillUnmount() {
        clearInterval(this.state.clockOn)
    }


    tick() {
        this.setState({
            time: new Date()
        });
    }
    render() {
        return (
            <div>
                <h2>{this.state.time.toLocaleTimeString()}</h2>
            </div>
        );
    }
}


export default clock;