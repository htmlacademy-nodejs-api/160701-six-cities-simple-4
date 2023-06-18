import { IsMongoId, IsString, Length, IsInt, Min, Max, IsOptional } from 'class-validator';
import { CommentV } from '../../../const/validation.js';

export default class CreateCommentDto {
  @IsString()
  @Length(CommentV.Text.Min, CommentV.Text.Max)
  public text!: string;

  @IsOptional()
  @IsMongoId()
  public offerId!: string;

  @IsMongoId()
  public userId!: string;

  @IsInt()
  @Min(CommentV.Rating.Min)
  @Max(CommentV.Rating.Max)
  public rating!: number;
}
