import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Restaurant } from '../restaurants/enteties/restaurant.entity';
import { PaymentResolver } from './payments.resolver';
import { PaymentService } from './payments.service';

@Module({
  controllers: [PaymentsController],
  imports: [TypeOrmModule.forFeature([Payment, Restaurant])],
  providers: [PaymentService, PaymentResolver],
})
export class PaymentsModule {}
