import Payment from '#models/payment'
import Product from '#models/product'
import MercadoPagoService from '#services/MercadoPago/index'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { randomUUID } from 'crypto'

@inject()
export default class MercadopagosController {
  constructor(protected MercadoPago: MercadoPagoService) {}

  async create_preference({ request, response }: HttpContext) {
    const product_id = request.input('id')
    const custom_id = randomUUID()
    const preference = await this.MercadoPago.createPreference(product_id, custom_id)
    response.status(201).json(preference)
  }

  async get_preference({ request, response }: HttpContext) {
    const payment_id = request.param('id')
    const payment = await this.MercadoPago.get_preference_by_external_reference(payment_id)
    response.status(200).json(payment)
  }

  async process_payment({ request, response }: HttpContext) {
    const preference_id = request.input('preference_id')
    const payment_id = request.input('payment_id')
    const payment_status = await this.MercadoPago.getPayment(payment_id)
    if (payment_status.status == 'approved' || payment_status.status == 'authorized') {
      const payment = await Payment.findByOrFail('preference_id', preference_id)
      await payment.load('user')
      payment.paid = true
      payment.payment_id = payment_status.id!.toString()
      payment.user.isAuthorized = true
      const product = await Product.findByOrFail('unit_price', payment.amount)
      const due_date = new Date(new Date().setDate(new Date().getDate() + product.duration))
      payment.user.authorizedUntil = due_date
      await payment.user.save()
      await payment.save()
      response.redirect('https://uptodatedopara.com')
    } else {
      response.redirect('https://uptodatedopara.com')
    }
  }
}
