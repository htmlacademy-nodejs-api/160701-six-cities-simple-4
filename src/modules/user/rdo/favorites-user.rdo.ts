import { Expose } from 'class-transformer';

export default class FavoritesUserRdo {
  @Expose()
  public favorites!: string[];
}
