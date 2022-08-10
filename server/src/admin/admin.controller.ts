import { Controller, Get, Query } from '@nestjs/common';
import { UserType } from '@prisma/client';
import { Roles } from 'src/decorators/roles.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    
    constructor(private readonly adminService: AdminService){}

    @Roles(UserType.ADMIN)
    @Get()
    getAllUsers(){
        return this.adminService.getAllUsers();
    }
}
