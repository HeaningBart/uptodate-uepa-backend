export interface CreatePreferenceResponse {
  client_id: string
  collector_id: number
  date_created: string
  id: string
  init_point: string
  items: {
    id: string
    category_id: string
    currency_id: string
    description: string
    title: string
    quantity: number
    unit_price: number
  }[]
  sandbox_init_point: string
}

export interface GetPaymentResponse {
  date_approved: string
  date_created: string
  description: string
  id: number
  status: string
  external_reference: string
}
