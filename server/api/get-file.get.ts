import { readFile, unlink } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const fileId = query.fileId as string;

    if (!fileId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File ID is required'
      });
    }

    // Construct file path - we need to find the file with the correct extension
    const uploadsDir = join(process.cwd(), 'uploads', 'temp');
    
    // Try to find the file by looking for files that start with the fileId
    const fs = await import('fs/promises');
    const files = await fs.readdir(uploadsDir);
    const targetFile = files.find(file => file.startsWith(fileId));
    
    if (!targetFile) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      });
    }
    
    const filePath = join(uploadsDir, targetFile);

    // Read file and convert to base64
    const fileBuffer = await readFile(filePath);
    const base64Data = fileBuffer.toString('base64');

    // Determine content type from file extension
    const extension = targetFile.split('.').pop()?.toLowerCase();
    let contentType = 'application/octet-stream';
    
    if (extension === 'pdf') contentType = 'application/pdf';
    else if (extension === 'jpg' || extension === 'jpeg') contentType = 'image/jpeg';
    else if (extension === 'png') contentType = 'image/png';
    else if (extension === 'gif') contentType = 'image/gif';

    return {
      success: true,
      data: base64Data,
      contentType,
      size: fileBuffer.length
    };

  } catch (error: any) {
    throw createError({
      statusCode: 404,
      statusMessage: 'File not found',
      data: error.message
    });
  }
});