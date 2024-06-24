import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema({ timestamps: true })
export class Chat {
  @Prop({required: true})
  userId: string;

  @Prop({required: true})
  teamId: string;

  @Prop({required: true})
  type: string;
}
export const ChatSchema = SchemaFactory.createForClass(Chat);