import { Logger } from 'src/utils/logger';
import { ChatService } from './chat.service';
import { WebSocketGateway, WebSocketServer, SubscribeMessage, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { createAdapter } from "@socket.io/redis-adapter";
import { Redis } from "ioredis";

@WebSocketGateway({ path: process.env.SOCKET_END_POINT, cors: { origin: '*' }, namespace: '/chat' })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private pubClient: Redis;
  private subClient: Redis;
  constructor(
    private readonly chatService: ChatService,
    private readonly logger: Logger,
  ) {
    this.server = new Server({adapter : createAdapter(this.pubClient , this.subClient)});
    this.pubClient =  new Redis(process.env.REDIS_URL ?? "redis://username:authpassword@127.0.0.1:6380/4"),
    this.subClient = this.pubClient.duplicate()
  }
  @WebSocketServer()
  server: Server;

  //Function that gets called on connection
  async handleConnection(client: Socket) {
    this.logger.log( "info" , `Client connected: ${client.id}`);
  }

  //Function that gets called on connection lost
  async handleDisconnect(client: Socket) {
    this.logger.log( "info" , `Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    this.logger.log("info" , `Client ${client.id} joined room ${room}`);
    this.server.to(room).emit('message', `Client ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    this.logger.log("info" , `Client ${client.id} left room ${room}`);
    this.server.to(room).emit('message', `Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: { room: string, message: string }): void {
    this.logger.log("info" , `Message from ${client.id} to room ${data.room}: ${data.message}`);
    this.server.to(data.room).emit('message', { clientId: client.id, message: data.message });
  }
}
