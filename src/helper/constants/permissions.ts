import { PermissionProps } from '../interfaces/permissions';

export const ALLPermissions: PermissionProps[] = [
  { entity: 'CATEGORY', action: 'CREATE' },
  { entity: 'CATEGORY', action: 'EDIT' },
  { entity: 'CATEGORY', action: 'REMOVE' },
  { entity: 'CATEGORY', action: 'VIEW' },

  { entity: 'COMMAND', action: 'CREATE' },
  { entity: 'COMMAND', action: 'EDIT' },
  { entity: 'COMMAND', action: 'REMOVE' },
  { entity: 'COMMAND', action: 'VIEW' },

  { entity: 'COMPANY', action: 'CREATE' },
  { entity: 'COMPANY', action: 'EDIT' },
  { entity: 'COMPANY', action: 'REMOVE' },
  { entity: 'COMPANY', action: 'VIEW' },

  { entity: 'EMPLOYEE', action: 'CREATE' },
  { entity: 'EMPLOYEE', action: 'EDIT' },
  { entity: 'EMPLOYEE', action: 'REMOVE' },
  { entity: 'EMPLOYEE', action: 'VIEW' },

  { entity: 'ITEM', action: 'CREATE' },
  { entity: 'ITEM', action: 'EDIT' },
  { entity: 'ITEM', action: 'REMOVE' },
  { entity: 'ITEM', action: 'VIEW' },

  { entity: 'ORDER', action: 'CREATE' },
  { entity: 'ORDER', action: 'EDIT' },
  { entity: 'ORDER', action: 'REMOVE' },
  { entity: 'ORDER', action: 'VIEW' },

  { entity: 'ORDER-ITEM', action: 'CREATE' },
  { entity: 'ORDER-ITEM', action: 'EDIT' },
  { entity: 'ORDER-ITEM', action: 'REMOVE' },
  { entity: 'ORDER-ITEM', action: 'VIEW' },

  { entity: 'PERMISSION', action: 'CREATE' },
  { entity: 'PERMISSION', action: 'EDIT' },
  { entity: 'PERMISSION', action: 'REMOVE' },
  { entity: 'PERMISSION', action: 'VIEW' },

  { entity: 'ROLE', action: 'CREATE' },
  { entity: 'ROLE', action: 'EDIT' },
  { entity: 'ROLE', action: 'REMOVE' },
  { entity: 'ROLE', action: 'VIEW' },

  { entity: 'ROLE-PERMISSION', action: 'CREATE' },
  { entity: 'ROLE-PERMISSION', action: 'EDIT' },
  { entity: 'ROLE-PERMISSION', action: 'REMOVE' },
  { entity: 'ROLE-PERMISSION', action: 'VIEW' },

  { entity: 'TABLE', action: 'CREATE' },
  { entity: 'TABLE', action: 'EDIT' },
  { entity: 'TABLE', action: 'REMOVE' },
  { entity: 'TABLE', action: 'VIEW' },
];
