import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm'
import { User } from '../users/user.entity'

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column({ nullable: true, type: 'text' })
    description?: string

    @Column({ type: 'datetime' })
    startDate: Date

    @Column({ type: 'datetime' })
    endDate: Date

    @Column()
    status: string

    @Column()
    assigneeId: number

    @ManyToOne(() => User)
    @JoinColumn({ name: 'assigneeId' })
    assignee: User
}
