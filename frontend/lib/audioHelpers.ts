// frontend/lib/audioHelpers.ts

/**
 * Converts a raw browser Blob (audio recording) into a Base64 Data URI string.
 * This is the format required by the /transcribe endpoint.
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      // The result is already a Data URI: "data:audio/webm;base64,..."
      // Cast the result to a string as required by the promise
      resolve(String(reader.result)); 
    };
    reader.onerror = () => reject(new Error('Failed to convert blob to base64'));
    reader.readAsDataURL(blob);
  });
}