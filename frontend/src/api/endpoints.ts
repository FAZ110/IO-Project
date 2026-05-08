export const ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        REGISTER: `/auth/register`,
        REFRESH: `/auth/refresh`,
        LOGOUT: `/auth/logout`
    },
    USERS: {
        LIST: '/users',
        DETAIL: (id: string) => `/users/${id}`,
        RESEND_INVITATION: '/users/invitation',
        WORKLOAD: (id?: string) => `/users/${id}/workload`,
        SEARCH_USERS: '/users/search'
    },
    ME: {
        QUALIFICATIONS: '/me/qualifications',
        QUALIFICATION: (id: string) => `/me/qualifications/${id}`,
        PASSWORD: '/me/password',
    },
    SKILLS: '/skills',
    ADMIN: {
        INVITATIONS: '/admin/invitations',
    },
    PROJECT: {
        BASE: '/projects',
        DETAILS: (id: string) => ({
            BASE: `/projects/${id}`,
            RISKS: `/projects/${id}/risks`,
            MEMBERS: `/projects/${id}/members`,
            ASSIGNMENTS: `/projects/${id}/assignments`
        }),
    },
    PROJECT_GROUP: {
        LIST_ALL: '/groups',
        WALLETS: '/groups/wallets',
        PROGRAMS: '/groups/programs',
        DETAIL: (groupId: string) => `/groups/${groupId}`,
        CREATE: '/groups',
    },
    APPROVALS: {
        ASSIGNMENTS: '/approvals/assignments/pending',
        ASSIGNMENT_DETAIL: (id: string) => `/approvals/assignments/${id}/details`,
        ACCEPT_ASSIGNMENT: (id: string) => `/approvals/assignments/${id}/accept`,
        REJECT_ASSIGNMENT: (id: string) => `/approvals/assignments/${id}/reject`
    }
} as const;