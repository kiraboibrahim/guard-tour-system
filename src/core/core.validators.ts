import {
  isArray,
  isISO8601,
  isString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, FindOptionsRelations, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LocalDate, ZoneId } from '@js-joda/core';
import '@js-joda/timezone';
import { ConfigService } from '@nestjs/config';
import { EntityClass, EntityColumnName } from './core.types';
import { isUGPhoneNumber } from './core.utils';
import { AIRTEL_UG_REGEX, LYCA_UG_REGEX, MTN_UG_REGEX } from './core.constants';

// See https://github.com/nestjs/nest/issues/528 on how to use nestjs DI container
// with class-validator. Credit goes to Julianomqs (https://github.com/julianomqs)
@ValidatorConstraint({ async: true })
@Injectable()
export class _IsUnique implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    if (!value) return false;
    const [entityClass, findByColumnName] = validationArguments.constraints;
    const whereOptions = { [findByColumnName]: value };
    const entity = await this.entityManager
      .getRepository(entityClass)
      .findOneBy(whereOptions);
    return !entity;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} should be unique`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class _AreUnique implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const [entityClass, findByColumnName, relations] =
      validationArguments.constraints;
    if (!isArray(value)) return false;
    const whereOptions = { [findByColumnName]: In(value) };
    const entities = await this.entityManager
      .getRepository(entityClass)
      .find({ where: whereOptions, relations });
    return entities.length === 0;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `Each value in ${validationArguments?.property} should be unique`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class _LoadEntityIfExists implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    if (!value) return false;
    const [
      entityClass,
      property = validationArguments.property,
      findByColumnName,
      relations,
      allowNull,
    ] = validationArguments.constraints;
    const whereOptions = { [findByColumnName]: value };
    const entity = await this.entityManager
      .getRepository(entityClass)
      .findOne({ where: whereOptions, relations });
    const entityExists = !!entity || allowNull;
    if (entityExists) {
      const { object } = validationArguments;
      Object.defineProperty(object, property, {
        value: entity,
        writable: false,
      });
    }
    return entityExists;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} doesn't exist`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class _LoadEntitiesIfExist implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const [
      entityClass,
      entitiesHolderProperty = validationArguments.property,
      findByColumnName,
      relations,
      allowNull,
    ] = validationArguments.constraints;
    if (!isArray(value)) return false;
    const whereOptions = { [findByColumnName]: In(value) };
    const entities = await this.entityManager
      .getRepository(entityClass)
      .find({ where: whereOptions, relations });
    const entitiesExist = entities.length === value.length || allowNull;
    if (entitiesExist) {
      const { object } = validationArguments;
      Object.defineProperty(object, entitiesHolderProperty, {
        value: entities,
        writable: false,
      });
    }
    return entitiesExist;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} doesn't exist`;
  }
}

@ValidatorConstraint({ async: false })
@Injectable()
export class IsAtLeastNYears implements ValidatorConstraintInterface {
  constructor(private configService: ConfigService) {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, validationArguments: ValidationArguments) {
    if (!isISO8601(value)) return false;
    const minimumAge = validationArguments.constraints[0];
    const age = this.getAgeFromBirthDate(value as string);
    return age >= minimumAge;
  }
  private getAgeFromBirthDate(birthDate_: string) {
    const timeZone = this.configService.get<string>('TZ');
    const birthDate = LocalDate.parse(birthDate_);
    const todayDate = LocalDate.now(ZoneId.of(timeZone as string));
    return birthDate.until(todayDate).years();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    const minimumAge = validationArguments?.constraints[0];
    return `Required date format is YYYY-MM-DD and the minimum age is ${minimumAge} years`;
  }
}

@ValidatorConstraint({ async: false })
@Injectable()
export class _IsUGPhoneNumber implements ValidatorConstraintInterface {
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, validationArguments: ValidationArguments) {
    if (!isString(value)) return false;
    return isUGPhoneNumber(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} should match ${MTN_UG_REGEX} or ${AIRTEL_UG_REGEX} or ${LYCA_UG_REGEX}`;
  }
}

export const IsUGPhoneNumber = () => {
  return Validate(_IsUGPhoneNumber);
};

export const IsConsentingAdult = () => {
  return Validate(IsAtLeastNYears, [18]);
};

export const LoadEntityIfExists = function <T>(
  entityClass: EntityClass<T>,
  accessEntityByProperty: string,
  findByColumnName: EntityColumnName<T> | 'id' = 'id',
  relations?: FindOptionsRelations<T>,
  allowNull: boolean = false,
) {
  return Validate(_LoadEntityIfExists, [
    entityClass,
    accessEntityByProperty,
    findByColumnName,
    relations,
    allowNull,
  ]);
};

export const LoadEntitiesIfExist = function <T>(
  entityClass: EntityClass<T>,
  accessEntityByProperty: string,
  findByColumnName: EntityColumnName<T> | 'id' = 'id',
  relations?: FindOptionsRelations<T>,
  allowNull = false,
) {
  return Validate(_LoadEntitiesIfExist, [
    entityClass,
    accessEntityByProperty,
    findByColumnName,
    relations,
    allowNull,
  ]);
};

export const IsUnique = function <T>(
  entityClass: EntityClass<T>,
  findByColumnName: EntityColumnName<T>,
) {
  return Validate(_IsUnique, [entityClass, findByColumnName]);
};

export const AreUnique = function <T>(
  entityClass: EntityClass<T>,
  findByColumnName: EntityColumnName<T>,
) {
  return Validate(_AreUnique, [entityClass, findByColumnName]);
};
