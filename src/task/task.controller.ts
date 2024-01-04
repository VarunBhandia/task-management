import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dtos/create-task.dto';
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
    const { weight = 1 } = task;
    return this.taskService.createTask({
      ...task,
      weight,
    });
  }

  @Post('/progress')
  async updateTaskProgress(@Body() updateProgressPaylaod: UpdateProgressDto) {
    return this.taskService.updateTaskProgress(updateProgressPaylaod);
  }

  @Get('/progress/:id')
  async getProgressForTask(@Param() params) {
    const { id } = params;
    const { progress, weight } = await this.taskService.getProgessForTask(id);
    return { overAllProgress: Math.round(progress), overAllWeight: weight };
  }
}
