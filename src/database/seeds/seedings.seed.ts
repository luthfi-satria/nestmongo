import { Command } from 'nestjs-command';
import { UsergroupService } from '../../usergroup/usergroup.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SeedingDB {
  constructor(private readonly usergroupService: UsergroupService) {}

  @Command({
    command: 'seeding:usergroup',
    describe: 'seeding usergroup',
  })
  async createGroup() {
    const group = await this.usergroupService.seeding();
    return group;
  }
}
