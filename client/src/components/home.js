import React from 'react';
import ChatroomPreview from './chatroom/chatroomPreview';

export default ({ chatrooms, onEnterChatroom }) => (
    <div>
        {
            chatrooms.map(chatroom => (
                <ChatroomPreview
                key={chatroom.name}
                chatroom={chatroom}
                onEnter={onEnterChatroom}
                />
            ))
        }
    </div>
)