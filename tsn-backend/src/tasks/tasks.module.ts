import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { User } from '../users/user.entity';
import { Status } from '../statuses/status.entity';
import { Availability } from '../availabilities/availability.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Task, User, Status, Availability]),
        BullModule.registerQueue({ name: 'availability' })
    ],
    controllers: [TasksController],
    providers: [TasksService],
    exports: [TasksService]
})
export class TasksModule { }
