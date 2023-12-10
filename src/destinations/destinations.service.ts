import { Injectable } from '@nestjs/common';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import Constants from 'src/utils/Constants';
import StringUtils from 'src/utils/StringUtils';
import { CreateDestinationDto } from './dto/create-destination.dto';
import { UpdateDestinationDto } from './dto/update-destination.dto';
import { DestinationsList } from './seed';

@Injectable()
export class DestinationsService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  // This method is used to create destinations from seed data
  async createDestinationsFromSeed(): Promise<
    SuccessApiResponse | ErrorApiResponse
  > {
    try {
      // Create a list of destinations
      const list = DestinationsList.map((destination) => ({
        ...destination,
        slug: this.helperService.slugify(destination.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      }));

      // Create destinations
      const destinations = await this.prisma.destinations.createMany({
        data: list,
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

  // This method is used to create a new destination
  async addNewDestination(
    createDestinationDto: CreateDestinationDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const destination = await this.prisma.destinations.create({
        data: {
          ...createDestinationDto,
          slug: this.helperService.slugify(createDestinationDto.name),
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_DESTINATIONS,
      });

      if (!destination) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_DESTINATION,
        );
      }

      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to get all destinations
  async getDestinations(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const destinations = await this.prisma.destinations.findMany({
        select: Constants.SELECT_KEYS_FOR_DESTINATIONS,
      });

      if (!destinations) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_DESTINATIONS,
        );
      }

      return this.responseService.getSuccessResponse(destinations);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to get a destination by id
  async getDestinationById(
    id: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const destination = await this.prisma.destinations.findUnique({
        where: {
          id,
        },
        select: Constants.SELECT_KEYS_FOR_DESTINATIONS,
      });

      if (!destination) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INAVLID_DESTINATION_ID,
        );
      }

      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to update a destination by id
  async updateDestinationById(
    id: string,
    updateDestinationDto: UpdateDestinationDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const destination = await this.prisma.destinations.update({
        where: {
          id,
        },
        data: {
          ...updateDestinationDto,
          slug: this.helperService.slugify(updateDestinationDto.name),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
        select: Constants.SELECT_KEYS_FOR_DESTINATIONS,
      });

      if (!destination) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_DESTINATION,
        );
      }

      return this.responseService.getSuccessResponse(destination);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to remove a destination by id
  async removeDestinationById(
    id: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const destination = await this.prisma.destinations.delete({
        where: {
          id,
        },
      });

      if (!destination) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_DELETE_DESTINATION,
        );
      }

      return this.responseService.getSuccessResponse();
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }
}
