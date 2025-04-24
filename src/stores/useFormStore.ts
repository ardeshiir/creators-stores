// stores/useFormStore.ts
import { create } from 'zustand'

interface FormState {
  step: number
  data: {
    storeName?: string
    propertyStatus?: 'rental' | 'owner'
    name?: string
    familyName?: string
    mobile?: string[]
    storeDescription?: {
      area?: number
      activityHistory?: number
      cooperationHistory?: number
      sellerType?: 'wholesaler' | 'retailer'
    }
    foa?: string[]
    purchaseMethod?: 'direct' | 'indirect'
    otherBrands?: string[]
    address?: {
      state?: string
      city?: string
      description?: string
      postalcode?: string
      phoneNumber?: string[]
      location?: [number, number]
    }
    enviornment?: {
      stock?: boolean
      mainStreet?: boolean
      signBoard?: {
        type: 'banner' | 'composite' | 'other'
        dimensions?: {
          width: number
          height: number
        }
      }[]
      attachments?: string[]
    }[]
    displayStand?: {
      brand: string
      attachments: string[]
    }[]
    showCase?: {
      dimensions: {
        width: number
        height: number
      }
      sticker: boolean
      attachments: string[]
    }[]
    externalImages?: string[]
    internalImages?: string[]
    description?: string
  }
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  updateData: (partial: Partial<FormState['data']>) => void
  reset: () => void
}

export const useFormStore = create<FormState>((set) => ({
  step: 1,
  data: {},
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  updateData: (partial) => set((state) => ({ data: { ...state.data, ...partial } })),
  reset: () => set({ step: 1, data: {} }),
}))
