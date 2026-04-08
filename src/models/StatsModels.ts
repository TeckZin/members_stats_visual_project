import type { UserSuper } from './UserModel'

const FileType = {
  Excel: 'xlsx',
  CSV: 'csv',
  JSON: 'json',
  PDF: 'pdf',
} as const

export type FileType = (typeof FileType)[keyof typeof FileType]

const FileKeyType = {
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
    this.fileInfo = {
      fileName,
      filePath,
      type,
    } as FileInfoModel
    this.fileKeys = fileKeys
    this.fileData = [] as Record<string, string>[]
  }
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
  longtitude: number
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
  location: Geolocation
  metaData: Record<string, unknown>
  createdDate: Date
  lastUpdated: Date
  email?: string
  phoneNumber: string
}

export type MembersModel = MemberModel[]
