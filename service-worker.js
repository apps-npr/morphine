self.addEventListener("install", event => {
  event.waitUntil(
    caches.open("morphine-v1").then(cache =>
      cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./app.js"
      ])
    )
  );
});
