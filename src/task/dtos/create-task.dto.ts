import { Max, Min } from 'class-validator';

export class CreateTaskDto {
  name: string;

  @Max(100, { message: 'Progress must not exceed 100' })
  @Min(1, { message: 'Progress must be atleast 1' })
  progress?: number = 0;

  @Min(1, { message: 'Weight must be atleast 1' })
  weight?: number = 1;

  parentTaskId?: string;

  actor: string;
}
