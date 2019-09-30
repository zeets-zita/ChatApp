import React from 'react';
import styled from 'styled-components';
import Fullscreen from './common/fullscreen';
import Overlay from './common/overlay';

import Avatar from '@material-ui/core/Avatar';
import FaceIcon from 'material-ui/svg-icons/action/face';

import BackgroundImg from '../static/background.jpg'

const ContentWrapper = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 1;
`
const Center = styled.div`
  position: relative;
  max-width: 1000px;
  margin: auto;
  padding: 40px 0;
  height: 100%;
  box-sizing: border-box;
`
const Content = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 20px;
  height: 100%;
`
const Relative = styled.div`
  position: relative;
`

const Sticky = styled.div`
  position: fixed;
  width: 20%;
  left: 10%;
`

const AvatarWrapper = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  a {
    text-decoration: none;
  }
  img {
    box-shadow: rgba(255, 255, 255, 0.2) 0 0 10px 2px;
  }
  .avatar {
    height: 100px;
    width: 100px;
  }

  .avatar-icon {
    font-size: 100px;
  }
`
const BackgroundImage = styled.div`
  background: url(${props => props.src}) no-repeat center center fixed;
  background-size: cover;
  height: 100%;
  overflow: hidden;
`
const UserName = styled.p`
  font-size: 24px;
  height: 27px;
  text-align: center;
  color: #fafafa;
`

function fullName(user) {
  return user ? `${user.name}` : 'Who are you?'
}

function renderAvatar(user) {
  const avatarProps = user
    ? {src: user.image }
    : {children: (<FaceIcon className='avatar-icon' />)}
  return <Avatar className='avatar' {...avatarProps}/>
}

function MainLayout(props) {
  return (
    <Fullscreen>
      <ContentWrapper>
        <Center>
          <Content>
            <Relative>
              <Sticky>
                <AvatarWrapper onClick={props.onUserSelectionClick} >
                  {renderAvatar(props.user)}
                  <UserName> { fullName(props.user) } </UserName>
                </AvatarWrapper>
              </Sticky>
            </Relative>
            { props.children }
          </Content>
        </Center>
      </ContentWrapper>
      <Fullscreen>
        <BackgroundImage src={BackgroundImg}></BackgroundImage>
        <Overlay opacity="0.7" background='#0f0f0f'>
        </Overlay>
      </Fullscreen>
    </Fullscreen>
  );
}

export default MainLayout;
