import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksModule } from './task/task.module';
import { MongooseModule } from '@nestjs/mongoose';

const mongooseModule = MongooseModule.forRoot('mongodb://localhost/powerplay');
@Module({
  imports: [TasksModule, mongooseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
