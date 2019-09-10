// Modules
import React, { Component } from "react";
import { render } from "react-dom";

// Style
import "./styles/styles.css";
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

// Components
import VideoComponent from './VideoComponent';



let dom = document.getElementById("app");
render(
  <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
    <div>
      <AppBar title="React Twilio Video" />
      <VideoComponent />
    </div>
  </MuiThemeProvider>
  ,
  dom
);