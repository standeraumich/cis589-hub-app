import React from 'react'
import './Popup.css'
import BirdTable from './BirdTable.js'


function Popup(props) {

    return (props.trigger) ? (
        <div className='popup'>
            <div className="popup-inner">
                <button className='close-btn' onClick={() => props.setTrigger(false)}>close</button>
                <BirdTable />
            </div>
        </div>
    ) : "";
}

export default Popup