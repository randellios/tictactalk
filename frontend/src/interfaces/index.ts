export interface Window {
  socket: {
    on: Function;
  };
}

export interface View {
  label: String;
  component: Function;
}

export interface Views {
  [key: string]: View;
}
