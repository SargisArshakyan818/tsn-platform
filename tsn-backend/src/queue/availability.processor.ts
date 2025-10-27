import { Processor, Process } from '@nestjs/bull';
import bull from 'bull';
import { DataSource } from 'typeorm';
import { Availability } from '../availabilities/availability.entity';
import { Task } from '../tasks/task.entity';

@Processor('availability')
export class AvailabilityProcessor {
    // Using a manual DataSource because this file runs in the same process
    private dataSource: DataSource;

    constructor() {
        // create a data source using env (same options as TypeORM in app.module)
        this.dataSource = new DataSource({
            type: 'mysql',
            host: process.env.DATABASE_HOST || '127.0.0.1',
            port: Number(process.env.DATABASE_PORT) || 3306,
            username: process.env.DATABASE_USER || 'app',
            password: process.env.DATABASE_PASSWORD || 'pass',
            database: process.env.DATABASE_NAME || 'tasks_db',
            entities: [Task, Availability],
            synchronize: false
        });
        // initialize lazily
        this.dataSource.initialize().catch((err) => {
            // initialization can fail early in some dev container flows; log
            console.warn('AvailabilityProcessor dataSource init warning:', err.message || err);
        });
    }

    @Process('sync')
    async handleSync(job: bull.Job<{ taskId: number }>) {
        const { taskId } = job.data;
        if (!this.dataSource.isInitialized) {
            try {
                await this.dataSource.initialize();
            } catch (e) {
                console.error('Failed to init datasource in availability processor', e);
                return;
            }
        }
        const taskRepo = this.dataSource.getRepository(Task);
        const availRepo = this.dataSource.getRepository(Availability);

        const task = await taskRepo.findOne({ where: { id: taskId } });
        if (!task) {
            // nothing to sync
            return;
        }

        // remove any existing availability for this task and insert fresh
        await availRepo.delete({ task_id: taskId });
        const avail = availRepo.create({
            user_id: (task as any).assignee?.id || (task as any).assignee_id || null,
            task_id: taskId,
            start_at: task.startDate,
            end_at: task.endDate
        });
        await availRepo.save(avail);

        // Here you could push a notification record or emit via websocket
        console.log(`Availability synced for task ${taskId}`);
    }

    @Process('remove')
    async handleRemove(job: bull.Job<{ taskId: number }>) {
        const { taskId } = job.data;
        if (!this.dataSource.isInitialized) {
            try {
                await this.dataSource.initialize();
            } catch (e) {
                console.error('Failed to init datasource in availability processor', e);
                return;
            }
        }
        const availRepo = this.dataSource.getRepository(Availability);
        await availRepo.delete({ task_id: taskId });
        console.log(`Availability removed for task ${taskId}`);
    }
}
