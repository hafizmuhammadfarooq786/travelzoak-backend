import { Injectable } from '@nestjs/common';
import { TripPhotos } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import { TripsService } from 'src/trips/trips.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringContants';
import { CreateTripPhotoDto } from './dto/create-trip-photo.dto';
import { UpdateTripPhotoDto } from './dto/update-trip-photo.dto';
import { Photos, TripPhoto } from './entities/trip-photo.entity';

@Injectable()
export class TripPhotosService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
    private tripService: TripsService,
  ) {}

  async addTripPhotos(
    tripId: string,
    createTripPhotosDto: CreateTripPhotoDto,
  ): Promise<TripPhoto> {
    const tripDetails = await this.tripService.getTripById(tripId);
    const photos: Photos[] = await Promise.all(
      createTripPhotosDto.photos.map(async (photo) => {
        return await this.imageUploadsService.uploadImage(
          photo,
          Constants.TRIPS_PHOTOS_FOLDER_NAME,
          tripDetails.slug,
        );
      }),
    );

    if (!photos) {
      throw StringUtils.MESSAGE.FAILED_TO_UPLOAD_TRIP_PHOTOS;
    }

    const tripPhotosUploaded = await Promise.all(
      photos.map(
        async (photo: Photos) =>
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
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_TRIP_PHOTOS;
    }

    return this.convertPrismaTripPhotosToTripPhotos(tripPhotosUploaded);
  }

  async getTripPhotosByTripId(tripId: string): Promise<TripPhoto> {
    const tripPhotos = await this.findTripPhotosByTripId(tripId);

    if (tripPhotos) {
      return null;
    }

    return tripPhotos;
  }

  // Update trip photo by trip id and public id
  async updateTripPhotoByTripIdAndPublicId(
    tripId: string,
    publicId: string,
    updateTripPhotosDto: UpdateTripPhotoDto,
  ): Promise<TripPhoto> {
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
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!updatedTripPhotos) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP_PHOTOS;
    }

    return this.findTripPhotosByTripId(tripId);
  }
  async deleteTripPhotosByTripId(tripId: string): Promise<boolean> {
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

    return true;
  }

  async deleteTripPhotoByTripIdAndPublicId(
    tripId: string,
    publicIds: string[],
  ): Promise<boolean> {
    publicIds.forEach(async (publicId) => {
      const isDeleted = await this.prisma.tripPhotos.delete({
        where: {
          tripId,
          cloudinaryPublicId: publicId,
        },
      });

      await this.imageUploadsService.deleteImage(publicId);

      if (!isDeleted) {
        throw StringUtils.MESSAGE.FAILED_TO_DELETE_TRIP_PHOTOS;
      }
      return isDeleted;
    });

    return true;
  }

  // Find trip photos by trip id
  async findTripPhotosByTripId(tripId: string) {
    const tripPhotos = await this.prisma.tripPhotos.findMany({
      where: { tripId },
    });

    return this.convertPrismaTripPhotosToTripPhotos(tripPhotos);
  }

  async convertPrismaTripPhotosToTripPhotos(
    tripPhotos: TripPhotos[],
  ): Promise<TripPhoto> {
    const photos = tripPhotos.map((item) => {
      return {
        id: item.id,
        imageUrl: item.photoUrl,
        publicId: item.cloudinaryPublicId,
      };
    });

    return {
      tripId: tripPhotos[0].tripId,
      photos,
    };
  }
}
