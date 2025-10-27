// import { Controller, Get, Post, Body, Param, Put, Delete, Query, BadRequestException } from '@nestjs/common'
// import { TasksService } from './tasks.service'

// @Controller('tasks')
// export class TasksController {
//     constructor(private readonly tasksService: TasksService) { }

//     @Get()
//     async list() {
//         return this.tasksService.findAll()
//     }

//     @Post()
//     async create(@Body() body: any) {
//         return this.tasksService.createTask(body)
//     }

//     @Put(':id')
//     async update(@Param('id') id: string, @Body() body: any) {
//         return this.tasksService.updateTask(Number(id), body)
//     }

//     @Delete(':id')
//     async remove(@Param('id') id: string) {
//         return { ok: true }
//     }

//     /**
//      * ✅ New endpoint to check user availability between two dates
//      * Example:
//      * GET /tasks/check?userId=1&start=2025-10-22T00:00:00Z&end=2025-10-28T00:00:00Z
//      */
//     @Get('check')
//     async checkAvailability(
//         @Query('userId') userId: string,
//         @Query('start') start: string,
//         @Query('end') end: string,
//     ) {
//         if (!userId || !start || !end) {
//             throw new BadRequestException('Missing required query parameters: userId, start, end')
//         }

//         const result = await this.tasksService.isUserAvailable(
//             Number(userId),
//             start,
//             end
//         )

//         // 👇 Return simple shape for frontend
//         return { available: result.available }
//     }
// }


import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common'
import { TasksService } from './tasks.service'

@Controller('tasks')
export class TasksController {
    constructor(private readonly tasksService: TasksService) { }

    @Get()
    findAll() {
        return this.tasksService.findAll()
    }

    @Post()
    create(@Body() body: any) {
        return this.tasksService.create(body)
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() body: any) {
        return this.tasksService.update(id, body)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.tasksService.remove(id)
    }
}
