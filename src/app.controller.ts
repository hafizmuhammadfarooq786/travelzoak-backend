import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './auth/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get()
  helloBackend(): string {
    return this.appService.helloBackend();
  }

  @Public()
  @Post('createAllSeed')
  async createAllSeeds(): Promise<string> {
    return this.appService.createAllSeeds();
  }
}
