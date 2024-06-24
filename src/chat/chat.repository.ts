import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ChatDocument } from './chat.schema';
import { ClientSession, Model } from 'mongoose';
import { CreateChatDao } from './dao/createChatDao';
import { FindChatDao } from './dao/findChatDao';
import { UpdateChatDao } from './dao/updateChatDao';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectModel('Chat') private readonly chatModel: Model<ChatDocument>,
  ) {}
  async createChat(createChatDao: CreateChatDao , session : ClientSession ): Promise<ChatDocument> {
      const newChatArray = await this.chatModel.create([createChatDao] , {session});
      const newChat = newChatArray[0];
      return newChat
  }

  //TODO - need to set {new : true} as default if not given but change it if so
  async updateChat(findChatDao: FindChatDao, updateChatDao: UpdateChatDao , session : ClientSession): Promise<ChatDocument | null> {
      const updatedChat = await this.chatModel.findOneAndUpdate(findChatDao, updateChatDao , {new : true}).session(session);
      if (!updatedChat) {
          return null
      }
      return updatedChat
  }

  async findChat(findChatDao: FindChatDao, session : ClientSession , projectionOptions: any = null, findOptions: any = null): Promise<ChatDocument | null> {
      const foundChat = await this.chatModel.findOne(findChatDao, projectionOptions , findOptions).session(session);
      if (!foundChat) {
          return null
      }
      return foundChat
  }

  async findChats(findChatDao: FindChatDao, session : ClientSession , projectionOptions: any = null, findOptions: any = null , limitValue: number = 0): Promise<ChatDocument[] | null> {
      const foundChats = await this.chatModel.find(findChatDao, projectionOptions, findOptions).limit(limitValue).session(session);
      if (!foundChats) {
          return null
      }
      return foundChats
  }

  async deleteChat(findChatDao: FindChatDao , session : ClientSession): Promise<boolean> {
    try {
      const deleteResult = await this.chatModel.deleteOne(findChatDao).session(session);
      if (deleteResult.acknowledged && deleteResult.deletedCount === 1){
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log('Error in deleteChat');
      console.log(error);
      return false;
    }
  }
}
