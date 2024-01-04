import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TaskDao } from './task.dao';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
@Injectable()
export class TaskService {
  constructor(
    private readonly taskDao: TaskDao,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getTaskById(id: string) {
    return this.taskDao.getById(id);
  }

  async createTask(task: CreateTaskDto) {
    const { parentTaskId } = task;
    if (parentTaskId) {
      return this.createSubTask(task);
    }
    return this.taskDao.create(task);
  }

  async createSubTask(subTask: CreateTaskDto) {
    const { parentTaskId } = subTask;

    const parentTask = await this.getTaskById(parentTaskId);
    if (!parentTask) {
      throw new HttpException(
        'No parent task mapped to given parent id',
        HttpStatus.BAD_REQUEST,
      );
    }
    const createdSubTask = await this.taskDao.create(subTask);
    await this.assignSubTaskToParentTask(
      parentTaskId,
      createdSubTask._id.toString(),
    );

    return createdSubTask;
  }

  async assignSubTaskToParentTask(parentTaskId: string, subtaskId: string) {
    await this.taskDao.resetProgress(parentTaskId);
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

  async getProgessForTask(taskId: string) {
    const cachedData = await this.cacheManager.get<{
      progress: number;
      weight: number;
    }>(taskId);

    if (cachedData) return cachedData;

    const task = await this.getTaskById(taskId);
    const { progress, weight, subTasks } = task;

    if (subTasks.length == 0) return { progress, weight };

    let totalProgress = 0;
    let totalWeight = 0;
    for (let i = 0; i < subTasks.length; i++) {
      const currProgress = await this.getProgessForTask(subTasks[i]);
      await this.cacheManager.set(subTasks[i], currProgress, 5000);
      totalProgress =
        totalProgress + currProgress.progress * currProgress.weight;
      totalWeight = totalWeight + currProgress.weight;
    }
    const overAllProgress = {
      progress: totalProgress / totalWeight,
      weight: totalWeight,
    };
    await this.cacheManager.set(taskId, overAllProgress, 6000);
    return overAllProgress;
  }
}
