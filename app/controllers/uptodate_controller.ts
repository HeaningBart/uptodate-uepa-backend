import Article from '#models/article'
import UpToDateService from '#services/uptodate_service'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import Image from '#models/image'

@inject()
export default class UptodateController {
  constructor(protected upToDate: UpToDateService) {}

  async get({ request, response }: HttpContext) {
    const article_slug = request.param('slug')
    const article = await Article.findBy('slug', article_slug)
    if (article) return response.json(article)
    const data = await this.upToDate.get_article(article_slug)
    if (data.data.isCanBookmark) {
      await Article.create({
        slug: article_slug,
        data: data.data,
      })
    }
    response.status(200).json(data)
    for (let i = 0; i <= data.data.topicInfo.relatedGraphics.length; i++) {
      try {
        const graphic = data.data.topicInfo.relatedGraphics[i]
        if (!graphic) return
        const topicKey = `${data.data.topicInfo.relatedGraphics[i].imageKey.split('/')[0]}/${data.data.topicInfo.id}`
        const db_image = await Image.findBy('slug', graphic.imageKey)
        if (!db_image && graphic) {
          const image = await this.upToDate.get_image(graphic.imageKey, topicKey)
          await Image.create({
            slug: graphic.imageKey,
            data: image.data,
          })
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  async get_image({ request, response }: HttpContext) {
    const topic_key = request.input('topicKey')
    const image_slug = request.input('imageKey')
    const db_image = await Image.findBy('slug', image_slug)

    if (db_image) return response.json(db_image)
    const article = await this.upToDate.get_image(image_slug, topic_key)
    await Image.create({
      slug: image_slug,
      data: article.data,
    })
    return response.status(200).json(article)
  }

  async delete({}: HttpContext) {}
}
