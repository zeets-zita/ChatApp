import React, { Component } from 'react';
import styled from 'styled-components'

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import Avatar from '@material-ui/core/Avatar';
import Fab from '@material-ui/core/Fab';
import SendIcon from '@material-ui/icons/Send';
import { List, ListItem, ListItemAvatar, ListItemText, Typography} from '@material-ui/core';

import Overlay from '../common/overlay'

const borderRadius = '20px'

const ChatWindow = styled.div`
    background-color: rgb(255, 255, 255, 0.1);
    background-image: url(${props => props.bgImage});
    border-radius: ${borderRadius};
    background-size: cover;
    background-position: center;
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    width: 520px;
    box-sizing: border-box;
`

const ChatPanel = styled.div`
    position: relative;
    display: inline-flex;
    flex-direction: column;
    justify-content: flex-end;
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    z-index: 1;
`

const InputPanel = styled.div`
    display: flex;
    align-items: center;
    align-self: center;
    padding: 20px;
    border-top: 1px solid #fafafa;

    .message-input {
        color: white;
    }
`

const Scrollable = styled.div`
    height: 100%;
    overflow: auto;
`
const OutputText = styled.div`
    box-sizing: border-box;
    white-space: normal !important;
    word-break: break-all !important;
    overflow: initial !important;
    width: 100%;
    height: auto !important;
    color: #fafafa !important;
    /*margin-top: 5px;*/
`

const EventText = styled(OutputText)`
    /*margin-top: 0px;*/
    color: silver !important;
    font-size: 12px;
`

const OverlayRound = styled(Overlay)`
    border-radius: ${borderRadius};
`

const EventTextPadded = styled(EventText)`
    padding-left: 58px;
`

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 0 20px;
    z-index: 1;
    color: #fafafa !important;
    border-bottom: 1px solid;
`

const Title = styled.p`
    text-align: center;
    font-size: 24px;
`

var isTypingTimeout = undefined;

class Chatroom extends Component {
    constructor(props){
        super(props);

        this.panel = React.createRef();
        const { chatHistory } = props;

        this.state = {
            input: '',
            chatHistory,
            typingUsers: [],
            someoneIsTypying: false,
            isTyping: false,
        }

        this.onSendMessage = this.onSendMessage.bind(this);
        this.updateChatHistory = this.updateChatHistory.bind(this);
        this.onMessageReceived = this.onMessageReceived.bind(this);
        this.onSomeoneIsTypingReceived = this.onSomeoneIsTypingReceived.bind(this);
        this.onIsTyping = this.onIsTyping.bind(this);
    }

    componentDidMount(){
        this.props.registerHandler(this.onMessageReceived, this.onSomeoneIsTypingReceived)
        this.scrollToChatBottom();
    }
    componentDidUpdate(){
        this.scrollToChatBottom();
    }
    componentWillUnmount(){
        this.props.unregisterHandler()
    }

    onLeave = () => {
        clearTimeout(isTypingTimeout);
        this.setIsNotTyping()
        this.props.onLeave()
    }

    onInputChange = (e) => {
        this.onIsTyping()
        this.setState({
            input: e.target.value,
        });
    }

    setIsNotTyping = (chatroomName) => {
        this.setState({isTyping: false})
        this.props.onIsTyping(chatroomName, false)
    }

    onIsTyping() {
        const {onIsTyping} = this.props;
        const interval = 1000;
        const chatroomName = this.props.chatroom.name

        if(!this.state.isTyping){
            this.setState({isTyping: true})
            isTypingTimeout = setTimeout(() => this.setIsNotTyping(chatroomName), interval)
            onIsTyping(chatroomName, true)
        }
        else {
            clearTimeout(isTypingTimeout)
            isTypingTimeout = setTimeout(() => this.setIsNotTyping(chatroomName), interval)
        }
    }

    onSendMessage() {

        if (!this.state.input)
            return
        const serverGotMessageCallback = (err) => {
            if (err)
                return console.error(err);
            return this.setState({
                input: ''
            })
        }
        this.props.onSendMessage(this.state.input, serverGotMessageCallback)
    }

    onMessageReceived(messageEntry) {
        this.updateChatHistory(messageEntry);
    }

    onSomeoneIsTypingReceived(typingUsers) {
        this.setState({
            typingUsers
        })
    }

    updateChatHistory(messageEntry) {
        this.setState({
            chatHistory: this.state.chatHistory.concat(messageEntry)
        });
    }

    scrollToChatBottom() {
        this.panel.current.scrollTo(0, this.panel.current.scrollHeight)
    }

    showMessageEvent(chatEvent){
        return (
            <React.Fragment>
                <ListItemAvatar>
                    <Avatar alt="Username image" src={chatEvent.user.image} />
                </ListItemAvatar>
                <ListItemText
                    disableTypography
                    primary={<EventText>{chatEvent.user.name} {chatEvent.event}</EventText>}
                    secondary={<OutputText>{chatEvent.message}</OutputText>}
                />
            </React.Fragment>
        )
    }

    showChatroomEvent(chatEvent){
        return (
            <ListItemText
                disableTypography
                secondary={<EventTextPadded>{chatEvent.user.name} {chatEvent.event}</EventTextPadded>}
            />
        )
    }

    showEvent(chatEvent){
        return chatEvent.event ? this.showChatroomEvent(chatEvent) : this.showMessageEvent(chatEvent)
    }

    showIsTyping() {
        let typingUsers = this.state.typingUsers.slice();
        if(typingUsers.length > 0){
            let typingUsersString = typingUsers.length < 4
                ? this.state.typingUsers.map(user => user.name).join(", ")
                : 'more than three'
            return (
                <Typography style={{fontSize: '14px', color: 'white'}} align='center' variant='overline' >
                    {typingUsersString} is typing...
                </Typography>
            );
        }
        else
            return 
    }

    showAllMessages(chatHistory){
        return(
            <List>
                {chatHistory.map(chatEvent => (
                    <ListItem alignItems="flex-start" key={chatEvent.id} >
                        {this.showEvent(chatEvent)}
                    </ListItem>
                ))}
            </List>
        );
    }

    render() {
        return(
                <ChatWindow bgImage={this.props.chatroom.image}>
                    <Header>
                        <Title>
                            {this.props.chatroom.name}
                        </Title>
                        <Button variant="contained" color="secondary" onClick={this.onLeave} >
                            Close
                        </Button>
                    </Header>
                    <ChatPanel>
                        <Scrollable ref={this.panel}>
                            {this.showAllMessages(this.state.chatHistory)}
                        </Scrollable>
                        {this.showIsTyping()}
                        <InputPanel>
                        <Input
                            className='message-input'
                            color='secondary'
                            id="message-input"
                            placeholder="Enter a message..."
                            onChange={this.onInputChange}
                            value={this.state.input}
                            onKeyPress={e => (e.key === 'Enter' ? this.onSendMessage() : null)}
                            autoComplete='off'
                            inputProps={{
                            'aria-label': 'Description',
                            }}
                        />
                        <Fab component="button" variant="extended" aria-label="Delete" onClick={this.onSendMessage}>
                            <SendIcon />
                            Send
                        </Fab>
                        </InputPanel>
                    </ChatPanel>
                    <OverlayRound opacity='0.5' background='black'/>
                </ChatWindow>
        );
    }
}

export default Chatroom;