export interface HostData {
  name: string;
}
export interface GuestData {
  name: string;
}

export interface RootState {
  gameId: string;
  isPaired: boolean;
  isHost: boolean;
  activeView: string;
  soundTypes: [];
  levelType: string;
  theme: string;
  chars: {};
  score: {};
  nextMove: string;
  hostData: HostData;
  guestData: GuestData;
  rounds: [];
}

export default RootState;
