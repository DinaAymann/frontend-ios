import { Platform } from 'react-native';

/**
 * @param {string} apiToken - Your API token.
 * @param {string} accountId - Your account ID.
 * @param {string} uri - The local file URI of the audio file.
 * @param {string} fileName - The name of the audio file.
 * @param {string} folderId - The folder ID for the request.
 * @param {number} timestamp - The timestamp for the audio.
 * @param {number} noOfSpeakers - Number of speakers in the audio.
 * @returns {Promise<string | null>} - Returns the request ID or null if upload fails.
 */
async function uploadAudio(apiToken, accountId, uri, fileName, folderId, timestamp, noOfSpeakers) {
  const url = `https://api.intella-voice.com/api/accounts/${accountId}/requests?folderId=${folderId}`;

  const formData = new FormData();
  formData.append('file', {
    uri,
    type: 'audio/mp4',
    name: fileName,
  });
  formData.append('fileName', fileName);
  formData.append('timestamp', String(timestamp));
  formData.append('noOfSpeakers', String(noOfSpeakers));

  try {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'x-ApiToken': apiToken,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });
      
      console.log('Response:', response);
      

    if (response.status === 201) {
      const data = await response.json();
      return data.id; 
    } else {
      console.error('Error uploading file:', response.status, await response.text());
      return null;
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return null;
  }
}

/**
 * @param {string} apiToken - Your API token.
 * @param {string} accountId - Your account ID.
 * @param {string} requestId - The request ID obtained after uploading.
 * @returns {Promise<string | null>} - Returns the transcription or null if it fails.
 */
async function getTranscription(apiToken, accountId, requestId) {
  const url = `https://api.intella-voice.com/api/accounts/${accountId}/requests/${requestId}`;

  while (true) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-ApiToken': apiToken,
        },
      });

      if (response.status === 200) {
        const data = await response.json();
        if (data.status === 0) {
          return data.transcriptContent;
        } else if (data.status === 3) {
          console.log('Transcription failed.');
          return null;
        } else {
          console.log('Transcription in progress...');
        }
      } else {
        console.error('Error retrieving transcription:', response.status, await response.text());
        break;
      }
    } catch (error) {
      console.error('Polling failed:', error);
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  return null;
}

export { uploadAudio, getTranscription };
