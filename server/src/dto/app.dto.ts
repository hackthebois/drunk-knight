import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class PlayDto {
	@IsOptional()
	@ApiProperty()
	excludeDeckIds: string[];
}
