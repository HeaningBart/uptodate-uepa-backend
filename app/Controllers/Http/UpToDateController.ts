import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpToDate from 'App/Services/UpToDate'
export default class UpToDatesController {
  public async index({}: HttpContextContract) {
    await UpToDate.get_logged_in_API()
  }

  public async get_article({ request, response }: HttpContextContract) {
    const article_slug = request.param('article')
    console.log(article_slug)
    const article = await UpToDate.get_article(article_slug)
    response.status(200).json(article)
  }
}
