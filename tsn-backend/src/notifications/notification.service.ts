import { Injectable } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';
import { User } from '../users/user.entity';

@Injectable()
export class NotificationsService {
    constructor(private readonly gateway: NotificationsGateway) { }

    async notifyUser(user: User, message: string) {
        this.gateway.sendNotification(user.email, message);
    }
}
