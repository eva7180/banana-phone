import React from 'react'
import Chatkit from '@pusher/chatkit-client'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import RoomList from './components/RoomList'
import NewRoomForm from './components/NewRoomForm'

import { tokenUrl, instanceLocator } from './config'

class App extends React.Component {

    constructor() {
        super()
        this.state = {
            messages: [],
            joinableRooms: [],
            joinedRooms: []
        }
        this.sendMessage = this.sendMessage.bind(this)
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: instanceLocator,
            userId: 'evaaa',
            tokenProvider: new Chatkit.TokenProvider({
                url: tokenUrl
            })
        });

        chatManager.connect()
            .then(currentUser => {
                this.currentUser = currentUser

                this.currentUser.getJoinableRooms()
                    .then(rooms => {
                        this.setState({
                            joinableRooms: rooms,
                            joinedRooms: this.currentUser.rooms
                        })
                    })
                    .catch(err => {
                      console.log(`Error getting joinable rooms: ${err}`)
                    })

                this.currentUser.subscribeToRoom({
                    roomId: '19383238',
                    hooks: {
                        onMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message]
                            })
                        }
                    }
                })
            })
            .catch(error => {
              console.error("error:", error);
            });
    }

    sendMessage(text) {
        this.currentUser.sendMessage({
            text: text,
            roomId: '19383238' 
        })
    }

    render() {
        return (
            <div className="app">
                <RoomList rooms={[...this.state.joinableRooms, ...this.state.joinedRooms]} />
                <MessageList messages={this.state.messages}/>
                <SendMessageForm sendMessage={this.sendMessage} />
                <NewRoomForm />
            </div>
        );
    }
}

export default App