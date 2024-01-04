import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true, _id: false })
export class TaskProgressLog {
  @Prop({ required: true })
  progress: number;

  @Prop({ required: true })
  updatedBy: string;
}

const TaskProgressLogSchema = SchemaFactory.createForClass(TaskProgressLog);

@Schema({ timestamps: true })
export class Task {
  @Prop()
  parentTaskId?: mongoose.Types.ObjectId;

  @Prop()
  subTasks?: Array<string>;

  @Prop({ required: true })
  name: string;

  @Prop()
  progress?: number;

  @Prop({ type: [TaskProgressLogSchema] })
  progressLogs?: Array<TaskProgressLog>;

  @Prop({ required: true })
  weight: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
TaskSchema.index({ parentTask: 1 });

export type TaskDocument = Task & Document;
