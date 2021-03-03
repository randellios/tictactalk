import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setActiveViewAction } from '../actions/mainActions';
import { pushGameUpdate } from '../utils';

const AwaitPairing = ({
  gameId,
  setActiveView,
  levelType,
  hostData,
  soundTypes,
  nextMove,
  rounds,
}) => {
  useEffect(() => {
    window.socket.on('PAIRING_SUCCESS', () => {
      pushGameUpdate({
        levelType,
        hostData,
        soundTypes,
        nextMove,
        rounds,
      });
      setActiveView('SELECT_THEME');
    });
  }, [levelType, hostData, soundTypes, nextMove, rounds]);

  return (
    <div>
      <h1>Awaiting player to join</h1>
      <h3>Here is your code: {gameId}</h3>
      <button onClick={() => setActiveView('CONFIGURE')}>Back</button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameId: state.gameId,
  levelType: state.levelType,
  hostData: state.hostData,
  soundTypes: state.soundTypes,
  nextMove: state.nextMove,
  rounds: state.rounds,
});

const mapDispatchToProps = {
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(AwaitPairing);
