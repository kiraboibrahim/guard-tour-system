import {
  isArray,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { EntityManager, In } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { LocalDate, ZoneId } from '@js-joda/core';
import '@js-joda/timezone';
import { ConfigService } from '@nestjs/config';

import { isISO8601, isString } from 'class-validator';

// See https://github.com/nestjs/nest/issues/528 on how to use nestjs DI container
// with class-validator. Credit goes to Julianomqs (https://github.com/julianomqs)
@ValidatorConstraint({ async: true })
@Injectable()
export class _IsUnique implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
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
export class _IsExists implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const [entityClass, findByColumnName] = validationArguments.constraints;
    const whereOptions = { [findByColumnName]: value };
    const entity = await this.entityManager
      .getRepository(entityClass)
      .findOneBy(whereOptions);
    return !!entity;
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} doesn't exist`;
  }
}

@ValidatorConstraint({ async: true })
@Injectable()
export class _IsExistsAndLoadEntity implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const [
      entityClass,
      propertyKey = validationArguments.property,
      findByColumnName,
      relations,
    ] = validationArguments.constraints;
    const whereOptions = { [findByColumnName]: value };
    const entity = await this.entityManager
      .getRepository(entityClass)
      .findOne({ where: whereOptions, relations });
    const entityExists = !!entity;
    if (entityExists) {
      const { object } = validationArguments;
      Object.defineProperty(object, propertyKey, {
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
export class _IsExistsAndLoadEntities implements ValidatorConstraintInterface {
  constructor(@InjectEntityManager() private entityManager: EntityManager) {}
  async validate(value: any, validationArguments: ValidationArguments) {
    const [
      entityClass,
      propertyKey = validationArguments.property,
      findByColumnName,
      relations,
    ] = validationArguments.constraints;
    if (!isArray(value)) return false;
    const whereOptions = { [findByColumnName]: In(value) };
    const entity = await this.entityManager
      .getRepository(entityClass)
      .find({ where: whereOptions, relations });
    const entityExists = !!entity;
    if (entityExists) {
      const { object } = validationArguments;
      Object.defineProperty(object, propertyKey, {
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

@ValidatorConstraint({ async: false })
@Injectable()
export class IsAtleastXYears implements ValidatorConstraintInterface {
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
  UG_PHONE_NUMBER_REGEX = /\+?2567[0-9]{8}/;
  constructor() {}
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(value: any, validationArguments: ValidationArguments) {
    if (!isString(value)) return false;
    return this.UG_PHONE_NUMBER_REGEX.test(value);
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments?.property} should match ${this.UG_PHONE_NUMBER_REGEX}`;
  }
}

export const IsUGPhoneNumber = () => {
  return Validate(_IsUGPhoneNumber);
};

export const IsConsentingAdult = () => {
  return Validate(IsAtleastXYears, [18]);
};

export const IsExistsAndLoadEntity = (
  entityClass: any,
  accessEntityByProperty: string,
  findByColumnName: string = 'id',
  relations?: object,
) => {
  return Validate(_IsExistsAndLoadEntity, [
    entityClass,
    accessEntityByProperty,
    findByColumnName,
    relations,
  ]);
};

export const IsUnique = (entityClass: any, findByColumnName: string = 'id') => {
  return Validate(_IsUnique, [entityClass, findByColumnName]);
};

export const IsExists = (entityClass: any, findByColumnName: string = 'id') => {
  return Validate(_IsExists, [entityClass, findByColumnName]);
};
