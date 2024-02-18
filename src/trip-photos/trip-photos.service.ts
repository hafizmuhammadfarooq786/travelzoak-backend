import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import { TripsService } from 'src/trips/trips.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringUtils';
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';
import { Photos } from './entities/trip-photo.entity';
import { tripPhotos } from './seed';

@Injectable()
export class TripPhotosService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
    private tripService: TripsService,
  ) {}

  // Create trip photos from seed data
  async createTripPhotosFromSeed(): Promise<
    SuccessApiResponse | ErrorApiResponse
  > {
    try {
      const list = tripPhotos.map(async (tripPhoto) => {
        const photos = await this.uploadSeedImages(
          tripPhoto.tripId,
          tripPhoto.photos,
        );

        if (!photos) {
          throw StringUtils.MESSAGE.FAILED_TO_UPLOAD_TRIP_PHOTOS;
        }

        for (const photo of photos) {
          return {
            id: this.helperService.generateUniqueId(),
            tripId: tripPhoto.tripId,
            photoUrl: photo.imageUrl,
            cloudinaryPublicId: photo.publicId,
            createdAtMillis:
              this.helperService.getCurrentTimestampInMilliseconds(),
            updatedAtMillis:
              this.helperService.getCurrentTimestampInMilliseconds(),
          };
        }
      });

      // Create destinations
      const partners = await this.prisma.tripPhotos.createMany({
        data: await Promise.all(list),
      });

      if (!partners) {
        throw StringUtils.MESSAGE.FAILED_TO_CREATE_TRIPS_PHOTOS_FROM_SEED;
      }

      return this.responseService.getSuccessResponse(partners);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Add trip photos
  async addTripPhotos(
    tripId: string,
    createTripPhotosDto: CreateTripPhotoDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripDetails = await this.tripService.getTripById(tripId);

      // Upload images to cloudinary
      const tripPhotos: Photos[] = await Promise.all(
        createTripPhotosDto.photos.map(async (photo) => {
          return await this.imageUploadsService.uploadImage(
            photo,
            Constants.TRIPS_PHOTOS_FOLDER_NAME,
            tripDetails.slug,
          );
        }),
      );

      if (!tripPhotos) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPLOAD_TRIP_PHOTOS,
        );
      }

      const tripPhotosUploaded = await Promise.all(
        tripPhotos.map(
          async (photo) =>
            await this.prisma.tripPhotos.create({
              data: {
                id: this.helperService.generateUniqueId(),
                tripId: tripId,
                photoUrl: photo.imageUrl,
                cloudinaryPublicId: photo.publicId,
                createdAtMillis:
                  this.helperService.getCurrentTimestampInMilliseconds(),
                updatedAtMillis:
                  this.helperService.getCurrentTimestampInMilliseconds(),
              },
            }),
        ),
      );

      if (!tripPhotosUploaded) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_TRIP_PHOTOS,
        );
      }

      return this.responseService.getSuccessResponse(tripPhotosUploaded);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Get trip photos by trip id
  async getTripPhotosByTripId(
    tripId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripPhotos = await this.findTripPhotosByTripId(tripId);

      if (!tripPhotos) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_TRIP_PHOTOS,
        );
      }
      return this.responseService.getSuccessResponse(tripPhotos);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Update trip photo by trip id and public id
  async updateTripPhotoByTripIdAndPublicId(
    tripId: string,
    publicId: string,
    updateTripPhotosDto: UpdateTripPhotoDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripPhoto: string = await this.imageUploadsService.replaceImage(
        publicId,
        Constants.TRIPS_PHOTOS_FOLDER_NAME,
        updateTripPhotosDto.image,
      );

      if (!tripPhoto) {
        throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP_PHOTOS;
      }

      const updatedTripPhotos = await this.prisma.tripPhotos.update({
        where: {
          tripId,
        },
        data: {
          photoUrl: tripPhoto,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!updatedTripPhotos) {
        throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP_PHOTOS;
      }

      return this.responseService.getSuccessResponse(updatedTripPhotos);
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Delete trip photo by trip id
  async deleteTripPhotosByTripId(
    tripId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripPhotos = await this.findTripPhotosByTripId(tripId);

      if (!tripPhotos) {
        throw StringUtils.MESSAGE.FAILED_TO_GET_TRIP_PHOTOS;
      }

      const deletedTripPhotos = await this.prisma.tripPhotos.deleteMany({
        where: {
          tripId,
        },
      });

      if (!deletedTripPhotos) {
        throw StringUtils.MESSAGE.FAILED_TO_DELETE_TRIP_PHOTOS;
      }

      return this.responseService.getSuccessResponse();
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Delete trip photo by trip id and public id
  async deleteTripPhotoByTripIdAndPublicId(
    tripId: string,
    publicId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripPhoto = await this.prisma.tripPhotos.delete({
        where: {
          tripId,
          cloudinaryPublicId: publicId,
        },
      });

      if (!tripPhoto) {
        throw StringUtils.MESSAGE.FAILED_TO_DELETE_TRIP_PHOTOS;
      }

      return this.responseService.getSuccessResponse();
    } catch (error) {
      return this.responseService.getErrorResponse(error);
    }
  }

  // Find trip photos by trip id
  async findTripPhotosByTripId(tripId: string) {
    return await this.prisma.tripPhotos.findMany({
      where: { tripId },
    });
  }

  // Upload seed images
  async uploadSeedImages(tripId: string, photos: string[]) {
    const tripDetails = await this.tripService.getTripById(tripId);
    const uploadedPhotos = photos.map(async (photo) => {
      return await this.imageUploadsService.uploadImage(
        photo,
        Constants.TRIPS_PHOTOS_FOLDER_NAME,
        tripDetails.slug,
      );
    });

    return await Promise.all(uploadedPhotos);
  }
}
