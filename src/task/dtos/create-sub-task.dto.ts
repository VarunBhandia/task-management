import { Max, Min } from 'class-validator';

export class CreateSubTaskDto {
  name: string;

  @Max(100, { message: 'Progress must not exceed 100' })
  @Min(1, { message: 'Progress must be atleast 1' })
  progress: number;

  @Max(100, { message: 'Weight must not exceed 100' })
  @Min(1, { message: 'Weight must be atleast 1' })
  weight: number = 1;

  parentTaskId: string;
}
