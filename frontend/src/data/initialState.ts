import RootState from '../interfaces/rootState.interface';

export const initialState: RootState = {
  gameId: '',
  isPaired: false,
  isHost: false,
  activeView: 'LANDING',
  soundTypes: [],
  levelType: 'WORD',
  theme: '',
  chars: {},
  score: {},
  nextMove: 'host',
  hostData: {
    name: '',
  },
  guestData: {
    name: '',
  },
  rounds: [],
};

export default initialState;
