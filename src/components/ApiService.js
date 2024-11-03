import axios from 'axios';
import * as FileSystem from 'expo-file-system';

class ApiService {
  static apiUrl = 'https://ramsesfrancoarabicapi-be0d6d6a9e4d.herokuapp.com/transcribeAndTranslate';
  static apiKey = '1a2b8c82d980594cf20a0b494164dc2b250cade2f26d38d331fc0f83821d190g';

  static async transcribeAndTranslate(targetLanguage, audioPath) {
    const uri = this.apiUrl;

    const formData = new FormData();
    formData.append('target_language', targetLanguage);

    const fileInfo = await FileSystem.getInfoAsync(audioPath);
    if (!fileInfo.exists) {
      throw new Error('The specified path does not point to a file.');
    }

    const mimeType = 'audio/m4a';

    formData.append('file', {
      uri: audioPath,
      name: 'audiofile.m4a', 
      type: mimeType,
    });

    try {
      const headers = {
        'x-api-key': this.apiKey,
        'Content-Type': 'multipart/form-data',
      };

      const response = await axios.post(uri, formData, { headers });

      if (response.status === 200) {
        const { translation = 'No translation found' } = response.data;
        return translation;
      } else {
        console.error(`Error status code: ${response.status}`);
        throw new Error(`Failed to transcribe and translate. Status code: ${response.status}`);
      }
    } catch (error) {
      console.error(`Error during transcribe and translate: ${error}`);
      throw error;
    }
  }
}

export default ApiService;
