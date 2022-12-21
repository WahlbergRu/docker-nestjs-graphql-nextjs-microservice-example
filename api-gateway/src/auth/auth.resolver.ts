import { Inject, OnModuleInit, UseGuards } from '@nestjs/common'
import { ClientGrpcProxy } from '@nestjs/microservices'
import { Resolver, Args, Mutation, Context } from '@nestjs/graphql'

import { isEmpty } from 'lodash'
import { PinoLogger } from 'nestjs-pino'

import { AuthService } from './auth.service'
import { RefreshAuthGuard } from './refresh-auth.guard'
import { CurrentUser } from './user.decorator'

import { IUsersService } from '../users/users.interface'
import { User, SignupUserInput, UserPayload, LoginUserInput } from '../graphql/typings'

import { PasswordUtils } from '../utils/password.utils'
import { lastValueFrom } from 'rxjs'

@Resolver()
export class AuthResolver implements OnModuleInit {
  constructor(
    @Inject('UsersServiceClient')
    private readonly usersServiceClient: ClientGrpcProxy,

    private readonly authService: AuthService,

    private readonly passwordUtils: PasswordUtils,

    private readonly logger: PinoLogger
  ) {
    logger.setContext(AuthResolver.name)
  }

  private usersService: IUsersService

  onModuleInit(): void {
    this.usersService = this.usersServiceClient.getService<IUsersService>('UsersService')
  }

  @Mutation()
  async signup(@Args('data') data: SignupUserInput): Promise<UserPayload> {
    const { count } = await lastValueFrom(
      this.usersService.count({
        where: JSON.stringify({ email: data.email })
      })
    )

    if (count >= 1) throw new Error('Email taken')

    const user: User = await lastValueFrom(
      this.usersService.create({
        ...data,
        password: await this.passwordUtils.hash(data.password)
      })
    )

    this.logger.warn('UsersMutation#create.result %o', user.createdAt)

    return { user }
  }

  @Mutation()
  async login(@Context() context: any, @Args('data') data: LoginUserInput): Promise<UserPayload> {
    const { res } = context

    const user: any = await lastValueFrom(
      this.usersService.findOne({
        where: JSON.stringify({ email: data.email })
      })
    )

    if (isEmpty(user)) throw new Error('Unable to login')

    const isSame: boolean = await this.passwordUtils.compare(data.password, user.password)

    if (!isSame) throw new Error('Unable to login')

    res.cookie('access-token', await this.authService.generateAccessToken(user), {
      httpOnly: true,
      maxAge: 1.8e6
    })
    res.cookie('refresh-token', await this.authService.generateRefreshToken(user), {
      httpOnly: true,
      maxAge: 1.728e8
    })

    return { user }
  }

  @Mutation()
  @UseGuards(RefreshAuthGuard)
  async refreshToken(@Context() context: any, @CurrentUser() user: User): Promise<UserPayload> {
    const { res } = context

    res.cookie('access-token', await this.authService.generateAccessToken(user), {
      httpOnly: true,
      maxAge: 1.8e6
    })
    res.cookie('refresh-token', await this.authService.generateRefreshToken(user), {
      httpOnly: true,
      maxAge: 1.728e8
    })

    return { user }
  }

  @Mutation()
  async logout(@Context() context: any): Promise<boolean> {
    const { res } = context

    res.cookie('access-token', '', {
      httpOnly: true,
      maxAge: 0
    })
    res.cookie('refresh-token', '', {
      httpOnly: true,
      maxAge: 0
    })

    return true
  }
}
