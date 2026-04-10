import { FileClass, type FileClassDoc, type MemberModel } from './StatsModels'

export interface SectionsModel {
  uid: string
  sections: Record<string, SectionModel[]>
}

export interface SectionModel {
  name: string
  fileClass: FileClass
  members: MemberModel[]
}

// Firestore-safe versions
export interface SectionsModelDoc {
  uid: string
  sections: Record<string, SectionModelDoc[]>
}

export interface SectionModelDoc {
  name: string
  fileClass: FileClassDoc
  members: MemberModel[]
}

export function sectionsToDoc(s: SectionsModel): SectionsModelDoc {
  const out: Record<string, SectionModelDoc[]> = {}
  for (const [key, arr] of Object.entries(s.sections)) {
    out[key] = arr.map((sec) => ({
      name: sec.name,
      fileClass: sec.fileClass.toDoc(),
      members: sec.members,
    }))
  }
  return { uid: s.uid, sections: out }
}

export function sectionsFromDoc(d: SectionsModelDoc): SectionsModel {
  const out: Record<string, SectionModel[]> = {}
  for (const [key, arr] of Object.entries(d.sections)) {
    out[key] = arr.map((sec) => ({
      name: sec.name,
      fileClass: FileClass.fromDoc(sec.fileClass),
      members: sec.members,
    }))
  }
  return { uid: d.uid, sections: out }
}

export function initSectionsModel(uid: string): SectionsModel {
  return { uid, sections: {} }
}
