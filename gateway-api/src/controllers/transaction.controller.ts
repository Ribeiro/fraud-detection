import { Controller, Post, Body } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { TransactionDto } from '../dtos/transaction.dto';
import { TransactionService } from '../services/transaction.service';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post('authorize')
  async authorize(@Body() body: TransactionDto) {
    const dto = plainToInstance(TransactionDto, body);
    return this.transactionService.initiateTransaction(dto);
  }
}
