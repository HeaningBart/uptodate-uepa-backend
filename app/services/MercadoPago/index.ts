import Env from '#start/env'
import { MercadoPagoConfig, Payment, Preference } from 'mercadopago'
import Product from '#models/product'
import LocalPayment from '#models/payment'
import env from '#start/env'
import stringHelpers from '@adonisjs/core/helpers/string'
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/core'
import UserService from '#services/user_service'
import { randomUUID } from 'crypto'

const accessToken = Env.get('MERCADOPAGO_ACCESS_TOKEN', '')

const client = new MercadoPagoConfig({
  accessToken,

  options: { timeout: 5000, idempotencyKey: randomUUID() },
})
const preferences = new Preference(client)
const payment = new Payment(client)

@inject()
export default class MercadoPagoService {
  constructor(protected users: UserService) {}

  async createPreference(product_id: number, external_reference: string) {
    const current_user = HttpContext.get()?.auth.user!
    const product = await Product.findOrFail(product_id)
    const response = await preferences.create({
      body: {
        auto_return: 'approved',
        back_urls: {
          success: `${env.get('API_URL')}/preferences/process`,
          pending: `${env.get('API_URL')}/preferences/process`,
          failure: `${env.get('API_URL')}/preferences/process`,
        },
        external_reference,
        redirect_urls: {
          success: `${env.get('FRONTEND_URL')}/store/${external_reference}`,
          pending: `${env.get('FRONTEND_URL')}/store/${external_reference}`,
          failure: `${env.get('FRONTEND_URL')}/store/${external_reference}`,
        },
        items: [
          {
            id: stringHelpers.slug(product.title),
            title: product.title,
            quantity: 1,
            currency_id: 'BRL',
            unit_price: product.unitPrice,
            description: product.description,
            category_id: 'virtual_goods',
          },
        ],
      },
    })
    await LocalPayment.create({
      custom_id: external_reference,
      preference_id: response.id,
      user_id: current_user.id,
      amount: product.unitPrice,
      description: product.description,
      paid: false,
    })

    return response
  }

  async get_preference_by_external_reference(external_reference: string) {
    const payment = await LocalPayment.findByOrFail('custom_id', external_reference)
    const response = await preferences.get({ preferenceId: payment.preference_id })
    return response
  }

  async getPayment(id: string) {
    const response = await payment.get({ id })
    return response
  }
}
