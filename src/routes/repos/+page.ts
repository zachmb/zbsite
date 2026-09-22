import type { PageLoad } from './$types';
import github from '$utils/github';

// Fixed owner for this personal site. Hardcoded on purpose: it used to read
// PUBLIC_REPO_OWNER from env, but .env is gitignored so the value only lived in the
// Netlify build env (wrong account, zachbas) and every rebuild reverted the fix.
// The GitHub account is zachmb — keep it here so it can't drift again.
const REPO_OWNER = 'zachmb';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const repos = await github.user(REPO_OWNER).repos(fetch);
		const filtered = repos
			.filter((r) => !r.archived)
			.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
		return { repos: filtered };
	} catch {
		return { repos: [] };
	}
};
