import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { MAX_PHOTO_SIZE } from '@core/core.constants';
import { BadRequestException } from '@nestjs/common';

export const isJPEGPhotoFilter = (
  req: any,
  file: Express.Multer.File,
  cb: any,
) => {
  // TODO: Check the magic number in the file instead of just relying on the file mimetype which is derived from the file extension
  const JPEG_MIME_TYPE = 'image/jpeg';
  if (file.mimetype !== JPEG_MIME_TYPE) {
    cb(new BadRequestException(`${file.fieldname} should be a JPEG image`));
  } else {
    cb(null, true);
  }
};

export const PhotoFieldInterceptor = (photoField: string) => {
  /**
   * An interceptor used for uploading many photo fields
   */
  return FileInterceptor(photoField, {
    fileFilter: isJPEGPhotoFilter,
    limits: { fileSize: MAX_PHOTO_SIZE, files: 1 },
    dest: process.env.MULTER_DEST,
  });
};
