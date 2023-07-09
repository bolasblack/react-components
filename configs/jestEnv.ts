import { TestEnvironment as JestEnv } from 'jest-environment-jsdom'
import { EnvironmentContext, JestEnvironmentConfig } from '@jest/environment'
import { TextEncoder, TextDecoder } from 'util'

export default class TestEnvironment extends JestEnv {
  constructor(config: JestEnvironmentConfig, context: EnvironmentContext) {
    super(config, context)
    this.global.TextEncoder = TextEncoder
    this.global.TextDecoder = TextDecoder as any
  }
}
