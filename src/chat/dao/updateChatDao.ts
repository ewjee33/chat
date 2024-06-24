import { CreateChatDao } from './createChatDao';
import { PartialType } from '@nestjs/mapped-types' 

export class UpdateChatDao extends PartialType(CreateChatDao){
}