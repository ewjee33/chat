import { CreateChatDao } from './createChatDao';
import { PartialType } from '@nestjs/mapped-types' 

export class FindChatDao extends PartialType(CreateChatDao){

}