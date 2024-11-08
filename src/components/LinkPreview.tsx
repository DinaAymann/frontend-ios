import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LinkPreviewProps {
  url: string;
  onVideoClick: (videoId: string) => void;
  isPIPActive: boolean;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ url, onVideoClick, isPIPActive }) => {
  const [metadata, setMetadata] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const isYouTubeLink = (url: string) => /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/.test(url);
  const getYouTubeVideoId = (url: string) => url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([^"&?/\s]{11})/)?.[1] || null;

  const fetchYouTubeMetadata = async (videoId: string) => {
    try {
      const response = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
      return response.json();
    } catch (error) {
      console.error('Error fetching YouTube metadata:', error);
      return null;
    }
  };

  useEffect(() => {
    const fetchMetadata = async () => {
      if (isYouTubeLink(url)) {
        const videoId = getYouTubeVideoId(url);
        if (videoId) {
          const videoMetadata = await fetchYouTubeMetadata(videoId);
          if (videoMetadata) {
            setMetadata({
              youtube: true,
              videoId: videoId,
              title: videoMetadata.title,
            });
          }
        }
      }
      setLoading(false);
    };
    fetchMetadata();
  }, [url]);

  if (loading) return <ActivityIndicator size="small" color="#0000ff" />;
  if (!metadata) return null;

  return (
    <View style={styles.youtubeContainer}>
      {/* Video thumbnail and play button */}
      <TouchableOpacity onPress={() => !isPIPActive && onVideoClick(metadata.videoId)}>
        <Image source={{ uri: `https://img.youtube.com/vi/${metadata.videoId}/0.jpg` }} style={styles.image} />
        <View style={styles.playButtonOverlay}>
          {!isPIPActive && (
            <View style={styles.playButtonContainer}>
              <Ionicons name="play-circle-outline" size={60} color="white" />
            </View>
          )}
        </View>
      </TouchableOpacity>

      {/* PIP message if active */}
      {isPIPActive && (
        <View style={styles.pipContainer}>
          <Ionicons name="copy-outline" size={35} color="white" />
          <Text style={styles.pipText}>This video is playing in Picture-in-Picture.</Text>
        </View>
      )}

      {/* Title and URL */}
      {metadata.title && <Text style={styles.videoTitle}>{metadata.title}</Text>}
      
      {/* Clickable link URL */}
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text style={styles.videoUrl}>{url}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  youtubeContainer: {
    alignItems: 'flex-start',
  },
  image: {
    width: 350,
    height: 200,
    marginBottom: 5,
    borderRadius: 8,
  },
  playButtonOverlay: {
    position: 'absolute',
    top: '40%',
    left: '65%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    justifyContent: 'center',
    alignItems: 'center',   
  },
  playButtonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  pipContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: '50%',
    left: '20%',
  },
  pipText: {
    fontSize: 15,
    color: 'white',
    fontWeight: 'bold',
 },
  videoTitle: {
    marginTop: 4,
    fontSize: 16,
    color: 'black',
    fontWeight: '600',
  },
  videoUrl: {
    marginTop: 2,
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LinkPreview;

