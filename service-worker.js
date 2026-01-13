
self.addEventListener("install", e => {
e.waitUntil(
caches.open("morphine-v1").then(cache =>
cache.addAll(["./","./index.html","./style.css","./app.js"])
)
);
});
