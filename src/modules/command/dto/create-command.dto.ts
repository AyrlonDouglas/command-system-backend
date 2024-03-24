import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Employee } from 'src/modules/employee/entities/employee.entity';

export class CreateCommandDto {
  @ApiProperty({ example: 1, description: 'command table id', required: false })
  tableId?: number;

  @ApiProperty({ example: 78495919095, description: 'command requester cpf' })
  @IsNumber()
  requesterCPF: number;

  @ApiProperty({
    example: 'Ayrlon Douglas',
    description: 'command requester name',
  })
  @IsString()
  requesterName: string;
}
