import Route from '@ioc:Adonis/Core/Route'

Route.group(() => {
  //registration user
  Route.post('register', 'Auth/AuthController.register').as('register')
}).prefix('api/v1/')
