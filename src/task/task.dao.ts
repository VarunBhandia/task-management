import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dtos/create-task.dto';
import { UpdateProgressDto } from './dtos/update-progress.dto';

export class TaskDao {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async getById(id: string) {
    return this.taskModel.findById(id).exec();
  }

  async create(task: CreateTaskDto) {
    const { actor, progress, name, weight, parentTaskId } = task;
    const progressLogs = {
      updatedBy: actor,
      progress,
    };
    return this.taskModel.create({
      parentTaskId,
      name,
      progress,
      weight,
      progressLogs,
    });
  }

  async addSubTaskToParent(parentTaskId: string, subtaskId: string) {
    return this.taskModel.updateOne(
      { _id: parentTaskId },
      { $push: { subTasks: subtaskId } },
    );
  }

  async updateProgress(updateProgressPaylaod: UpdateProgressDto) {
    const { taskId, actor, progress } = updateProgressPaylaod;
    return this.taskModel.updateOne(
      { _id: taskId },
      {
        $set: { progress },
        $push: {
          progressLogs: {
            updatedBy: actor,
            progress,
          },
        },
      },
    );
  }

  async resetProgress(taskId: string) {
    return this.taskModel.updateOne(
      { _id: taskId },
      {
        $unset: { progress: 1 },
      },
    );
  }
}
