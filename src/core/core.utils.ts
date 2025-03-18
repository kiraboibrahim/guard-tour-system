import { AIRTEL_UG_REGEX, LYCA_UG_REGEX, MTN_UG_REGEX } from './core.constants';
import * as argon2 from 'argon2';
import { Patrol } from '@patrol/entities/patrol.entity';
import { LocalDate } from '@js-joda/core';
import { BadRequestException } from '@nestjs/common';

// Credit goes to:
// https://stackoverflow.com/questions/286141/remove-blank-attributes-from-an-object-in-javascript
export function removeEmptyObjects(obj: any): any {
  return Object.entries(obj)
    .filter(([, v]) => v != null)
    .reduce(
      (acc, [k, v]) => ({
        ...acc,
        [k]: v === Object(v) ? removeEmptyObjects(v) : v,
      }),
      {},
    );
}

export function removeDuplicates<T>(arr: T[]) {
  return Array.from(new Set(arr));
}

export const isEmptyObject = (obj: any) => {
  return JSON.stringify(obj) === '{}';
};

export function isUGPhoneNumber(phoneNumber: string) {
  return (
    MTN_UG_REGEX.test(phoneNumber) ||
    AIRTEL_UG_REGEX.test(phoneNumber) ||
    LYCA_UG_REGEX.test(phoneNumber)
  );
}

export async function hash(value: string) {
  return await argon2.hash(value);
}

export function applyMixins(
  derivedConstructor: any,
  ...baseConstructors: any[]
) {
  baseConstructors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      derivedConstructor.prototype[name] = baseCtor.prototype[name];
    });
  });
}
export function calculateDailyScore(
  patrols: Patrol[],
  year: number,
  month: number,
  day: number,
) {
  const hours = [...Array(24).keys()].map((v) => v + 1);
  return hours.reduce((dailyScore, hour) => {
    const isHourPatrolled = patrols.find((patrol) => {
      const patrolDate = LocalDate.parse(patrol.date);
      return (
        patrolDate.year() === year &&
        patrolDate.monthValue() === month &&
        patrolDate.dayOfMonth() === day
      );
    });
    const HOURS_PER_DAY = 24;
    return isHourPatrolled ? dailyScore + 1 / HOURS_PER_DAY : dailyScore;
  }, 0);
}

export function getDateInfo(year: number, month: number, day: number) {
  const isInvalidMonth = month < 1 || month > 12;
  if (isInvalidMonth) throw new BadRequestException('Invalid month');

  const paddedMonth = String(month).padStart(2, '0');
  const paddedDay = String(day).padStart(2, '0');
  const _month = LocalDate.parse(`${year}-${paddedMonth}-01`);
  const previousMonthEndDate = _month
    .minusMonths(1)
    .withDayOfMonth(_month.minusMonths(1).lengthOfMonth())
    .toString();
  let nextMonthStartDate = _month.plusMonths(1).withDayOfMonth(1);
  const daysInMonth = nextMonthStartDate.minusDays(1).dayOfMonth();
  const isInvalidDay = day < 1 || day > daysInMonth;
  if (isInvalidDay) throw new BadRequestException('Invalid day');
  return {
    date: LocalDate.parse(`${year}-${paddedMonth}-${paddedDay}`),
    daysInMonth,
    previousMonthEndDate,
    nextMonthStartDate,
  };
}
