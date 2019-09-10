import React, { Component } from 'react'
import Video from 'twilio-video'
import axios from 'axios'

import RaisedButton from 'material-ui/RaisedButton'
import TextField from 'material-ui/TextField'
import { Card, CardHeader, CardText } from 'material-ui/Card'


export default class VideoComponent extends Component {
  constructor(props) {
    super()

    this.state = {
      identity: null,
      roomName: "",
      roomNameErr: false,
      previewTracks: null,
      localMediaAvailable: false,
      hasJoinedRoom: false,
      activeRoom: null
    }
    this.joinRoom = this.joinRoom.bind(this)
    this.handleRoomNameChange = this.handleRoomNameChange.bind(this)
    this.roomJoined = this.roomJoined.bind(this)
    this.leaveRoom = this.leaveRoom.bind(this)
    this.detachTracks = this.detachTracks.bind(this)
    this.detachParticpantTracks = this.detachParticpantTracks.bind(this)
  }


  componentDidMount() {
    axios.get('/token')
      .then(results => {
        const { identity, token } = results.data
        this.setState({ identity, token })
      })
  }


  handleRoomNameChange(e) {
    // Fetch room name and update state
    let roomName = e.target.value
    this.setState({ roomName })
  }


  // JOIN ROOM
  joinRoom() {

    // Show error message on room name

    if (!this.state.roomName.trim()) {
      this.setState({ roomNameErr: true })
      return
    }

    console.log("joining room '" + this.state.roomName + " '...")
    let connectOptions = {
      name: this.state.roomName
    }

    if (this.state.previewTracks) {
      connectOptions.tracks = this.state.previewTracks
    }

    // Provide token & connection options including room and tracks. Show alert if error happens when connecting.

    Video.connect(this.state.token, connectOptions).then(this.roomJoined, error => {
      alert('Twilio API connection unavailable: ' + error.message)
    })
  }


  //Attach Tracks to the DOM

  attachTracks(tracks, container) {
    tracks.forEach(track => {
      container.appendChild(track.attach())
    })
  }


  // Attach chat particpant Tracks to the DOM

  attachParticpantTracks(participant, container) {
    const tracks = Array.from(participant.tracks.values())
    this.attachTracks(tracks, container)
  }

  roomJoined(room) {
    //Initialized when a particpant joins a room
    console.log(("joined as '" + this.state.identity + "'"))
    this.setState({
      activeRoom: room,
      localMediaAvailable: true,
      hasJoinedRoom: true // Removes 'join room button and displays 'leave room button'
    })

    var previewContainer = this.refs.localMedia
    if (!previewContainer.querySelector('video')) {
      this.attachParticipantTracks(room.localParticipant, previewContainer)
    }

    // Attach tracks for rooms participants
    room.participants.forEach(participant => {
      console.log("Already in Room: '" + participant.identity + "'")
      const previewContainer = this.refs.remoteMedia
      this.attachParticpantTracks(participant, previewContainer)
    })

    // Participant joining room
    room.on('participantConnected', participant => {
      console.log("Joining: '" + participant.identity + "'")
    })

    // Attach participant’s tracks to DOM when they add a track
    room.on('trackAdded', (track, participant) => {
      console.log(participant.identity + 'added track:' + track.kind)
      const previewContainer = this.refs.remoteMedia
      this.attachTracks([track], previewContainer)
    })

    // Detach participant’s track from DOM when they remove a track.
    room.on('trackRemoved', (track, participant) => {
      this.log(participant.identity + ' removed track: ' + track.kind);
      this.detachTracks([track]);
    });

    // Detach all participant’s track when they leave a room.
    room.on('participantDisconnected', participant => {
      console.log("Participant '" + participant.identity + "' left the room");
      this.detachParticipantTracks(participant);
    });


    // Once the local participant (room owner) leaves the room, detach the Tracks
    // of all other participants, including that of the LocalParticipant.


    room.on('disconnected', () => {
      if (this.state.previewTracks) {
        this.state.previewTracks.forEach(track => {
          track.stop();
        })
      }

      this.detachParticpantTracks(room.localParticipant)
      room.participants.forEach(this.detachParticpantTracks)
      this.state.activeRoom = nullthis.setState({ hasJoinedRoom: false, localMediaAvailable: false })
    })
  }

  // LEAVE ROOM

  leaveRoom() {
    this.state.activeRoom.disconnect()
    this.setState({ hasJoinedRoom: false, localMediaAvailable: false })
  }

  // DETACH TRACKS 

  detachTracks(tracks) {
    tracks.forEach(track => {
      track.detach().forEach(detachedElement => {
        detachedElement.remove()
      })
    })
  }

  detachParticpantTracks(participant) {
    const tracks = Array.from(participant.tracks.values())
    this.detachTracks(tracks)
  }


  render() {
    let showLocalTrack = this.state.localMediaAvailable ? (
      <div className="flex-item"><div ref="localMedia" /> </div>) : ''
    let joinOrLeaveRoomButton = this.state.hasJoinedRoom ? (

      <RaisedButton
        label="leave room"
        secondary={true}
        onClick={this.leaveRoom} />
    ) : (
        <RaisedButton label="join room"
          primary={true}
          onClick={this.joinRoom}
        />)

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
