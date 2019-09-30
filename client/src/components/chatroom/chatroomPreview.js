import React from 'react';
import styled from 'styled-components';

import Card from '@material-ui/core/Card';
import { CardMedia, CardContent, CardActionArea } from '@material-ui/core';
import Typography from '@material-ui/core/Typography';

const ChatroomWrapper = styled.section`
    float: right;
    background-color: #123EDF;
    width: 70%;
    min-width: 250px;
    margin-bottom: 20px;
`

function ChatroomPreview(props) {
    const {chatroom, onEnter} = props;

    return (
        <ChatroomWrapper padding>
            <Card onClick={(e) => onEnter(chatroom, e)}>
                <CardActionArea>
                    <CardMedia
                        component="img"
                        image={chatroom.image}
                        />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {chatroom.name}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </ChatroomWrapper>
    )
}

export default ChatroomPreview;