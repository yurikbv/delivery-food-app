import { InputType, ObjectType, PickType, Field } from '@nestjs/graphql';
import { Restaurant } from '../enteties/restaurant.entity';
import { CoreOutput } from '../../common/dtos/output.dto';

// OmitType remove these fields from response
/*export class CreateRestaurantInput extends OmitType(Restaurant, [
  'id',
  'category',
  'owner',
]) {}*/

//PickType Take only these fields
@InputType()
export class CreateRestaurantInput extends PickType(Restaurant, [
  'name',
  'address',
  'coverImage',
]) {
  @Field((type) => String)
  categoryName: string;
}

@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {}
