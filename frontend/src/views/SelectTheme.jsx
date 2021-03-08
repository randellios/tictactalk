import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import themesData from '../data/themes';
import characters from '../data/characters';
import { pushGameUpdate, emitMessage } from '../utils';
import { setActiveViewAction } from '../actions/mainActions';
import PageContent from '../components/PageContent';
import Card from '../components/Card';

export const SelectTheme = ({
  selectedTheme,
  hostCharacter,
  guestCharacter,
  isHost,
  setActiveView,
}) => {
  const selectedCharacter = isHost ? hostCharacter : guestCharacter;
  const isAwaitingOtherPlayer = ![hostCharacter, guestCharacter].every(
    (c) => c
  );
  const themes = Object.keys(themesData);
  const onSelectTheme = (theme) => pushGameUpdate({ theme });
  const onSelectCharacter = (character) =>
    pushGameUpdate({
      [isHost ? 'hostCharacter' : 'guestCharacter']: character,
    });
  const onStartGame = () => {
    emitMessage('START_GAME');
  };

  if (
    selectedTheme &&
    !themesData[selectedTheme].characters.find((c) => c === selectedCharacter)
  ) {
    pushGameUpdate({
      [isHost ? 'hostCharacter' : 'guestCharacter']: null,
    });
  }

  useEffect(() => {
    window.socket.on('START_GAME', () => setActiveView('GAME'));
  }, []);

  return (
    <div className="theme-page">
      <PageContent title="Choose Theme">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {themes.map((theme) => (
            <Card
              title={themesData[theme].label}
              selected={selectedTheme === theme}
            >
              <div
                className="theme-img"
                onClick={() => onSelectTheme(theme)}
                style={{
                  backgroundImage: `url(/img/${themesData[theme].backgroundImage})`,
                }}
              ></div>
            </Card>
          ))}
        </div>

        {selectedTheme && !selectedCharacter && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {themesData[selectedTheme].characters.map((character) => (
                <div
                  onClick={() => onSelectCharacter(character)}
                  className="character-img"
                >
                  <img
                    src={`/img/${characters[selectedTheme][character].image}`}
                  />
                  {/* <div>{characters[selectedTheme][character].label}</div> */}
                </div>
              ))}
            </div>
            <button onClick={() => onSelectTheme(null)}>Go back</button>
          </>
        )}

        {selectedCharacter && selectedTheme && (
          <div>
            {isAwaitingOtherPlayer && <div>Awaiting other player...</div>}
            <button disabled={isAwaitingOtherPlayer} onClick={onStartGame}>
              Start
            </button>
            <button onClick={() => onSelectCharacter(null)}>Go back</button>
          </div>
        )}
      </PageContent>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isHost: state.isHost,
  selectedTheme: state.theme,
  hostCharacter: state.hostCharacter,
  guestCharacter: state.guestCharacter,
});

const mapDispatchToProps = {
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(SelectTheme);
