import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatDocument } from './chat.schema';
import { CreateChatDao } from './dao/createChatDao';
import { FindChatDao } from './dao/findChatDao';
import { UpdateChatDao } from './dao/updateChatDao';
import { ClientSession } from 'mongoose';

@Injectable()
export class ChatService {
    constructor (
        private readonly chatRepository: ChatRepository,
    ){}
    async createChat(createChatDao : CreateChatDao , session : ClientSession): Promise<ChatDocument | null>{
        try {
            const newChat = await this.chatRepository.createChat(createChatDao , session);
            return newChat;
        } catch (error){
            return null;
        }
    }

    async findChats(findChatDao : FindChatDao , session : ClientSession , projectionOptions: any = null, findOptions: any = null , limitValue: number = 0): Promise<ChatDocument[] | null>{
        try {
            const newChats = await this.chatRepository.findChats(findChatDao , session , projectionOptions , findOptions , 0);
            return newChats;
        } catch (error){
            return [];
        }
    }

    async findChat(findChatDao : FindChatDao , session : ClientSession , projectionOptions: any = null, findOptions: any = null): Promise<ChatDocument | null>{
        try {
            const newChat = await this.chatRepository.findChat(findChatDao , session , projectionOptions , findOptions);
            return newChat;
        } catch (error){
            return null;
        }
    }

    async updateChat(findChatDao : FindChatDao , updateChatDao : UpdateChatDao , session : ClientSession): Promise<ChatDocument | null>{
        try {
            const newChat = await this.chatRepository.updateChat(findChatDao , updateChatDao , session);
            return newChat;
        } catch (error){
            return null;
        }
    }

    async deleteChat(findChatDao : FindChatDao , session : ClientSession): Promise<boolean>{
        try {
            const deleted = await this.chatRepository.deleteChat(findChatDao ,  session);
            return deleted;
        } catch (error){
            return false;
        }
    }
}
