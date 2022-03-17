import { InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from '../enteties/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(Restaurant, ['id']) {}
