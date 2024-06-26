import { IsNotEmpty, IsDate , IsString, IsBoolean } from 'class-validator';

export class CreateChatDao {
  @IsString()
  @IsNotEmpty()
  ChatId: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  consumerId : string;

}