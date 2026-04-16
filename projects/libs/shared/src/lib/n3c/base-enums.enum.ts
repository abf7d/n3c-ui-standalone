export interface N3C_TENANT {
  menu: string;
  id: number;
}

export enum N3C_BASE_TENANT_TYPES {
  TENANT_TYPE_COVID = 2,
  TENANT_TYPE_EDUCATION = 3,
  TENANT_TYPE_CANCER = 4,
  TENANT_TYPE_RENAL = 5,
  TENANT_TYPE_CLINICAL = 6
}

export interface N3C_MENU {
  menu: string;
  id: string;
}

export enum N3C_BASE_MENU_TYPES {
  MENU_NAME_COVID = 'covid',
  MENU_NAME_EDUCATION = 'education',
  MENU_NAME_CANCER = 'cancer',
  MENU_NAME_RENAL = 'renal',
  MENU_NAME_CLINICAL = 'clinical'
}

// Exporting a tenantProfileMap for use incase we need to use both values as well.
export const N3C_TENANT_PROFILE_MAP: {[key: number]: string} = {
  2: 'covid',
  3: 'education',
  4: 'cancer',
  5: 'renal',
  6: 'clinical'
};
