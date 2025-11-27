
import 'dotenv/config'
import AppDataSource from './data-source.js'

/**
 * Create and initialize the TypeORM DataSource.
 *
 * Exported so other packages in the monorepo can import a single factory:
 *
 *   import { createDataSource } from '@my-markdown/typeorm'
 *
 * The factory returns an initialized DataSource instance.
 */
export async function createDataSource() {
  // AppDataSource is configured using environment variables from `dotenv`.
  return AppDataSource.initialize()
}

export { AppDataSource }
