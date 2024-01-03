import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CreateSubTaskDto } from './dtos/create-sub-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async getTasks(@Param() id: string) {
    return this.taskService.getTaskById(id)
  }

  @Post('/')
  async createTask(@Body() task: CreateTaskDto){
    return this.taskService.createTask(task)
  }

  @Post('/sub-task')
  async createSubTask(@Body() task: CreateSubTaskDto){
    return this.taskService.createSubTask(task)
  }
}
