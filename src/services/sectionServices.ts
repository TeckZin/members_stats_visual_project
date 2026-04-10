// src/services/sectionServices.ts
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  type Unsubscribe,
} from 'firebase/firestore'
import { db } from '@/firebase'
import {
  sectionsToDoc,
  sectionsFromDoc,
  initSectionsModel,
  type SectionsModel,
  type SectionsModelDoc,
  type SectionModel,
} from '@/models/SectionModels'

const SECTIONS = 'sections'

export async function createSections(uid: string): Promise<SectionsModel> {
  const sections = initSectionsModel(uid)
  const ref = doc(db, SECTIONS, uid)
  await setDoc(ref, sectionsToDoc(sections))
  return sections
}

export async function fetchSections(uid: string): Promise<SectionsModel> {
  const ref = doc(db, SECTIONS, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return initSectionsModel(uid)
  return sectionsFromDoc(snap.data() as SectionsModelDoc)
}

export async function saveSections(sections: SectionsModel): Promise<void> {
  const ref = doc(db, SECTIONS, sections.uid)
  await setDoc(ref, sectionsToDoc(sections))
}

export async function upsertSectionGroup(
  uid: string,
  groupKey: string,
  group: SectionModel[],
): Promise<void> {
  const ref = doc(db, SECTIONS, uid)
  const serialized = group.map((s) => ({
    name: s.name,
    fileClass: s.fileClass.toDoc(),
    members: s.members,
  }))
  await updateDoc(ref, { [`sections.${groupKey}`]: serialized })
}

export async function removeSectionGroup(uid: string, groupKey: string): Promise<void> {
  const ref = doc(db, SECTIONS, uid)
  const snap = await getDoc(ref)
  if (!snap.exists()) return
  const data = snap.data() as SectionsModelDoc
  const { [groupKey]: _removed, ...rest } = data.sections
  await updateDoc(ref, { sections: rest })
}

export async function addSectionToGroup(
  uid: string,
  groupKey: string,
  section: SectionModel,
): Promise<void> {
  const current = await fetchSections(uid)
  const group = current.sections[groupKey] ?? []
  group.push(section)
  current.sections[groupKey] = group
  await upsertSectionGroup(uid, groupKey, group)
}

export async function deleteSections(uid: string): Promise<void> {
  const ref = doc(db, SECTIONS, uid)
  await deleteDoc(ref)
}

export function subscribeToSections(
  uid: string,
  onChange: (sections: SectionsModel) => void,
): Unsubscribe {
  const ref = doc(db, SECTIONS, uid)
  return onSnapshot(ref, (snap) => {
    if (!snap.exists()) {
      onChange(initSectionsModel(uid))
      return
    }
    onChange(sectionsFromDoc(snap.data() as SectionsModelDoc))
  })
}
