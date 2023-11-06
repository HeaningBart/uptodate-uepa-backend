/*
|--------------------------------------------------------------------------
| Application middleware
|--------------------------------------------------------------------------
|
| This file is used to define middleware for HTTP requests. You can register
| middleware as a `closure` or an IoC container binding. The bindings are
| preferred, since they keep this file clean.
|
*/

import Server from '@ioc:Adonis/Core/Server'

Server.middleware.register([
  () => import('@ioc:Adonis/Core/BodyParser'),
  () => import('App/Middleware/SilentAuth'),
])

Server.middleware.registerNamed({
  silentAuth: () => import('App/Middleware/SilentAuth'),
  auth: () => import('App/Middleware/Auth'),
})
