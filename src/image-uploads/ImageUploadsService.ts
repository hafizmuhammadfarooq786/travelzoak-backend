import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import StringUtils from 'src/utils/StringUtils';

type ImageUploadResponse = {
  imageUrl: string;
  publicId: string;
};

@Injectable()
export class ImageUploadsService {
  private readonly logger = new Logger(ImageUploadsService.name);

  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  // Upload an image to Cloudinary and return the URL
  async uploadImage(
    file: string,
    parent_folder: string,
    folder: string,
  ): Promise<ImageUploadResponse> {
    const uniqueFilename = new Date().toISOString();
    const publicId = `${folder}/${uniqueFilename}`;

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        { public_id: publicId, folder: parent_folder },
        (error, result) => {
          if (error) {
            this.logger.error(error.message);
            reject(StringUtils.MESSAGE.FAILED_TO_UPLOAD_IMAGE);
          } else {
            resolve({ imageUrl: result.url, publicId: result.public_id });
          }
        },
      );
    });
  }

  // Replace an image in Cloudinary and return the URL
  async replaceImage(
    file: string,
    folder: string,
    publicId: string,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        file,
        { public_id: publicId, folder: folder, overwrite: true },
        (error, result) => {
          if (error) {
            this.logger.error(error.message);
            reject(StringUtils.MESSAGE.FAILED_TO_REPLACE_IMAGE);
          } else {
            resolve(result.url);
          }
        },
      );
    });
  }
}
