import { Logger } from 'src/utils/logger';
import { ChatService } from './chat.service';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ path: process.env.SOCKET_END_POINT, cors: { origin: '*' }, namespace: '/chat' })
//@WebSocketGateway({ cors: { origin: '*' }})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly logger: Logger,
  ) {}

  //Function that gets called on connection
  async handleConnection(client: Socket) {
    this.logger.log( "info" , `Client connected: ${client.id}`);
    console.log("connected");
  }

  //Function that gets called on connection lost
  async handleDisconnect(client: Socket) {
    this.logger.log( "info" , `Client disconnected: ${client.id}`);
    console.log("disconnected");
  }

  @SubscribeMessage('joinTeamChat')
  handleJoinRoom(client: Socket, teamId: string): void {
    console.log("joinRoom");
    console.log("room - " + teamId);
    client.join(teamId);
    this.logger.log("info" , `Client ${client.id} joined teamId ${teamId}`);
    this.server.to(teamId).emit('message', `Client ${client.id} joined teamId ${teamId}`);
  }

  @SubscribeMessage('leaveTeamChat')
  handleLeaveRoom(client: Socket, teamId: string): void {
    client.leave(teamId);
    this.logger.log("info" , `Client ${client.id} left room ${teamId}`);
    this.server.to(teamId).emit('message', `Client ${client.id} left room ${teamId}`);
  }

  @SubscribeMessage('sendTeamChat')
  handleMessage(client: Socket, data: { teamId : string, message: string }): void {
    console.log(data);
    this.logger.log("info" , `Message from ${client.id} to room ${data.teamId}: ${data.message}`);
    this.server.to(data.teamId).emit('chat', { clientId: client.id, message: data.message });
  }
}
