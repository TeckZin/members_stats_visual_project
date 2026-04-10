import type { UserSuper } from './UserModel'

export const FileType = {
  Excel: 'xlsx',
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
} as const
export type FileType = (typeof FileType)[keyof typeof FileType]

export const FileKeyType = {
  Address: 'address',
  Name: 'name',
  PhoneNumber: 'phone-number',
  Email: 'email',
  Meta: 'meta',
} as const
export type FileKeyType = (typeof FileKeyType)[keyof typeof FileKeyType]

export class FileClass {
  fileInfo: FileInfoModel
  fileData: Record<string, string>[]
  fileKeys: Record<FileKeyType, string>

  constructor(
    fileName: string,
    filePath: string,
    type: FileType,
    fileKeys: Record<FileKeyType, string>,
  ) {
    this.fileInfo = { fileName, filePath, type }
    this.fileKeys = fileKeys
    this.fileData = []
  }

  // Firestore-safe plain object
  toDoc(): FileClassDoc {
    return {
      fileInfo: { ...this.fileInfo },
      fileKeys: { ...this.fileKeys },
      fileData: [...this.fileData],
    }
  }

  static fromDoc(doc: FileClassDoc): FileClass {
    const f = new FileClass(
      doc.fileInfo.fileName,
      doc.fileInfo.filePath,
      doc.fileInfo.type,
      doc.fileKeys,
    )
    f.fileData = doc.fileData
    return f
  }
}

export interface FileClassDoc {
  fileInfo: FileInfoModel
  fileKeys: Record<FileKeyType, string>
  fileData: Record<string, string>[]
}

export interface FileInfoModel {
  fileName: string
  filePath: string
  type: FileType
}

export interface StatsInputModel {
  user: UserSuper
  fileInfo: FileInfoModel
  login: boolean
}

export interface GeoLocation {
  latitude: number
  longitude: number // was "longtitude"
  altitude?: number
}

export interface Address {
  street?: string
  city: string
  state: string
  country: string
  zip?: string
}

export interface MemberModel {
  name: string
  address: Address
  location: GeoLocation
  metaData: Record<string, unknown>
  createdDate: Date
  lastUpdated: Date
  email?: string
  phoneNumber: string
}

export type MembersModel = MemberModel[]
