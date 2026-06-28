export type FeatureKey =
  | 'wallColors'
  | 'furniturePlacement'
  | 'curtainColor'
  | 'furnitureDimensions'
  | 'woodPlanks'
  | 'upholsteryFabric'
  | 'carpetSelection'
  | 'runners'
  | 'tableaux'

export interface RoomSection {
  inputs: Record<string, unknown>
  imageBase64?: string
  response?: string
}

export interface RoomProject {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  sections: Partial<Record<FeatureKey, RoomSection>>
}
