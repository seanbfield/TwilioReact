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
  }

  componentDidMount() {
    axios.get('/token')
      .then(results => {
        const { identity, token } = results.data;
        this.setState({ identity, token });
      });
  }

  render() {
    let showLocalTrack = this.state.localMediaAvailable ? (
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
      <>
        <Card>
          <CardText>
            <div className="flex-container">
              {showLocalTrack} {/* Show local track if available */}
              <div className="flex-item">
                {/*
                  The following text field is used to enter a room name. It calls  `handleRoomNameChange` method when the text changes which sets the `roomName` variable initialized in the state.
                */}
              </div>
            </div>
          </CardText>

        </Card>



        )
      )
      </>
    )
  }
}
