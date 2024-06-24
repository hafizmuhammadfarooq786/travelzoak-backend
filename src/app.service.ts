import { Injectable } from '@nestjs/common';
import { CategoriesService } from './categories/categories.service';
import { DestinationsService } from './destinations/destinations.service';
import LoggerFactory from './helpers/LoggerFactory';
import { ApiResponseType } from './response.service';
import { UserRolesService } from './user-roles/user-roles.service';

@Injectable()
export class AppService {
  // create constructor to pass in all modules with seed creation
  constructor(
    private readonly userRolesService: UserRolesService,
    private readonly categoriesService: CategoriesService,
    private readonly destinationsService: DestinationsService,
  ) {}

  helloBackend(): string {
    return 'Travelzoak Backend is running';
  }

  /**
   * Create all seed data
   * @returns response message
   */
  async createAllSeeds(): Promise<string> {
    const responses: {
      [serviceName: string]: ApiResponseType<any>;
    } = {};

    responses['userRoles'] =
      await this.userRolesService.createUserRolesFromSeed();
    responses['categories'] =
      await this.categoriesService.createCategoriesFromSeed();
    responses['destinations'] =
      await this.destinationsService.createDestinationsFromSeed();

    // run through each response
    const result = {};

    // for each response
    let response: ApiResponseType<any>;
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
  validateResponse<T>(response: ApiResponseType<T>): string {
    if (response.code < 200 || response.code >= 300) {
      LoggerFactory.getLogger().error(
        `validateResponse() error=${JSON.stringify(response)}`,
      );
    }
    return response.message;
  }
}
