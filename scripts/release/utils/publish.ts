import * as execa from 'execa';
import * as ora from 'ora';
import * as path from 'path';
import { APP_DIR, DIST_DIR, monoRepo } from '../constant';
import { ReleaseParams } from './parse-params-release';

export const publish = async (
  spinner: ora.Ora,
  params: ReleaseParams,
  version: string
) => {
  const publishArgs = ['publish'];
  if (params.canary) {
    publishArgs.push(`--tag=canary`);
  }

  for (const [pkgName, { folder }] of Object.entries(monoRepo)) {
    spinner.text = `Publish ${pkgName}`;
    const pkgDist = path.resolve(DIST_DIR, path.relative(APP_DIR, folder));
    await execa('npm', publishArgs, { cwd: pkgDist });
  }
  spinner.text = `Git add`;
  await execa(`git`, `add -u`.split(' '), { cwd: APP_DIR });
  spinner.text = `Git commit`;
  await execa(`git`, `commit -m "release v${version}"`.split(' '), {
    cwd: APP_DIR,
  });
  spinner.text = `Git tag`;
  await execa(`git`, `tag -s "v${version}"`.split(' '), { cwd: APP_DIR });
};
