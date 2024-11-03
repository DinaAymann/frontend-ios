import React, { createContext, useState, useContext } from 'react';

interface VideoContextType {
  videoId: string | null;
  setVideoId: (id: string | null) => void;
}

export const VideoContext = createContext<VideoContextType>({
  videoId: null,
  setVideoId: () => {},
});

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [videoId, setVideoId] = useState<string | null>(null);

  return (
    <VideoContext.Provider value={{ videoId, setVideoId }}>
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => useContext(VideoContext);