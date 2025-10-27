import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepo: Repository<User>,
        private jwtService: JwtService
    ) { }

    async validateUser(email: string, pass: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) return null;
        const ok = await bcrypt.compare(pass, user.password_hash);
        if (!ok) return null;
        // @ts-ignore
        delete user.password_hash;
        return user;
    }

    async login(email: string, password: string) {
        const user = await this.userRepo.findOneBy({ email });
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) throw new UnauthorizedException('Invalid credentials');
        const payload = { email: user.email, sub: user.id, name: user.name };
        return { access_token: this.jwtService.sign(payload) };
    }
}
