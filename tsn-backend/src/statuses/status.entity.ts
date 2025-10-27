import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('statuses')
export class Status {
    @PrimaryGeneratedColumn() id: number;

    @Column({ length: 100, unique: true }) key: string;

    @Column({ length: 191 }) label: string;
}
