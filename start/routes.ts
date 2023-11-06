import Route from '@ioc:Adonis/Core/Route'
Route.post('/login', 'UsersController.login')
Route.post('/register', 'UsersController.register')

Route.get('/articles/:article', 'UpToDateController.get_article')
Route.get('/contents/image', 'UpToDateController.getImage')

Route.get('/status', 'UsersController.getUserStatus')

Route.group(() => {
  Route.get('/user', 'UsersController.getUserData')
}).prefix('auth')

Route.group(() => {
  Route.get('/', 'UsersController.query')
  Route.get('/:id', 'UsersController.getUser')
  Route.put('/:id', 'UsersController.update')
}).prefix('users')

Route.group(() => {
  Route.post('/create', 'MarketplaceController.createPreference').middleware('auth:api')
  Route.get('/payments', 'MarketplaceController.getPaymentStatus')
}).prefix('marketplace')
