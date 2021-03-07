import React, { FunctionComponent } from 'react';
import { connect } from 'react-redux';
import {
  setActiveViewAction,
  setGameIdAction,
  flushDataAction,
  setIsHostAction,
  setGameConfigAction,
} from '../actions/mainActions';
import PageContent from '../components/PageContent';
import gameExample from '../img/game-example.png';

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
    <PageContent title="Tic tac talk">
      <>
        <img className="styled-img" src={gameExample} />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 40,
          }}
        >
          <button
            className="game-button primary wide"
            onClick={() => {
              flushData();
              setIsHost(true);
              setActiveView('CONFIGURE');
            }}
          >
            Create game
          </button>
          <button
            className="game-button primary wide"
            onClick={() => {
              flushData();
              setActiveView('JOIN_GAME');
            }}
          >
            Join Game
          </button>
        </div>
      </>
    </PageContent>
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
