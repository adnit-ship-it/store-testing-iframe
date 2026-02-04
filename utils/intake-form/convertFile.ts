/**
 * Converts a File object into a base64 encoded string.
 * This is a generic utility function that can be reused anywhere in the application.
 * @param file The File object to convert.
 * @returns A promise that resolves with the base64 string.
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes a prefix like "data:image/png;base64,"
      // We need to strip that out for the API.
      const base64String = result.split(",")[1];

      if (base64String) {
        resolve(base64String);
      } else {
        reject(new Error("Could not extract base64 string from file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
};
