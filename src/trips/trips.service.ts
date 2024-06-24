import { Injectable } from '@nestjs/common';
import { Trips } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { ImageUploadsService } from 'src/image-uploads/ImageUploadsService';
import { PrismaService } from 'src/prisma.service';
import { ResponseService } from 'src/response.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringContants';
import { convertBigIntToNumber } from 'src/utils/WoiUtils';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripCoverDto } from './dto/update-trip-cover.dto';
import { UpdateTripThumbnailDto } from './dto/update-trip-thumbnail.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TravelzoakTrip } from './entities/trip.entity';

@Injectable()
export class TripsService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
    private imageUploadsService: ImageUploadsService,
  ) {}

  // Add new trip
  async addTrip(createTripDto: CreateTripDto): Promise<TravelzoakTrip> {
    const slug = this.helperService.slugify(createTripDto.title);

    // Upload cover photo
    const uploadCoverPhotoResponse = await this.imageUploadsService.uploadImage(
      createTripDto.coverPhoto,
      Constants.TRIPS_FOLDER_NAME,
      slug,
    );

    const uploadThumbnailPhotoResponse =
      await this.imageUploadsService.uploadImage(
        createTripDto.thumbnailPhoto,
        Constants.TRIPS_FOLDER_NAME,
        slug,
      );

    const trip: Trips = await this.prisma.trips.create({
      data: {
        id: this.helperService.generateUniqueId(),
        title: createTripDto.title,
        slug,
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
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!trip) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_TRIP;
    }

    return await this.convertPrimsaTripToTravelzoakTrip(trip);
  }

  // Get all trips
  async getTrips(): Promise<TravelzoakTrip[]> {
    const trips = await this.prisma.trips.findMany({});
    if (trips.length === 0) {
      return [];
    }

    const results = await Promise.all(
      trips.map(async (trip) => {
        return await this.convertPrimsaTripToTravelzoakTrip(trip);
      }),
    );

    return results;
  }

  // Get trip details by id
  async getTripById(tripId: string): Promise<TravelzoakTrip> {
    const trip: Trips = await this.prisma.trips.findUnique({
      where: {
        id: tripId,
      },
    });

    if (!trip) {
      throw StringUtils.MESSAGE.INAVLID_TRIP_ID;
    }

    return this.convertPrimsaTripToTravelzoakTrip(trip);
  }

  // Update trip details
  async updateTripById(
    tripId: string,
    updateTripDto: UpdateTripDto,
  ): Promise<TravelzoakTrip> {
    if (updateTripDto.title) {
      updateTripDto['slug'] = this.helperService.slugify(updateTripDto.title);
    }
    const trip: Trips = await this.prisma.trips.update({
      where: {
        id: tripId,
      },
      data: {
        ...updateTripDto,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!trip) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP;
    }

    return this.convertPrimsaTripToTravelzoakTrip(trip);
  }

  // Update trip cover
  async updateTripCover(
    tripId: string,
    updateTripCoverDto: UpdateTripCoverDto,
  ): Promise<TravelzoakTrip> {
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
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP;
    }

    return this.getTripById(trip.id);
  }

  // Update trip thumbnail
  async updateTripThumbnail(
    tripId: string,
    updateTripThumbnailDto: UpdateTripThumbnailDto,
  ): Promise<TravelzoakTrip> {
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
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_TRIP;
    }

    return this.getTripById(trip.id);
  }

  // Archive trip by id
  async deleteTripById(tripId: string): Promise<boolean> {
    const trip = await this.prisma.trips.update({
      where: {
        id: tripId,
      },
      data: {
        isArchived: true,
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!trip) {
      throw StringUtils.MESSAGE.FAILED_TO_ARCHIVE_TRIP;
    }

    return true;
  }

  async convertPrimsaTripToTravelzoakTrip(
    trip: Trips,
  ): Promise<TravelzoakTrip> {
    return {
      ...trip,
      createdAtMillis: convertBigIntToNumber(trip.createdAtMillis),
      updatedAtMillis: convertBigIntToNumber(trip.updatedAtMillis),
    };
  }
}
