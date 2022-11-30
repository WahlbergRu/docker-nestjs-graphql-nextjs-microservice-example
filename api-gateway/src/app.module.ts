import { join } from 'path'

import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { GraphQLModule, GqlModuleOptions } from '@nestjs/graphql'

import { LoggerModule, PinoLogger } from 'nestjs-pino'

import { DateTimeResolver, EmailAddressResolver, UnsignedIntResolver } from 'graphql-scalars'
import { GraphQLJSONObject } from 'graphql-type-json'

import { AuthModule } from './auth/auth.module'
import { CommentsModule } from './comments/comments.module'
import { PostsModule } from './posts/posts.module'
import { UsersModule } from './users/users.module'

import { playgroundQuery } from './graphql/playground-query'
import { ApolloDriver } from '@nestjs/apollo'

@Module({
  imports: [
    ConfigModule.forRoot(),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          pinoHttp: {
            safe: true,
            prettyPrint: configService.get<string>('NODE_ENV') !== 'production'
          }
        };
      }
    }),
    GraphQLModule.forRootAsync({
      imports: [LoggerModule],
      driver: ApolloDriver,
      useFactory: async (logger: PinoLogger) => ({
        path: '/',
        // subscriptions: '/',
        typePaths: ['./**/*.graphql'],
        resolvers: {
          DateTime: DateTimeResolver,
          EmailAddress: EmailAddressResolver,
          UnsignedInt: UnsignedIntResolver,
          JSONObject: GraphQLJSONObject
        },
        definitions: {
          path: join(__dirname, 'graphql.ts')
        },
        logger,
        debug: true,
        cors: false,
        installSubscriptionHandlers: true,
        playground: {
          endpoint: '/',
          subscriptionEndpoint: '/',
          settings: {
            'request.credentials': 'include'
          },
          tabs: [
            {
              name: 'GraphQL API',
              endpoint: '/',
              query: playgroundQuery
            }
          ]
        },
        context: ({ req, res }): any => ({ req, res })
      }),
      inject: [PinoLogger]
    }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule
  ]
})
export class AppModule { }
