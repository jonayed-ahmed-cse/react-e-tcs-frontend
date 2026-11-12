import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type PaymentStatus = 'Paid' | 'Pending' | 'Failed'

export interface Collection {
  id: string
  retailerId: string
  retailerName: string
  tin: string
  amount: number
  rate: number
  taxAmount: number
  totalAmount: number
  collectionDate: string
  reference: string
  status: PaymentStatus
}

interface CollectionState {
  collections: Collection[]
  addCollection: (collection: Omit<Collection, 'id' | 'reference'>) => string
  updateCollectionStatus: (id: string, status: PaymentStatus) => void
}

export const useCollectionStore = create<CollectionState>()(
  persist(
    (set) => ({
      collections: [],

      addCollection: (collection) => {
        const id = crypto.randomUUID()
        const reference = `TCS-${Date.now().toString().slice(-10)}`

        set((state) => ({
          collections: [
            {
              ...collection,
              id,
              reference,
            },
            ...state.collections,
          ],
        }))

        return id
      },

      updateCollectionStatus: (id, status) =>
        set((state) => ({
          collections: state.collections.map((item) =>
            item.id === id ? { ...item, status } : item,
          ),
        })),
    }),
    {
      name: 'tcs-collections-session',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)
