// ─── IRONCUT SERVICE WORKER ───────────────────────────────────────────────────
const VERSION = "ic-sw-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

// ── RECEBE MENSAGEM DO APP ─────────────────────────────────────────────────
self.addEventListener("message", e => {
  const { tipo, payload } = e.data || {};

  if (tipo === "AGENDAR_NOTIFICACAO") {
    const { id, titulo, corpo, icone, delay } = payload;
    // Agenda via setTimeout dentro do SW
    setTimeout(() => {
      self.registration.showNotification(titulo, {
        body: corpo,
        icon: icone || "/logo.png",
        badge: "/logo.png",
        tag: id,
        renotify: true,
        vibrate: [200, 100, 200],
        data: { url: self.location.origin },
        actions: [
          { action: "abrir", title: "Abrir App" },
          { action: "ok",    title: "OK, obrigado!" },
        ],
      });
    }, delay);
  }

  if (tipo === "CANCELAR_NOTIFICACAO") {
    self.registration.getNotifications({ tag: payload.id })
      .then(ns => ns.forEach(n => n.close()));
  }

  if (tipo === "CANCELAR_TODAS") {
    self.registration.getNotifications()
      .then(ns => ns.forEach(n => n.close()));
  }
});

// ── CLIQUE NA NOTIFICAÇÃO ─────────────────────────────────────────────────
self.addEventListener("notificationclick", e => {
  e.notification.close();
  if (e.action === "ok") return;
  e.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(clients => {
      const client = clients.find(c => c.url.includes(self.location.origin));
      if (client) return client.focus();
      return self.clients.openWindow(e.notification.data?.url || "/");
    })
  );
});
