import IndexedDB from '@/modules/storage/idb'
import type { ImageObject } from '@molecules/canvas-layer/types'
import type { UUID } from '@/utils/crypto'

export interface Archive {
  id: UUID
  title: string
  snapshot?: ImageData
  images: Omit<ImageObject, 'ref'>[] // NOTE: HTMLImageElement 는 웹 스토리지에 저장할 수 없기 때문에 제외
}

export async function getArchive(id: string) {
  return await IndexedDB.getInstance().getItem<Archive>(id)
}

export async function getAllArchive() {
  return await IndexedDB.getInstance().getAllItems<Archive>()
}

export function addOrUpdateArchive(data: Archive) {
  IndexedDB.getInstance().addOrUpdateItem(data)
}

export function deleteArchive(id: string) {
  IndexedDB.getInstance().deleteItem(id)
}
