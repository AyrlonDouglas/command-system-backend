import { Module } from '@nestjs/common';
import { CommandService } from './command.service';
import { CommandController } from './command.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Command } from './entities/command.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Command])],
  controllers: [CommandController],
  providers: [CommandService],
})
export class CommandModule {}
