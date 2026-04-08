import type { User } from 'firebase/auth'
import type { SectionModel, SectionsModel } from './SectionModels'
import type { FileType } from './StatsModels'

const Role = {
  Admin: 'admin',
  Manager: 'manager',
  Customer: 'customer',
  Guest: 'guest',
}

export interface UserModel {
  id: string
  role: Role
  sections: SectionModel
}

export type Role = (typeof Role)[keyof typeof Role]

export class UserSuper {
  name: string
  role: Role

  constructor(name: string, role: Role) {
    this.name = name
    this.role = role
  }
}

export class UserApp extends UserSuper {
  uid: string
  role: Role
  sections: SectionsModel
  authUser: User

  constructor(name: string, uid: string, role: Role, sections: SectionsModel, authUser: User) {
    super(name, role)
    this.uid = uid
    this.role = role
    this.sections = sections
    this.authUser = authUser
  }
}

export class GuestUserApp extends UserSuper {
  section?: SectionModel

  constructor(name: string, fileName: string, filePath: string, type: FileType) {
    super(name, Role.Guest)
  }
}
