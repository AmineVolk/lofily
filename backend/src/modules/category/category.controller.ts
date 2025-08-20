import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  ConflictException,
  UseInterceptors,
  Inject,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { DEFAULT_PAGINATION_LIMIT } from 'src/constants/constants';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { GetAllCategoryDto } from './dto/get-all-category.dto';
import { GetOneBackgroundDto } from '../background/dto/get-one-background.dto';
import { GetOneCategoryDto } from './dto/get-one-category.dto';
import { RequestInterceptor } from 'src/interceptor/request.interceptor';
import { REQUEST } from '@nestjs/core';
import { RequestModel } from 'src/overrid/request';
import { UpdateCategoryOrderDto } from './dto/update-category-order.dto';

@Controller('category')
@UseInterceptors(RequestInterceptor)
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    @Inject(REQUEST) private request: RequestModel,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryService.finOneByName(
      createCategoryDto.name,
    );

    if (category) {
      throw new ConflictException('category name already exists');
    }
    const createdCategory = await this.categoryService.create(
      createCategoryDto,
    );

    return {
      ...createdCategory,
      nbr_backgrounds: 0,
    };
  }

  @Get()
  findAll(): Promise<GetOneCategoryDto[]> {
    return this.categoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Get(':id/backgrounds')
  findBackgrounds(@Param('id') id: string) {
    return this.categoryService.findBackgrounds(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/order')
  updateOrder(@Body() updateCategoryOrderDto: UpdateCategoryOrderDto) {
    return this.categoryService.updateCategoriesOrder(updateCategoryOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
