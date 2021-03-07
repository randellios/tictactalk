import React, { FunctionComponent, useState } from 'react';
import { connect } from 'react-redux';
import { sounds } from '../data/sounds';
import {
  setGameConfigAction,
  setGameIdAction,
  setActiveViewAction,
} from '../actions/mainActions';
import { toast } from 'react-toastify';
import {
  emitMessage,
  getNewGameId,
  populateAllQuestions,
  pushGameUpdate,
} from '../utils';
import RootState from '../interfaces/rootState.interface';
import type { SoundTypes } from '../interfaces/sounds.interface';
import { emptyRound } from '../data';
import PageContent from '../components/PageContent';
import Card from '../components/Card';
import NumericInput from 'react-numeric-input';
import { config } from 'process';

interface ConfigureGameProps {
  storedSoundTypes: SoundTypes;
  storedNextMove: string;
  storedLevelType: string;
  storedRounds: [];
  hostData: {
    name: string;
  };
  gameId: string;
  setGameConfig: Function;
  setGameId: Function;
  setActiveView: Function;
}

export const ConfigureGame: FunctionComponent<ConfigureGameProps> = ({
  storedSoundTypes,
  storedNextMove,
  storedLevelType,
  storedRounds,
  hostData,
  setGameConfig,
  setGameId,
  gameId,
  setActiveView,
}) => {
  const [displayErrors, setDisplayErrors] = useState(false);
  const [soundTypes, setSoundTypes] = useState<SoundTypes | []>(
    storedSoundTypes || []
  );
  const [nextMove, setNextMove] = useState(storedNextMove || 'HOST');
  const [levelType, setLevelType] = useState(storedLevelType || 'WORD');
  const [rounds, setRounds] = useState(
    storedRounds.length ? storedRounds : [emptyRound]
  );
  const [name, setName] = useState(hostData.name || '');

  const onSetRounds = (value: number | null) => {
    setRounds(new Array(value || 0).fill(emptyRound));
  };

  const onSelectSound = ({
    sound,
    position,
    isSelected,
  }: {
    sound: {};
    position: string;
    isSelected: boolean;
  }) => {
    if (soundTypes.length < 9 || !isSelected) {
      setSoundTypes(
        isSelected
          ? [...soundTypes, { sound, position }]
          : soundTypes.filter(
              (type) => type.sound !== sound || type.position !== position
            )
      );
    } else {
      toast.error('Selected too many');
    }
  };

  const onResetConfig = () => {
    setSoundTypes([]);
    setNextMove('HOST');
    setLevelType('WORD');
    setName('');
  };

  const onConfigReady = (nextAction: string) => {
    const config = {
      soundTypes,
      nextMove,
      levelType,
      hostData: { name },
      rounds: populateAllQuestions(rounds, soundTypes),
    };
    if (!name.length) {
      setDisplayErrors(true);
      return;
    }

    setGameConfig(config);

    if (nextAction === 'LOBBY') {
      setGameId(getNewGameId());
      emitMessage('NEW_GAME');
      setActiveView('AWAIT_PAIRING');

      return;
    }

    pushGameUpdate(config);

    if (nextAction === 'THEME') {
      pushGameUpdate({ activeView: 'SELECT_THEME', levelType: '', theme: '' });
    }
    if (nextAction === 'GAME') {
      emitMessage('START_GAME');
    }
  };

  const onClickBack = () => {
    setActiveView('LANDING');
  };

  return (
    <div className="config-page">
      <PageContent title="Configruation">
        <div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div
              style={{
                minWidth: 300,
                maxWidth: 300,
                flex: 1,
                marginRight: 25,
              }}
            >
              <Card title="The Setup">
                <div className="form">
                  <div className="form-field">
                    <label>
                      <span className="label-text">Your name</span>
                      {displayErrors && !name.length && (
                        <span>Enter name!</span>
                      )}
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                      />
                    </label>
                  </div>
                  <div className="form-field">
                    <label>
                      <span className="label-text">How many rounds?</span>
                      <NumericInput
                        value={rounds.length}
                        onChange={onSetRounds}
                        type="number"
                        min={1}
                      />
                    </label>
                  </div>
                  <div className="form-field">
                    <label className="checkbox">
                      <input type="checkbox" />
                      <span className="label-text">Give me questions too</span>
                    </label>
                  </div>
                  <div className="form-field">
                    <div className="label-text" style={{ marginBottom: 10 }}>
                      Who goes first?
                    </div>
                    <label className="radio">
                      <input
                        checked={nextMove === 'HOST'}
                        type="radio"
                        id="first-move-host"
                        onChange={() => setNextMove('HOST')}
                      />
                      <span>Me</span>
                    </label>
                    <label className="radio">
                      <input
                        checked={nextMove === 'GUEST'}
                        type="radio"
                        id="first-move-guest"
                        onChange={() => setNextMove('GUEST')}
                      />
                      <span>Other Player</span>
                    </label>
                  </div>
                </div>
              </Card>
            </div>
            <div
              style={{
                minWidth: 200,
                flex: 1,
              }}
            >
              <Card title="The Sounds">
                <div
                  className="sound-selection"
                  style={{
                    height: 500,
                    overflowY: 'scroll',
                  }}
                >
                  <div className="sound-selection-heading">
                    <div></div>
                    <div>Initial</div>
                    <div>Medial</div>
                    <div>Final</div>
                  </div>
                  {Object.keys(sounds).map((sound: any) => (
                    <div className="sound-row" key={sound}>
                      <div>{sound.toUpperCase()}</div>
                      {Object.keys(sounds[sound]).map((position) => (
                        <div
                          style={{
                            visibility: sounds[sound][position].length
                              ? 'visible'
                              : 'hidden',
                          }}
                        >
                          <label className="checkbox">
                            <input
                              type="checkbox"
                              style={{ marginRight: 0 }}
                              checked={
                                soundTypes.findIndex(
                                  (type) =>
                                    type.sound === sound &&
                                    type.position === position
                                ) !== -1
                              }
                              onChange={(e) =>
                                onSelectSound({
                                  sound,
                                  position,
                                  isSelected: e.target.checked,
                                })
                              }
                            />
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="bottom-controls">
            <button className="game-button primary" onClick={onClickBack}>
              Back
            </button>
            <button className="game-button primary" onClick={onResetConfig}>
              Reset
            </button>
            {!gameId && (
              <button
                className="game-button primary wide"
                onClick={() => onConfigReady('LOBBY')}
              >
                Submit
              </button>
            )}
            {gameId && (
              <div>
                <button
                  className="game-button primary"
                  onClick={() => onConfigReady('THEME')}
                >
                  Theme setup
                </button>
                <button
                  className="game-button primary"
                  onClick={() => onConfigReady('GAME')}
                >
                  Start game
                </button>
              </div>
            )}
          </div>
        </div>
      </PageContent>
    </div>
  );
};

const mapStateToProps = (state: RootState) => ({
  storedSoundTypes: state.soundTypes,
  storedLevelType: state.levelType,
  storedNextMove: state.nextMove,
  storedRounds: state.rounds,
  hostData: state.hostData,
  guestData: state.guestData,
  gameId: state.gameId,
});

const mapDispatchToProps = {
  setGameConfig: setGameConfigAction,
  setGameId: setGameIdAction,
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(ConfigureGame);
