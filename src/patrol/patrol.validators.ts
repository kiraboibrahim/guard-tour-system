import { IsIn } from 'class-validator';
import { GROUP_PATROL_TYPE, INDIVIDUAL_PATROL_TYPE } from './patrol.constants';

export const IsValidPatrolType = () =>
  IsIn([INDIVIDUAL_PATROL_TYPE, GROUP_PATROL_TYPE]);
