import { Signale } from 'signale';

export class Logger extends Signale {
  constructor(scope: string, types?: object, interactive?: boolean) {
    super({ scope: scope, types: types, interactive: interactive });
  }
}
