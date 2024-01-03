import { Injectable } from '@nestjs/common';
import { TaskDao } from './task.dao';
import { CreateTaskDto } from './dtos/create-task.dto';
import { CreateSubTaskDto } from './dtos/create-sub-task.dto';

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
}
