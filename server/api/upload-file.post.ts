import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event);
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file provided'
      });
    }

    const file = formData[0];
    if (!file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      });
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'uploads', 'temp');
    await mkdir(uploadsDir, { recursive: true });

    // Clean up any existing files for this user session
    await cleanupExistingFiles(uploadsDir);

    // Generate unique filename
    const fileId = randomUUID();
    const fileExtension = file.filename.split('.').pop();
    const fileName = `${fileId}.${fileExtension}`;
    const filePath = join(uploadsDir, fileName);

    // Save file to disk
    await writeFile(filePath, file.data);

    // Return file ID and metadata
    return {
      success: true,
      fileId,
      fileName: file.filename,
      contentType: file.type || 'application/octet-stream',
      size: file.data.length
    };

  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload file',
      data: error.message
    });
  }
});

// Helper function to clean up existing files
async function cleanupExistingFiles(uploadsDir: string) {
  try {
    const fs = await import('fs/promises');
    const files = await fs.readdir(uploadsDir);
    
    // Delete all existing files in the temp directory
    for (const file of files) {
      const filePath = join(uploadsDir, file);
      await fs.unlink(filePath);
    }
  } catch (error) {
    // Ignore cleanup errors - not critical
  }
}