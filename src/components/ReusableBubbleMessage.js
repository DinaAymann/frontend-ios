import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MessageBubble = ({ isOutgoing, message, timestamp, type, onVideoPress }) => {
  // const handlePress = () => {
  //   if (type === 'link' && message.includes("youtube.com")) {
  //     const videoId = getYouTubeVideoId(message); 
  //     if (videoId) {
  //       onVideoPress(videoId); 
  //     }
  //   }
  // };


  // const getYouTubeVideoId = (url) => {
  //   const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/\s]{11})/;
  //   const match = url.match(regex);
  //   return match ? match[1] : null;
  // };

  return (
      <View
        style={[
          styles.bubble,
          isOutgoing ? styles.outgoing : styles.incoming,
        ]}
      >        
        <Text style={styles.messageText}>{message}</Text>
        <Text style={styles.timestamp}>{timestamp}</Text>
      </View>

  );
};

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '100%',
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
  },
  outgoing: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
    zIndex: 0,
  },
  incoming: {
    backgroundColor: '#FFF',
  },
  messageText: {
    fontSize: 16,
  },
  timestamp: {
    marginTop: 5,
    fontSize: 12,
    color: 'gray',
    alignSelf: 'flex-end',
  },
});

export default MessageBubble;
