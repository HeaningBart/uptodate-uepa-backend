import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Article from 'App/Models/Article'
import Image from 'App/Models/Image'
import UpToDate from 'App/Services/UpToDate'
export default class UpToDateController {
  public async get_article({ request, response, bouncer }: HttpContextContract) {
    const isAllowed = await bouncer.with('ReaderPolicy').allows('canView')
    if (isAllowed) {
      const article_slug = request.param('article')
      const db_article = await Article.findBy('slug', article_slug)
      if (db_article) {
        return response.status(200).json(db_article)
      }
      const article = await UpToDate.get_article(article_slug)
      if (article.data.isCanBookmark) {
        await Article.create({
          slug: article_slug,
          data: article.data,
        })
      }
      return response.status(200).json(article)
    } else {
      return response.status(200).json({
        data: {
          topicInfo: {
            title: 'Unauthorized',
            metaDescription: 'Unauthorized',
          },
          bodyHtml: '<p>You cant read this without paying!!</p>',
          outlineHtml: '<p>You cant read this without paying!!</p>',
        },
      })
    }
  }

  public async getImage({ request, response, bouncer }: HttpContextContract) {
    const isAllowed = await bouncer.with('ReaderPolicy').allows('canView')
    if (isAllowed) {
      const image_slug = request.input('imageKey')
      const topic_key = request.input('topicKey')

      const db_image = await Image.findBy('slug', image_slug)
      if (db_image) {
        return response.status(200).json(db_image)
      }
      const article = await UpToDate.get_image(image_slug, topic_key)
      await Image.create({
        slug: image_slug,
        data: article.data,
      })
      return response.status(200).json(article)
    } else {
      return response.status(200).json({
        data: {
          topicInfo: {
            title: 'Unauthorized',
            metaDescription: 'Unauthorized',
          },
          bodyHtml: '<p>You cant read this without paying!!</p>',
          outlineHtml: '<p>You cant read this without paying!!</p>',
        },
      })
    }
  }
}
