import { DataSource } from 'typeorm';
import { User } from '../users/user.entity';
import { Status } from '../statuses/status.entity';
import * as bcrypt from 'bcrypt';

async function seed() {
    const ds = new DataSource({
        type: 'mysql',
        host: process.env.DATABASE_HOST || '127.0.0.1',
        port: Number(process.env.DATABASE_PORT) || 3306,
        username: process.env.DATABASE_USER || 'app',
        password: process.env.DATABASE_PASSWORD || 'pass',
        database: process.env.DATABASE_NAME || 'tasks_db',
        entities: [User, Status],
        synchronize: true
    });

    await ds.initialize();
    const userRepo = ds.getRepository(User);
    const statusRepo = ds.getRepository(Status);

    const pass = await bcrypt.hash('password123', 10);

    const existingAdmin = await userRepo.findOneBy({ email: 'admin@example.com' });
    if (!existingAdmin) {
        await userRepo.save({ name: 'Admin', email: 'admin@example.com', password_hash: pass });
    }

    const existingManager = await userRepo.findOneBy({ email: 'manager@example.com' });
    if (!existingManager) {
        await userRepo.save({ name: 'Manager', email: 'manager@example.com', password_hash: pass });
    }

    const statuses = [
        { key: 'todo', label: 'To Do' },
        { key: 'in_progress', label: 'In Progress' },
        { key: 'done', label: 'Done' }
    ];
    for (const s of statuses) {
        const found = await statusRepo.findOneBy({ key: s.key });
        if (!found) await statusRepo.save(s);
    }

    console.log('Seeding completed.');
    process.exit(0);
}

seed().catch((err) => {
    console.error('Seed error', err);
    process.exit(1);
});
