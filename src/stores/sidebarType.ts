export interface SidebarItem {
  name: string
  id: string
  class?: string
  active?: boolean
}

export interface SidebarSection {
  id: string
  items: SidebarItem[]
}

export interface SidebarInterface {
  sections: SidebarSection[]
  class?: string
}
