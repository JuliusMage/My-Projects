import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from 'typeorm';
import { Ticket } from '../../tickets/entities/ticket.entity';
import { Message } from '../../messages/entities/message.entity';
// import { Comment } from '../../comments/entities/comment.entity';

export enum UserRole {
  AGENT = 'AGENT',
  ADMIN = 'ADMIN',
  SUPERVISOR = 'SUPERVISOR',
  // CUSTOMER = 'CUSTOMER', // If customers can also be users
}

@Entity('users') // TypeORM decorator to define a table named 'users'
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar' }) // Length will be determined by bcrypt output, typically 60 chars
  passwordHash: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  firstName?: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  lastName?: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.AGENT,
  })
  role: UserRole;

  @Column({ type: 'varchar', nullable: true })
  refreshTokenHash?: string;

  @CreateDateColumn({ type: 'timestamptz' }) // timestamptz for PostgreSQL stores timezone
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt?: Date;

  @Column({ default: true })
  isActive: boolean;

  // --- Relations ---
  // Note: Relations are defined but might not be immediately queryable
  // unless explicitly joined or using eager loading (use with caution).

  @OneToMany(() => Ticket, (ticket) => ticket.assignedTo)
  assignedTickets: Ticket[]; // Tickets assigned to this user

  @OneToMany(() => Ticket, (ticket) => ticket.createdBy)
  createdTickets: Ticket[]; // Tickets created by this user

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[]; // Messages sent by this user

  // @OneToMany(() => Comment, comment => comment.user)
  // comments: Comment[];
}
