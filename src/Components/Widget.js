import React from 'react'
import './Widget.css'

function Widget(props) {
    return (
        <div className='hub-container' onClick={props.onClick}>
            <div className='hub-display-container'>
                <div className={`hub-display ${props.color}`}>{props.sensorData}{props.symbol}</div>
            </div>
            <div className='title-container'>{props.title}</div>
        </div>
    );
}

export default Widget