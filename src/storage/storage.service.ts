import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fsp from 'node:fs/promises';
import * as path from 'node:path';
import { Resource } from '@core/core.constants';

@Injectable()
export class StorageService {
  private readonly uploadDir: string;
  private readonly uploadUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get<string>('UPLOAD_DIR') as string;
    this.uploadUrl = this.configService.get<string>('UPLOAD_URL') as string;
  }

  async upload(files: Express.Multer.File[], resource: Resource, id: any) {
    return await Promise.all(
      files.map(async (file) =>
        !!file ? await this._upload(file, resource, id) : undefined,
      ),
    );
  }
  private async _upload(
    file: Express.Multer.File,
    resource: Resource,
    id: any,
  ) {
    const dirname = path.join(
      this.uploadDir,
      `${resource.toLowerCase()}s`,
      `${id}`,
    );
    await this.mkdir(dirname);
    const filePath = path.join(dirname, this.getFilename(file));
    if (!!file?.buffer) {
      await fsp.writeFile(filePath, file.buffer);
    } else {
      await fsp.copyFile(file.path, filePath);
    }
    return this.url(filePath);
  }

  url(path: string) {
    if (path.startsWith(this.uploadDir)) {
      return path
        .replace(this.uploadDir, this.uploadUrl)
        .replace(/\/{2,}/, '/');
    }
    return path;
  }

  private getFilename(file: Express.Multer.File) {
    const fileExt = path.extname(file.originalname);
    return `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
  }

  async delete(url: string) {
    await fsp.rm(this.path(url), { recursive: true, force: true });
  }

  path(url: string) {
    if (url.startsWith(this.uploadUrl)) {
      return url.replace(this.uploadUrl, this.uploadDir);
    }
    return url;
  }

  private async mkdir(path: string) {
    try {
      await fsp.access(path);
    } catch (err) {
      await fsp.mkdir(path, { recursive: true, mode: '755' });
    }
    return path;
  }
}
