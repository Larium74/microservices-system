import { Injectable, Inject, HttpException, HttpStatus } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
@Injectable()
export class ProductService {
  constructor(
    @Inject('PRODUCT_SERVICE') private readonly productClient: ClientProxy,
  ) {}
  async findAll(query: any) {
    try {
      return await firstValueFrom(
        this.productClient.send('get_all_products', query)
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener productos del microservicio',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async findOne(id: string) {
    try {
      return await firstValueFrom(
        this.productClient.send('get_product_by_id', { id })
      );
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al obtener producto del microservicio',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async create(createProductDto: any) {
    try {
      return await firstValueFrom(
        this.productClient.send('create_product', createProductDto)
      );
    } catch (error) {
      throw new HttpException(
        'Error al crear producto en el microservicio',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async update(id: string, updateProductDto: any) {
    try {
      return await firstValueFrom(
        this.productClient.send('update_product', { id, ...updateProductDto })
      );
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al actualizar producto en el microservicio',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async remove(id: string) {
    try {
      return await firstValueFrom(
        this.productClient.send('delete_product', { id })
      );
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al eliminar producto del microservicio',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async findByCategory(category: string, query: any) {
    try {
      return await firstValueFrom(
        this.productClient.send('get_products_by_category', {
          category,
          ...query,
        })
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener productos por categoría',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
  async addReview(id: string, reviewDto: any) {
    try {
      return await firstValueFrom(
        this.productClient.send('add_product_review', { id, ...reviewDto })
      );
    } catch (error) {
      if (error.status === 404) {
        throw new HttpException('Producto no encontrado', HttpStatus.NOT_FOUND);
      }
      throw new HttpException(
        'Error al agregar reseña',
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }
  }
}
