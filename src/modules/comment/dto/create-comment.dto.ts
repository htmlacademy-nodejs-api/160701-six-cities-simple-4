import { IsMongoId, IsString, Length, IsInt, Min, Max } from 'class-validator';
import { CommentV } from '../../../const/validation.js';

export default class CreateCommentDto {
  @IsString({ message: 'text is required' })
  @Length(CommentV.Text.Min, 1024, { message: 'Min length is 5, max is 1024' })
  public text!: string;

  @IsMongoId({ message: 'offerId field must be a valid id' })
  public offerId!: string;

  @IsMongoId({ message: 'userId field must be a valid id' })
  public userId!: string;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(CommentV.Rating.Min, { message: `Minimum rating is ${CommentV.Rating.Min}` })
  @Max(CommentV.Rating.Max, { message: `Maximum rating is ${CommentV.Rating.Max}` })
  public rating!: number;
}
