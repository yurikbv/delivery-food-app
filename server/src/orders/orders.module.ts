import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderResolver } from './orders.resolver';
import { OrderService } from './orders.service';
import { Restaurant } from '../restaurants/enteties/restaurant.entity';
import { OrderItem } from './entities/order.item.entity';
import { Dish } from '../restaurants/enteties/dish.entity';
import { PubSub } from 'graphql-subscriptions';

@Module({
  imports: [TypeOrmModule.forFeature([Order, Restaurant, OrderItem, Dish])],
  providers: [OrderResolver, OrderService],
})
export class OrdersModule {}
