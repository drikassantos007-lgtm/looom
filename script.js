function initTheme() {
  const saved = localStorage.getItem("wrmThemeMode") || "light";
  if (saved === "light") document.body.classList.add("light");
  updateThemeIcon();
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const mode = document.body.classList.contains("light") ? "light" : "dark";
  localStorage.setItem("wrmThemeMode", mode);
  updateThemeIcon();
}

function updateThemeIcon() {
  const btn = document.getElementById("themeToggle");
  if (!btn) return;
  const isLight = document.body.classList.contains("light");
  btn.textContent = isLight ? "🌙" : "🌑";
  btn.title = isLight ? "Modo escuro" : "Modo claro";
}

function showToast(msg, type = "") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = `toast ${type}`;
  setTimeout(() => toast.classList.add("show"), 10);
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { toast.classList.remove("show"); }, 2800);
}

const PALETAS = [
  { id: "padrao", nome: "Névoa",    cores: ["#77858b", "#849fad", "#a9b9bd", "#cbc9cc", "#f0e5df"] },
  { id: "rosa",   nome: "Rosé",     cores: ["#8c4a5e", "#b0607a", "#dba8b8", "#e9d3da", "#f7ece6"] },
  { id: "verde",  nome: "Floresta", cores: ["#3f6652", "#4f7d62", "#8fb59e", "#c9dccf", "#eef0e0"] },
  { id: "roxo",   nome: "Lavanda",  cores: ["#46396b", "#7662a8", "#a99bd0", "#d8d0ea", "#f0e9f2"] },
  { id: "solar",  nome: "Areia",    cores: ["#7f5a0c", "#a07a1d", "#d4b25a", "#ecd9a3", "#f6efd9"] },
];
function renderPaletas() {
  const box = document.getElementById("listaPaletas");
  if (!box) return;
  box.innerHTML = PALETAS.map(p => `
    <button class="paleta-card" data-tema="${p.id}" onclick="trocarTema('${p.id}')">
      <span class="paleta-cores">${p.cores.map(c => `<i style="background:${c}"></i>`).join("")}</span>${p.nome}
    </button>`).join("");
}
function aplicarTema(tema) {
  if (tema === "amarelo") tema = "solar";
  if (!PALETAS.some(p => p.id === tema)) tema = "padrao";
  document.documentElement.dataset.tema = tema;
  localStorage.setItem("temaPerfil", tema);
  document.querySelectorAll(".paleta-card").forEach(b => b.classList.toggle("active", b.dataset.tema === tema));
}
function trocarTema(tema) { aplicarTema(tema); showToast(" Paleta aplicada!", "success"); }

function aplicarFonte(t, avisar = false) {
  t = String(t);
  document.documentElement.style.zoom = Number(t) / 15;
  localStorage.setItem("wrmFonte", t);
  if (avisar) showToast("Tamanho do texto ajustado!", "success");
}

const kU = k => k + ":" + (localStorage.getItem("loomMeuUser") || "");

function editarBio() {
  const bio = document.getElementById("bioTexto");
  const area = document.getElementById("bioTextarea");
  const btnEditar = document.getElementById("btnEditarBio");
  const btnSalvar = document.getElementById("btnSalvarBio");
  const btnCancelar = document.getElementById("btnCancelarBio");

  if (!bio || !area) return;

  bio.style.display = "none";
  area.style.display = "block";
  area.value = bio.textContent.trim();
  btnEditar.style.display = "none";
  if (btnSalvar) btnSalvar.style.display = "inline-flex";
  if (btnCancelar) btnCancelar.style.display = "inline-flex";
  area.focus();
}

function salvarBio() {
  const bio = document.getElementById("bioTexto");
  const area = document.getElementById("bioTextarea");
  const btnEditar = document.getElementById("btnEditarBio");
  const btnSalvar = document.getElementById("btnSalvarBio");
  const btnCancelar = document.getElementById("btnCancelarBio");

  if (!bio || !area) return;

  bio.textContent = area.value.trim() || bio.textContent;
  localStorage.setItem(kU("wrmBio"), bio.textContent);
  bio.style.display = "block";
  area.style.display = "none";
  btnEditar.style.display = "inline-flex";
  if (btnSalvar) btnSalvar.style.display = "none";
  if (btnCancelar) btnCancelar.style.display = "none";
  showToast("Bio atualizada!", "success");
}

function cancelarBio() {
  const bio = document.getElementById("bioTexto");
  const area = document.getElementById("bioTextarea");
  const btnEditar = document.getElementById("btnEditarBio");
  const btnSalvar = document.getElementById("btnSalvarBio");
  const btnCancelar = document.getElementById("btnCancelarBio");

  if (!bio || !area) return;

  bio.style.display = "block";
  area.style.display = "none";
  btnEditar.style.display = "inline-flex";
  if (btnSalvar) btnSalvar.style.display = "none";
  if (btnCancelar) btnCancelar.style.display = "none";
}

function copiarLink() {
  const url = window.location.href;
  navigator.clipboard.writeText(url).then(() => {
    showToast("Link copiado!", "success");
  }).catch(() => {
    showToast("Link: " + url);
  });
}

function compartilharPerfil() {
  const dados = { title: "Loom — " + (document.getElementById("nomeUsuario")?.textContent || "perfil"), text: "Confira meu perfil no Loom!", url: window.location.href };
  if (navigator.share) {
    navigator.share(dados).catch(() => copiarLink());
  } else {
    copiarLink();
  }
}

function filtrarAlunos() {
  const pesquisaInput = document.getElementById("pesquisa");
  const filtroTurmaInput = document.getElementById("filtroTurma");
  const filtroAnoInput = document.getElementById("filtroAno");
  const alunos = document.querySelectorAll(".aluno-card");

  if (!pesquisaInput || !filtroTurmaInput || !filtroAnoInput) return;

  const pesquisa = pesquisaInput.value.toLowerCase();
  const turma = filtroTurmaInput.value;
  const ano = filtroAnoInput.value;
  let visiveis = 0;

  alunos.forEach(aluno => {
    const nome = aluno.dataset.nome.toLowerCase();
    const ok = nome.includes(pesquisa)
      && (turma === "" || aluno.dataset.turma === turma)
      && (ano === "" || aluno.dataset.ano === ano);
    aluno.style.display = ok ? "block" : "none";
    if (ok) visiveis++;
  });

  const msg = document.getElementById("semResultados");
  if (msg) msg.style.display = visiveis === 0 ? "block" : "none";
}

function curtirPost(botao) {
  const curtido = botao.dataset.curtido === "1";
  let numero = parseInt(botao.dataset.count || 0);
  if (curtido) {
    numero--;
    botao.dataset.curtido = "0";
    botao.style.color = "";
  } else {
    numero++;
    botao.dataset.curtido = "1";
    botao.style.color = "#f87171";
  }
  botao.dataset.count = numero;
  botao.textContent = `❤ ${numero}`;
}

function mostrarComentarios(botao) {
  const comentarios = botao.parentElement.nextElementSibling;
  const aberto = comentarios.style.display !== "none";
  comentarios.style.display = aberto ? "none" : "block";
}

function criarComentarioEl(autor, texto, mencao = "") {
  const d = document.createElement("div");
  d.className = "comentario";
  d.dataset.autor = autor;
  d.innerHTML = `<p><strong style="color:var(--accent)">${esc(autor)}</strong> ${mencao ? `<span class="mencao">@${esc(mencao)}</span> ` : ""}${esc(texto)}</p>
    <div class="comentario-acoes"><button onclick="responderComentario(this)">Responder</button></div>
    ${mencao ? "" : '<div class="respostas"></div>'}`;
  return d;
}
function responderComentario(btn) {
  const alvo = btn.closest(".comentario");
  const box = btn.closest(".comentarios");
  box._alvo = alvo;
  let aviso = box.querySelector(".respondendo");
  if (!aviso) { aviso = document.createElement("div"); aviso.className = "respondendo"; box.querySelector(".comentario-row").before(aviso); }
  aviso.innerHTML = `<span>Respondendo a <b>@${esc(alvo.dataset.autor)}</b></span><button onclick="cancelarResposta(this)">✕</button>`;
  box.querySelector(".input-comentario").focus();
}
function cancelarResposta(el) {
  const box = el.closest(".comentarios");
  box._alvo = null;
  box.querySelector(".respondendo")?.remove();
}
function comentarPost(botao) {
  const box = botao.closest(".comentarios");
  const input = box.querySelector(".input-comentario");
  const texto = input.value.trim();
  if (!texto) return;
  const eu = usuarioAtual().nome;
  const alvo = box._alvo;
  if (alvo) {
    const topo = alvo.closest(".respostas") ? alvo.parentElement.closest(".comentario") : alvo;
    topo.querySelector(".respostas").appendChild(criarComentarioEl(eu, texto, alvo.dataset.autor));
    cancelarResposta(box.querySelector(".respondendo") || box);
  } else {
    box.querySelector(".lista-comentarios").appendChild(criarComentarioEl(eu, texto));
  }
  input.value = "";
  input.focus();
}

function criarPostagem() {
  const textoEl = document.getElementById("textoPostagem");
  const imagemInput = document.getElementById("imagemPostagem");
  const lista = document.getElementById("listaPostagens");
  const texto = textoEl.value.trim();
  const eu = usuarioAtual();
  if (eu.verificado === false) { showToast("Verifique sua conta (menu → Verificar conta) para postar.", "error"); return; }

  if (texto === "" && imagemInput.files.length === 0) {
    showToast("Escreva algo ou escolha uma imagem.", "error");
    return;
  }

  let imagemHTML = "";
  if (imagemInput.files.length > 0) {
    const url = URL.createObjectURL(imagemInput.files[0]);
    imagemHTML = `<img src="${url}" alt="Imagem" class="post-imagem">`;
  }

  const novoPost = document.createElement("div");
  novoPost.className = "post-card";
  novoPost.dataset.turma = eu.curso;
  novoPost.dataset.autor = eu.user;
  novoPost.innerHTML = `
    <div class="post-topo-card">
      <div class="post-topo-info">
        <img src="${avatarUsuario(eu)}" alt="Foto">
        <div>
          <h3>${esc(eu.nome)}</h3>
          <span>${turmaTexto(eu)}</span>
        </div>
      </div>
      <button class="btn-excluir-post" onclick="excluirPost(this)" title="Excluir postagem">✕</button>
    </div>
    <p class="post-texto">${esc(texto)}</p>
    ${imagemHTML}
    <div class="post-acoes">
      <button onclick="curtirPost(this)" data-count="0" data-curtido="0">❤ 0</button>
      <button onclick="mostrarComentarios(this)">💬 Comentários</button>
    </div>
    <div class="comentarios" style="display:none;">
      <div class="lista-comentarios"></div>
      <div class="comentario-row">
        <input type="text" placeholder="Escreva um comentário..." class="input-comentario">
        <button class="btn-enviar-comentario" onclick="comentarPost(this)">Enviar</button>
      </div>
    </div>
  `;

  lista.prepend(novoPost);
  textoEl.value = "";
  imagemInput.value = "";
  showToast("Postagem publicada!", "success");
}

function limparPostagem() {
  const textoEl = document.getElementById("textoPostagem");
  const imagemInput = document.getElementById("imagemPostagem");
  if (textoEl) textoEl.value = "";
  if (imagemInput) imagemInput.value = "";
}

function excluirPost(btn) {
  const card = btn.closest(".post-card");
  if (!card) return;
  if (card.dataset.autor !== meuUsuario()) { showToast("Você só pode excluir as suas postagens.", "error"); return; }
  card.style.opacity = "0";
  card.style.transform = "scale(0.95)";
  card.style.transition = "all 0.25s ease";
  setTimeout(() => card.remove(), 250);
  showToast("Postagem excluída.", "");
}

async function hashSenha(user, senha) {
  const txt = `loom:${user}:${senha}`;
  if (!window.crypto?.subtle) return btoa(unescape(encodeURIComponent(txt)));
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(txt));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
}
function iniciarSessao(u) {
  localStorage.setItem("loomMeuUser", u.user);
  localStorage.setItem("wrmNome", u.nome);
  localStorage.setItem("wrmEmail", u.email);
  localStorage.setItem("wrmTurma", `${u.ano}º Ano • ${CURSOS[u.curso]} • AGV`);
  localStorage.setItem("wrmLogado", "true");
}
async function fazerLogin() {
  const email = document.getElementById("email").value.trim().toLowerCase();
  const senha = document.getElementById("senha").value;
  if (!email || !senha) { showToast("Preencha todos os campos!", "error"); return; }
  const u = lerJSON("loomUsers", []).find(x => (x.email || "").toLowerCase() === email);
  if (!u || !u.senhaHash || u.senhaHash !== await hashSenha(u.user, senha)) {
    showToast("E-mail ou senha incorretos.", "error"); return;
  }
  iniciarSessao(u);
  showToast("Login realizado!", "success");
  setTimeout(() => window.location.href = "inicio.html", 700);
}

document.addEventListener("DOMContentLoaded", function () {
  montarShell();
  initTheme();
  initLoom();
  initNavPill();

  aplicarTema(localStorage.getItem("temaPerfil") || "padrao");
  aplicarFonte(localStorage.getItem("wrmFonte") || "15");

  const bioSalva = localStorage.getItem(kU("wrmBio"));
  const bioEl = document.getElementById("bioTexto");
  if (bioSalva && bioEl) bioEl.textContent = bioSalva;

  document.querySelectorAll(".input-comentario").forEach(input => {
    input.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        const btn = input.nextElementSibling;
        if (btn) btn.click();
      }
    });
  });
});

function initNavPill() {
  const menu = document.querySelector('.menu');
  if (!menu) return;

  const pill = document.createElement('div');
  pill.style.cssText = `
    position: absolute;
    background: rgba(255,255,255,0.18);
    backdrop-filter: blur(8px);
    border-radius: 999px;
    transition: all 0.3s cubic-bezier(.4,0,.2,1);
    pointer-events: none;
    z-index: 0;
  `;
  menu.appendChild(pill);

  function moverPill(el) {
    pill.style.width = el.offsetWidth + 'px';
    pill.style.height = el.offsetHeight + 'px';
    pill.style.left = el.offsetLeft + 'px';
    pill.style.top = el.offsetTop + 'px';
  }

  const ativo = menu.querySelector('a.active');
  if (ativo) moverPill(ativo);

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('mouseenter', () => moverPill(link));
    link.addEventListener('mouseleave', () => {
      const atual = menu.querySelector('a.active');
      if (atual) moverPill(atual);
      else pill.style.width = '0';
    });
  });
}

const CURSOS = { DS: "Desenvolvimento de Sistemas", ADM: "Administração", PRT: "Portos", BIO: "Bioeconomia" };

const SEED_USERS = [
  { user: "andriellyn", nome: "Andriellyn", curso: "DS",  ano: 2, views: 248, seguidores: 34, img: "img/musa.jpg" },
  { user: "giovana",    nome: "Giovana",    curso: "DS",  ano: 3, views: 203, seguidores: 41, img: "img/gio.png" },
  { user: "joao",       nome: "João",       curso: "DS",  ano: 2, views: 175, seguidores: 28, img: "img/joao.jpg" },
  { user: "mickael",    nome: "Mickael",    curso: "ADM", ano: 2, views: 131, seguidores: 19, img: "img/ratopor.jpg" },
  { user: "gabriel",    nome: "Gabriel",    curso: "PRT", ano: 1, views: 109, seguidores: 15, img: "img/gabriel.jpg" },
  { user: "entoin",     nome: "Entoin",     curso: "BIO", ano: 1, views: 87,  seguidores: 22, img: "img/bluez.jpg" },
  { user: "ruan",       nome: "Ruan",       curso: "ADM", ano: 3, views: 64,  seguidores: 11, img: "img/rua.jpg" },
  { user: "arthur",     nome: "Arthur",     curso: "BIO", ano: 2, views: 52,  seguidores: 9,  img: "img/arthur.jpg" },
];

const lerJSON = (k, padrao) => { try { return JSON.parse(localStorage.getItem(k)) || padrao; } catch { return padrao; } };
const slugUser = v => (v || "").trim().toLowerCase().replace(/^@/, "");

function getUsuarios() {
  const stats = lerJSON("loomStats", {});
  return [...SEED_USERS, ...lerJSON("loomUsers", [])].map(u => ({
    ...u,
    views: (u.views || 0) + (stats[u.user]?.views || 0),
    seguidores: (u.seguidores || 0) + (stats[u.user]?.seguidores || 0),
  }));
}
function getUsuario(handle) { return getUsuarios().find(u => u.user === handle); }
function meuUsuario() { return localStorage.getItem("loomMeuUser") || "andriellyn"; }

function addStat(user, campo, delta) {
  const stats = lerJSON("loomStats", {});
  stats[user] = stats[user] || {};
  stats[user][campo] = (stats[user][campo] || 0) + delta;
  localStorage.setItem("loomStats", JSON.stringify(stats));
}
const getSeguindo = () => lerJSON("loomSeguindo", []);
function setSeguindo(user, seguindo) {
  const lista = getSeguindo().filter(u => u !== user);
  if (seguindo) lista.push(user);
  localStorage.setItem("loomSeguindo", JSON.stringify(lista));
}

function turmaTexto(u) { return `${u.ano}º Ano • ${u.curso}`; }
function avatarUsuario(u) {
  if (u.img) return u.img;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="#5a7b8d"/><text x="50" y="66" font-size="48" font-family="Arial" font-weight="700" text-anchor="middle" fill="#fff">${(u.nome || "?")[0].toUpperCase()}</text></svg>`;
  return "data:image/svg+xml," + encodeURIComponent(svg);
}

function validarUsuario(valor) {
  const user = slugUser(valor);
  if (!/^[a-z0-9._]{3,20}$/.test(user))
    return { ok: false, user, msg: "Use de 3 a 20 caracteres: letras, números, ponto ou _." };
  if (getUsuarios().some(u => u.user === user))
    return { ok: false, user, msg: "✕ Esse usuário já está em uso." };
  return { ok: true, user, msg: ` @${user} está disponível!` };
}

function garantirUsuario(e) {
  e.preventDefault();
  const r = validarUsuario(document.getElementById("garantirUser").value);
  if (!r.ok) { showToast(r.msg, "error"); return; }
  window.location.href = "cadastro.html?user=" + encodeURIComponent(r.user);
}

async function fazerCadastro(e) {
  if (e) e.preventDefault();
  const campos = ["nomeCadastro", "usuarioCadastro", "emailCadastro", "turmaCadastro", "senhaCadastro"];
  let vazio = false;
  campos.forEach(id => {
    const el = document.getElementById(id);
    const falta = !el.value.trim();
    el.classList.toggle("campo-erro", falta);
    if (falta) vazio = true;
  });
  if (vazio) { showToast("Preencha todos os campos!", "error"); return; }

  const nome = document.getElementById("nomeCadastro").value.trim();
  const email = document.getElementById("emailCadastro").value.trim();
  const turma = document.getElementById("turmaCadastro").value;
  const senha = document.getElementById("senhaCadastro").value;

  if (nome.length < 2) { showToast("Digite seu nome.", "error"); return; }
  const r = validarUsuario(document.getElementById("usuarioCadastro").value);
  if (!r.ok) { showToast(r.msg, "error"); return; }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast("E-mail inválido.", "error"); return; }
  if (senha.length < 6) { showToast("A senha precisa de ao menos 6 caracteres.", "error"); return; }

  if (lerJSON("loomUsers", []).some(x => (x.email || "").toLowerCase() === email.toLowerCase())) {
    showToast("Esse e-mail já tem cadastro.", "error"); return;
  }
  const [curso, ano] = turma.split("-");
  const novo = { user: r.user, nome, email, curso, ano: Number(ano), views: 0, seguidores: 0,
                 senhaHash: await hashSenha(r.user, senha), verificado: false, criadoEm: Date.now() };
  localStorage.setItem("loomUsers", JSON.stringify([...lerJSON("loomUsers", []), novo]));
  iniciarSessao(novo);
  showToast("Cadastro realizado! Agora digite o código de verificação.", "success");
  setTimeout(() => window.location.href = "verificar.html", 1200);
}

function initCadastro() {
  const inp = document.getElementById("usuarioCadastro");
  if (!inp) return;
  const msg = document.getElementById("msgUsuario");
  const checar = () => {
    inp.value = slugUser(inp.value);
    if (!inp.value) { msg.textContent = ""; return; }
    const r = validarUsuario(inp.value);
    msg.textContent = r.msg;
    msg.className = "msg-campo " + (r.ok ? "ok" : "erro");
  };
  inp.addEventListener("input", checar);
  const pre = new URLSearchParams(location.search).get("user");
  if (pre) { inp.value = pre; checar(); }
  document.querySelectorAll("#formCadastro input, #formCadastro select")
    .forEach(el => el.addEventListener("input", () => el.classList.remove("campo-erro")));
}

function renderDestaques(criterio = "views") {
  const grid = document.getElementById("destaquesGrid");
  if (!grid) return;
  document.querySelectorAll(".destaques-tabs button")
    .forEach(b => b.classList.toggle("active", b.dataset.rank === criterio));
  const outro = criterio === "views" ? "seguidores" : "views";
  const top = getUsuarios()
    .filter(u => u.verificado !== false)
    .sort((a, b) => b[criterio] - a[criterio] || b[outro] - a[outro])
    .slice(0, 3);
  const medalhas = ["🥇", "🥈", "🥉"];
  grid.innerHTML = top.map((u, i) => `
    <a class="destaque-card" href="perfil.html?u=${u.user}">
      <span class="destaque-medalha">${medalhas[i]}</span>
      <img src="${avatarUsuario(u)}" alt="${u.nome}" onerror="this.src='${avatarUsuario({ nome: u.nome })}'">
      <h3>${u.nome}</h3>
      <span class="destaque-user">@${u.user}</span>
      <span class="destaque-turma">${turmaTexto(u)}</span>
      <div class="destaque-stats">
        <span class="${criterio === "views" ? "em-foco" : ""}">👁 ${u.views}</span>
        <span class="${criterio === "seguidores" ? "em-foco" : ""}">👥 ${u.seguidores}</span>
      </div>
    </a>`).join("");
}

function initExplorar() {
  const lista = document.getElementById("listaAlunos");
  if (!lista) return;
  lerJSON("loomUsers", []).forEach(u => {
    const card = document.createElement("div");
    card.className = "aluno-card";
    card.dataset.user = u.user; card.dataset.nome = u.nome;
    card.dataset.turma = u.curso; card.dataset.ano = u.ano;
    card.innerHTML = `
      <img src="${avatarUsuario(u)}" alt="${u.nome}">
      <h3>${u.nome}</h3>
      <p>${turmaTexto(u)}</p>
      <span class="status-card online-texto">@${u.user}</span>
      <div class="aluno-acoes">
        <button class="btn-seguir" onclick="seguirAluno(this)">+ Seguir</button>
        <a href="perfil.html?u=${u.user}" class="btn-ver-perfil">Ver perfil</a>
      </div>`;
    lista.appendChild(card);
  });
  const seguindo = getSeguindo();
  lista.querySelectorAll(".aluno-card").forEach(card => {
    if (seguindo.includes(card.dataset.user)) {
      const b = card.querySelector(".btn-seguir");
      b.classList.add("seguindo"); b.textContent = "Seguindo";
    }
  });
}

function seguirAluno(btn) {
  const card = btn.closest(".aluno-card");
  const user = card.dataset.user;
  const seguindo = btn.classList.toggle("seguindo");
  btn.textContent = seguindo ? "Seguindo" : "+ Seguir";
  setSeguindo(user, seguindo);
  addStat(user, "seguidores", seguindo ? 1 : -1);
  const nome = card.querySelector("h3").textContent;
  showToast(seguindo ? `Você está seguindo ${nome}!` : `Você deixou de seguir ${nome}.`, seguindo ? "success" : "");
}

function initLoom() {
  renderPaletas();
  initInicio();
  initCadastro();
  renderDestaques("views");
  initExplorar();
  initApp();
}

const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
function usuarioAtual() { return getUsuario(meuUsuario()) || SEED_USERS[0]; }

function initApp() {
  if (!document.getElementById("apNome")) return;
  const u = usuarioAtual();
  const foto = localStorage.getItem(kU("wrmFoto")) || avatarUsuario(u);
  const nome = localStorage.getItem("wrmNome") || u.nome;
  const txt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
  ["apFoto", "apFoto2"].forEach(id => { const el = document.getElementById(id); if (el) el.src = foto; });
  txt("apNome", nome); txt("apNome2", nome);
  txt("apUser", "@" + u.user);
  txt("apTurma", turmaTexto(u)); txt("apTurma2", turmaTexto(u));
  txt("apViews", u.views); txt("apSeg", u.seguidores);
  txt("apPosts", document.querySelectorAll(`.post-card[data-autor="${u.user}"]`).length);

  document.querySelectorAll(".post-card").forEach(c => {
    if (c.dataset.autor !== u.user) c.querySelector(".btn-excluir-post")?.remove();
  });
}

let cursoFeed = "";
function filtrarFeed(curso, btn) {
  cursoFeed = curso;
  document.querySelectorAll(".ap-turma").forEach(b => b.classList.toggle("active", b === btn));
  aplicarFiltroFeed();
}
function aplicarFiltroFeed() {
  const q = (document.getElementById("buscaFeed")?.value || "").toLowerCase();
  document.querySelectorAll("#listaPostagens .post-card").forEach(p => {
    const okTurma = !cursoFeed || p.dataset.turma === cursoFeed;
    const okBusca = !q || p.textContent.toLowerCase().includes(q);
    p.style.display = okTurma && okBusca ? "" : "none";
  });
}
function sairApp() {
  localStorage.removeItem("wrmLogado");
  window.location.href = "login.html";
}

function montarShell() {
  const body = document.body;
  if (!body.classList.contains("app-body")) return;
  if (!localStorage.getItem("wrmLogado") || !localStorage.getItem("loomMeuUser")) { location.replace("login.html"); return; }
  const pag = location.pathname.split("/").pop() || "index.html";
  const pendente = usuarioAtual().verificado === false;
  const itens = [...(pendente ? [["verificar.html", "", "Verificar conta"]] : []), ["feed.html", "", "Feed"], ["inicio.html", "", "Início"], ["explorar.html", "", "Explorar"],
                 ["perfil.html", "", "Meu perfil"], ["configuracoes.html", "", "Configurações"]];
  const app = document.createElement("div");
  app.className = "app";
  app.innerHTML = `
    <aside class="ap-side">
      <a href="index.html" class="ap-logo"><b>L</b>Loom</a>
      <div class="ap-me">
        <img id="apFoto" src="" alt="Minha foto">
        <h3 id="apNome"></h3>
        <div class="ap-user" id="apUser"></div>
        <span class="ap-chip" id="apTurma"></span>
      </div>
      <div class="ap-stats">
        <div><strong id="apViews">0</strong><span>Visitas</span></div>
        <div><strong id="apSeg">0</strong><span>Seguidores</span></div>
        <div><strong id="apPosts">0</strong><span>Posts</span></div>
      </div>
      <nav class="ap-nav">
        ${itens.map(([h, i, t]) => `<a href="${h}" class="${pag === h ? "active" : ""}">${i} ${t}</a>`).join("")}
        <button class="sep" id="themeToggle" onclick="toggleTheme()">🌑</button>
        <button onclick="sairApp()">↩ Sair</button>
      </nav>
    </aside>
    <main class="ap-main"></main>`;
  const main = app.querySelector(".ap-main");
  [...body.children].filter(el => el.tagName !== "SCRIPT" && el.id !== "toast").forEach(el => main.appendChild(el));
  body.insertBefore(app, body.firstChild);
  body.classList.add("pronto");
}


const LINKS_PADRAO = { andriellyn: ["https://www.instagram.com/driarievilo/", "https://github.com/", "https://open.spotify.com/user/31csvzrqxfkkp3v7pdm5b7pzxygm", "https://www.tiktok.com/@dri_arievilo"] };
const REDES = [["instagram", "", "Instagram"], ["github", "", "GitHub"], ["spotify", "", "Spotify"], ["tiktok", "", "TikTok"], ["youtube", "", "YouTube"], ["linkedin", "", "LinkedIn"]];
function getLinks(user) { return lerJSON("loomLinks", {})[user] || LINKS_PADRAO[user] || []; }
function setLinks(user, arr) { const m = lerJSON("loomLinks", {}); m[user] = arr; localStorage.setItem("loomLinks", JSON.stringify(m)); }
function urlSegura(v) {
  v = (v || "").trim(); if (!v) return "";
  if (!/^https?:\/\//i.test(v)) v = "https://" + v;
  try { const u = new URL(v); return /^https?:$/.test(u.protocol) ? u.href : ""; } catch { return ""; }
}
function infoLink(url) {
  let h = ""; try { h = new URL(url).hostname; } catch {}
  const r = REDES.find(x => h.includes(x[0]));
  return r ? { emoji: r[1], nome: r[2] } : { emoji: "🔗", nome: h.replace(/^www\./, "") || url };
}
function renderLinksEm(el, user, classe, seta) {
  el.innerHTML = "";
  getLinks(user).forEach(url => {
    const i = infoLink(url), a = document.createElement("a");
    a.href = url; a.target = "_blank"; a.rel = "noopener noreferrer";
    if (classe) a.className = classe;
    a.innerHTML = `${i.emoji} ${esc(i.nome)}` + (seta ? ' <span class="link-arrow">→</span>' : "");
    el.appendChild(a);
  });
}

function initInicio() {
  const nomeEl = document.getElementById("heroNome");
  if (!nomeEl) return;
  const u = usuarioAtual();
  nomeEl.textContent = localStorage.getItem("wrmNome") || u.nome;
  document.getElementById("heroTurma").textContent = `@${u.user} • ${turmaTexto(u)}`;
  document.getElementById("heroFoto").src = localStorage.getItem(kU("wrmFoto")) || avatarUsuario(u);
  renderLinksEm(document.getElementById("heroLinks"), u.user, "", false);
}
function atualizarUsuario(patch) {
  const us = lerJSON("loomUsers", []), u = us.find(x => x.user === meuUsuario());
  if (u) { Object.assign(u, patch); localStorage.setItem("loomUsers", JSON.stringify(us)); }
}

const VERIF_SECRET = "troque-este-segredo";
async function codigoVerificacao(user) {
  const h = await hashSenha("verif:" + VERIF_SECRET, slugUser(user));
  return String(parseInt(h.slice(0, 8), 16) % 1000000).padStart(6, "0");
}

document.addEventListener("error", e => {
  const img = e.target;
  if (!img || img.tagName !== "IMG" || img.dataset.fb) return;
  img.dataset.fb = "1";
  img.src = avatarUsuario({ nome: img.alt || "?" });
}, true);
