import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCategoryDto: CreateCategoryDto) {
    const { name, slug } = createCategoryDto;
    const existingByName = await this.prisma.category.findUnique({
      where: { name },
    });
    if (existingByName) {
      throw new ConflictException('Ya existe una categoría con ese nombre');
    }
    const existingBySlug = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (existingBySlug) {
      throw new ConflictException('Ya existe una categoría con ese slug');
    }
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }
  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    active?: boolean,
  ) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (active !== undefined) {
      where.isActive = active;
    }
    const [data, total] = await Promise.all([
      this.prisma.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count({ where }),
    ]);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }
  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const { name, slug } = updateCategoryDto;
    if (name) {
      const existingByName = await this.prisma.category.findUnique({
        where: { name },
      });
      if (existingByName && existingByName.id !== id) {
        throw new ConflictException('Ya existe una categoría con ese nombre');
      }
    }
    if (slug) {
      const existingBySlug = await this.prisma.category.findUnique({
        where: { slug },
      });
      if (existingBySlug && existingBySlug.id !== id) {
        throw new ConflictException('Ya existe una categoría con ese slug');
      }
    }
    const updatedCategory = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    if (!updatedCategory) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return updatedCategory;
  }
  async remove(id: string) {
    const category = await this.findOne(id);
    await this.prisma.category.delete({
      where: { id: category.id },
    });
    return { message: 'Categoría eliminada correctamente' };
  }
  async activate(id: string) {
    const category = await this.prisma.category.update({
      where: { id },
      data: { isActive: true },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }
  async deactivate(id: string) {
    const category = await this.prisma.category.update({
      where: { id },
      data: { isActive: false },
    });
    if (!category) {
      throw new NotFoundException('Categoría no encontrada');
    }
    return category;
  }
}
