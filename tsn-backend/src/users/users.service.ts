import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User } from './user.entity'

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepo: Repository<User>,
    ) { }

    async findAll(): Promise<User[]> {
        return this.userRepo.find()
    }

    async findOne(id: number): Promise<User | null> {
        return this.userRepo.findOne({ where: { id } })
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepo.findOne({ where: { email } })
    }

    async create(name: string, email: string, password: string): Promise<User> {
        const hash = await bcrypt.hash(password, 10)
        const user = this.userRepo.create({
            name,
            email,
            password_hash: hash,
        })
        return this.userRepo.save(user)
    }

    async updateBalance(id: number, amount: number): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } })
        if (!user) throw new NotFoundException('User not found')
        user.balance += amount
        return this.userRepo.save(user)
    }
}
