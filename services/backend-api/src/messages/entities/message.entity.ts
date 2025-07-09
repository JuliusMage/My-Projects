import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, Index, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Ticket } from '../../tickets/entities/ticket.entity';

export enum MessageSenderType {
  USER = 'USER',          // An agent, admin, or supervisor (internal user)
  CUSTOMER = 'CUSTOMER',  // External customer (not a platform user, e.g., email reply)
  SYSTEM = 'SYSTEM',      // Automated messages (e.g., ticket created, status changed)
}

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ type: 'uuid' }) // Foreign key to Ticket
  ticketId: string;

  @Column({
    type: 'enum',
    enum: MessageSenderType,
    default: MessageSenderType.USER,
  })
  senderType: MessageSenderType;

  // Nullable if senderType is CUSTOMER or SYSTEM.
  // If senderType is USER, this should be a valid User ID.
  @Index()
  @Column({ type: 'uuid', nullable: true })
  senderId?: string; // User ID if senderType is USER

  // If senderType is CUSTOMER, this might store their email or name if not a platform user
  @Column({ type: 'varchar', length: 255, nullable: true })
  externalSenderName?: string;


  @Column('text')
  content: string;

  @CreateDateColumn({ type: 'timestamptz' }) // Using timestamptz for timezone awareness
  timestamp: Date;

  @Column({ default: false })
  isPrivateNote: boolean; // Internal notes not visible to external customers

  // --- Relations ---
  @ManyToOne(() => Ticket, (ticket) => ticket.messages, { onDelete: 'CASCADE', nullable: false })
  @JoinColumn({ name: 'ticketId' }) // Explicitly defines the FK column
  ticket: Ticket;

  // This relation is nullable because a message might come from an external customer or be a system message.
  // It's only populated if senderType is 'USER' and senderId is a valid user.
  @ManyToOne(() => User, (user) => user.sentMessages, { nullable: true, onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'senderId' }) // Name of the foreign key column in the messages table
  sender?: User; // Populated if senderType is USER and senderId is not null
}
