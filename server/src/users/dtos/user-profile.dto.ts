import { ArgsType, Field, ObjectType } from '@nestjs/graphql';
import { MutationOutput } from '../../common/dtos/output.dto';
import { User } from '../entities/user.entity';

@ArgsType()
export class UserProfileDto {
  @Field((type) => Number)
  userId: number;
}

@ObjectType()
export class UserProfileOutput extends MutationOutput {
  @Field((type) => User, { nullable: true })
  user?: User;
}
