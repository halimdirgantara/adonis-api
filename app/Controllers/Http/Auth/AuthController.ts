import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import User from 'App/Models/User'

export default class AuthController {
  /**
   * async register
  {request, response}: HttpContextContract */
  public async register({ request, response }: HttpContextContract) {
    //validate request
    const validations = await schema.create({
      email: schema.string({}, [rules.email(), rules.unique({ table: 'users', column: 'email' })]),
      password: schema.string({}, [rules.confirmed(), rules.minLength(8)]),
      name: schema.string({}, [rules.confirmed()]),
    })
    const data = await request.validate({ schema: validations })
    const user = await User.create(data)
    return response.created(user)
  }
}
