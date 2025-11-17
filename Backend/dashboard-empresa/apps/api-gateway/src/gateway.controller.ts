import { Controller, Get, Post, Body, Inject, Param, Patch, Delete } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class GatewayController {
  constructor(
    @Inject('AUTH_SERVICE') private authClient: ClientProxy,
    @Inject('MERCH_SERVICE') private merchClient: ClientProxy,
    @Inject('CATEGORIA_SERVICE') private categoriaClient: ClientProxy
  ) {}

  @Get()
  helloWorld() {
    return {
      message: '🚀 API Gateway - Hello World',
      status: 'running',
      port: 3030,
    };
  }

  @Get('health')
  health() {
    return { status: 'ok' };
  }

  @Get('auth/test')
  async testAuthService() {
    return this.authClient.send({ cmd: 'test' }, {});
  }

  @Post('auth/register')
  async register(@Body() registerDto: any) {
    return this.authClient.send({ cmd: 'register' }, registerDto);
  }

  @Post('auth/login')
  async login(@Body() loginDto: any) {
    return this.authClient.send({ cmd: 'login' }, loginDto);
  }

  // Merchandising endpoints
  @Get('merchandising')
  async getAllMerchandising() {
    return this.merchClient.send({ cmd: 'get-all-merchandising' }, {});
  }

  @Get('merchandising/:id')
  async getMerchById(@Param('id') id: string) {
    return this.merchClient.send({ cmd: 'get-merch-by-id' }, { id });
  }

  @Post('merchandising')
  async createMerchandising(@Body() createMerchandisingDto: any) {
    return this.merchClient.send({ cmd: 'create-merchandising' }, createMerchandisingDto);
  }

  @Patch('merchandising/:id')
  async updateMerchandising(@Param('id') id: string, @Body() updateMerchandisingDto: any) {
    return this.merchClient.send({ cmd: 'update-merchandising' }, { id, ...updateMerchandisingDto });
  }

  @Delete('merchandising/:id')
  async deleteMerchandising(@Param('id') id: string) {
    return this.merchClient.send({ cmd: 'delete-merchandising' }, { id });
  }

  // Categories endpoints
  @Get('categories')
  async getAllCategories() {
    return this.categoriaClient.send({ cmd: 'get-all-categories' }, {});
  }

  @Get('categories/:id')
  async getCategoryById(@Param('id') id: string) {
    return this.categoriaClient.send({ cmd: 'get-category-by-id' }, { id });
  }

  @Post('categories')
  async createCategory(@Body() createCategoryDto: any) {
    return this.categoriaClient.send({ cmd: 'create-category' }, createCategoryDto);
  }

  @Patch('categories/:id')
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return this.categoriaClient.send({ cmd: 'update-category' }, { id, ...updateCategoryDto });
  }

  @Delete('categories/:id')
  async deleteCategory(@Param('id') id: string) {
    return this.categoriaClient.send({ cmd: 'delete-category' }, { id });
  }
}
