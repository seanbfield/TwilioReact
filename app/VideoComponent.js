import React, { Component } from 'react'
import Video from 'twilio-video'
import axios from 'axios'

import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardText } from 'material-ui/Card';


export default class VideoComponent extends Component {
  constructor(props) {
    super();

    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null
    }
    this.joinRoom = this.joinRoom.bind(this);
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this)
  }


  componentDidMount() {
    axios.get('/token')
      .then(results => {
        const { identity, token } = results.data;
        this.setState({ identity, token });
      });
  }


  handleRoomNameChange(e) {
    // Fetch room name and update state
    let roomName = e.target.value;
    this.setState({ roomName });
  }
  joinRoom() {

    // Show error message on room name

    if (!this.state.roomNameErr.trim()) {
      this.setState({ roomNameErr: true });
      return;
    }

    console.log("joining room '" + this.state.roomName + " '...");
    let connectOptions = {
      name: this.state.roomName
    }

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks
    }

    // Provide token & connection options including room and tracks. Show alert if error happens when connecting.

    Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
      alert('Twilion API connection unavailable: ' + error.message);
    })

  }



  render() {
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item"><div ref="localMedia" /> </div>) : '';
    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (
      <RaisedButton
        label="leave room"
        secondary={true}
        onClick={() => alert("leave room")} />
    ) : (
        <RaisedButton label="join room"
          primary={true}
          onClick={this.joinRoom}
        />);

    return (

      <Card>
        <CardText>
          <div className="flex-container">
            {showLocalTrack} {/* Show local track if available */}
            <div className="flex-item">
              {/*
                  The following text field is used to enter a room name. It calls  `handleRoomNameChange` method when the text changes which sets the `roomName` variable initialized in the state.
                */}
              <TextField hintText="Room Name" onChange={this.handleRoomNameChange}
                errorText={this.state.roomNameErr ? 'Room Name is required' : undefined}
              />
              <br />
              {joinOrLeaveRoomButton} {/* Show either ‘Leave Room’ or ‘Join Room’ button */}
            </div>
            {/* 
The following div element shows all remote media (other                             participant’s tracks) 
    */}
            <div className="flex-item" ref="remoteMedia" id="remote-media" />
          </div>
        </CardText>
      </Card>
    )
  }
}
