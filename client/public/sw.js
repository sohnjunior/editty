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

self.addEventListener('activate', (ev) => {
  ev.waitUntil(deleteOldCache())
})

async function deleteOldCache() {
  const cacheKeys = await caches.keys()
  const cacheToDelete = cacheKeys.filter((key) => key !== CACHE_VERSION)
  const deleteCacheJobs = cacheToDelete.map(deleteCache)
  await Promise.all(deleteCacheJobs)
}

async function deleteCache(key) {
  await caches.delete(key)
}

self.addEventListener('install', (ev) => {
  ev.waitUntil(cacheResource())
})

async function cacheResource() {
  const cache = await caches.open(CACHE_VERSION)
  return cache.addAll([...ICON_CACHE, ...PAGE_CACHE])
}

self.addEventListener('fetch', async (ev) => {
  if (ev.request.method !== 'GET') {
    return
  }

  ev.respondWith(cacheFirst(ev.request))
})

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request)

  if (cachedResponse) {
    return cachedResponse
  }

  try {
    const response = await fetch(request)
    putCache(request, response)
    return response
  } catch {
    return new Response('Network error!', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' },
    })
  }
}

async function putCache(request, response) {
  const cache = await caches.open(CACHE_VERSION)
  cache.put(request, response.clone())
}
