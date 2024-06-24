import { Injectable } from '@nestjs/common';
import { CategoryDto } from './dto/category.dto';

import { Categories } from '@prisma/client';
import { HelpersService } from 'src/helpers/Helpers';
import { PrismaService } from 'src/prisma.service';
import { ApiResponseType, ResponseService } from 'src/response.service';
import StringUtils from 'src/utils/StringContants';
import { TravelzoakCategory } from './entities/category.entity';
import { CategoriesSeed } from './seed';

@Injectable()
export class CategoriesService {
  constructor(
    private prisma: PrismaService,
    private readonly responseService: ResponseService,
    private helperService: HelpersService,
  ) {}

  async createCategoriesFromSeed(): Promise<ApiResponseType<void>> {
    try {
      // Create a list of destinations
      const list = CategoriesSeed.map((category) => ({
        id: this.helperService.generateUniqueId(),
        ...category,
        slug: this.helperService.slugify(category.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      }));

      // Create destinations
      const categories = await this.prisma.categories.createMany({
        data: list,
        skipDuplicates: true,
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

  async addCategory(
    createCategoryDto: CategoryDto,
  ): Promise<TravelzoakCategory> {
    const category = await this.prisma.categories.create({
      data: {
        id: this.helperService.generateUniqueId(),
        ...createCategoryDto,
        slug: this.helperService.slugify(createCategoryDto.name),
        createdAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!category) {
      throw StringUtils.MESSAGE.FAILED_TO_CREATE_CATEGORY;
    }

    return this.convertPrimsaCategoryToTravelzoakCategory(category);
  }

  async getCategories(): Promise<TravelzoakCategory[]> {
    const categories = await this.prisma.categories.findMany({});

    if (categories.length === 0) {
      return [];
    }

    const results = await Promise.all(
      categories.map(async (category) => {
        return await this.convertPrimsaCategoryToTravelzoakCategory(category);
      }),
    );

    return results;
  }

  // This method is used to get a category by id
  async getCategoryById(id: string): Promise<TravelzoakCategory> {
    const category = await this.prisma.categories.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      throw StringUtils.MESSAGE.INAVLID_CATEGORY_ID;
    }

    return this.convertPrimsaCategoryToTravelzoakCategory(category);
  }

  // This method is used to update a category by id
  async updateCategoryById(
    id: string,
    updateCategoryDto: CategoryDto,
  ): Promise<TravelzoakCategory> {
    const category = await this.prisma.categories.update({
      where: {
        id,
      },
      data: {
        ...updateCategoryDto,
        slug: this.helperService.slugify(updateCategoryDto.name),
        updatedAtMillis: this.helperService.getCurrentTimestampInMilliseconds(),
      },
    });

    if (!category) {
      throw StringUtils.MESSAGE.FAILED_TO_UPDATE_CATEGORY;
    }

    return this.getCategoryById(category.id);
  }

  // This method is used to remove a category by id
  async deleteCategoryById(id: string): Promise<boolean> {
    const category = await this.prisma.categories.delete({
      where: {
        id,
      },
    });

    if (!category) {
      throw StringUtils.MESSAGE.FAILED_TO_DELETE_CATEGORY;
    }

    return true;
  }

  async convertPrimsaCategoryToTravelzoakCategory(
    category: Categories,
  ): Promise<TravelzoakCategory> {
    return {
      id: category.id,
      name: category.name,
      slug: category.slug,
    };
  }
}
