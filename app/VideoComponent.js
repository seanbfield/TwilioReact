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
    return (
      <div>
        <h2>Video Component</h2>
      </div>
    )
  }
}
