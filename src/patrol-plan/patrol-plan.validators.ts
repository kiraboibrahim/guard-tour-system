import {
  GROUP_PATROL_PLAN,
  INDIVIDUAL_PATROL_PLAN,
} from './patrol-plan.constants';
import { IsIn } from 'class-validator';

export const IsValidPatrolPlanType = () => {
  const validPatrolPlanTypes = [INDIVIDUAL_PATROL_PLAN, GROUP_PATROL_PLAN];
  return IsIn(validPatrolPlanTypes);
};
