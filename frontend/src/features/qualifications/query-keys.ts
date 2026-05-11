export const MY_QUALIFICATIONS_QUERY_KEY = ['me', 'qualifications'] as const;
export const SKILL_SUGGESTIONS_QUERY_KEY = (query: string) => ['skills', 'suggestions', query] as const;
