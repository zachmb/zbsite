import type { PageLoad } from './$types';
import { PUBLIC_REPO_OWNER } from '$env/static/public';
import github from '$utils/github';

export const prerender = true;

export const load: PageLoad = async ({ fetch }) => {
	try {
		const repos = await github.user(PUBLIC_REPO_OWNER).repos(fetch);
		const filtered = repos
			.filter((r) => !r.archived)
			.sort((a, b) => b.updated_at.getTime() - a.updated_at.getTime());
		return { repos: filtered };
	} catch {
		return { repos: [] };
	}
};
