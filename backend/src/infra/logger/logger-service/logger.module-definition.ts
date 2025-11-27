/* eslint-disable @typescript-eslint/no-unused-vars  */
// Options_type and Async options type are creating errors but are necessary for code clarity
import { ConfigurableModuleBuilder } from '@nestjs/common';

const {
  ConfigurableModuleClass,
  MODULE_OPTIONS_TOKEN,
  OPTIONS_TYPE,
  ASYNC_OPTIONS_TYPE,
} = new ConfigurableModuleBuilder<boolean>().build();

export const Logger = Symbol('logger');

export {
  ConfigurableModuleClass as LoggerConfigurableClass,
  MODULE_OPTIONS_TOKEN as Logger_OPTIONS_TOKEN,
};

export type LoggerOptions = typeof OPTIONS_TYPE;
export type AsyncLoggerOptions = typeof ASYNC_OPTIONS_TYPE;
