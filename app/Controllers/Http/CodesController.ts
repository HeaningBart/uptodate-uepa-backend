import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PromotionalCode from 'App/Models/PromotionalCode'

export default class CodesController {
  public async query({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ReaderPolicy').authorize('adminActions')

    const querystring = request.input('query')

    const codes = await PromotionalCode.query()
      .where((query) => {
        query.where('slug', 'ILIKE', `%${querystring}%`)
      })
      .paginate(1, 12)

    response.json(codes)
  }

  public async create({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ReaderPolicy').authorize('adminActions')

    const { canBeUsed, slug, discount } = request.all()

    await PromotionalCode.create({
      canBeUsed,
      discount,
      slug,
    })

    response.status(200)
  }

  public async update({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ReaderPolicy').authorize('adminActions')

    const slug = request.input('slug')

    const code = await PromotionalCode.findByOrFail('slug', slug)
    const discount = request.input('discount', code.discount)
    const canBeUsed = request.input('canBeUsed', code.canBeUsed)

    code.discount = discount
    code.canBeUsed = canBeUsed

    await code.save()

    response.status(200)
  }

  public async delete({ request, response, bouncer }: HttpContextContract) {
    await bouncer.with('ReaderPolicy').authorize('adminActions')
    const slug = request.input('slug')
    const code = await PromotionalCode.findByOrFail('slug', slug)
    await code.delete()
    response.status(200)
  }
}
