import { runCli } from './cli';

const path = process.env.INPUT_PATH ?? '.';
const dist = process.env.INPUT_DIST ?? 'dist';
const tag = process.env.INPUT_TAG ?? '';

const argv: Array<string> = ['--path', path, '--dist', dist];
if (tag !== '') {
  argv.push('--tag', tag);
}

const ghaLogger = {
  log: (message: string): void => console.log(message),
  error: (message: string): void => console.log(`::error::${message}`),
};

runCli(argv, ghaLogger).then((code) => {
  process.exitCode = code;
});
