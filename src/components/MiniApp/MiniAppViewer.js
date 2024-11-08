// MiniAppViewer.js
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Text } from "react-native";
import WebView from "react-native-webview";
import * as FileSystem from "expo-file-system";
import { unzip } from "react-native-zip-archive";

const MiniAppViewer = ({ zipFilePath }) => {
  const [localUri, setLocalUri] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMiniApp = async () => {
      try {
        setLoading(true);

        // Define paths
        const unzipDestination = `${FileSystem.cacheDirectory}unzippedMiniApp`;

        // Clear previous unzipped files if needed
        await FileSystem.deleteAsync(unzipDestination, { idempotent: true });

        // Unzip the file
        const extractedPath = await unzip(zipFilePath, unzipDestination);
        console.log("Unzipping completed at:", extractedPath);

        // Locate the main HTML file (assuming it's named 'index.html')
        const mainFileUri = `${unzipDestination}/index.html`;
        const fileInfo = await FileSystem.getInfoAsync(mainFileUri);

        if (fileInfo.exists) {
          setLocalUri(mainFileUri);
        } else {
          console.error("Main HTML file not found in unzipped content.");
        }
      } catch (error) {
        console.error("Error unzipping the file:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMiniApp();
  }, [zipFilePath]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : localUri ? (
        <WebView source={{ uri: localUri }} style={styles.webView} />
      ) : (
        <Text>Error: Unable to load mini-app</Text>
      )}
    </View>
  );
};

export default MiniAppViewer;

const styles = StyleSheet.create({
  container: { flex: 1 },
  webView: { flex: 1 },
});
