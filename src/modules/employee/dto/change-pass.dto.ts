import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePassDto {
  @ApiProperty({ description: 'old pass', example: 'alterarsenhaagora' })
  @IsString()
  oldPass: string;

  @ApiProperty({ description: 'new pass', example: '123456' })
  @IsString()
  newPass: string;
}
