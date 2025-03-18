import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Company } from '@company/entities/company.entity';
import CreateThemeDto from '@company/dto/create-theme.dto';
import { BadRequestException } from '@nestjs/common';
import UpdateThemeDto from '@company/dto/update-theme.dto';

@Entity()
export class Theme extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  primaryColor: string;

  @Column()
  secondaryColor: string;

  @Column()
  accentColor: string;

  @OneToOne(() => Company, (company) => company.theme, { onDelete: 'CASCADE' })
  @JoinColumn()
  company: Company;

  static async createTheme(
    companyId: number,
    createThemeSettingsDto: CreateThemeDto,
  ) {
    const company = await Company.findOne({
      where: { id: companyId },
      relations: { theme: true },
    });
    if (!company) throw new BadRequestException("Company doesn't exist");
    if (!!company.theme)
      throw new BadRequestException(
        'Company already has a theme. Consider updating it',
      );
    const themeSettings = Theme.create({
      ...createThemeSettingsDto,
      company,
    } as any);
    return await Theme.save(themeSettings);
  }

  static async updateTheme(
    companyId: number,
    updateThemeSettingsDto: UpdateThemeDto,
  ) {
    return await Theme.update(
      { company: { id: companyId } },
      updateThemeSettingsDto,
    );
  }

  static async deleteTheme(companyId: number) {
    return await Theme.delete({ company: { id: companyId } });
  }
}
