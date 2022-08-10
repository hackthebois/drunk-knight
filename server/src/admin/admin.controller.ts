import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    
    constructor(private readonly adminService: AdminService){}

    @Roles(UserType.ADMIN)
    @Get()
    getAllUsers(@Query('UserType') user_type: UserType){
        const filter = user_type in UserType ? { user_type } : undefined;
        return this.adminService.getAllUsers();
    }
}
