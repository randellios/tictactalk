export interface SoundType {
  sound: {};
  position: {};
}
export interface SoundTypes extends Array<SoundType> {}

export interface Sound {
  initial: {
    name: string;
  };
  medial: {
    name: string;
  };
  final: {
    name: string;
  };
}

export interface Sounds {
  [key: string]: Sound;
}
