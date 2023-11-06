import Env from '@ioc:Adonis/Core/Env'
import { configurations, preferences, payment } from 'mercadopago'
import { CreatePreferenceResponse, GetPaymentResponse } from './interface'
import PromotionalCode from 'App/Models/PromotionalCode'

const accessToken = Env.get('MERCADOPAGO_ACCESS_TOKEN', '')

configurations.configure({
  access_token: accessToken,
})

class MercadoPagoService {
  public async createPreference(promotional_code?: string, external_reference?: string) {
    const code = await PromotionalCode.findBy('slug', promotional_code)

    const response = code
      ? await preferences.create({
          auto_return: 'approved',
          back_urls: {
            success: 'https://api.uepautd.online/marketplace/payments',
            pending: 'https://api.uepautd.online/marketplace/payments',
            failure: 'https://api.uepautd.online/marketplace/payments',
          },
          ...(external_reference && { external_reference }),
          items: [
            {
              title: 'Assinatura mensal - UTD',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: 12 * (1 - code.discount),
              description: 'Compra de uma assinatura mensal válida de UTD (válida por 30 dias)',
              category_id: 'virtual_goods',
            },
          ],
        })
      : await preferences.create({
          auto_return: 'approved',
          back_urls: {
            success: 'https://api.uepautd.online/marketplace/payments',
            pending: 'https://api.uepautd.online/marketplace/payments',
            failure: 'https://api.uepautd.online/marketplace/payments',
          },
          ...(external_reference && { external_reference }),
          items: [
            {
              title: 'Assinatura mensal - UTD',
              quantity: 1,
              currency_id: 'BRL',
              unit_price: 12,
              description: 'Compra de uma assinatura mensal válida de UTD (válida por 30 dias)',
              category_id: 'virtual_goods',
            },
          ],
        })
    return response.response as CreatePreferenceResponse
  }

  public async getPayment(id: string) {
    const response = (await payment.get(id)).response
    return response as GetPaymentResponse
  }
}

export default new MercadoPagoService()
