import { Injectable, Logger } from '@nestjs/common';
import { UsergroupService } from '../usergroup/usergroup.service';
import { AppmenuService } from '../appmenu/appmenu.service';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class SchedullerService {
  constructor(
    private readonly usergroupService: UsergroupService,
    private readonly appmenuService: AppmenuService,
  ) {}

  Logger = new Logger(SchedullerService.name);

  // @Cron('45 * * * * *', {
  //   name: 'Syncronize usergroup',
  // })
  async UsergroupHandle() {
    this.Logger.log('cron is running every 45s');
  }
}
