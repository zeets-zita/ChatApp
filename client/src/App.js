import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from './components/home';
import Layout from './components/layout';
import Chatroom from './components/chatroom/chatroom';
import UserSelect from './components/userSelect';

import Spinner from './components/common/spinner';
import socket from './utils/socket';

import './App.css'

class App extends Component {
  constructor(props, context){
    super(props);

    this.state = {
        client: socket(),
        user: null,
        chatrooms: null,
        selectedChatroom: null,
        userSelectionOpen: false,
    }        

    this.registerUser = this.registerUser.bind(this);
    this.handleOnLeaveChatroom = this.handleOnLeaveChatroom.bind(this);
    this.handleSendMessage = this.handleSendMessage.bind(this);
    this.handleUserSelectionClickOpen = this.handleUserSelectionClickOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
    this.onEnterChatroom = this.onEnterChatroom.bind(this);
    this.onLeaveChatroom = this.onLeaveChatroom.bind(this);
    this.getChatrooms = this.getChatrooms.bind(this);
    this.handleIsTyping = this.handleIsTyping.bind(this);
}

componentDidMount() {
    this.getChatrooms()
}

getChatrooms() {
    const getChatroomsCallback = (err, chatrooms) => {
        this.setState({chatrooms})
    }
    this.state.client.getChatRooms(getChatroomsCallback)
}

handleUserSelectionClickOpen(){
    if(this.state.selectedChatroom)
        return
    this.setState({
        userSelectionOpen: true
    }, () => console.log('handledClick. UserSel is open: ', this.state.userSelectionOpen))
}

handleClose() {
    this.setState({userSelectionOpen : false})
}

handleOnEnterChatroom = (chatroom) => {
    const onNoUserSelected = () => {
        this.setState({selectedChatroom: null})
    }
    const onEnterChatroomSuccess = (chatHistory) => {
        this.setState({
            chatHistory,
            selectedChatroom: chatroom
        })
    }

    this.onEnterChatroom(chatroom.name, onNoUserSelected, onEnterChatroomSuccess)
}

onEnterChatroom(chatroomName, onNoUserSelected, onEnterChatroomSuccess) {
    if(!this.state.user)
        return onNoUserSelected()
    const onEnterChatroomSuccessCallback = (err, chatHistory) => {
        if (err)
            return Error(err)
        return onEnterChatroomSuccess(chatHistory)
    }
    
    return this.state.client.join(chatroomName, onEnterChatroomSuccessCallback)
}


handleOnLeaveChatroom() {
    const onLeaveSuccess = () => {
        this.setState({
            selectedChatroom : null
        })
    }
    this.onLeaveChatroom(this.state.selectedChatroom, onLeaveSuccess)        
}

onLeaveChatroom(chatroom, onLeaveSuccess) {
    const onLeaveCallback = (err) => {
        if(err)
            return Error('Could not leave chatroom', err)
        return onLeaveSuccess()
    }
    this.state.client.leave(chatroom.name, onLeaveCallback)
}

handleRegister(user) {
    this.registerUser(user);
}

registerUser(userToRegister) {
    const onRegisterResponse = (user) => this.setState({userSelectionOpen : false, user})
    const onRegisterCallback = (err, user) => {
        if (err) {
            return onRegisterResponse(null)
        }
        else return onRegisterResponse(user)
    }

    this.setState({userSelectionOpen : true})
    this.state.client.register(userToRegister.name, onRegisterCallback)
}

handleSendMessage(message, callback) {
    this.state.client.message(
        this.state.selectedChatroom.name,
        message,
        callback
    );
}

handleIsTyping(chatroomName, isTyping){
    const isTypingCallback = (err) => {
        if(err) {
            console.error('got this error from server when sending user is typing: ', err)
        }
    }
    this.state.client.isTyping(this.state.selectedChatroom.name, isTyping, isTypingCallback)
}

isUserAndChatroomSelected() {
    if(this.state.selectedChatroom && this.state.user) 
        return true;
    else
        return false;
}

showChatroom() {
    return (
        <Chatroom
            chatroom={this.state.selectedChatroom}
            user={this.state.user}
            chatHistory={this.state.chatHistory}
            registerHandler={this.state.client.registerHandler}
            unregisterHandler={this.state.client.unregisterHandler}
            onSendMessage={this.handleSendMessage}
            onIsTyping={this.handleIsTyping}
            onLeave={this.handleOnLeaveChatroom}
        />
    )
}

showHome() {
    return (
        <React.Fragment>
            {!this.state.chatrooms
                ? <Spinner />
                : (
                    <Home
                        chatrooms={this.state.chatrooms}
                        onEnterChatroom={this.handleOnEnterChatroom}
                    />
                )}
        </React.Fragment>
    )
}

showUserSelection() {
    return (
        <React.Fragment>
            {!this.state.userSelectionOpen
                ? <React.Fragment />
                : (
                    <UserSelect
                        onClose={this.handleClose}
                        onSelection={this.handleRegister}
                        open
                        selectedUser={this.state.user}
                        getAvailableUsers={this.state.client.getAvailableUsers}
                    />
                )}
        </React.Fragment>
    )
}

render() {
    return (
        <MuiThemeProvider>
            <Layout user={this.state.user} onUserSelectionClick={this.handleUserSelectionClickOpen}>
                {this.isUserAndChatroomSelected() ? this.showChatroom() : this.showHome() }
                {this.showUserSelection()}
            </Layout>
        </MuiThemeProvider>
    )
  }
}

export default App;
