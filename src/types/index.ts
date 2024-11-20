export enum WorkTypes {
  Smen = 'smen',
  Day = 'day',
}

export enum WorkTime {
  day = '08-20',
  night = '20-08'
}

export enum GraphTypes {
  Work = 'W',
  Day = 'day',
}

export enum RolesEnum {
  OPERATOR = 'operator',
  ADMIN = 'admin',
}

export interface CustomRequest extends Request {
  userId: string;
  role: string;
}