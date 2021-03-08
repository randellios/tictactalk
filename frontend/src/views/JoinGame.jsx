import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { setActiveViewAction, setGameIdAction } from '../actions/mainActions';
import Card from '../components/Card';
import PageContent from '../components/PageContent';
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
  };

  const [name, setName] = useState('');

  useEffect(() => {
    window.socket.on('PAIRING_SUCCESS', () => {
      setActiveView('SELECT_THEME');
    });
  }, []);

  return (
    <div className="join-game-page">
      <PageContent title="Join A Game">
        <Card title="Almost there!" noHeader>
          <div className="content-wrapper">
            <div className="form">
              <div className="form-field" style={{ textAlign: 'center' }}>
                <div className="label-text">Hi! What is your name?</div>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  type="text"
                />
              </div>
              <div className="form-field enter-code-field">
                <div className="label-text">
                  Enter your <span>secret</span> code
                </div>
                <input
                  onChange={(e) => setGameId(e.target.value)}
                  value={gameId}
                  type="text"
                  style={{ maxWidth: 150 }}
                />
              </div>
            </div>
          </div>
        </Card>
        <div className="bottom-controls">
          <button className="game-button primary" onClick={onClickBack}>
            Back
          </button>
          <button className="game-button primary wide" onClick={onClickSubmit}>
            Join
          </button>
        </div>
      </PageContent>
    </div>
  );
};

{
  /* <div>
  <h1>Name</h1>
  <input onChange={(e) => setName(e.target.value)} value={name} />
  <h1>Enter code</h1>
  <input onChange={(e) => setGameId(e.target.value)} value={gameId} />
  <button onClick={onClickSubmit}>Join</button>
  <button onClick={onClickBack}>Back</button>
</div>; */
}

const mapStateToProps = (state) => ({
  gameId: state.gameId,
});

const mapDispatchToProps = {
  setGameId: setGameIdAction,
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(JoinGame);
