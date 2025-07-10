import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { Response } from 'express';
import { ApiTags, ApiBody, ApiResponse } from '@nestjs/swagger';

@ApiTags('URL Shortener')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('/api/shorten')
  @ApiBody({ type: CreateUrlDto })
  @ApiResponse({ status: 201, description: 'Short URL created' })
  async shorten(@Body() dto: CreateUrlDto) {
    const data = await this.urlService.createShortUrl(dto);
    return {
      originalUrl: data.originalUrl,
      shortUrl: `http://localhost:3000/r/${data.shortCode}`,
    };
  }

  @Get('/r/:shortCode')
  async redirect(@Param('shortCode') code: string, @Res() res: Response) {
    const original = await this.urlService.getOriginalUrl(code);
    return res.redirect(HttpStatus.FOUND, original);
  }

  @Get('/api/stats/:shortCode')
  async stats(@Param('shortCode') code: string) {
    return this.urlService.getStats(code);
  }
}
