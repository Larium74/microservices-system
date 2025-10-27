import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma-service/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AddReviewDto } from './dto/add-review.dto';
import { CategoryService } from '../category/category.service';
interface FindAllOptions {
  page: number;
  limit: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  featured?: boolean;
  active?: boolean;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}
@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private categoryService: CategoryService,
  ) {}
  async create(createProductDto: CreateProductDto) {
    const existingSku = await this.prisma.product.findUnique({
      where: { sku: createProductDto.sku },
    });
    if (existingSku) {
      throw new ConflictException('Ya existe un producto con ese SKU');
    }
    await this.categoryService.findOne(createProductDto.categoryId);
    return await this.prisma.product.create({
      data: {
        ...createProductDto,
        categoryId: createProductDto.categoryId,
      },
    });
  }
  async findAll(options: FindAllOptions) {
    const {
      page,
      limit,
      search,
      category,
      minPrice,
      maxPrice,
      featured,
      active,
      sortBy,
      sortOrder,
    } = options;
    const skip = (page - 1) * limit;
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (category) where.categoryId = category;
    if (featured !== undefined) where.isFeatured = featured;
    if (active !== undefined) where.isActive = active;
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
      }),
      this.prisma.product.count({ where }),
    ]);
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
  async findBySku(sku: string) {
    const product = await this.prisma.product.findUnique({
      where: { sku },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
  async findByCategory(categoryId: string, page = 1, limit = 10) {
    await this.categoryService.findOne(categoryId);
    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where: { categoryId, isActive: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.product.count({ where: { categoryId, isActive: true } }),
    ]);
    return {
      data: products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await this.prisma.product.findUnique({
        where: { sku: updateProductDto.sku },
      });
      if (existingSku) {
        throw new ConflictException('Ya existe un producto con ese SKU');
      }
    }
    if (updateProductDto.categoryId) {
      await this.categoryService.findOne(updateProductDto.categoryId);
    }
    return await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
    });
  }
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Producto eliminado correctamente' };
  }
  async addReview(id: string, addReviewDto: AddReviewDto) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    const existingReview = product.reviews?.find(
      (r) => r.userId === addReviewDto.userId,
    );
    if (existingReview)
      throw new ConflictException('El usuario ya ha dejado una reseña');
    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        reviews: {
          push: {
            ...addReviewDto,
            createdAt: new Date(),
          },
        },
      },
    });
    const reviews = updatedProduct.reviews ?? [];
    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating =
      reviews.length > 0
        ? Math.round((totalRating / reviews.length) * 10) / 10
        : 0;
    return await this.prisma.product.update({
      where: { id },
      data: {
        averageRating: avgRating,
        totalReviews: reviews.length,
      },
    });
  }
  async updateStock(id: string, quantity: number) {
    if (quantity < 0) throw new BadRequestException('Cantidad inválida');
    const product = await this.prisma.product.update({
      where: { id },
      data: { stock: quantity },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
  async incrementViews(id: string) {
    const product = await this.prisma.product.update({
      where: { id },
      data: { views: { increment: 1 } },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }
  async getFeatured(limit = 10) {
    return this.prisma.product.findMany({
      where: { isFeatured: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }
  async getPopular(limit = 10) {
    return this.prisma.product.findMany({
      where: { isActive: true },
      orderBy: [{ totalSales: 'desc' }, { views: 'desc' }],
      take: limit,
    });
  }
}
