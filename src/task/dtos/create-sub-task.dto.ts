export class CreateSubTaskDto {
  name: string;
  progress: number;
  weight: number;
  parentTaskId: string;
}
