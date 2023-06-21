import { IsString, Length, IsInt, Min, Max } from 'class-validator';
import { CommentV } from '../../../const/validation.js';
import { Expose } from 'class-transformer';

export default class CreateCommentDto {
  @Expose()
  @IsString()
  @Length(CommentV.Text.Min, CommentV.Text.Max)
  public text!: string;

  public offerId!: string;

  public userId!: string;

  @Expose()
  @IsInt()
  @Min(CommentV.Rating.Min)
  @Max(CommentV.Rating.Max)
  public rating!: number;
}
