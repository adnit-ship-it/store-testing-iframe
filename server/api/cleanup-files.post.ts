import { unlink } from 'fs/promises';
import { join } from 'path';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const { fileIds } = body;

    if (!fileIds || !Array.isArray(fileIds)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File IDs array is required'
      });
    }

    const uploadsDir = join(process.cwd(), 'uploads', 'temp');
    const results = [];

    for (const fileId of fileIds) {
      try {
        // Find the actual file with extension
        const fs = await import('fs/promises');
        const files = await fs.readdir(uploadsDir);
        const targetFile = files.find(file => file.startsWith(fileId));
        
        if (targetFile) {
          const filePath = join(uploadsDir, targetFile);
          await unlink(filePath);
          results.push({ fileId, success: true });
        } else {
          results.push({ fileId, success: false, error: 'File not found' });
        }
      } catch (error: any) {
        results.push({ fileId, success: false, error: error.message });
      }
    }

    return {
      success: true,
      results
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to cleanup files',
      data: error.message
    });
  }
});