import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringUtils';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripCoverDto } from './dto/update-trip-cover.dto';
import { UpdateTripThumbnailDto } from './dto/update-trip-thumbnail.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { trips } from './seed';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
  ) {}

  // Create trips from seed data
  async createTripsFromSeed(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      // Create a list of destinations
      const list = trips.map((trip) => ({
        id: this.helperService.generateUniqueId(),
        ...trip,
        slug: this.helperService.slugify(trip.title),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      }));

      // Create destinations
      const partners = await this.prisma.trips.createMany({
        data: list,
      });

      if (!partners) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_TRIPS_FROM_SEED,
        );
      }

      return this.responseService.getSuccessResponse(partners);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Add new trip
  async addTrip(
    createTripDto: CreateTripDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const tripTitleSlug = this.helperService.slugify(createTripDto.title);

      // Upload cover photo
      const uploadCoverPhotoResponse =
        await this.imageUploadsService.uploadImage(
          createTripDto.coverPhoto,
          Constants.TRIPS_FOLDER_NAME,
          tripTitleSlug,
        );

      const uploadThumbnailPhotoResponse =
        await this.imageUploadsService.uploadImage(
          createTripDto.thumbnailPhoto,
          Constants.TRIPS_FOLDER_NAME,
          tripTitleSlug,
        );

      const trip = await this.prisma.trips.create({
        data: {
          id: this.helperService.generateUniqueId(),
          title: createTripDto.title,
          slug: tripTitleSlug,
          description: createTripDto.description,
          startDate: createTripDto.startDate,
          endDate: createTripDto.endDate,
          startDesitination: createTripDto.startDesitination,
          endDestination: createTripDto.endDestination,
          totalDays: createTripDto.totalDays,
          totalSeats: createTripDto.totalSeats,
          bookedSeats: createTripDto.bookedSeats,
          perPersonCharges: createTripDto.perPersonCharges,
          coupleCharges: createTripDto.coupleCharges,
          familyCharges: createTripDto.familyCharges,
          advancePayment: createTripDto.advancePayment,
          roomSharing: createTripDto.roomSharing,
          coverPhotoUrl: uploadCoverPhotoResponse.imageUrl,
          thumbnailUrl: uploadThumbnailPhotoResponse.imageUrl,
          cloudinaryCoverPublicId: uploadCoverPhotoResponse.publicId,
          cloudinaryThumbnailPublicId: uploadThumbnailPhotoResponse.publicId,
          placesIncluded: createTripDto.placesIncluded,
          servicesIncluded: createTripDto.servicesIncluded,
          servicesExcluded: createTripDto.servicesExcluded,
          isArchived: false,
          partnerId: createTripDto.partnerId,
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_TRIP,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get all trips
  async getTrips(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const trips = await this.prisma.trips.findMany({});

      if (!trips) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_TRIPS,
        );
      }

      return this.responseService.getSuccessResponse(trips);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Get trip details by id
  async getTripDetailsById(
    tripId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const trip = await this.getTripById(tripId);

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INAVLID_TRIP_ID,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update trip details
  async updateTripDetailsById(
    tripId: string,
    updateTripDto: UpdateTripDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      if (updateTripDto.title) {
        updateTripDto['slug'] = this.helperService.slugify(updateTripDto.title);
      }

      const trip = await this.prisma.trips.update({
        where: {
          id: tripId,
        },
        data: {
          ...updateTripDto,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update trip cover
  async updateTripCover(
    tripId: string,
    updateTripCoverDto: UpdateTripCoverDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const updatedData = {
        coverPhotoUrl: '',
        cloudinaryCoverPublicId: '',
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      };

      // Upload cover photo if new
      if (updateTripCoverDto.new) {
        const logoImageResponse = await this.imageUploadsService.uploadImage(
          updateTripCoverDto.coverImage,
          Constants.TRIPS_FOLDER_NAME,
          updateTripCoverDto.slug,
        );
        updatedData.coverPhotoUrl = logoImageResponse.imageUrl;
        updatedData.cloudinaryCoverPublicId = logoImageResponse.publicId;
      } else {
        const imageUrl = await this.imageUploadsService.replaceImage(
          updateTripCoverDto.coverImage,
          Constants.TRIPS_FOLDER_NAME,
          updateTripCoverDto.cloudinaryCoverPublicId,
        );
        updatedData.coverPhotoUrl = imageUrl;
        updatedData.cloudinaryCoverPublicId =
          updateTripCoverDto.cloudinaryCoverPublicId;
      }

      const trip = await this.prisma.partners.update({
        where: { id: tripId },
        data: updatedData,
      });

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Update trip thumbnail
  async updateTripThumbnail(
    tripId: string,
    updateTripThumbnailDto: UpdateTripThumbnailDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const updatedData = {
        thumbnailUrl: '',
        cloudinaryThumbnailPublicId: '',
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      };

      if (updateTripThumbnailDto.new) {
        const logoImageResponse = await this.imageUploadsService.uploadImage(
          updateTripThumbnailDto.thumbnailImage,
          Constants.TRIPS_FOLDER_NAME,
          updateTripThumbnailDto.slug,
        );
        updatedData.thumbnailUrl = logoImageResponse.imageUrl;
        updatedData.cloudinaryThumbnailPublicId = logoImageResponse.publicId;
      } else {
        const imageUrl = await this.imageUploadsService.replaceImage(
          updateTripThumbnailDto.thumbnailImage,
          Constants.TRIPS_FOLDER_NAME,
          updateTripThumbnailDto.cloudinaryThumbnailPublicId,
        );
        updatedData.thumbnailUrl = imageUrl;
        updatedData.cloudinaryThumbnailPublicId =
          updateTripThumbnailDto.cloudinaryThumbnailPublicId;
      }

      const trip = await this.prisma.trips.update({
        where: { id: tripId },
        data: updatedData,
      });

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // Archive trip by id
  async deleteTripById(
    tripId: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const trip = await this.prisma.trips.update({
        where: {
          id: tripId,
        },
        data: {
          isArchived: true,
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!trip) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_ARCHIVE_TRIP,
        );
      }

      return this.responseService.getSuccessResponse(trip);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  async getTripById(tripId: string) {
    const trip = await this.prisma.trips.findUnique({
      where: {
        id: tripId,
      },
    });
    return trip;
  }
}
