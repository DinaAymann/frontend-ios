import React from 'react';
import { View, StyleSheet } from 'react-native';
import LinkPreview from './LinkPreview';

interface LinkPreviewWithDraggableVideoProps {
  url: string;
  isOutgoing: boolean;
  onVideoClick: (url: string) => void;
  onCloseClick: () => void;
  isPIPActive: boolean;
}

const LinkPreviewWithDraggableVideo: React.FC<LinkPreviewWithDraggableVideoProps> = ({ url, isOutgoing, onVideoClick, isPIPActive, onCloseClick }) => {
  return (
    <View style={[styles.container, isOutgoing ? styles.outgoing : styles.incoming]}>
      <LinkPreview url={url} onVideoClick={onVideoClick} isPIPActive={isPIPActive} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%',
  },
  outgoing: {
    alignSelf: 'flex-end',
    backgroundColor: '#DCF8C6',
  },
  incoming: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
});

export default LinkPreviewWithDraggableVideo;

