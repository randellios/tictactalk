import React from 'react';
import { connect } from 'react-redux';
import { emitMessage, pushGameUpdate } from '../utils';
import Modal from 'react-modal';
import { setActiveViewAction } from '../actions/mainActions';
import PageContent from '../components/PageContent';
import themes from '../data/themes';

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

  console.log(themes[theme].backgroundImage);

  return (
    <div className="game-page">
      <PageContent>
        <div
          className="game-container"
          style={{
            backgroundImage: `url(/img/${themes[theme].backgroundImage})`,
          }}
        >
          {!round.winner && (
            <h1>
              {isNextMove
                ? 'Your turn'
                : `${isHost ? guestData.name : hostData.name}'s turn`}
            </h1>
          )}
          {round.winner && (
            <h1>
              {round.winner === 'HOST' ? hostData.name : guestData.name}{' '}
              {hasNextRound ? 'has won this round!' : 'has won!'}
            </h1>
          )}
          <div className="game-board">
            <div className="game-board-row">
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
            </div>
            <div className="game-board-row">
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
            </div>
            <div className="game-board-row">
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
              <div className="game-board-column"></div>
            </div>
          </div>
          
          <div style={{ margin: 'auto', width: 500 }}>
            <div style={{ marginLeft: 50 }}>
              <div className="game--container" style={{ position: 'relative' }}>
                {!!question && (
                  <div
                    style={{
                      background: '#fff',
                      height: 'calc(100% - 34px)',
                      width: 'calc(100% - 68px)',
                      marginTop: 17,
                      marginLeft: 17,
                      position: 'absolute',
                      zIndex: 20,
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                      }}
                    >
                      <h2>Word: {question.word}</h2>
                      <div>
                        {levelType === 'WORD'
                          ? 'Say it then...'
                          : 'Say it - then in a sentence - ta'}
                      </div>
                    </div>
                  </div>
                )}
                {round.questions.map((question, index) => (
                  <div
                    onClick={() => onClickCell(index)}
                    className="cell"
                    style={{
                      position: 'relative',

                      backgroundImage: 'url(/img/frame.png)',
                      backgroundSize: 'cover',
                      padding: '17px',
                      marginLeft:
                        index === 0 || index === 3 || index === 6 ? null : -50,
                    }}
                  >
                    <div
                      style={{
                        background: 'rgba(0, 0, 0, .8)',
                        height: '100%',
                        width: '100%',
                        cursor: 'pointer',
                      }}
                    ></div>
                    <div
                      style={{
                        position: 'absolute',
                        fontSize: '18px',
                        opacity: 0.5,
                        marginTop: '-20px',
                        marginLeft: 'auto',
                        marginRight: 'auto',
                        left: 0,
                        right: 0,
                      }}
                    >
                      {question.completedBy}
                    </div>
                    <div style={{ fontSize: 15 }}>{question.word}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {question && isHost && (
            <div>
              <button
                onClick={() => onConfirmQuestion(isNextMove ? 'HOST' : 'GUEST')}
              >
                Confirm
              </button>
              <button onClick={onCancelQuestion}>Cancel</button>
            </div>
          )}
          {rounds.map((round, index) => (
            <div
              style={{
                border: activeRoundIndex === index ? '1px solid black' : null,
              }}
            >
              {`Round ${index + 1}`}
              {rounds[index].winner &&
                (rounds[index].winner === 'GUEST'
                  ? ` - Won by ${guestData.name}`
                  : ` - Won by ${hostData.name}`)}
            </div>
          ))}
          {isClickingForGuest && <h1>Clicking for guest active</h1>}
          {isHost && !isClickingForGuest && (
            <button onClick={() => setIsClickingForGuest(true)}>
              Click for guest
            </button>
          )}
          {isHost && isClickingForGuest && (
            <button onClick={() => setIsClickingForGuest(false)}>
              Stop clicking for guest
            </button>
          )}
          {isHost && round.winner && hasNextRound && (
            <div>
              <label htmlFor="host-first">
                I'll go first
                <input
                  type="radio"
                  id="host-first"
                  checked={nextMove === 'HOST'}
                  onChange={() => pushGameUpdate({ nextMove: 'HOST' })}
                />
              </label>
              <label htmlFor="guest-first">
                {`${guestData.name} can go first`}
                <input
                  type="radio"
                  id="guest-first"
                  checked={nextMove === 'GUEST'}
                  onChange={() => pushGameUpdate({ nextMove: 'GUEST' })}
                />
              </label>
              <button onClick={startNextRound}>Next Round</button>
            </div>
          )}
          {isHost && (
            <div>
              <button
                onClick={() =>
                  pushGameUpdate({
                    rounds: getEmptyRounds(),
                    nextMove: initialFirstMove,
                    activeRound: 0,
                  })
                }
              >
                Restart game
              </button>
              <button onClick={() => setActiveView('CONFIGURE')}>
                Reconfigure game
              </button>
              {round.winner && !hasNextRound && (
                <button
                  onClick={() =>
                    pushGameUpdate({
                      rounds: getEmptyRounds(),
                      nextMove: initialFirstMove,
                      activeRound: 0,
                    })
                  }
                >
                  Replay
                </button>
              )}
            </div>
          )}
        </div>
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
