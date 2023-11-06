import { test } from '@japa/runner'

import MercadoPago from 'App/Services/MercadoPago'

test.group('mercado pago test', () => {
  test('can upload', async ({}) => {
    console.log(await MercadoPago.getPayment('1319361205'))
  })
})
