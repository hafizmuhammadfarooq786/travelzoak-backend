import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post('/seed')
  createManyCategories() {
    return this.categoriesService.createManyCategoriesFromSeed();
  }

  @Post()
  createCategory(@Body() createCategoryDto: CategoryDto) {
    return this.categoriesService.addCategory(createCategoryDto);
  }

  @Get()
  async getAllCatogires() {
    return await this.categoriesService.getCategories();
  }

  @Get(':id')
  async getCategoryById(@Param('id') id: string) {
    return await this.categoriesService.getCategoryById(id);
  }

  @Patch(':id')
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: CategoryDto,
  ) {
    return await this.categoriesService.updateCategoryById(
      id,
      updateCategoryDto,
    );
  }

  @Delete(':id')
  async deleteCategory(@Param('id') id: string) {
    return await this.categoriesService.removeCategoryById(id);
  }
}
