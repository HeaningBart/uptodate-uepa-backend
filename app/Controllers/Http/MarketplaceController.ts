import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MercadoPago from 'App/Services/MercadoPago'
import Payment from 'App/Models/Payment'
import crypto from 'node:crypto'

export default class MarketplaceController {
  public async createPreference({ request, response }: HttpContextContract) {
    const user = request.ctx?.auth.user!
    const promotional_code = request.input('promotional_code')

    const custom_id = crypto.randomUUID()

    const mp_response = await MercadoPago.createPreference(promotional_code, custom_id)

    await Payment.create({
      amount: 1,
      description: 'Compra de um mês de acesso ao UTD',
      custom_id,
      paid: false,
      preference_id: mp_response.id,
      user_id: user.id,
    })

    response.send(mp_response)
  }

  public async getPaymentStatus({ request, response }: HttpContextContract) {
    const preference_id = request.input('preference_id')
    const payment_id = request.input('payment_id')

    const payment_status = await MercadoPago.getPayment(payment_id)

    if (payment_status.status == 'approved' || payment_status.status == 'authorized') {
      const payment = await Payment.findByOrFail('preference_id', preference_id)
      await payment.load('user')
      payment.paid = true
      payment.user.isAuthorized = true

      const due_date = new Date()
      due_date.setDate(due_date.getDate() + 30)

      payment.user.authorizedUntil = due_date

      await payment.user.save()
      await payment.save()

      response.redirect('https://uepautd.online')
    } else {
      response.redirect('https://uepautd.online')
    }
  }

  public async webhook({ request, response }: HttpContextContract) {
    const type = request.input('type')
    if (type !== 'payment') throw new Error('Not a payment')
    const payment_id = request.input('data').id

    const payment_status = await MercadoPago.getPayment(payment_id)

    if (payment_status.status == 'approved' || payment_status.status == 'authorized') {
      const payment = await Payment.findByOrFail('custom_id', payment_status.external_reference)
      await payment.load('user')
      payment.paid = true
      payment.user.isAuthorized = true

      const due_date = new Date()
      due_date.setDate(due_date.getDate() + 30)

      payment.user.authorizedUntil = due_date

      await payment.user.save()
      await payment.save()

      response.redirect('https://uepautd.online')
    } else {
      response.redirect('https://uepautd.online')
    }

    response.status(200)
  }

  public async processIpn({ request, response }: HttpContextContract) {
    const type = request.input('type')
    if (type !== 'payment') throw new Error('Not a payment')
    const payment_id = request.input('data').id

    const payment_status = await MercadoPago.getPayment(payment_id)

    if (payment_status.status == 'approved' || payment_status.status == 'authorized') {
      const payment = await Payment.findByOrFail('custom_id', payment_status.external_reference)
      await payment.load('user')
      payment.paid = true
      payment.user.isAuthorized = true

      const due_date = new Date()
      due_date.setDate(due_date.getDate() + 30)

      payment.user.authorizedUntil = due_date

      await payment.user.save()
      await payment.save()

      response.redirect('https://uepautd.online')
    } else {
      response.redirect('https://uepautd.online')
    }

    response.status(200)
  }
}
