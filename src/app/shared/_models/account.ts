import { Role } from './role';

export class Account {
  constructor(
    public id: string,
    public email: string,
    public password: string,
    public userName: string,
    public role: Role,
    public token?: string
  ) {}
}
