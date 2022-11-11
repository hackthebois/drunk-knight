import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class PlayDto {
	@IsOptional()
	@IsBoolean()
	@ApiProperty()
	useStandard: boolean;
}
