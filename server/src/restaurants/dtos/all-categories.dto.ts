import { CoreOutput } from '../../common/dtos/output.dto';
import { Category } from '../enteties/category.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
  @Field((type) => [Category], { nullable: true })
  categories?: Category[];
}
