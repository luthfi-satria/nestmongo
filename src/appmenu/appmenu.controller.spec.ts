import { Test, TestingModule } from '@nestjs/testing';
import { AppmenuController } from './appmenu.controller';

describe('AppmenuController', () => {
  let controller: AppmenuController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppmenuController],
    }).compile();

    controller = module.get<AppmenuController>(AppmenuController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
