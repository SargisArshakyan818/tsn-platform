import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('availabilities')
export class Availability {
    @PrimaryGeneratedColumn() id: number;

    @Column() user_id: number;

    @Column() task_id: number;

    @Column('datetime') start_at: Date;

    @Column('datetime') end_at: Date;
}
