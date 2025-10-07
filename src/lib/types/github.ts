import * as z from 'zod';

const RepositorySchema = z.object({
	archived: z.boolean(),
	clone_url: z.url(),
	collaborators_url: z.url(),
	description: z.string().nullable(),
	forks_count: z.number(),
	full_name: z.string(),
	html_url: z.url(),
	license: z.object({ name: z.string() }).nullable(),
	name: z.string(),
	stargazers_count: z.number(),
	topics: z.array(z.string()),
	updated_at: z.string().transform((str) => new Date(str))
});
export type Repository = z.infer<typeof RepositorySchema>;

const UserSchema = z.object({
	login: z.string(),
	avatar_url: z.url(),
	html_url: z.url(),
	type: z.union([z.literal('User'), z.literal('Organization')]),
	name: z.string().nullable(),
	company: z.string().nullable(),
	bio: z.string().nullable(),
	public_repos: z.number(),
	followers: z.number(),
	following: z.number(),
	created_at: z.string().transform((str) => new Date(str))
});
export type User = z.infer<typeof UserSchema>;

export default {
	user: (username: string) => ({
		async repos(init?: RequestInit) {
			const url = `https://api.github.com/users/${username}/repos`;
			const res = await fetch(url, init).then((r) => r.json());
			return RepositorySchema.array().parse(res);
		},
		async info(init?: RequestInit) {
			const url = `https://api.github.com/users/${username}`;
			const res = await fetch(url, init).then((r) => r.json());
			return UserSchema.parse(res);
		}
	})
} as const;
