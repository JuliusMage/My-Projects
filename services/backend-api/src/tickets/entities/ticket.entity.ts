import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, Index, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Message } from '../../messages/entities/message.entity';
// import { Comment } from '../../comments/entities/comment.entity';
// import { Tag } from '../../tags/entities/tag.entity';
// import { TicketTag } from './ticket-tag.entity'; // For many-to-many with tags

export enum TicketStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  PENDING_CUSTOMER = 'PENDING_CUSTOMER',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum TicketPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

@Entity('tickets')
export class Ticket {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column('text')
  description: string;

  @Index()
  @Column({
    type: 'enum',
    enum: TicketStatus,
    default: TicketStatus.OPEN,
  })
  status: TicketStatus;

  @Column({
    type: 'enum',
    enum: TicketPriority,
    default: TicketPriority.MEDIUM,
  })
  priority: TicketPriority;

  @Column({ type: 'varchar', length: 255, nullable: true })
  customerEmail?: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  customerName?: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  resolvedAt?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  closedAt?: Date;

  // --- Relations ---
  @ManyToOne(() => User, (user) => user.assignedTickets, { nullable: true, onDelete: 'SET NULL', eager: false })
  @JoinColumn({ name: 'assignedToId' }) // Explicitly define the foreign key column name
  assignedTo?: User;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  assignedToId?: string; // Foreign key column

  @ManyToOne(() => User, (user) => user.createdTickets, { nullable: false, onDelete: 'CASCADE', eager: false })
  @JoinColumn({ name: 'createdById' })
  createdBy: User;

  @Index()
  @Column({ type: 'uuid' })
  createdById: string; // Foreign key column

  @OneToMany(() => Message, (message) => message.ticket, { cascade: ['insert', 'update'] }) // Cascade operations if needed
  messages: Message[];

  // @OneToMany(() => Comment, comment => comment.ticket)
  // comments: Comment[];

  // @OneToMany(() => TicketTag, ticketTag => ticketTag.ticket)
  // ticketTags: TicketTag[];
}
