import { GraphQLScalarType } from 'graphql'

const nativeIsoDateRegex = /(\d{4})-(\d{2})-(\d{2})T((\d{2}):(\d{2}):(\d{2}))\.(\d{3})Z/

export const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Data type representing the date and time',
  parseValue: (value: string) => {
    if (!nativeIsoDateRegex.test(value)) {
      throw new Error('Invalid date format')
    }

    return new Date(value)
  },
  serialize: (value: string) => {
    return new Date(value).toISOString()
  }
})
