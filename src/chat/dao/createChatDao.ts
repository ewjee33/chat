import { IsNotEmpty, IsDate , IsString, IsBoolean } from 'class-validator';

export class CreateChatDao {
  @IsString()
  @IsNotEmpty()
  teamId: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsString()
  @IsNotEmpty()
  userId : string;

}