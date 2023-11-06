import Route from '@ioc:Adonis/Core/Route'
Route.post('/login', 'UsersController.login')
Route.post('/register', 'UsersController.register')

Route.get('/articles/:article', 'UpToDateController.get_article')
Route.get('/contents/image', 'UpToDateController.getImage')

Route.get('/status', 'UsersController.getUserStatus')

Route.post('/webhooks', 'MarketplaceController.webhook')
Route.post('/ipn', 'MarketplaceController.processIpn')

Route.group(() => {
  Route.get('/user', 'UsersController.getUserData')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'UsersController.query')
  Route.get('/:id', 'UsersController.getUser')
  Route.put('/:id', 'UsersController.update')
})
  .prefix('users')
  .middleware('only:Admin')

Route.group(() => {
  Route.post('/create', 'MarketplaceController.createPreference').middleware('auth:api')
  Route.get('/payments', 'MarketplaceController.getPaymentStatus')
}).prefix('marketplace')

Route.group(() => {
  Route.get('/', 'CodesController.query')
  Route.post('/create', 'CodesController.create')
  Route.put('/update', 'CodesController.update')
  Route.delete('/delete', 'CodesController.delete')
})
  .prefix('codes')
  .middleware('only:Admin')
