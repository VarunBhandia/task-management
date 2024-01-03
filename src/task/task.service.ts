import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { TaskDao } from './task.dao';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CreateSubTaskDto } from './dtos/create-sub-task.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';

@Injectable()
export class TaskService {
  constructor(private readonly taskDao: TaskDao) {}

  async getTaskById(id: string) {
    return this.taskDao.getById(id);
  }

  async createTask(task: CreateTaskDto) {
    return this.taskDao.create(task);
  }

  async createSubTask(subTask: CreateSubTaskDto) {
    const createdSubTask = await this.createTask(subTask);
    await this.assignSubTaskToParentTask(
      subTask.parentTaskId,
      createdSubTask._id.toString(),
    );

    return createdSubTask;
  }

  async assignSubTaskToParentTask(parentTaskId: string, subtaskId: string) {
    return this.taskDao.addSubTaskToParent(parentTaskId, subtaskId);
  }

  async updateTaskProgress(updateProgressPaylaod: UpdateProgressDto) {
    const { taskId } = updateProgressPaylaod;
    const task = await this.getTaskById(taskId);

    const { subTasks } = task;

    if (subTasks.length > 0) {
      throw new HttpException(
        'Only leaf tasks can have progress',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.taskDao.updateProgress(updateProgressPaylaod);
  }

  async getProgessForTask(taskId: string): Promise<number> {
    const task = await this.getTaskById(taskId);

    const { progress, weight } = task;

    if (progress) return progress * weight;

    const { subTasks } = task;
    let overAllProgress = 0;
    for (let subTask in subTasks) {
      const currProgress = await this.getProgessForTask(subTask);
      overAllProgress = overAllProgress + currProgress;
    }

    return overAllProgress;
  }
}
