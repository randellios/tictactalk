import SelectTheme from '../views/SelectTheme';
import Game from '../views/Game';
import ConfigureGame from '../views/ConfigureGame';
import AwaitPairing from '../views/AwaitPairing';
import JoinGame from '../views/JoinGame';
import Landing from '../views/Landing';
import { views as viewKeys } from '../constants';
import type { Views } from '../interfaces/index';

export const views: Views = {
  [viewKeys.LANDING]: { label: 'create game', component: Landing },
  [viewKeys.SELECT_THEME]: {
    label: 'create game',
    component: SelectTheme,
  },
  [viewKeys.GAME]: { label: 'the game', component: Game },
  [viewKeys.CONFIGURE]: { label: 'Configure', component: ConfigureGame },
  [viewKeys.AWAIT_PAIRING]: {
    label: 'Configure',
    component: AwaitPairing,
  },
  [viewKeys.JOIN_GAME]: { label: 'Configure', component: JoinGame },
};

export const emptyRound = {
  questions: new Array(9).fill({
    soundType: {},
    word: '',
    image: '',
    completedBy: '',
  }),
};
