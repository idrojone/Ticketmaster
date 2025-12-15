import { Test, TestingModule } from '@nestjs/testing';
import { MerchServiceController } from './merch-service.controller';
import { MerchServiceService } from './merch-service.service';

describe('MerchServiceController', () => {
  let merchServiceController: MerchServiceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [MerchServiceController],
      providers: [MerchServiceService],
    }).compile();

    merchServiceController = app.get<MerchServiceController>(MerchServiceController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(merchServiceController.getHello()).toBe('Hello World!');
    });
  });
});
