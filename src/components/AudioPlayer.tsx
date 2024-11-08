import { useState, useRef, useCallback, useEffect } from 'react';
import { Audio, AVPlaybackStatusSuccess } from 'expo-av';
import { Sound } from 'expo-av/build/Audio';

interface AudioPlayerState {
  sounds: Sound[];
  currentSegmentIndex: number;
  playbackStatus: 'playing' | 'paused' | 'stopped';
  currentPosition: number;
  totalDuration: number;
  segmentDurations: number[];
  segmentStartPositions: number[];
  isTransitioning: boolean;
}

export const useAudioPlayer = (audioSegments: string[]) => {
  const [state, setState] = useState<AudioPlayerState>({
    sounds: [],
    currentSegmentIndex: 0,
    playbackStatus: 'stopped',
    currentPosition: 0,
    totalDuration: 0,
    segmentDurations: [],
    segmentStartPositions: [],
    isTransitioning: false
  });

  const activeSound = useRef<Sound | null>(null);
  const lastPlaybackPosition = useRef<number>(0);

  useEffect(() => {
    const initAudioMode = async () => {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });
    };
    initAudioMode();
  }, []);

  const loadSounds = useCallback(async () => {
    if (!audioSegments?.length) return;
    
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
      });

      const loadedSounds: Sound[] = [];
      const durations: number[] = [];
      const startPositions: number[] = [];
      let totalDurationMs = 0;

      const soundPromises = audioSegments.map(uri => 
        Audio.Sound.createAsync({ uri }, { progressUpdateIntervalMillis: 50 })
      );

      const results = await Promise.all(soundPromises);
      
      for (const { sound } of results) {
        const status = await sound.getStatusAsync() as AVPlaybackStatusSuccess;
        const duration = status.durationMillis || 0;
        
        startPositions.push(totalDurationMs);
        totalDurationMs += duration;
        durations.push(duration);
        loadedSounds.push(sound);
      }

      setState(prev => ({
        ...prev,
        sounds: loadedSounds,
        segmentDurations: durations,
        segmentStartPositions: startPositions,
        totalDuration: totalDurationMs
      }));

    } catch (error) {
      console.error("Error loading audio segments:", error);
    }
  }, [audioSegments]);

  const resetAudio = async () => {
    if (activeSound.current) {
      await activeSound.current.setPositionAsync(0); 
    }
    setState(prev => ({ ...prev, currentPosition: 0, playbackStatus: 'stopped' }));
  };

  const setPlaybackRate = async (rate: number) => {
    if (activeSound.current) {
      try {
        await activeSound.current.setRateAsync(rate, true); 
        setState(prev => ({ ...prev, playbackSpeed: rate })); 
      } catch (error) {
        console.error("Error setting playback rate:", error);
      }
    }
  };
  

  const playSegment = async (segmentIndex: number, startPosition?: number) => {
    if (segmentIndex >= state.sounds.length || state.isTransitioning) return;
    
    const sound = state.sounds[segmentIndex];
    if (!sound) return;

    try {
      setState(prev => ({ ...prev, isTransitioning: true }));
      
      if (activeSound.current) {
        activeSound.current.setOnPlaybackStatusUpdate(null);
        await activeSound.current.stopAsync();
      }

      activeSound.current = sound;
      
      if (startPosition !== undefined) {
        await sound.setPositionAsync(startPosition);
      }

      sound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;

        const currentPos = calculatePosition(segmentIndex, status.positionMillis);
        setState(prev => ({ ...prev, currentPosition: currentPos }));
        lastPlaybackPosition.current = currentPos;

        if (status.didJustFinish) {
          handleSegmentFinish(segmentIndex);
        }
      });

      await sound.playAsync();
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        playbackStatus: 'playing',
        currentSegmentIndex: segmentIndex
      }));

    } catch (error) {
      console.error("Error playing segment:", error);
      setState(prev => ({
        ...prev,
        isTransitioning: false,
        playbackStatus: 'stopped'
      }));
      activeSound.current = null;
    }
  };

  const calculatePosition = (segmentIndex: number, positionMillis: number) => {
    return (state.segmentStartPositions[segmentIndex] || 0) + positionMillis;
  };

  const handleSegmentFinish = async (finishedSegmentIndex: number) => {
    const nextSegmentIndex = finishedSegmentIndex + 1;
    if (nextSegmentIndex < state.sounds.length) {
      await playSegment(nextSegmentIndex, 0);
    } else {
      await resetAudio();
    }
  };
  

  const findSegmentForPosition = (position: number) => {
    return state.segmentStartPositions.findIndex((startPos, index) => 
      position >= startPos && 
      (index === state.segmentStartPositions.length - 1 || 
       position < state.segmentStartPositions[index + 1])
    );
  };

  const seekToPosition = async (progress: number) => {
    const targetTimeMs = progress * state.totalDuration;
    const targetSegmentIndex = findSegmentForPosition(targetTimeMs);
    const segmentPosition = targetTimeMs - state.segmentStartPositions[targetSegmentIndex];
    
    await stopPlayback();
    
    setState(prev => ({
      ...prev,
      currentPosition: targetTimeMs,
      currentSegmentIndex: targetSegmentIndex
    }));
  
    await playSegment(targetSegmentIndex, segmentPosition);
  };
  

  const togglePlayback = async () => {
    if (state.playbackStatus === 'playing') {
      await pausePlayback();
    } else {
      const targetTimeMs = state.currentPosition;
      const targetSegmentIndex = findSegmentForPosition(targetTimeMs);
      const segmentPosition = targetTimeMs - state.segmentStartPositions[targetSegmentIndex];
      await playSegment(targetSegmentIndex, segmentPosition);
    }
  };
  

  const pausePlayback = async () => {
    if (activeSound.current) {
      await activeSound.current.pauseAsync();
      setState(prev => ({ ...prev, playbackStatus: 'paused' }));
    }
  };

  const stopPlayback = async () => {
    if (activeSound.current) {
      activeSound.current.setOnPlaybackStatusUpdate(null);
      await activeSound.current.stopAsync();
    }
    activeSound.current = null;
    setState(prev => ({ 
      ...prev,
      playbackStatus: 'stopped',
      currentPosition: 0
    }));
  };

 return {
  ...state,
  loadSounds,
  togglePlayback,
  seekToPosition,
  stopPlayback,
  setPlaybackRate ,
};
};