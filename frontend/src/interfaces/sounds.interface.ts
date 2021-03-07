export interface SoundType {
  sound: {};
  position: {};
}
export interface SoundTypes extends Array<SoundType> {}

export interface Sounds {
  [key: string]: Sound;
}

export interface SoundData {
  name: string;
}

export interface Sound {
  [key: string]: SoundData[];
}
