import type { FileClass, FileInfoModel, MemberModel } from './StatsModels'

export interface SectionsModel {
  uid: string
  sections: Record<string, SectionModel[]>
}

export interface SectionModel {
  name: string
  fileClass: FileClass
  members: MemberModel[]
}

const InitSectionModel = () => {}
