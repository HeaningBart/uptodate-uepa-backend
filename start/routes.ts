import Route from '@ioc:Adonis/Core/Route'

Route.get('/', 'UpToDateController.index')
Route.get('/articles/:article', 'UpToDateController.get_article')
