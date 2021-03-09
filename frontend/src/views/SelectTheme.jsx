import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import themesData from '../data/themes';
import characters from '../data/characters';
import { pushGameUpdate, emitMessage } from '../utils';
import { setActiveViewAction } from '../actions/mainActions';
import PageContent from '../components/PageContent';
import Card from '../components/Card';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';

export const SelectTheme = ({
  selectedTheme,
  hostCharacter,
  guestCharacter,
  isHost,
  setActiveView,
}) => {
  const selectedCharacter = isHost ? hostCharacter : guestCharacter;
  const otherPlayersCharacter = isHost ? guestCharacter : hostCharacter;
  const isAwaitingOtherPlayer = ![hostCharacter, guestCharacter].every(
    (c) => c
  );
  const bothPlayersReady = !!hostCharacter && !!guestCharacter;

  const themes = Object.keys(themesData);
  const onSelectTheme = (theme) => pushGameUpdate({ theme });
  const onSelectCharacter = (character) =>
    pushGameUpdate({
      [isHost ? 'hostCharacter' : 'guestCharacter']: character,
    });
  const onStartGame = () => {
    setTimeout(() => setActiveView('GAME'), 500);
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
    window.socket.on('START_GAME', () => onStartGame());
    if (bothPlayersReady) {
      emitMessage('START_GAME');
    }
  }, [bothPlayersReady]);

  return (
    <div className="theme-page">
      <PageContent
        title={
          selectedCharacter && selectedTheme
            ? 'Awaiting Other Player...'
            : 'Choose Your Theme'
        }
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '1em',
          }}
        >
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

        <TransitionGroup>
          {selectedTheme && (
            <CSSTransition timeout={500} classNames="item">
              <Card title="Select Character">
                <div
                  style={{ display: 'flex', justifyContent: 'space-between' }}
                >
                  {themesData[selectedTheme].characters.map((character) => (
                    <div
                      onClick={() => onSelectCharacter(character)}
                      className={classNames(
                        'character-img',
                        selectedCharacter === character ? 'selected' : null,
                        otherPlayersCharacter === character
                          ? 'other-player-selected'
                          : null
                      )}
                    >
                      <img
                        src={`/img/${characters[selectedTheme][character].image}`}
                      />
                      {/* <div>{characters[selectedTheme][character].label}</div> */}
                    </div>
                  ))}
                </div>
              </Card>
            </CSSTransition>
          )}
        </TransitionGroup>
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
