import { Logger } from 'src/utils/logger';
import { ChatService } from './chat.service';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionManager } from 'src/utils/sessionManager';
import { ClientSession } from 'mongoose';
import { ChatDocument } from './chat.schema';
import { FindChatDao } from './dao/findChatDao';

@WebSocketGateway({ path: process.env.SOCKET_END_POINT, cors: { origin: '*' }, namespace: '/chat' })
//@WebSocketGateway({ cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly logger: Logger,
    private readonly sessionService: SessionManager , 
  ) {}

  //Function that gets called on connection
  async handleConnection(client: Socket) {
    this.logger.log( "info" , `Client connected: ${client.id}`);
  }

  //Function that gets called on connection lost
  async handleDisconnect(client: Socket) {
    this.logger.log( "info" , `Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinTeamChat')
  handleJoinRoom(client: Socket, teamId: string): void {
    try {
      client.join(teamId);
      this.logger.log("info" , `Client ${client.id} joined room ${teamId}`);
      this.server.to(teamId).emit('joinTeam', `Client ${client.id} joined team ${teamId}`);
    } catch (error) {
      this.logger.log("error", `Failed to join room ${teamId} : ${error.message}`);
      client.emit('error', { message: 'Failed to join room', details: error.message });
    }
  }

  @SubscribeMessage('leaveTeamChat')
  handleLeaveRoom(client: Socket, teamId: string): void {
    try {
      client.leave(teamId);
      this.logger.log("info" , `Client ${client.id} left room ${teamId}`);
      this.server.to(teamId).emit('leaveTeam', `Client ${client.id} left team ${teamId}`);
    } catch (error) {
      this.logger.log("error", `Failed to leave room ${teamId} : ${error.message}`);
      client.emit('error', { message: 'Failed to leave room', details: error.message });
    }
  }

  @SubscribeMessage('sendTeamChat')
  handleMessage(client: Socket, data: { teamId: string, message: string , userId : string}): void {
    try {
      this.logger.log("info", `Message from ${client.id} to room ${data.teamId}: ${data.message}`);
      this.server.to(data.teamId).emit('chat', { clientId: client.id, message: data.message });
    } catch (error) {
      this.logger.log("error", `Failed to send message from ${client.id} to room ${data.teamId}: ${error.message}`);
      client.emit('error', { message: 'Failed to send message', details: error.message });
    }
  }

  @SubscribeMessage('deleteChat')
  async deleteChat(client: Socket, packet: string): Promise<void> {
    try {
      const session : ClientSession = await this.sessionService.startSession();
      const deleteChatDto = { teamId: packet['teamId'], _id: packet['chatId'] };
      await this.chatService.deleteChat(deleteChatDto , session);
      this.server.to(packet['teamId']).emit('deleteChat', { chatId: packet['chatId'] });
      this.logger.log( "info" , `teamId : ${packet['teamId']} , chatId : ${packet['chatId']}`);
    } catch (error) {
      this.logger.log( "error" , `teamId : ${packet['teamId']} , chatId : ${packet['chatId']} , ${error}` );
    }
  }

  @SubscribeMessage('chatlog')
  async sendChatlog(client: Socket,  teamId: string): Promise<void> {
    try {
      const session : ClientSession = await this.sessionService.startSession();
      const findChatDao : FindChatDao = { teamId };
      const chats : ChatDocument[] | null = await this.chatService.findChats(findChatDao , session);
      if (chats != null){
        client.emit('chatlog', chats);
        this.logger.log( "info" , `teamId : ${teamId}`);
      }
    } catch (error) {
      this.logger.log( "error" , `teamId : ${teamId} , ${error}` );
    }
  }
}
