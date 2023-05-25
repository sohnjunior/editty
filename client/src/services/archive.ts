import IndexedDB from '@/modules/storage/idb'
import { EventBus, EVENT_KEY } from '@/event-bus'

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

export async function addArchive(data: Archive) {
  IndexedDB.getInstance().addItem(data)
}

export async function addOrUpdateArchive(data: Archive) {
  IndexedDB.getInstance().addOrUpdateItem(data)
}

export async function deleteArchive(id: string) {
  try {
    await IndexedDB.getInstance().deleteItem(id)
    EventBus.getInstance().emit(EVENT_KEY.DELETE_SUCCESS)
  } catch (err) {
    EventBus.getInstance().emit(EVENT_KEY.DELETE_FAIL)
  }
}
