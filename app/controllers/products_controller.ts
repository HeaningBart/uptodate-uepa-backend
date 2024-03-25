import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class ProductsController {
  async get({ request, response }: HttpContext) {
    const id = request.param('id')
    const product = await Product.findByOrFail('id', id)
    console.log(product)
    response.status(200).json(product.serialize())
  }

  async create({ request, response }: HttpContext) {
    const data = request.only(['title', 'unitPrice', 'description', 'duration'])
    const product = await Product.create(data)
    response.status(201).json(product.serialize())
  }

  async update({ request, response }: HttpContext) {
    const id = request.param('id')
    const data = request.only(['title', 'unitPrice', 'description', 'duration'])
    const product = await Product.findByOrFail('id', id)
    product.merge(data)
    await product.save()
    response.status(200).json(product.serialize())
  }

  async delete({ request, response }: HttpContext) {
    const id = request.param('id')
    const product = await Product.findByOrFail('id', id)
    await product.delete()
    response.status(204)
  }

  async query({ request, response }: HttpContext) {
    const query_string = request.input('query', '')
    const order = request.input('order', 'asc')
    const orderBy = request.input('orderBy', 'id')
    const page = request.input('page', 1)
    const perPage = request.input('perPage', 12)
    const products = await Product.query()
      .where((query) => {
        query
          .orWhere('title', 'ILIKE', `%${query_string}%`)
          .orWhere('description', 'ILIKE', `%${query_string}%`)
      })
      .orderBy(orderBy, order)
      .paginate(page, perPage)
    response.send(products.serialize())
  }
}
