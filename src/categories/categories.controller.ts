import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Public } from 'src/auth/decorators';
import LoggerFactory from 'src/helpers/LoggerFactory';
import { ApiResponseType, ResponseService } from 'src/response.service';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { TravelzoakCategory } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly categoriesService: CategoriesService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  async addCategory(
    @Body() createCategoryDto: CategoryDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const category: TravelzoakCategory =
        await this.categoriesService.addCategory(createCategoryDto);
      LoggerFactory.getLogger().debug(
        `CATEGORIES: addCategory() response=${JSON.stringify(category)}`,
      );
      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CATEGORIES: addCategory() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Public()
  @Get()
  async getCategories(): Promise<ApiResponseType<void>> {
    try {
      const categories: TravelzoakCategory[] =
        await this.categoriesService.getCategories();
      LoggerFactory.getLogger().debug(
        `CATEGORIES: getAllCatogires() response=${JSON.stringify(categories)}`,
      );
      return this.responseService.getSuccessResponse(categories);
    } catch (error) {
      LoggerFactory.getLogger().error(`USERS: getAllUser() error=${error}`);
      return this.responseService.getErrorResponse(error);
    }
  }

  @Get(':id')
  async getCategoryById(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      const category: TravelzoakCategory =
        await this.categoriesService.getCategoryById(id);
      LoggerFactory.getLogger().debug(
        `CATEGORIES: getCategoryById() id=${id}, response=${JSON.stringify(category)}`,
      );
      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CATEGORIES: getCategoryById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Patch(':id')
  async updateCategoryById(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryDto,
  ): Promise<ApiResponseType<void>> {
    try {
      const category: TravelzoakCategory =
        await this.categoriesService.updateCategoryById(id, updateCategoryDto);
      LoggerFactory.getLogger().debug(
        `CATEGORIES: updateCategoryById() id=${id}, response=${JSON.stringify(category)}`,
      );
      return this.responseService.getSuccessResponse(category);
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CATEGORIES: updateCategoryById() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }

  @Delete(':id')
  async deleteCategory(
    @Param('id') id: string,
  ): Promise<ApiResponseType<void>> {
    try {
      await this.categoriesService.deleteCategoryById(id);
      return this.responseService.getSuccessResponse();
    } catch (error) {
      LoggerFactory.getLogger().error(
        `CATEGORIES: deleteCategory() error=${error}`,
      );
      return this.responseService.getErrorResponse(error);
    }
  }
}
