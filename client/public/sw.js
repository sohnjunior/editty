const CACHE_VERSION = 'editty-cache-v3'

const ICON_PATH = '/assets/images'
const ICON_CACHE = [
  'cursor',
  'draw',
  'text',
  'back-arrow',
  'forward-arrow',
  'search',
  'erase',
  'emoji',
  'trash',
  'gallery',
  'folder',
  'disk',
  'success',
  'fail',
  'add-circle',
  'close-circle',
  'download',
].map((icon) => `${ICON_PATH}/${icon}.svg`)
const PAGE_CACHE = ['./index.html', './manifest.json']

async function deleteCache(key) {
  await caches.delete(key)
}

async function deleteOldCache() {
  const cacheKeys = await caches.keys()
  const cacheToDelete = cacheKeys.filter((key) => key !== CACHE_VERSION)
  const deleteCacheJobs = cacheToDelete.map(deleteCache)
  await Promise.all(deleteCacheJobs)
}

self.addEventListener('activate', (ev) => {
  ev.waitUntil(deleteOldCache())
})

async function cacheResource() {
  const cache = await caches.open(CACHE_VERSION)
  return cache.addAll([...ICON_CACHE, ...PAGE_CACHE])
}

self.addEventListener('install', (ev) => {
  ev.waitUntil(cacheResource())
})

self.addEventListener('fetch', (ev) => {
  if (ev.request.method !== 'GET') {
    return
  }

  ev.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_VERSION)

      let resource = null

      try {
        const response = await fetch(ev.request)
        cache.put(ev.request, response.clone())
        resource = response
      } catch {
        resource = await cache.match(ev.request)
      }

      return resource
    })()
  )
})
