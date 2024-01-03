import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CreateSubTaskDto } from './dtos/create-sub-task.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('/:id')
  async getTasks(@Param() params) {
    const { id } = params;
    return this.taskService.getTaskById(id);
  }

  @Post('/')
  async createTask(@Body() task: CreateTaskDto) {
    return this.taskService.createTask(task);
  }

  @Post('/sub-task')
  async createSubTask(@Body() task: CreateSubTaskDto) {
    return this.taskService.createSubTask(task);
  }

  @Post('/progress')
  async updateTaskProgress(@Body() updateProgressPaylaod: UpdateProgressDto) {
    return this.taskService.updateTaskProgress(updateProgressPaylaod);
  }

  @Get('/progress/:id')
  async getProgressForTask(@Param() params) {
    const { id } = params;
    return this.taskService.getProgessForTask(id);
  }
}
