import type { PageLoad } from './$types';
import { PUBLIC_REPO_OWNER } from '$env/static/public';
import github from '$utils/github';

export const load: PageLoad = async ({ fetch }) => {
	const repos = await github.user(PUBLIC_REPO_OWNER).repos(fetch);
	return { repos };
};
