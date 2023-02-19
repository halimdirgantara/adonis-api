import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { cuid } from '@ioc:Adonis/Core/Helpers'
import Application from '@ioc:Adonis/Core/Application'

export default class AuthController {
  /**
   * async register
  {request, response}: HttpContextContract */
  public async register({ request, response }: HttpContextContract) {
    // Define validation schema
    const registerSchema = schema.create({
      name: schema.string({}, [rules.required()]),
      email: schema.string({}, [rules.email(), rules.required()]),
      password: schema.string({}, [rules.required(), rules.minLength(8)]),
      roleId: schema.number([rules.unsigned(), rules.required()]),
      avatar: schema.file.optional({
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
        size: '1mb',
      }),
    })

    // Validate request data
    const validatedData = await request.validate({ schema: registerSchema })

    // Set default avatar if none provided
    let avatarPath = 'default-avatar.png'
    if (validatedData.avatar) {
      const avatar = validatedData.avatar
      avatarPath = `${cuid()}.${avatar.extname}`
      await avatar.move(Application.tmpPath('uploads'), {
        name: avatarPath,
        overwrite: true,
      })
    }

    // Create a new user record
    const user = new User()
    user.name = validatedData.name
    user.email = validatedData.email
    user.password = validatedData.password
    user.roleId = validatedData.roleId
    user.avatar = avatarPath

    await user.save()

    return response.created({ success: true })
  }
}
