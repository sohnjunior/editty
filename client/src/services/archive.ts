import IndexedDB from '@/modules/storage/idb'
import { showToast } from '@/services/toast'

import type { ImageObject } from '@molecules/canvas-layer/types'

export interface Archive {
  id: string
  title: string
  snapshot?: ImageData
  imageSnapshot?: ImageData
  images: Omit<ImageObject, 'ref'>[] // NOTE: HTMLImageElement 는 웹 스토리지에 저장할 수 없기 때문에 제외
}

export async function getArchive(id: string) {
  return await IndexedDB.getInstance().getItem<Archive>(id)
}

export async function getAllArchive() {
  return await IndexedDB.getInstance().getAllItems<Archive>()
}

export async function addArchive(data: Archive) {
  try {
    await IndexedDB.getInstance().addItem(data)
    showToast('ADD_ARCHIVE', 'SUCCESS')
  } catch (err) {
    showToast('ADD_ARCHIVE', 'FAIL')
  }
}

export async function addOrUpdateArchive(data: Archive) {
  try {
    await IndexedDB.getInstance().addOrUpdateItem(data)
    showToast('SAVE_ARCHIVE', 'SUCCESS')
  } catch (err) {
    showToast('SAVE_ARCHIVE', 'FAIL')
  }
}

export async function deleteArchive(id: string) {
  try {
    await IndexedDB.getInstance().deleteItem(id)
    showToast('DELETE_ARCHIVE', 'SUCCESS')
  } catch (err) {
    showToast('DELETE_ARCHIVE', 'FAIL')
  }
}
