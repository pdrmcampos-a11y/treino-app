// Lógica pura (sem DOM) para poder testar no Node.
(function (root) {
  const ORDER = ["A", "B", "C"];

  // Treino do dia: o que já está em andamento hoje, senão o próximo da sequência A→B→C.
  function nextTreino(sessions, today) {
    const last = sessions[sessions.length - 1];
    if (!last) return "A";
    if (last.d === today) return last.t;
    return ORDER[(ORDER.indexOf(last.t) + 1) % ORDER.length];
  }

  // Cargas registradas de um exercício, da mais antiga para a mais recente.
  function history(sessions, id) {
    return sessions.filter((s) => s.kg[id] != null).map((s) => s.kg[id]);
  }

  // Mesma carga nas duas últimas vezes → hora de subir (dupla progressão).
  function suggestUp(h) {
    return h.length >= 2 && h[h.length - 1] === h[h.length - 2];
  }

  // Grava (ou remove, se kg == null) a carga de um exercício na sessão do dia/treino.
  function upsert(sessions, d, t, id, kg) {
    let s = sessions.find((x) => x.d === d && x.t === t);
    if (kg == null) {
      if (!s) return sessions;
      delete s.kg[id];
      if (!Object.keys(s.kg).length) sessions.splice(sessions.indexOf(s), 1); // in place: o app ignora o retorno
      return sessions;
    }
    if (!s) { s = { d, t, kg: {} }; sessions.push(s); }
    s.kg[id] = kg;
    return sessions;
  }

  // Backup colado pelo usuário: só aceita o formato exato (um backup torto deixaria o app em branco).
  const okDate = (d) => typeof d === "string" && /^\d{4}-\d\d-\d\d$/.test(d);
  function validBackup(o) {
    return !!o && Array.isArray(o.sessions) && Array.isArray(o.bodyweight)
      && o.sessions.every((s) => s && okDate(s.d) && ORDER.includes(s.t) && s.kg && typeof s.kg === "object"
        && Object.values(s.kg).every(Number.isFinite))
      && o.bodyweight.every((e) => e && okDate(e.d) && Number.isFinite(e.kg));
  }

  // Dias entre duas datas "YYYY-MM-DD" (ambas lidas em UTC, então a conta é exata).
  const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 864e5);

  const api = { ORDER, nextTreino, history, suggestUp, upsert, validBackup, daysBetween };
  if (typeof module !== "undefined") module.exports = api;
  else root.Logic = api;
})(typeof self !== "undefined" ? self : this);
