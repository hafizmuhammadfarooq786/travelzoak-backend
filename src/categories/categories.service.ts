import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import {
  ErrorApiResponse,
  ResponseService,
  SuccessApiResponse,
} from 'src/response.service';
import StringUtils from 'src/utils/StringUtils';
import { Categories } from './seed';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  // This method is used to create categories from seed data
  async createCategoriesFromSeed(): Promise<
    SuccessApiResponse | ErrorApiResponse
  > {
    try {
      // Create a list of destinations
      const list = Categories.map((category) => ({
        id: this.helperService.generateUniqueId(),
        ...category,
        slug: this.helperService.slugify(category.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      }));

      // Create destinations
      const categories = await this.prisma.categories.createMany({
        data: list,
      });

      if (!categories) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_DESTINATIONS_FROM_SEED,
        );
      }

      return this.responseService.getSuccessResponse(categories);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to create a new category
  async addCategory(
    createCategoryDto: CategoryDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const category = await this.prisma.categories.create({
        data: {
          id: this.helperService.generateUniqueId(),
          ...createCategoryDto,
          slug: this.helperService.slugify(createCategoryDto.name),
          createdAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!category) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_CREATE_CATEGORY,
        );
      }

      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to get all categories
  async getCategories(): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const categories = await this.prisma.categories.findMany({});

      if (!categories) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_GET_CATEGORIES,
        );
      }

      return this.responseService.getSuccessResponse(categories);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to get a category by id
  async getCategoryById(
    id: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const category = await this.prisma.categories.findUnique({
        where: {
          id,
        },
      });

      if (!category) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.INAVLID_CATEGORY_ID,
        );
      }

      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to update a category by id
  async updateCategoryById(
    id: string,
    updateCategoryDto: CategoryDto,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const category = await this.prisma.categories.update({
        where: {
          id,
        },
        data: {
          ...updateCategoryDto,
          slug: this.helperService.slugify(updateCategoryDto.name),
          updatedAtMillis:
            this.helperService.getCurrentTimestampInMilliseconds(),
        },
      });

      if (!category) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_UPDATE_CATEGORY,
        );
      }

      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }

  // This method is used to remove a category by id
  async removeCategoryById(
    id: string,
  ): Promise<SuccessApiResponse | ErrorApiResponse> {
    try {
      const category = await this.prisma.categories.delete({
        where: {
          id,
        },
      });

      if (!category) {
        return this.responseService.getErrorResponse(
          StringUtils.MESSAGE.FAILED_TO_DELETE_CATEGORY,
        );
      }

      return this.responseService.getSuccessResponse();
    } catch (error) {
      throw this.responseService.getErrorResponse(error);
    }
  }
}
