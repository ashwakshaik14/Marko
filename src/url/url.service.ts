import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url, UrlDocument } from './schema/url.schema'; // ✅ fixed path
import { CreateUrlDto } from './dto/create-url.dto';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(@InjectModel(Url.name) private urlModel: Model<UrlDocument>) {}

  async createShortUrl(dto: CreateUrlDto) {
    const { url, customCode } = dto;
    const shortCode = customCode || nanoid(6);

    const exists = await this.urlModel.findOne({ shortCode });
    if (exists) throw new ConflictException('Short code already in use');

    const newUrl = new this.urlModel({
      originalUrl: url,
      shortCode,
    });

    return newUrl.save();
  }

  async getOriginalUrl(shortCode: string): Promise<string> {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('URL not found');

    url.clicks++;
    await url.save();

    return url.originalUrl;
  }

  async getStats(shortCode: string) {
    const url = await this.urlModel.findOne({ shortCode });
    if (!url) throw new NotFoundException('URL not found');

    return {
      originalUrl: url.originalUrl,
      shortUrl: `https://marko-79lx.onrender.com/r/${url.shortCode}`,
      clicks: url.clicks,
    };
  }
}
