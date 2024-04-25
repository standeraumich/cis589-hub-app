import React from 'react'
import './Popup.css'
import Graph from './Graphs.js'

function Popup(props) {

    return (props.trigger) ? (
        <div className='popup'>
            <div className="popup-inner">
                <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
                <Graph title={props.title} sensor={props.sensor} />
            </div>
        </div>
    ) : "";
}

export default Popup