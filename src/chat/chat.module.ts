import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatService } from './chat.service';
import { ChatRepository } from './chat.repository';
import { ChatGateway } from './chat.gateway';
import { SessionManager } from '../utils/sessionManager'
import { ChatSchema } from './chat.schema';
import { Logger } from 'src/utils/logger';

@Module({
    imports: [MongooseModule.forFeature([{name: "Chat", schema: ChatSchema }])], 
    controllers: [], 
    providers: [ChatService , ChatRepository , SessionManager , Logger , ChatGateway], 
    exports: [ChatService ]
  })
  export class ChatModule {}