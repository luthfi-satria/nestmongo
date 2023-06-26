import {
  IsEmail,
  IsNotEmpty,
  IsNumberString,
  IsString,
  Length,
  ValidateIf,
} from 'class-validator';

export class CreateUsersDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;

  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @ValidateIf((o) => o.email !== '')
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsNumberString()
  @Length(10, 15)
  phone: string;
}
