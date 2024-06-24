import { Injectable } from '@nestjs/common';
import { Destinations } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ApiResponseType, ResponseService } from 'src/response.service';
import StringUtils from 'src/utils/StringContants';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { Destination } from './entities/destination.entity';
import { DestinationsList } from './seed';

@Injectable()
export class DestinationsService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  async createDestinationsFromSeed(): Promise<ApiResponseType<void>> {
    try {
      // Create a list of destinations
      const list = DestinationsList.map((destination) => ({
        id: this.helperService.generateUniqueId(),
        ...destination,
        slug: this.helperService.slugify(destination.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      }));

      // Create destinations
      const destinations = await this.prisma.destinations.createMany({
        data: list,
        skipDuplicates: true,
      });

      if (!destinations) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_DESTINATIONS_FROM_SEED,
        );
      }

      return this.responseService.getSuccessResponse(destinations);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  async addDestination(
    createDestinationDto: CreateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.prisma.destinations.create({
      data: {
        id: this.helperService.generateUniqueId(),
        ...createDestinationDto,
        slug: this.helperService.slugify(createDestinationDto.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!destination) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_DESTINATION;
    }

    return this.convertPrimsaDestinationsToDestinations(destination);
  }

  async getDestinations(): Promise<Destination[]> {
    const destinations = await this.prisma.destinations.findMany({});

    if (destinations.length === 0) {
      return [];
    }

    const results = await Promise.all(
      destinations.map(async (destination) => {
        return await this.convertPrimsaDestinationsToDestinations(destination);
      }),
    );

    return results;
  }

  // This method is used to get a destination by id
  async getDestinationById(id: string): Promise<Destination> {
    const destination = await this.prisma.destinations.findUnique({
      where: {
        id,
      },
    });

    if (!destination) {
      throw StringUtils.MESSAGE.INAVLID_DESTINATION_ID;
    }

    return this.convertPrimsaDestinationsToDestinations(destination);
  }

  // This method is used to update a destination by id
  async updateDestinationById(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<Destination> {
    const destination = await this.prisma.destinations.update({
      where: {
        id,
      },
      data: {
        ...updateDestinationDto,
        slug: this.helperService.slugify(updateDestinationDto.name),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!destination) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_DESTINATION;
    }

    return this.getDestinationById(destination.id);
  }

  // This method is used to remove a destination by id
  async deleteDestinationById(id: string): Promise<boolean> {
    const destination = await this.prisma.destinations.delete({
      where: {
        id,
      },
    });

    if (!destination) {
      throw StringUtils.MESSAGE.FAILED_TO_DELETE_DESTINATION;
    }

    return true;
  }

  async convertPrimsaDestinationsToDestinations(
    destination: Destinations,
  ): Promise<Destination> {
    return {
      id: destination.id,
      name: destination.name,
      coverPhotoUrl: destination.coverPhotoUrl,
      backgroundUrl: destination.backgroundUrl,
      thumbnailUrl: destination.thumbnailUrl,
      latitude: destination.latitude,
      longitude: destination.longitude,
      description: destination.description,
    };
  }
}
