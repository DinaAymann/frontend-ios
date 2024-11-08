// Path: /types/react-native-audio-toolkit.d.ts
declare module 'react-native-audio-toolkit' {
    interface RecorderOptions {
      quality?: string;
      format?: string;
      channels?: number;
      sampleRate?: number;
      bitrate?: number;
      meteringInterval?: number;
    }
  
    interface PlayerOptions {
      autoDestroy?: boolean;
    }
  
    export class Recorder {
      constructor(filename: string, options?: RecorderOptions);
      record(callback?: (error: Error | null) => void): Recorder;
      stop(callback?: (error: Error | null) => void): Recorder;
      on(event: 'meter', callback: (data: { value: number }) => void): Recorder;
      prepare(callback?: (error: Error | null, fsPath?: string) => void): Recorder;
      destroy(): void;
      fsPath?: string;
    }
  
    export class Player {
      constructor(filename: string, options?: PlayerOptions);
      play(callback?: (error: Error | null) => void): Player;
      pause(): Player;
      stop(callback?: (error: Error | null) => void): Player;
      seek(position: number, callback?: (error: Error | null) => void): Player;
      on(event: string, callback: (data: any) => void): Player;
    }
  }
  