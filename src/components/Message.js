import React from 'react'

const Message = (props) => {
        return (
            <div className="message">
            	<div className="message-username"> {props.username} </div>
                <div className="message-text"> {props.text} </div>
            </div>
        )
}

export default Message