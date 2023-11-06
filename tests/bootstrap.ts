import { type Config } from '@japa/runner'
import TestUtils from '@ioc:Adonis/Core/TestUtils'
import { assert, runFailedTests, specReporter, apiClient } from '@japa/preset-adonis'
import Database from '@ioc:Adonis/Lucid/Database'

export const plugins: Required<Config>['plugins'] = [assert(), runFailedTests(), apiClient()]

export const reporters: Required<Config>['reporters'] = [specReporter()]

export const runnerHooks: Pick<Required<Config>, 'setup' | 'teardown'> = {
  setup: [() => TestUtils.ace().loadCommands(), () => TestUtils.db().migrate()],
  teardown: [],
}

export const configureSuite: Required<Config>['configureSuite'] = (suite) => {
  if (suite.name === 'functional') {
    suite.setup(async () => {
      TestUtils.httpServer().start()
      await Database.beginGlobalTransaction()
      return () => Database.rollbackGlobalTransaction()
    })
  }
}
