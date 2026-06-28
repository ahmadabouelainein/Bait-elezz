import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FeatureKey, RoomProject, RoomSection } from '@/types/room'

interface RoomStore {
  project: RoomProject | null
  createProject: (name: string) => void
  setProjectName: (name: string) => void
  updateSection: (feature: FeatureKey, data: Partial<RoomSection>) => void
  clearProject: () => void
}

export const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      project: null,

      createProject: (name) =>
        set({
          project: {
            id: Date.now().toString(),
            name,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            sections: {},
          },
        }),

      setProjectName: (name) =>
        set((state) =>
          state.project
            ? { project: { ...state.project, name, updatedAt: new Date().toISOString() } }
            : state
        ),

      updateSection: (feature, data) =>
        set((state) => {
          if (!state.project) return state
          const current = state.project.sections[feature] ?? { inputs: {} }
          return {
            project: {
              ...state.project,
              updatedAt: new Date().toISOString(),
              sections: {
                ...state.project.sections,
                [feature]: { ...current, ...data },
              },
            },
          }
        }),

      clearProject: () => set({ project: null }),
    }),
    { name: 'bait-elezz-room' }
  )
)
