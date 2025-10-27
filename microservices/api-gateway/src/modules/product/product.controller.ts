import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @Get()
  async findAll(@Query() query: any) {
    return await this.productService.findAll(query);
  }
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.productService.findOne(id);
  }
  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createProductDto: any) {
    return await this.productService.create(createProductDto);
  }
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: any,
  ) {
    return await this.productService.update(id, updateProductDto);
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.productService.remove(id);
    return { message: 'Producto eliminado correctamente' };
  }
  @Get('category/:category')
  async findByCategory(
    @Param('category') category: string,
    @Query() query: any,
  ) {
    return await this.productService.findByCategory(category, query);
  }
  @Post(':id/reviews')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async addReview(@Param('id') id: string, @Body() reviewDto: any) {
    return await this.productService.addReview(id, reviewDto);
  }
}
