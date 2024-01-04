import { Max, Min } from 'class-validator';

export class UpdateProgressDto {
  taskId: string;
  @Max(100, { message: 'Progress must not exceed 100' })
  @Min(1, { message: 'Progress must be atleast 1' })
  progress: number;
  actor: string;
}