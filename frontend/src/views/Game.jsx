import React from 'react';
import { connect } from 'react-redux';
import { emitMessage, pushGameUpdate } from '../utils';
import Modal from 'react-modal';
import { setActiveViewAction } from '../actions/mainActions';
import PageContent from '../components/PageContent';
import themes from '../data/themes';
import characters from '../data/characters';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import classNames from 'classnames';

Modal.setAppElement('#root');

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Game = ({
  isHost,
  nextMove,
  rounds,
  hostData,
  guestData,
  levelType,
  activeRound: activeRoundIndex,
  activeQuestion: activeQuestionIndex,
  setActiveView,
  theme,
  hostCharacter,
  guestCharacter,
}) => {
  const playerAlias = isHost ? 'HOST' : 'GUEST';
  const isNextMove =
    (isHost && nextMove === 'HOST') || (!isHost && nextMove === 'GUEST');

  const [initialFirstMove, setInitialFirstMove] = React.useState('');
  const [isModalOpen, setIsModalOpen] = React.useState(true);

  const round = rounds[activeRoundIndex];
  const question =
    rounds[activeRoundIndex].questions[activeQuestionIndex] || null;
  const [isClickingForGuest, setIsClickingForGuest] = React.useState(false);
  const getQuestionByIndex = (questionIndex) => {
    return rounds[activeRoundIndex].questions[questionIndex];
  };
  const getHasWon = () => {
    const selectedIndexes = rounds[activeRoundIndex].questions
      .map((q, i) => (q.completedBy === playerAlias ? i : null))
      .filter((q, i) => q !== null);
    return winCombinations.some((combo) =>
      combo.every((comboIndex) => selectedIndexes.includes(comboIndex))
    );
  };

  // {
  //   rounds.map((round, index) => (
  //     <div
  //       style={{
  //         border: activeRoundIndex === index ? '1px solid black' : null,
  //       }}
  //     >
  //       {`Round ${index + 1}`}
  //       {rounds[index].winner &&
  //         (rounds[index].winner === 'GUEST'
  //           ? ` - Won by ${guestData.name}`
  //           : ` - Won by ${hostData.name}`)}
  //     </div>
  //   ));
  // }

  const hostCharacterSrc = `/img/${characters[theme][hostCharacter].image}`;
  const guestCharacterSrc = `/img/${characters[theme][guestCharacter].image}`;
  const getCharacterSrc = (completedBy) => {
    if (!completedBy) {
      return null;
    }
    return completedBy === 'HOST' ? hostCharacterSrc : guestCharacterSrc;
  };

  const getEmptyRounds = () =>
    rounds.map((r) => ({
      ...r,
      winner: null,
      questions: round.questions.map((q) => ({ ...q, completedBy: '' })),
    }));

  const hasNextRound = activeRoundIndex + 1 < rounds.length;

  if (getHasWon() && !round.winner) {
    pushGameUpdate({
      rounds: rounds.map((r, roundIndex) =>
        roundIndex === activeRoundIndex ? { ...r, winner: playerAlias } : r
      ),
    });
  }

  const onCancelQuestion = () => {
    pushGameUpdate({ activeQuestion: null });
  };

  const getNotificationText = () => {
    if (round.winner) {
      const name = round.winner === 'HOST' ? hostData.name : guestData.name;
      return `${name} ${hasNextRound ? 'has won this round!' : 'has won!'}`;
    }
    return isNextMove
      ? 'Your turn'
      : `${isHost ? guestData.name : hostData.name}'s turn`;
  };

  const onConfirmQuestion = (completedBy) => {
    pushGameUpdate({
      activeQuestion: null,
      nextMove: completedBy === 'HOST' ? 'GUEST' : 'HOST',
      rounds: rounds.map((r, roundIndex) => {
        if (roundIndex === activeRoundIndex) {
          return {
            ...r,
            questions: r.questions.map((q, questionIndex) => {
              if (questionIndex === activeQuestionIndex) {
                return {
                  ...q,
                  completedBy,
                };
              }
              return q;
            }),
          };
        }

        return r;
      }),
    });
  };

  const onClickCell = (index) => {
    if (
      !round.winner &&
      (isNextMove || isClickingForGuest) &&
      !getQuestionByIndex(index).completedBy
    ) {
      pushGameUpdate({ activeQuestion: index });
    }
  };

  const startNextRound = () => {
    if (hasNextRound) {
      pushGameUpdate({ activeRound: activeRoundIndex + 1 });
    }
  };

  React.useEffect(() => {
    setInitialFirstMove(nextMove);
  }, []);

  const boardSize = 500;
  const paddingOffset = boardSize / 30;
  const squareSize = boardSize / 3;

  return (
    <div className="game-page">
      <PageContent>
        <div
          className="top-notification"
          style={{
            backgroundImage: 'url(/img/paper-banner.png)',
          }}
        >
          {getNotificationText()}
        </div>
        <div className="hanger-container">
          <img src="/img/hanger.png" alt="" />
          <img src="/img/hanger.png" alt="" />
        </div>
        <div
          className="game-container"
          style={{
            backgroundImage: `url(/img/${themes[theme].backgroundImage})`,
          }}
        >
          <div
            className="board-container"
            style={{
              backgroundImage: 'url(/img/tile-border.png)',
              width: boardSize + paddingOffset,
              height: boardSize + paddingOffset,
            }}
          >
            <TransitionGroup component={null}>
              {!!question && (
                <CSSTransition timeout={500} classNames="item">
                  <div
                    style={{
                      background: 'url(/img/paper-scroll.png)',
                      backgroundSize: 'contain',
                      height: `calc(100% - ${paddingOffset * 2}px)`,
                      width: `calc(100% - ${paddingOffset * 2}px)`,
                      position: 'absolute',
                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <div className="heading" style={{ fontSize: '3em' }}>
                        {question.word}
                      </div>
                      <img
                        className="mascot-character"
                        src={
                          nextMove === 'HOST'
                            ? hostCharacterSrc
                            : guestCharacterSrc
                        }
                        alt=""
                      />
                    </div>
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>

            <div
              // className="game-board"
              style={{
                position: 'relative',
                flexWrap: 'wrap',
                display: 'flex',
                width: boardSize,
                // marginLeft: 10
              }}
            >
              {round.questions.map((question, index) => (
                <div
                  className="game-square"
                  style={{
                    width: squareSize,
                    height: squareSize,
                    backgroundImage: `url(/img/tile-${index}.png)`,
                    backgroundSize: 'cover',
                    padding: 7,
                  }}
                >
                  <div
                    className={classNames(
                      'game-square-content',
                      question.completedBy ? 'completed' : null
                    )}
                    onClick={() => onClickCell(index)}
                    style={{
                      background: 'rgba(0, 0, 0, .7)',
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      cursor: 'pointer',
                    }}
                  >
                    {isHost && !question.completedBy && (
                      <div className="word-hint">{question.word}</div>
                    )}
                    {question.completedBy && (
                      <img
                        className="completed-character"
                        src={getCharacterSrc(question.completedBy)}
                        alt=""
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {isHost && (
            <div className="info-strip">
              <div className="info-strip-content">
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={isClickingForGuest}
                    onClick={() => setIsClickingForGuest(!isClickingForGuest)}
                  />
                  <span className="label-text">Play as both?</span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* {isClickingForGuest && <h1>Clicking for guest active</h1>}
        {isHost && !isClickingForGuest && (
          <button className="game-button primary" onClick={() => setIsClickingForGuest(true)}>
            Click for guest
          </button>
        )}
        {isHost && isClickingForGuest && (
          <button className="game-button primary" onClick={() => setIsClickingForGuest(false)}>
            Stop clicking for guest
          </button>
        )} */}
        {isHost && (
          <div className="bottom-controls">
            <div className="controls-container">
              <div className="controls-title">
                <span>Play Again</span>
              </div>
              <div className="controls-content">
                <div>
                  <button
                    className="game-button primary"
                    style={{ marginRight: 20 }}
                    onClick={() => setActiveView('CONFIGURE')}
                  >
                    Reconfigure
                  </button>
                  <button
                    className="game-button primary"
                    onClick={() =>
                      pushGameUpdate({
                        rounds: getEmptyRounds(),
                        nextMove: initialFirstMove,
                        activeRound: 0,
                      })
                    }
                  >
                    {round.winner && !hasNextRound ? 'Replay' : 'Restart'}
                  </button>
                </div>
              </div>
            </div>
            {isHost && !round.winner && (
              <div className="confirm-go-controls">
                <div className="controls-container">
                  <div className="controls-title">
                    <span>Next action</span>
                  </div>
                  {!round.winner && (
                    <div className="controls-content">
                      <button
                        className="game-button primary"
                        style={{ marginRight: 20 }}
                        onClick={onCancelQuestion}
                        disabled={!question}
                      >
                        Cancel
                      </button>
                      <button
                        className="game-button green wide"
                        onClick={() =>
                          onConfirmQuestion(isNextMove ? 'HOST' : 'GUEST')
                        }
                        disabled={!question}
                      >
                        Confirm
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
            {round.winner && hasNextRound && (
              <div className="next-round-controls">
                <div className="controls-container">
                  <div className="controls-title">
                    <span>Who goes first?</span>
                  </div>
                  <div className="controls-content">
                    <label className="radio">
                      <input
                        type="radio"
                        id="host-first"
                        checked={nextMove === 'HOST'}
                        onChange={() => pushGameUpdate({ nextMove: 'HOST' })}
                      />
                      <span>Me</span>
                    </label>
                    <label className="radio">
                      <input
                        type="radio"
                        id="guest-first"
                        checked={nextMove === 'GUEST'}
                        onChange={() => pushGameUpdate({ nextMove: 'GUEST' })}
                      />
                      <span>{guestData.name}</span>
                    </label>
                    <button
                      className="game-button primary"
                      onClick={startNextRound}
                    >
                      Next Round
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </PageContent>
    </div>
  );
};

const mapStateToProps = (state) => ({
  isHost: state.isHost,
  theme: state.theme,
  hostCharacter: state.hostCharacter,
  guestCharacter: state.guestCharacter,
  board: state.board,
  score: state.score,
  nextMove: state.nextMove,
  rounds: state.rounds,
  activeRound: state.activeRound,
  activeQuestion: state.activeQuestion,
  hostData: state.hostData,
  guestData: state.guestData,
  levelType: state.levelType,
});

const mapDispatchToProps = {
  setActiveView: setActiveViewAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Game);
