import React, { Component } from 'react';
import io from 'socket.io-client';
import MainComponent from './MainComponent.jsx';

export default function(props) {
  const isAdmin = props.match.url === '/admin' ? true : false;
  const resCode = props.match.params.res_code === undefined ? null : props.match.params.res_code;
  const socket = io('http://localhost:3001');


  return (
    <MainComponent
      isAdmin={isAdmin}
      resCode={resCode}
      socket={socket}      
    />
  )
}
