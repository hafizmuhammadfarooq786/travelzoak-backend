import { Injectable } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { DestinationsService } from './destinations/destinations.service';
import { PartnersService } from './partners/partners.service';
import { ErrorApiResponse, SuccessApiResponse } from './response.service';
import { TripPhotosService } from './trip-photos/trip-photos.service';
import { TripsService } from './trips/trips.service';
import { UserRolesService } from './user-roles/user-roles.service';

@Injectable()
export class AppService {
  // create constructor to pass in all modules with seed creation
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly categoriesService: CategoriesService,
    private readonly destinationsService: DestinationsService,
    private readonly partnersService: PartnersService,
    private readonly tripsService: TripsService,
    private readonly tripPhotosService: TripPhotosService,
  ) {}

  getHello(): string {
    return 'Sprout Backend';
  }

  /**
   * Create all seed data
   * @returns response message
   */
  async createAllSeeds(): Promise<string> {
    const responses: {
      [serviceName: string]: SuccessApiResponse | ErrorApiResponse;
    } = {};

    responses['userRolesService'] =
      await this.userRolesService.createUserRolesFromSeed();
    responses['categoriesService'] =
      await this.categoriesService.createCategoriesFromSeed();
    responses['destinationsService'] =
      await this.destinationsService.createDestinationsFromSeed();
    responses['partnersService'] =
      await this.partnersService.createPartnersFromSeed();
    responses['tripsService'] = await this.tripsService.createTripsFromSeed();
    responses['tripPhotosService'] =
      await this.tripPhotosService.createTripPhotosFromSeed();

    // run through each response
    const result = {};

    // for each response
    let response: SuccessApiResponse | ErrorApiResponse;
    for (const serviceName of Object.keys(responses)) {
      response = responses[serviceName];
      result[serviceName] = this.validateResponse(response);
    }

    return JSON.stringify(result);
  }

  /**
   * Validate the response
   * @param response Validate each response
   * @returns response message
   */
  validateResponse(response: SuccessApiResponse | ErrorApiResponse): string {
    return response.message;
  }
}
