import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import WebView from 'react-native-webview';
import { isVideoLink } from '../../utils';


const renderVideoPreview = () => {
  const [previewLink, setPreviewLink] = useState<string | null>(null);

  if (previewLink && isVideoLink(previewLink)) {
    const embedUrl = getEmbedUrl(previewLink);
    return (
      <View style={styles.previewContainer}>
        <WebView source={{ uri: embedUrl }} />
      </View>
    );
  }
  return null;
};

const getEmbedUrl = (url) => {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1] || url.split("/").pop();
    return `https://www.youtube.com/embed/${videoId}`;
  } else if (url.includes("vimeo.com")) {
    const videoId = url.split("/").pop();
    return `https://player.vimeo.com/video/${videoId}`;
  }
  return url;
};

export default renderVideoPreview;

const styles = StyleSheet.create({
  previewContainer: {
    height: 150,
    width: "100%",
    flexDirection: 'row',
    alignItems: 'center',
  },
});