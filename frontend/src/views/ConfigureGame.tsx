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

  const onSetRounds = (e: { target: { value: string } }) =>
    setRounds(new Array(parseInt(e.target.value, 10)).fill(emptyRound));

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
    <div>
      <h1>Configure</h1>
      <button onClick={onClickBack}>Back</button>
      <button onClick={onResetConfig}>Reset</button>
      {!gameId && (
        <button onClick={() => onConfigReady('LOBBY')}>Submit</button>
      )}
      {gameId && (
        <div>
          <button onClick={() => onConfigReady('THEME')}>Theme setup</button>
          <button onClick={() => onConfigReady('GAME')}>Start game</button>
        </div>
      )}
      <h3>Enter your name</h3>
      {displayErrors && !name.length && <span>Enter name!</span>}
      <input value={name} onChange={(e) => setName(e.target.value)} />
      <h3>Number of rounds</h3>
      <input value={rounds.length} onChange={onSetRounds} type="number" />
      <h3>Who takes first move</h3>
      <label htmlFor="first-move-host">
        Me
        <input
          checked={nextMove === 'HOST'}
          type="checkbox"
          id="first-move-host"
          onChange={() => setNextMove('HOST')}
        />
      </label>
      <label htmlFor="first-move-guest">
        Other player
        <input
          checked={nextMove === 'GUEST'}
          type="checkbox"
          id="first-move-guest"
          onChange={() => setNextMove('GUEST')}
        />
      </label>
      <h3>Select level</h3>
      <div style={{ background: 'gray' }}>
        <label htmlFor="word-level">
          Word level
          <input
            checked={levelType === 'WORD'}
            type="checkbox"
            id="word-level"
            onChange={() => setLevelType('WORD')}
          />
        </label>
        <label htmlFor="sentence-level">
          Sentence level
          <input
            checked={levelType === 'SENTENCE'}
            type="checkbox"
            id="sentence-level"
            onChange={() => setLevelType('SENTENCE')}
          />
        </label>
      </div>
      <h3>Select sound</h3>

      {Object.keys(sounds).map((sound) => (
        <div key={sound} style={{ background: 'gray' }}>
          <h3>{sound}</h3>
          {Object.keys(sounds[sound]).map((position) => (
            <label htmlFor={`${sound}-${position}`}>
              {position}
              <input
                id={`${sound}-${position}`}
                type="checkbox"
                checked={
                  soundTypes.findIndex(
                    (type) => type.sound === sound && type.position === position
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
          ))}
        </div>
      ))}
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
