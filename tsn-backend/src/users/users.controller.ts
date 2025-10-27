import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common'
import { UsersService } from './users.service'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    // GET /users
    @Get()
    async getAllUsers() {
        return this.usersService.findAll()
    }

    // GET /users/:id
    @Get(':id')
    async getUser(@Param('id') id: number) {
        return this.usersService.findOne(Number(id))
    }

    // POST /users
    @Post()
    async createUser(
        @Body() body: { name: string; email: string; password: string },
    ) {
        return this.usersService.create(body.name, body.email, body.password)
    }

    // PATCH /users/:id/balance
    @Patch(':id/balance')
    async updateBalance(
        @Param('id') id: number,
        @Body() body: { amount: number },
    ) {
        return this.usersService.updateBalance(Number(id), body.amount)
    }


}
