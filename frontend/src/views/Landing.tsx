import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {
  setActiveViewAction,
  setGameIdAction,
  flushDataAction,
  setIsHostAction,
  setGameConfigAction,
} from '../actions/mainActions';

interface LandingProps {
  setActiveView: Function;
  flushData: Function;
  setIsHost: Function;
}

export const Landing: FunctionComponent<LandingProps> = ({
  setActiveView,
  flushData,
  setIsHost,
}) => (
  <div>
    <h1>Landing</h1>
    <button
      onClick={() => {
        flushData();
        setIsHost(true);
        setActiveView('CONFIGURE');
      }}
    >
      Create game
    </button>
    <button
      onClick={() => {
        flushData();
        setActiveView('JOIN_GAME');
      }}
    >
      Join Game
    </button>
  </div>
);

const mapDispatchToProps = {
  setGameId: setGameIdAction,
  setGameConfig: setGameConfigAction,
  setActiveView: setActiveViewAction,
  setIsHost: setIsHostAction,
  flushData: flushDataAction,
};

export default connect(null, mapDispatchToProps)(Landing);
