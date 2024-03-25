/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

router.get('/article/:slug', '#controllers/uptodate_controller.get')
router.get('/contents/image', '#controllers/uptodate_controller.get_image')
router.get('/auth/user', '#controllers/users_controller.get')
router.post('/auth/login', '#controllers/users_controller.login')

router.get('/products', '#controllers/products_controller.query')
router.get('/products/:id', '#controllers/products_controller.get')
router.post('/products', '#controllers/products_controller.create')
router.put('/products/:id', '#controllers/products_controller.update')
router.delete('/products/:id', '#controllers/products_controller.delete')

router.post('/preferences', '#controllers/mercadopago_controller.create_preference')
router.get('/preferences/external/:id', '#controllers/mercadopago_controller.get_preference')
router.get('/preferences/process', '#controllers/mercadopago_controller.process_payment')

router
  .group(() => {
    router.get('/query', '#controllers/users_controller.query')
    router.get('/:id', '#controllers/users_controller.get')
    router.put('/:id', '#controllers/users_controller.update')
  })
  .prefix('users')
