import { build, files, prerendered, version } from '$service-worker'

const worker = self
const cacheName = `appcache-${version}`
const toCache = [
	'/index.html', 	/* Index page */
	...build, 		/* compiled assets */
	...(files.filter( e => !e.match(/\/\./))), /* static files (except files hidden by Apache) */
	...prerendered /* pages */
]

// On installation cache all files to the new cache
worker.addEventListener("install", event => {
    event.waitUntil(
		caches.open(cacheName)
	      	.then(cache => new Promise((resolve, reject) =>  {
				// Ignoring "cache.addAll", since it does not tell, what files make problems
				toCache.map( async (e) => {
					try { await cache.add(e)
					} catch(err) { console.error("failed to fetch ", e); }
				});
				resolve(null);
		  	}))
	      	.then(() => worker.skipWaiting())
    )
})

// On activation delete all older caches
worker.addEventListener("activate", event => {
    event.waitUntil( 
		caches.keys().then(async (keys) => {
			for (const key of keys) {
				if (key !== cacheName)
					await caches.delete(key)
			}
		})
    )
})


worker.addEventListener("fetch", event => {

	// Basic cache first handling (Everything, that was not precached is just fetched)
	const fnc = async () => {
		let match = await caches.match(event.request.clone());
		if(match) return match;
		else return await fetch(event.request)
	}

	event.respondWith(fnc())

})