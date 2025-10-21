import { join, resolve, normalize } from 'node:path';

export const relativeToMe = (meta: ImportMeta, ...paths: string[]) =>
	resolve(normalize(join(meta.dirname.replace('file://', ''), ...paths)));
