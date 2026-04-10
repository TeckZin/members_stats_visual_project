import { doc, setDoc, getDoc } from 'firebase/firestore'
import { sendEmailVerification, type User } from 'firebase/auth'
import { db } from '@/firebase'
import { UserApp, Role, type UserDoc } from '@/models/UserModel'
import {
  sectionsToDoc,
  sectionsFromDoc,
  initSectionsModel,
  type SectionsModelDoc,
  type SectionsModel,
} from '@/models/SectionModels'

const USERS = 'users'
const SECTIONS = 'sections'

export async function createUserDoc(
  authUser: User,
  name: string,
  role: Role = Role.Customer,
): Promise<UserApp> {
  const userApp = UserApp.initial(name, authUser, role)

  const sectionsRef = doc(db, SECTIONS, authUser.uid)
  await setDoc(sectionsRef, sectionsToDoc(userApp.sections))

  const userRef = doc(db, USERS, authUser.uid)
  await setDoc(userRef, userApp.toDoc())

  return userApp
}

export async function fetchUserApp(authUser: User): Promise<UserApp | null> {
  const userRef = doc(db, USERS, authUser.uid)
  const userSnap = await getDoc(userRef)
  if (!userSnap.exists()) return null

  const userDoc = userSnap.data() as UserDoc
  const sections = await fetchSections(userDoc.sectionsRef, authUser.uid)
  return UserApp.fromDoc(userDoc, sections, authUser)
}

export async function fetchSections(
  sectionsRefPath: string,
  fallbackUid: string,
): Promise<SectionsModel> {
  const ref = doc(db, sectionsRefPath)
  const snap = await getDoc(ref)
  if (!snap.exists()) return initSectionsModel(fallbackUid)
  return sectionsFromDoc(snap.data() as SectionsModelDoc)
}

export async function saveSections(userApp: UserApp): Promise<void> {
  const ref = doc(db, SECTIONS, userApp.uid)
  await setDoc(ref, sectionsToDoc(userApp.sections))
}

export async function sendVerificationEmail(user: User): Promise<void> {
  await sendEmailVerification(user)
}
