import { S3 } from '@aws-sdk/client-s3'
import env from '#start/env'
import { MultipartFile } from '@adonisjs/core/bodyparser'
import fs from 'fs/promises'
import { cuid } from '@adonisjs/core/helpers'

export default class BackblazeService {
  public backblaze = new S3({
    endpoint: env.get('S3_ENDPOINT'),
    region: env.get('S3_REGION'),
    credentials: {
      accessKeyId: env.get('S3_KEY')!,
      secretAccessKey: env.get('S3_SECRET')!,
    },
  })

  private CDN = env.get('S3_CDN')

  async upload_file(file: MultipartFile) {
    const buffer = await fs.readFile(file.tmpPath!)
    const filename = `${cuid()}.${file.extname}`
    await this.backblaze.putObject({
      Bucket: env.get('S3_BUCKET'),
      Key: filename,
      Body: buffer,
      ContentType: `${file.type!}/${file.subtype}`,
    })

    return this.get_url(filename)
  }

  async get_url(file: string) {
    return new URL(`/file/${env.get('S3_BUCKET')}/${file}`, this.CDN).toString()
  }
}
