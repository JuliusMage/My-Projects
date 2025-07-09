import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class WsGateway {
  @WebSocketServer()
  server: Server;

  sendTicketUpdate(ticket: any) {
    this.server.emit('ticket', ticket);
  }
}
