import type { User } from 'firebase/auth'
import {
  type SectionsModel,
  type SectionsModelDoc,
  sectionsToDoc,
  sectionsFromDoc,
  initSectionsModel,
} from './SectionModels'

export const Role = {
  Admin: 'admin',
  Manager: 'manager',
  Customer: 'customer',
  Guest: 'guest',
} as const
export type Role = (typeof Role)[keyof typeof Role]

// Firestore shape for /users/{uid} — no sections blob, just a pointer
export interface UserDoc {
  uid: string
  name: string
  role: Role
  sectionsRef: string // path to the sections doc, e.g. "sections/abc123"
}

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
  sections: SectionsModel
  authUser: User

  constructor(name: string, uid: string, role: Role, sections: SectionsModel, authUser: User) {
    super(name, role)
    this.uid = uid
    this.sections = sections
    this.authUser = authUser
  }

  get sectionsRef(): string {
    return `sections/${this.uid}`
  }

  toDoc(): UserDoc {
    return {
      uid: this.uid,
      name: this.name,
      role: this.role,
      sectionsRef: this.sectionsRef,
    }
  }

  static fromDoc(doc: UserDoc, sections: SectionsModel, authUser: User): UserApp {
    return new UserApp(doc.name, doc.uid, doc.role, sections, authUser)
  }

  static initial(name: string, authUser: User, role: Role = Role.Customer): UserApp {
    return new UserApp(name, authUser.uid, role, initSectionsModel(authUser.uid), authUser)
  }
}

export class GuestUserApp extends UserSuper {
  constructor(name: string) {
    super(name, Role.Guest)
  }
}
