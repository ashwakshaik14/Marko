import { IsOptional, IsString, IsUrl, Length } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  url: string;

  @IsOptional()
  @IsString()
  @Length(3, 20)
  customCode?: string;
}
