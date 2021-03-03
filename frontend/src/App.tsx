import React, { useEffect, FunctionComponent } from 'react';
import { connect } from 'react-redux';
import { io } from 'socket.io-client';
import { autoUpdateGameDataAction } from './actions/mainActions';
import { views } from './data/index';
import { dispatchRequestedData } from './utils';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import type RootState from './interfaces/rootState.interface';

type AppProps = {
  activeView: string;
  autoUpdateGameData: Function;
};

declare global {
  interface Window {
    socket: {
      on: Function;
    };
  }
}

export const App: FunctionComponent<AppProps> = ({
  activeView,
  autoUpdateGameData,
}) => {
  useEffect(() => {
    window.socket = io('http://localhost:4000');
    window.socket.on('REQUEST_DATA', dispatchRequestedData);
    window.socket.on('INCOMING_GAME_DATA', autoUpdateGameData);
  }, []);
  const ActiveView = views[activeView].component;

  return (
    <>
      <ToastContainer position="top-center" />
      <ActiveView />
    </>
  );
};

const mapStateToProps = (state: RootState) => ({
  activeView: state.activeView,
});

const mapDispatchToProps = {
  autoUpdateGameData: autoUpdateGameDataAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
