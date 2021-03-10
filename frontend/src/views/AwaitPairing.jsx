import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { setActiveViewAction } from '../actions/mainActions';
import Card from '../components/Card';
import PageContent from '../components/PageContent';
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
        isPaired: true,
      });
      setActiveView('SELECT_THEME');
    });
  }, [levelType, hostData, soundTypes, nextMove, rounds]);

  return (
    <div className="host-lobby-page">
      <PageContent title="All set up!">
        <Card title="Here's your game code">
          <div className="game-code">
            <div>
              <div className="game-code-text">{gameId}</div>
              <div className="game-code-info-text">
                Give your code to the other player
              </div>
            </div>
          </div>
        </Card>
        <div className="bottom-controls">
          <button
            className="game-button primary"
            onClick={() => setActiveView('CONFIGURE')}
          >
            Back
          </button>
        </div>
      </PageContent>
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
