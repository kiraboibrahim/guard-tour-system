export type Permission = {
  action: string;
  resource: string;
  resourceId?: string;
  childResource?: string;
};
