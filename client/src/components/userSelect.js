import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { Dialog, DialogTitle, Avatar, DialogContent} from '@material-ui/core';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import DialogActions from '@material-ui/core/DialogActions';


import Spinner from './common/spinner';


class UserSelect extends Component {
  constructor(props) {
      super(props);

      this.state = {
          availableUsers: null,
      }

      this.renderUserListItems = this.renderUserListItems.bind(this);
      this.handleClose = this.handleClose.bind(this);
      this.handleUserSelection = this.handleUserSelection.bind(this);
      this.isUserSelected = this.isUserSelected.bind(this);
  }

  componentDidMount() {
      const setAvailableUserCallback = (err, availableUsers) => {
          this.setState({availableUsers})
      }
      this.props.getAvailableUsers(setAvailableUserCallback)
  }

  isUserSelected = (user) => {
      if(!user || !this.props.selectedUser)
          return false
      if(user.name === this.props.selectedUser.name) return true;
      else return false
  }

  handleClose() {
      this.props.onClose()
  }

  handleUserSelection(user) {
      this.props.onSelection(user)
  }

  renderUserListItems() {
      return this.state.availableUsers.map((user) => (
          <ListItem 
          style={{margin: ' 5px 20px'}}
          button selected={this.isUserSelected(user)} onClick={() => this.handleUserSelection(user)} key={user.name}>
              <ListItemAvatar>
                  <Avatar src={user.image}/>
              </ListItemAvatar>
              <ListItemText 
              primary={user.name}
              secondary={user.statusText}
              />
              
          </ListItem>
      ))
  }

  render() {
      return (
          <Dialog 

          onClose={this.handleClose} open={this.props.open}>
              <DialogTitle>Choose User</DialogTitle>
              <DialogContent>
                  {!(this.state.availableUsers)
                      ?   <Spinner /> 
                      :   <List>
                              {this.renderUserListItems()}
                          </List>
                  }
              </DialogContent>
              <DialogActions onClick={this.handleClose}>
                  <Button>Close</Button>
              </DialogActions>
          </Dialog>
      );    
  }
}

export default UserSelect;