import CreatedUserRdo from '../user/create-user.dto.js';

export default class CommentRdo {
  public id!: string;

  public text!: string;

  public rating!: number;

  public createdAt!: string;

  public author!: CreatedUserRdo;
}
