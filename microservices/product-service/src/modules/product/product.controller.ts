import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddReviewDto } from './dto/add-review.dto';
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @MessagePattern('create_product')
  create(@Payload() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }
  @MessagePattern('find_all_products')
  findAll(@Payload() query: any) {
    return this.productService.findAll(query);
  }
  @MessagePattern('find_one_product')
  findOne(@Payload('id') id: string) {
    return this.productService.findOne(id);
  }
  @MessagePattern('update_product')
  update(@Payload() data: { id: string; dto: UpdateProductDto }) {
    return this.productService.update(data.id, data.dto);
  }
  @MessagePattern('remove_product')
  remove(@Payload('id') id: string) {
    return this.productService.remove(id);
  }
  @MessagePattern('add_review')
  addReview(@Payload() data: { id: string; dto: AddReviewDto }) {
    return this.productService.addReview(data.id, data.dto);
  }
  @MessagePattern('update_stock')
  updateStock(@Payload() data: { id: string; quantity: number }) {
    return this.productService.updateStock(data.id, data.quantity);
  }
  @MessagePattern('increment_views')
  incrementViews(@Payload('id') id: string) {
    return this.productService.incrementViews(id);
  }
  @MessagePattern('get_featured_products')
  getFeatured(@Payload('limit') limit: number) {
    return this.productService.getFeatured(limit || 10);
  }
  @MessagePattern('get_popular_products')
  getPopular(@Payload('limit') limit: number) {
    return this.productService.getPopular(limit || 10);
  }
}
