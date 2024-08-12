import { Component } from 'react';
import './Pong.css';

class Paddle extends Component {
    render() {
        const { position, side } = this.props;
        const style = {
            [side]: 0,
            top: `${position}%`,
        };

        return <div className='paddle' style={style}></div>;
    }
}

export default Paddle;
