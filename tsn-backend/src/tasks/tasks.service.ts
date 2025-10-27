// import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
// import { InjectRepository } from '@nestjs/typeorm'
// import { Repository } from 'typeorm'
// import { Task } from './task.entity'

// @Injectable()
// export class TasksService {
//     constructor(
//         @InjectRepository(Task)
//         private readonly taskRepo: Repository<Task>,
//     ) { }

//     // Return overlapping tasks and availability boolean
//     async isUserAvailable(userId: number, startISO: string, endISO: string) {
//         console.log('now', userId, startISO, endISO)
//         const start = new Date(startISO)
//         const end = new Date(endISO)
//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//             throw new BadRequestException('Invalid date format')
//         }
//         if (end < start) {
//             throw new BadRequestException('endDate must be after startDate')
//         }
//         // const overlap = await this.taskRepo
//         //     .createQueryBuilder('a')
//         //     .where('a.as_id = :userId', { userId: userId })
//         //     .andWhere('a.start_at <= :end', { end: start.toISOString() })
//         //     .andWhere('a.end_at >= :start', { start: end.toISOString() })
//         //     .getOne();

//         // if (overlap) {
//         //     throw new BadRequestException('User is not available for this time range');
//         // }
//         // Overlap condition: NOT (existing.end < new.start OR existing.start > new.end)
//         const overlaps = await this.taskRepo
//             .createQueryBuilder('t')
//             .where('t.assigneeId = :userId', { userId })
//             .andWhere('NOT (t.endDate < :start OR t.startDate > :end)', { start: start.toISOString(), end: end.toISOString() })
//             .getMany()

//         return { available: overlaps.length === 0, overlapping: overlaps }
//     }

//     // Create a task with availability validation
//     async createTask(payload: {
//         title: string
//         description?: string
//         startDate: string
//         endDate: string
//         assigneeId: number
//         status: string
//     }) {
//         // validate dates
//         const start = new Date(payload.startDate)
//         const end = new Date(payload.endDate)
//         if (isNaN(start.getTime()) || isNaN(end.getTime())) {
//             throw new BadRequestException('Invalid date format')
//         }
//         if (end < start) {
//             throw new BadRequestException('End date must be after start date')
//         }

//         // Check availability
//         const { available, overlapping } = await this.isUserAvailable(payload.assigneeId, payload.startDate, payload.endDate)
//         if (!available) {
//             // return helpful error
//             throw new BadRequestException({ message: 'User not available during selected dates', overlapping })
//         }

//         const task = this.taskRepo.create({
//             title: payload.title,
//             description: payload.description,
//             startDate: start.toISOString(),
//             endDate: end.toISOString(),
//             assigneeId: payload.assigneeId,
//             status: payload.status,
//         })
//         return this.taskRepo.save(task)
//     }

//     // Optional: update task with reassignment availability check
//     async updateTask(id: number, payload: Partial<Task>) {
//         const task = await this.taskRepo.findOne({ where: { id } })
//         if (!task) throw new NotFoundException('Task not found')

//         // If reassigning or changing dates, check availability
//         const assigneeId = payload.assigneeId ?? task.assigneeId
//         const start = payload.startDate ? new Date(payload.startDate) : new Date(task.startDate)
//         const end = payload.endDate ? new Date(payload.endDate) : new Date(task.endDate)
//         if (end < start) throw new BadRequestException('End date must be after start date')

//         // check overlaps excluding current task
//         const overlaps = await this.taskRepo
//             .createQueryBuilder('t')
//             .where('t.assigneeId = :assigneeId', { assigneeId })
//             .andWhere('t.id != :id', { id })
//             .andWhere('NOT (t.endDate < :start OR t.startDate > :end)', { start: start.toISOString(), end: end.toISOString() })
//             .getMany()

//         if (overlaps.length > 0) {
//             throw new BadRequestException({ message: 'User not available during selected dates', overlapping: overlaps })
//         }

//         Object.assign(task, payload)
//         return this.taskRepo.save(task)
//     }

//     async findAll() {
//         return this.taskRepo.find({ relations: ['assignee'] })
//     }
// }


import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Task } from './task.entity'

@Injectable()
export class TasksService {
    constructor(@InjectRepository(Task) private readonly repo: Repository<Task>) { }

    async findAll() {
        return this.repo.find()
    }

    async create(dto: any) {
        const overlap = await this.repo
            .createQueryBuilder('task')
            .where('task.assigneeId = :assigneeId', { assigneeId: dto.assigneeId })
            .andWhere('(task.startDate <= :endDate AND task.endDate >= :startDate)', dto)
            .getOne()

        if (overlap) throw new BadRequestException('User already has overlapping task')
        const task = this.repo.create(dto)
        return this.repo.save(task)
    }

    async update(id: number, dto: any) {
        const task = await this.repo.findOne({ where: { id } })
        if (!task) throw new NotFoundException()

        // overlap check if user or date changed
        if (dto.assigneeId || dto.startDate || dto.endDate) {
            const overlap = await this.repo
                .createQueryBuilder('task')
                .where('task.assigneeId = :assigneeId', { assigneeId: dto.assigneeId ?? task.assigneeId })
                .andWhere('task.id != :id', { id })
                .andWhere('(task.startDate <= :endDate AND task.endDate >= :startDate)', {
                    startDate: dto.startDate ?? task.startDate,
                    endDate: dto.endDate ?? task.endDate,
                })
                .getOne()

            if (overlap) throw new BadRequestException('Overlapping task for this user')
        }

        Object.assign(task, dto)
        return this.repo.save(task)
    }

    async remove(id: number) {
        const task = await this.repo.findOne({ where: { id } })
        if (!task) throw new NotFoundException()
        await this.repo.remove(task)
        return { success: true }
    }
}
