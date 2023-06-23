import { DocumentType, types } from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { LoggerInterface } from '../../core/logger/logger.interface.js';
import UpdateUserDto from './dto/update-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from '../../app/app.constant.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>,
  ) {}

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, avatarPath: DEFAULT_AVATAR_FILE_NAME });
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(`New user created: ${user.email}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existUser = await this.findByEmail(dto.email);

    if (existUser) {
      return existUser;
    }

    return this.create(dto, salt);
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    return user?.verifyPassword(dto.password, salt) ? user : null;
  }

  public async getFavorites(email: string): Promise<string[]> {
    const foundedUser = await this.findByEmail(email);

    return foundedUser?.favorites || [];
  }

  public async addFavorites(email: string, offerId: string): Promise<string[]> {
    const foundedUser = await this.findByEmail(email);
    const foundedFavorites = foundedUser?.favorites || [];
    const newFavorites = Array.from(new Set([...foundedFavorites, offerId]));
    const newUser = await this.userModel
      .findByIdAndUpdate(foundedUser?.id, { favorites: newFavorites }, { new: true })
      .exec();

    return newUser?.favorites || [];
  }

  public async removeFavorites(email: string, offerId: string): Promise<string[]> {
    const foundedUser = await this.findByEmail(email);
    const foundedFavorites = foundedUser?.favorites || [];
    const newFavorites = foundedFavorites.filter((id) => id !== offerId);

    const newUser = await this.userModel
      .findByIdAndUpdate(foundedUser?.id, { favorites: newFavorites }, { new: true })
      .exec();

    return newUser?.favorites || [];
  }

  public async clearFavorites(offerId: string): Promise<number> {
    const result = await this.userModel.updateMany(
      { favorites: { $exists: true, $ne: [] } },
      { $pull: { favorites: offerId } },
    );
    return result.modifiedCount;
  }
}
