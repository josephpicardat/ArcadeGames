import { Component } from 'react';
import './Pong.css';

class Ball extends Component {
    render() {
        const { x, y } = this.props.position;
        const ballStyle = {
            left: `${x}%`,
            top: `${y}%`,
        };

        return <div className='ball' style={ballStyle}></div>;
    }
}

export default Ball;
