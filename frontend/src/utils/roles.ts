export const ROLE_HIERARCHY = {
    user: 1,
    dev: 2,
    admin: 3,
    superadmin: 4,
  } as const;
  
  export type Role = keyof typeof ROLE_HIERARCHY;
  