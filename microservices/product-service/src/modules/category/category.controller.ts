import { Controller } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';
@Controller()
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}
  @MessagePattern('create_category')
  create(@Payload() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }
  @MessagePattern('find_all_categories')
  findAll(
    @Payload()
    data: {
      page?: number;
      limit?: number;
      search?: string;
      active?: boolean;
    },
  ) {
    const { page = 1, limit = 10, search, active } = data;
    return this.categoryService.findAll(page, limit, search, active);
  }
  @MessagePattern('find_one_category')
  findOne(@Payload() id: string) {
    return this.categoryService.findOne(id);
  }
  @MessagePattern('find_category_by_slug')
  findBySlug(@Payload() slug: string) {
    return this.categoryService.findBySlug(slug);
  }
  @MessagePattern('update_category')
  update(
    @Payload()
    data: { id: string; updateCategoryDto: UpdateCategoryDto },
  ) {
    return this.categoryService.update(data.id, data.updateCategoryDto);
  }
  @MessagePattern('remove_category')
  remove(@Payload() id: string) {
    return this.categoryService.remove(id);
  }
  @MessagePattern('activate_category')
  activate(@Payload() id: string) {
    return this.categoryService.activate(id);
  }
  @MessagePattern('deactivate_category')
  deactivate(@Payload() id: string) {
    return this.categoryService.deactivate(id);
  }
}
