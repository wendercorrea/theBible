// Visualizador de alterações do PorAlmeida1911.json entre commits do GitHub.
// Roda 100% no navegador (GitHub Pages): lista os commits do arquivo pela API
// e compara duas versões em estilo "git diff", palavra a palavra.
(() => {
  const REPO = "wendercorrea/TheBible";
  const PATH = "PorAlmeida1911.json";
  const PAGE = 200;
  const BRANCH = "PORALMEIDA1911"; // branch onde o arquivo vive (main não o tem)

  const $ = (id) => document.getElementById(id);
  const cache = new Map();
  let changes = [];   // [{book, ref, before, after, o, n}]
  let shown = 0;
  let view = [];
  let commits = [];
  let cur = 0; // índice do commit exibido (0 = mais novo)

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const TK = /[\p{L}']+|[^\p{L}']+/gu;

  // diff de palavras por LCS (versículos têm poucas dezenas de tokens)
  function wordDiff(x, y) {
    const a = x.match(TK) || [], b = y.match(TK) || [];
    const m = a.length, n = b.length;
    const t = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
    for (let i = m - 1; i >= 0; i--)
      for (let j = n - 1; j >= 0; j--)
        t[i][j] = a[i] === b[j] ? t[i + 1][j + 1] + 1 : Math.max(t[i + 1][j], t[i][j + 1]);
    const ops = [];
    let i = 0, j = 0;
    while (i < m || j < n) {
      if (i < m && j < n && a[i] === b[j]) { ops.push(["=", a[i]]); i++; j++; }
      else if (j < n && (i === m || t[i][j + 1] >= t[i + 1][j])) { ops.push(["+", b[j]]); j++; }
      else { ops.push(["-", a[i]]); i++; }
    }
    return ops;
  }

  function render(ops) {
    let o = "", n = "", dn = "", dp = "";
    const flush = () => {
      if (dn) { o += "<del>" + esc(dn) + "</del>"; dn = ""; }
      if (dp) { n += "<ins>" + esc(dp) + "</ins>"; dp = ""; }
    };
    for (const [k, w] of ops) {
      if (k === "=") { flush(); o += esc(w); n += esc(w); }
      else if (k === "-") dn += w;
      else dp += w;
    }
    flush();
    return [o, n];
  }

  async function getJson(url) {
    if (cache.has(url)) return cache.get(url);
    const r = await fetch(url);
    if (!r.ok) throw new Error(url + " → HTTP " + r.status);
    const j = await r.json();
    cache.set(url, j);
    return j;
  }
  const rawUrl = (sha) => `https://raw.githubusercontent.com/${REPO}/${sha}/${PATH}`;

  function compare(A, B) {
    const out = [];
    const tops = new Map();
    const books = [];
    B.forEach((bk, bi) => {
      const ba = A[bi];
      if (!ba) return;
      let cnt = 0;
      bk.chapters.forEach((ch, ci) => ch.forEach((v, vi) => {
        const old = ba.chapters[ci] && ba.chapters[ci][vi];
        if (old === undefined || old === v) return;
        const ops = wordDiff(old, v);
        const [o, n] = render(ops);
        out.push({ book: bk.name, ref: `${bk.name} ${ci + 1}:${vi + 1}`, before: old, after: v, o, n });
        cnt++;
        // pares simples "antes → depois" para o ranking
        for (let k = 0; k < ops.length - 1; k++) {
          if (ops[k][0] === "-" && ops[k + 1][0] === "+" && /^[\p{L}']+$/u.test(ops[k][1]) && /^[\p{L}']+$/u.test(ops[k + 1][1])) {
            const key = ops[k][1] + " → " + ops[k + 1][1];
            tops.set(key, (tops.get(key) || 0) + 1);
          }
        }
      }));
      if (cnt) books.push(bk.name);
    });
    return { out, tops, books };
  }

  function showTop(tops) {
    const rows = [...tops.entries()].sort((a, b) => b[1] - a[1]).slice(0, 40);
    $("top").innerHTML = rows.map(([k, c]) => `<tr><td><code>${esc(k)}</code></td><td>${c}×</td></tr>`).join("");
    $("countWords").textContent = tops.size.toLocaleString("pt-BR") + " pares de palavras";
  }

  function applyFilter() {
    const bk = $("book").value, q = $("q").value.trim().toLowerCase();
    view = changes.filter((c) => (!bk || c.book === bk) && (!q || c.before.toLowerCase().includes(q) || c.after.toLowerCase().includes(q)));
    shown = 0;
    $("list").innerHTML = "";
    more();
    $("status").textContent = view.length.toLocaleString("pt-BR") + " versículos na lista";
  }

  function more() {
    const slice = view.slice(shown, shown + PAGE);
    $("list").insertAdjacentHTML("beforeend", slice.map((c) =>
      `<div class="v"><div class="r">@@ ${esc(c.ref)} @@</div><span class="l o">${c.o}</span><span class="l p">${c.n}</span></div>`).join(""));
    shown += slice.length;
    $("more").hidden = shown >= view.length;
  }

  function present(A, B, label) {
    const { out, tops, books } = compare(A, B);
    changes = out;
    $("result").hidden = false;
    $("countVerses").textContent = out.length.toLocaleString("pt-BR") + " versículos alterados";
    $("countRange").textContent = label;
    $("book").innerHTML = '<option value="">Todos os livros</option>' + books.map((b) => `<option>${esc(b)}</option>`).join("");
    showTop(tops);
    applyFilter();
  }

  function stepInfo() {
    const c = commits[cur];
    if (!c) return;
    const par = commits[cur + 1];
    $("stepInfo").innerHTML = `Commit ${cur + 1} de ${commits.length}: <a href="${c.html_url}" target="_blank" rel="noopener">${c.sha.slice(0, 7)}</a> · ${c.commit.author.date.slice(0, 10)} · ${esc(c.commit.message.split("\n")[0])}` + (par ? "" : " (primeira versão do arquivo)");
    $("newer").disabled = cur === 0;
    $("older").disabled = cur >= commits.length - 1;
  }

  function step(i) {
    if (i < 0 || i >= commits.length) return;
    cur = i;
    $("target").value = commits[i].sha;
    $("base").value = (commits[i + 1] || commits[i]).sha;
    stepInfo();
    run(true);
  }

  async function run(fromStep) {
    if (fromStep !== true) {
      const i = commits.findIndex((c) => c.sha === $("target").value);
      if (i >= 0) { cur = i; stepInfo(); }
    }
    const b = $("base").value, t = $("target").value;
    $("go").disabled = true;
    $("status").textContent = "Baixando versões…";
    try {
      const [A, B] = await Promise.all([getJson(rawUrl(b)), getJson(rawUrl(t))]);
      present(A, B, b.slice(0, 7) + " → " + t.slice(0, 7));
      history.replaceState(null, "", `#base=${b}&target=${t}`);
    } catch (e) {
      $("status").textContent = "Erro: " + e.message;
    } finally {
      $("go").disabled = false;
    }
  }

  async function runLocal() {
    const fa = $("fileA").files[0], fb = $("fileB").files[0];
    if (!fa || !fb) { $("status").textContent = "Escolha os dois arquivos."; return; }
    try {
      const [A, B] = await Promise.all([fa.text().then(JSON.parse), fb.text().then(JSON.parse)]);
      present(A, B, fa.name + " → " + fb.name);
    } catch (e) {
      $("status").textContent = "Erro: " + e.message;
    }
  }

  async function loadCommits(branch) {
    $("status").textContent = "Carregando commits de " + branch + "…";
    commits = [];
    for (let page = 1; page <= 20; page++) { // até 2000 commits do arquivo
      const r = await fetch(`https://api.github.com/repos/${REPO}/commits?sha=${encodeURIComponent(branch)}&path=${encodeURIComponent(PATH)}&per_page=100&page=${page}`);
      if (!r.ok) throw new Error("API do GitHub: HTTP " + r.status);
      const part = await r.json();
      commits = commits.concat(part);
      if (part.length < 100) break;
    }
    if (!commits.length) throw new Error("Nenhum commit de " + PATH + " no branch " + branch);
    const opt = (c) => `<option value="${c.sha}">${c.sha.slice(0, 7)} · ${c.commit.author.date.slice(0, 10)} · ${esc(c.commit.message.split("\n")[0])}</option>`;
    $("base").innerHTML = $("target").innerHTML = commits.map(opt).join("");
    $("target").selectedIndex = 0;
    $("base").selectedIndex = Math.min(1, commits.length - 1);
    cur = 0;
    stepInfo();
    $("go").disabled = false;
    $("status").textContent = commits.length + " commits do arquivo no branch " + branch + ".";
    if (commits.length > 1) run(true); else $("status").textContent += " Só há um commit.";
  }

  async function init() {
    $("go").onclick = () => run();
    $("goLocal").onclick = runLocal;
    $("more").onclick = more;
    $("orig").onclick = () => {
      if (commits.length < 2) return;
      $("base").value = commits[commits.length - 1].sha; // original = commit mais antigo do arquivo
      $("target").value = commits[0].sha;
      cur = 0; stepInfo(); run(true);
    };
    $("newer").onclick = () => step(cur - 1);
    $("older").onclick = () => step(cur + 1);
    document.addEventListener("keydown", (e) => {
      if (/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)) return;
      if (e.key === "ArrowLeft") step(cur - 1);
      if (e.key === "ArrowRight") step(cur + 1);
    });
    $("book").onchange = applyFilter;
    let timer;
    $("q").oninput = () => { clearTimeout(timer); timer = setTimeout(applyFilter, 250); };
    try {
      let names = [BRANCH];
      try {
        const rb = await fetch(`https://api.github.com/repos/${REPO}/branches?per_page=100`);
        if (rb.ok) names = (await rb.json()).map((b) => b.name);
      } catch (_) { /* usa só o branch padrão da página */ }
      if (!names.includes(BRANCH)) names.unshift(BRANCH);
      $("branch").innerHTML = names.map((n) => `<option${n === BRANCH ? " selected" : ""}>${esc(n)}</option>`).join("");
      $("branch").onchange = () => loadCommits($("branch").value).catch((e) => { $("status").textContent = e.message; });
      await loadCommits(BRANCH);
      const h = new URLSearchParams(location.hash.slice(1));
      if (h.get("base") && h.get("target")) { $("base").value = h.get("base"); $("target").value = h.get("target"); run(); }
    } catch (e) {
      $("status").textContent = e.message + " — use “Comparar dois arquivos locais”.";
      $("go").disabled = true;
    }
  }
  init();
})();
