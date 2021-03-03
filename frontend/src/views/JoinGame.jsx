import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setActiveViewAction, setGameIdAction } from '../actions/mainActions';
import { emitMessage, pushGameUpdate } from '../utils';

const JoinGame = ({
  setGameId,
  gameId,
  onClickConfirmJoinGame,
  setActiveView,
}) => {
  const onClickSubmit = () => {
    emitMessage('JOIN_GAME');
    pushGameUpdate({ guestData: { name } });
  };
  const onClickBack = () => {
    setActiveView('LANDING');
  }

  const [name, setName] = useState('');

  useEffect(() => {
    window.socket.on('PAIRING_SUCCESS', () => {
      setActiveView('SELECT_THEME');
    });
  }, []);

  return (
    <div>
      <h1>Name</h1>
      <input onChange={(e) => setName(e.target.value)} value={name} />
      <h1>Enter code</h1>
      <input onChange={(e) => setGameId(e.target.value)} value={gameId} />
      <button onClick={onClickSubmit}>Join</button>
      <button onClick={onClickBack}>Back</button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameId: state.gameId,
});

const mapDispatchToProps = {
  setGameId: setGameIdAction,
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
