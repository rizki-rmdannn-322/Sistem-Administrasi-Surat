(() => {
    "use strict";

    // Helper DOM & keamanan teks

    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Ikon SVG 

    const P = {
        home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1Z"/>',
        list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
        inbox: '<path d="M22 12h-6l-2 3h-4l-2-3H2"/><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1Z"/>',
        send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
        history: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/>',
        plus: '<path d="M12 5v14M5 12h14"/>', x: '<path d="M18 6 6 18M6 6l12 12"/>',
        search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
        edit: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
        trash: '<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6"/>',
        moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z"/>',
        sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
        down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
        up: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
        printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
        eye: '<path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
        check: '<path d="M20 6 9 17l-5-5"/>', alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/>',
        cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        wand: '<path d="m15 4 5 5L8 21l-5-5Z"/><path d="M5 2v3M3.5 3.5h3M19 15v3M17.5 16.5h3"/>',
        mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
        trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>', chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-3"/>',
        save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>'
    };
    const ic = n => `<svg class="ic" viewBox="0 0 24 24">${P[n]}</svg>`;

    // Format tanggal & waktu

    const pad = n => String(n).padStart(2, "0");
    const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const today = () => dkey(new Date());
    const BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const BLNP = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const fmt = t => t ? t.split("-").reverse().join("-") : "";
    const fmtL = t => { const p = t.split("-"); return `${+p[2]} ${BLNP[+p[1] - 1]} ${p[0]}`; };
    const ago = iso => {
        const s = Math.floor((Date.now() - new Date(iso)) / 1000);
        return s < 60 ? "Baru saja" : s < 3600 ? Math.floor(s / 60) + " menit lalu" : s < 86400 ? Math.floor(s / 3600) + " jam lalu" : s < 604800 ? Math.floor(s / 86400) + " hari lalu" : fmt(dkey(new Date(iso)));
    };
    const jam = iso => { const d = new Date(iso); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };

    // Data & penyimpanan (Firebase Firestore, dipakai bersama semua perangkat)

    const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAiLylQl2B4jtoBJT47CmWwNobesgKHNgM",
  authDomain: "sistem-administrasi-sura-1413b.firebaseapp.com",
  projectId: "sistem-administrasi-sura-1413b",
  storageBucket: "sistem-administrasi-sura-1413b.firebasestorage.app",
  messagingSenderId: "665939059922",
  appId: "1:665939059922:web:21283e7642871f7f46b90b",
  measurementId: "G-DD62NEC1PX"
};
    
    firebase.initializeApp(FIREBASE_CONFIG);
    const ref = firebase.firestore().collection("agenda").doc("main");
    const KEY = "agenda_surat_v1"; // kunci localStorage lama, hanya untuk migrasi data
    let DB = { surat: [], riwayat: [], seq: 1 };
    let ready = false;
    const save = () => {
        if (!ready)
            return toast("Data belum dimuat dari server", "er");
        ref.set(JSON.parse(JSON.stringify(DB))).catch(() => toast("Gagal menyimpan ke server", "er"));
    };
    const byId = id => DB.surat.find(r => String(r.id) === String(id));
    const log = (aksi, r, detail) => { DB.riwayat.unshift({ id: Date.now() + Math.random(), sid: r.id, aksi, jenis: r.jenis, nomor: r.nomor, detail, at: new Date().toISOString() }); DB.riwayat = DB.riwayat.slice(0, 500); };
    const cut = (s, n = 70) => { s = String(s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };
    const FIELD = { jenis: "Jenis Surat", tanggal: "Tanggal", nomor: "Nomor Agenda", lembaga: "Lembaga/Instansi", org: "Organisasi/Perorangan", isi: "Perihal" };

    // Konfigurasi halaman & state 

    const META = {
        beranda: ["Beranda", "Ringkasan administrasi surat"], semua: ["Agenda Surat", "Seluruh surat masuk dan keluar", ""],
        masuk: ["Surat Masuk", "Daftar surat yang diterima", "Masuk"], keluar: ["Surat Keluar", "Daftar surat yang dikirim", "Keluar"],
        riwayat: ["Riwayat Aktivitas", "Catatan penambahan, perubahan, dan penghapusan surat"]
    };

    const st = { view: "beranda", q: "", from: "", to: "", fj: "", page: 1, pp: 10, desc: true, ra: "" };

    const view = $("#view");
    const ACT = { tambah: ["Ditambahkan", "plus", "c-ok"], ubah: ["Diubah", "edit", "c-wa"], hapus: ["Dihapus", "trash", "c-er"] };
    const jenisAktif = () => st.view === "semua" ? st.fj : META[st.view][2];
    const JN = { Masuk: ["c-ok", "inbox"], Keluar: ["c-er", "send"] };
    const badge = (j, text = j, icon = true) => `<span class="badge ${JN[j][0]}">${icon ? ic(JN[j][1]) + " " : ""}${text}</span>`;
    const chips = (attr, items) => items.map(([v, l]) => `<button class="chip" data-${attr}="${v}">${l}</button>`).join("");

    // Komponen UI: toast, tema, dock, modal

    function toast(msg, t) {
        const e = document.createElement("div");
        e.className = "toast " + (t || "");
        e.innerHTML = ic(t === "er" ? "alert" : "check") + `<span>${esc(msg)}</span>`;
        $("#toasts").append(e);
        setTimeout(() => { e.classList.add("out"); setTimeout(() => e.remove(), 400); }, 3000);
    }

    function setTheme(t) {
        document.documentElement.dataset.theme = t;
        $("#theme").innerHTML = ic(t === "dark" ? "sun" : "moon");
        try {
            localStorage.setItem("agenda_theme", t);
        }
        catch { }
    }

    let th = null;
    try {
        th = localStorage.getItem("agenda_theme");
    }
    catch { }
    setTheme(th || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
    $("#theme").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
    $("#sIc").innerHTML = ic("search");
    $("#gc").innerHTML = ic("x");
    $("#yr").textContent = new Date().getFullYear();
    const tick = () => { const d = new Date(); $("#dt").innerHTML = ic("cal") + " " + d.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) + " • " + jam(d); };
    tick();
    setInterval(tick, 30000);

    const NAV = [["beranda", "home", "Beranda"], ["semua", "list", "Agenda"], ["masuk", "inbox", "Masuk"], ["add", "plus", "Tambah"], ["keluar", "send", "Keluar"], ["riwayat", "history", "Riwayat"]];

    function renderDock() {
        const n = { semua: DB.surat.length, masuk: DB.surat.filter(r => r.jenis === "Masuk").length, keluar: DB.surat.filter(r => r.jenis === "Keluar").length };
        $("#dock").innerHTML = NAV.map(([id, i, l]) => id === "add"
            ? `<button class="bub add" data-add title="Tambah surat (N)" aria-label="Tambah surat">${ic(i)}</button>`
            : `<button class="bub ${st.view === id ? "on" : ""}" data-go="${id}" title="${l}">${ic(i)}<span>${l}</span>${n[id] ? `<em class="cnt">${n[id]}</em>` : ""}</button>`).join("");
    }

    const ov = $("#ov");
    const openModal = html => { $("#md").className = "md"; $("#md").innerHTML = html; ov.classList.add("show"); document.body.style.overflow = "hidden"; };
    const closeModal = () => { ov.classList.remove("show"); document.body.style.overflow = ""; };
    ov.addEventListener("mousedown", e => { if (e.target === ov)
        closeModal(); });

    // Form tambah/edit, hapus & detail surat

    function formModal(r, preset) {
        const e = !!r;
        r = r || { jenis: preset || "", tanggal: today(), nomor: "", lembaga: "", org: "", isi: "" };
        openModal(`<div class="mh ${e ? "edit" : ""}"><h4>${ic(e ? "edit" : "plus")} ${e ? "Edit Data Surat" : "Tambah Agenda Surat"}</h4><button data-close>${ic("x")}</button></div>
  <form id="fm" novalidate data-id="${e ? r.id : ""}"><div class="mb">
    <div class="r2">
      <div class="fl"><label>Jenis Surat <i>*</i></label><select name="jenis" required><option value="">-- Pilih jenis --</option>
        <option value="Masuk" ${r.jenis === "Masuk" ? "selected" : ""}>Surat Masuk</option><option value="Keluar" ${r.jenis === "Keluar" ? "selected" : ""}>Surat Keluar</option></select></div>
      <div class="fl"><label>Tgl/Bln/Tahun <i>*</i></label><input type="date" name="tanggal" value="${r.tanggal}" required></div>
    </div>
    <div class="fl"><label>Nomor Agenda <i>*</i></label><div class="ib"><input name="nomor" value="${esc(r.nomor)}" placeholder="Contoh: 001/ASM/IX/2026" required>
      <button type="button" class="btn b-gh sm" data-auto>${ic("wand")} Otomatis</button></div><small>Nomor agenda dapat disesuaikan dengan administrasi kantor.</small></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Lembaga / Instansi</label><input name="lembaga" value="${esc(r.lembaga)}" placeholder="Contoh: Dinas Pendidikan"></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Organisasi / Perorangan</label><input name="org" value="${esc(r.org)}" placeholder="Contoh: Universitas / Nama Perorangan"></div>
    <div class="fl"><label>Isi Surat / Perihal <i>*</i></label><textarea name="isi" rows="4" maxlength="2000" placeholder="Tuliskan isi atau perihal surat..." required>${esc(r.isi)}</textarea></div>
  </div><div class="mf"><button type="button" class="btn b-gh" data-close>Batal</button><button class="btn b-pr">${ic("save")} ${e ? "Simpan Perubahan" : "Simpan Surat"}</button></div></form>`);
        setTimeout(() => $(e || r.jenis ? "[name=nomor]" : "[name=jenis]").focus(), 260);
    }

    function submitForm(f) {
        const bad = $$("[required]", f).filter(i => !i.value.trim());
        $$(".fl.bad", f).forEach(x => x.classList.remove("bad"));
        if (bad.length) {
            bad.forEach(i => { const w = i.closest(".fl"); void w.offsetWidth; w.classList.add("bad"); });
            bad[0].focus();
            return toast("Data wajib belum lengkap!", "er");
        }
        const v = Object.fromEntries([...new FormData(f)].map(([k, x]) => [k, x.trim()]));
        const id = f.dataset.id;
        if (id) {
            const r = byId(id), ch = Object.keys(FIELD).filter(k => r[k] !== v[k]).map(k => FIELD[k]);
            Object.assign(r, v);
            log("ubah", r, ch.length ? "Mengubah " + ch.join(", ") : "Disimpan tanpa perubahan data");
            toast("Perubahan berhasil disimpan");
        }
        else {
            const r = { id: DB.seq++, ...v, createdAt: new Date().toISOString() };
            DB.surat.push(r);
            log("tambah", r, `Menambahkan surat ${r.jenis.toLowerCase()}: ${cut(r.isi)}`);
            toast("Surat berhasil ditambahkan");
        }
        save();
        closeModal();
        refresh();
    }

    function confirmModal(title, text, btn, fn) {
        openModal(`<div class="wi">${ic("alert")}</div><h4>${title}</h4><p>${text}</p><div class="mf"><button class="btn b-gh" data-close>Batal</button><button class="btn b-er" id="yes">${ic("trash")} ${btn}</button></div>`);
        $("#md").classList.add("sm");
        $("#yes").onclick = () => { fn(); save(); closeModal(); refresh(); };
    }
    const hapus = r => confirmModal("Hapus surat ini?", `Surat dengan nomor agenda "${esc(r.nomor)}" akan dihapus permanen.`, "Ya, Hapus", () => {
        DB.surat = DB.surat.filter(x => x.id !== r.id);
        log("hapus", r, `Menghapus surat ${r.jenis.toLowerCase()}${r.lembaga || r.org ? " (" + cut(r.lembaga + " " + r.org, 50) + ")" : ""}: ${cut(r.isi, 60)}`);
        toast("Surat berhasil dihapus");
    });

    function detail(r) {
        openModal(`<div class="mh"><h4>${ic("eye")} Detail Surat</h4><button data-close>${ic("x")}</button></div><div class="mb">
    <div class="dh">${badge(r.jenis, "Surat " + r.jenis)}<span class="nomor big">${esc(r.nomor)}</span></div>
    <div class="r2"><div class="dg"><label>Tanggal</label><div>${fmtL(r.tanggal)}</div></div><div class="dg"><label>Dicatat pada</label><div>${fmt(dkey(new Date(r.createdAt)))} ${jam(r.createdAt)}</div></div>
    <div class="dg"><label>Lembaga / Instansi</label><div>${esc(r.lembaga) || "-"}</div></div><div class="dg"><label>Organisasi / Perorangan</label><div>${esc(r.org) || "-"}</div></div>
    <div class="dg full"><label>Isi Surat / Perihal</label><div class="isi">${esc(r.isi)}</div></div></div></div>
    <div class="mf"><button class="btn b-gh" data-close>Tutup</button><button class="btn b-gh" data-edit="${r.id}">${ic("edit")} Edit</button><button class="btn b-er" data-del="${r.id}">${ic("trash")} Hapus</button></div>`);
    }

    // Halaman Beranda: statistik & grafik

    function monthly(n = 6) {
        const o = [], now = new Date();
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            o.push({ k: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, l: BLN[d.getMonth()], Masuk: 0, Keluar: 0 });
        }
        DB.surat.forEach(r => { const m = o.find(x => x.k === r.tanggal.slice(0, 7)); if (m)
            m[r.jenis]++; });
        return o;
    }

    function chart(d) {
        const W = 640, H = 260, L = 36, T = 14, B = 32, iw = W - L - 8, ih = H - T - B, top = Math.ceil(Math.max(4, ...d.map(x => Math.max(x.Masuk, x.Keluar))) / 4) * 4, gw = iw / d.length, bw = Math.min(26, gw / 3);
        let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik surat per bulan">`;
        for (let i = 0; i <= 4; i++) {
            const y = T + ih - ih * i / 4;
            s += `<line x1="${L}" x2="${W - 8}" y1="${y}" y2="${y}" stroke="var(--bd)" stroke-dasharray="${i ? "4 5" : 0}"/><text x="${L - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="var(--mu)">${top * i / 4}</text>`;
        }
        d.forEach((m, i) => {
            const cx = L + gw * i + gw / 2;
            [["Masuk", "var(--ok)", -bw - 2], ["Keluar", "var(--er)", 2]].forEach(([k, c, o], j) => {
                const h = Math.max(m[k] ? 4 : 0, ih * m[k] / top);
                s += `<rect class="bar" style="animation-delay:${i * 80 + j * 40}ms" x="${cx + o}" y="${T + ih - h}" width="${bw}" height="${h}" rx="6" fill="${c}"><title>${m.l}: ${m[k]} surat ${k.toLowerCase()}</title></rect>`;
            });
            s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="12" fill="var(--mu)">${m.l}</text>`;
        });
        return s + "</svg>";
    }

    function numAnim(el, to) {
        let t0;
        const step = ts => { t0 ??= ts; const p = Math.min((ts - t0) / 800, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1)
            requestAnimationFrame(step); };
        requestAnimationFrame(step);
    }

    function demo() {
        const mk = (b, d, j, n, l, o, i) => { const dt = new Date(); dt.setMonth(dt.getMonth() - b); dt.setDate(d); return { id: DB.seq++, jenis: j, tanggal: dkey(dt), nomor: n, lembaga: l, org: o, isi: i, createdAt: dt.toISOString() }; };
        const rows = [
            mk(5, 6, "Masuk", "001/ASM/I/2026", "Dinas Pendidikan", "Bidang Perguruan Tinggi", "Undangan rapat koordinasi akreditasi program studi."),
            mk(4, 12, "Keluar", "001/ASK/I/2026", "Kemenag Kuningan", "Seksi Pendidikan Tinggi", "Permohonan data mahasiswa penerima beasiswa."),
            mk(3, 3, "Masuk", "002/ASM/II/2026", "LLDIKTI Wilayah IV", "Sekretariat", "Pemberitahuan jadwal evaluasi kinerja dosen."),
            mk(2, 20, "Masuk", "003/ASM/III/2026", "PT Mitra Edukasi", "Bapak Andi", "Penawaran kerja sama penyediaan sistem informasi akademik."),
            mk(1, 9, "Keluar", "002/ASK/III/2026", "Pemerintah Desa Cibingbin", "Kepala Desa", "Permohonan izin pelaksanaan KKN mahasiswa."),
            mk(0, 1, "Keluar", "003/ASK/IV/2026", "Dinas Kesehatan", "Ibu Siti", "Konfirmasi kehadiran dalam seminar kesehatan masyarakat.")
        ];
        rows.forEach(r => { DB.surat.push(r); log("tambah", r, `Menambahkan surat ${r.jenis.toLowerCase()}: ${cut(r.isi)}`); });
        save();
        refresh();
        toast("Contoh data dimuat");
    }

    function mBeranda() {
        const S = DB.surat, tot = S.length, mk = S.filter(r => r.jenis === "Masuk").length, kl = tot - mk, bi = S.filter(r => r.tanggal.slice(0, 7) === today().slice(0, 7)).length;
        const sorted = [...S].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || b.id - a.id), h = new Date().getHours(), C = 2 * Math.PI * 54;
        const lastM = sorted.find(r => r.jenis === "Masuk"), lastK = sorted.find(r => r.jenis === "Keluar");
        const li = (r) => `<div class="li" data-detail="${r.id}"><div class="dot ${JN[r.jenis][0]}">${ic(JN[r.jenis][1])}</div><div><div class="t">${esc(r.nomor)}</div><div class="s">${esc(cut(r.isi))}</div></div><div class="r">${fmt(r.tanggal)}</div></div>`;
        const none = (i, t) => `<div class="empty tight">${ic(i)}<p>${t}</p></div>`;
        view.innerHTML = `
  <section class="hero"><div><h2>${h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 19 ? "Selamat sore" : "Selamat malam"}! 👋</h2>
    <p>Kelola surat masuk dan keluar dalam satu tempat. Saat ini tercatat <b>${tot}</b> surat, <b>${bi}</b> di antaranya pada bulan ${BLNP[new Date().getMonth()]}.</p></div>
    <div class="acts"><button class="btn b-wh" data-add="Masuk">${ic("inbox")} Catat Surat Masuk</button><button class="btn b-gl" data-add="Keluar">${ic("send")} Catat Surat Keluar</button></div></section>
  <section class="stats">${[["Total Surat", tot, "mail", "c-pr", "semua"], ["Surat Masuk", mk, "inbox", "c-ok", "masuk"], ["Surat Keluar", kl, "send", "c-er", "keluar"], ["Bulan Ini", bi, "cal", "c-wa", "semua"]]
            .map(([l, n, i, c, g], k) => `<div class="card stat" style="animation-delay:${k * 80}ms" data-go="${g}"><div class="si ${c}">${ic(i)}</div><div><small>${l}</small><h3 data-n="${n}">0</h3></div></div>`).join("")}</section>
  <section class="g2"><div class="card pn"><div class="pnh"><h3>${ic("chart")} Statistik 6 Bulan Terakhir</h3><div class="lg"><span><i class="bg-ok"></i>Masuk</span><span><i class="bg-er"></i>Keluar</span></div></div><div class="chart">${chart(monthly())}</div></div>
    <div class="card pn"><div class="pnh"><h3>${ic("trend")} Perbandingan</h3></div><div class="dw"><div class="dn"><svg viewBox="0 0 140 140" width="160" height="160">
      <circle cx="70" cy="70" r="54" fill="none" stroke="${tot ? "var(--er)" : "var(--bd)"}" stroke-width="18"/><circle id="dn" cx="70" cy="70" r="54" fill="none" stroke="var(--ok)" stroke-width="18" stroke-dasharray="0 ${C}" data-d="${tot ? C * mk / tot : 0} ${C}"/></svg>
      <div class="mid"><b>${tot}</b><small>Total surat</small></div></div>
      <div class="dl"><div><i class="bg-ok"></i>Masuk<b>${tot ? Math.round(mk * 100 / tot) : 0}%</b></div><div><i class="bg-er"></i>Keluar<b>${tot ? Math.round(kl * 100 / tot) : 0}%</b></div></div></div></div></section>
  <section class="g2b"><div class="card pn"><div class="pnh"><h3>${ic("mail")} Surat Terbaru</h3><button class="lk" data-go="semua">Lihat semua →</button></div>${sorted.length ? sorted.slice(0, 5).map(li).join("") : none("inbox", "Belum ada surat.")}</div>
    <div class="card pn"><div class="pnh"><h3>${ic("history")} Aktivitas Terakhir</h3><button class="lk" data-go="riwayat">Lihat riwayat →</button></div>${DB.riwayat.length ? DB.riwayat.slice(0, 5).map(a => { const m = ACT[a.aksi]; return `<div class="li" data-go="riwayat"><div class="dot ${m[2]}">${ic(m[1])}</div><div><div class="t">${m[0]} • ${esc(a.nomor)}</div><div class="s">${esc(a.detail)}</div></div><div class="r">${ago(a.at)}</div></div>`; }).join("") : none("history", "Belum ada aktivitas.")}</div></section>
  <section class="card bk"><div><b>Data &amp; Cadangan</b><div class="mu">Data tersimpan di server dan dipakai bersama semua perangkat. Cadangkan secara berkala agar aman.</div></div>
    <div class="acts"><button class="btn b-gh sm" data-act="backup">${ic("down")} Cadangkan (JSON)</button><button class="btn b-gh sm" data-act="restore">${ic("up")} Pulihkan</button>${tot ? "" : `<button class="btn b-pr sm" data-act="demo">${ic("wand")} Muat Contoh Data</button>`}</div></section>`;
        $$("[data-n]", view).forEach(e => numAnim(e, +e.dataset.n));
        setTimeout(() => { const c = $("#dn"); if (c)
            c.setAttribute("stroke-dasharray", c.dataset.d); }, 150);
    }

    // Halaman Data Surat: tabel, filter, ekspor, cetak

    function filtered() {
        const q = st.q.toLowerCase(), j = jenisAktif();
        return DB.surat.filter(r => (!j || r.jenis === j) && (!st.from || r.tanggal >= st.from) && (!st.to || r.tanggal <= st.to) &&
            (!q || [r.nomor, r.lembaga, r.org, r.isi].some(v => String(v || "").toLowerCase().includes(q))))
            .sort((a, b) => (st.desc ? -1 : 1) * (a.tanggal.localeCompare(b.tanggal) || a.id - b.id));
    }
    const hl = t => st.q ? esc(t).replace(new RegExp("(" + reEsc(esc(st.q)) + ")", "gi"), "<mark>$1</mark>") : esc(t);

    function mData() {
        const [t, s] = META[st.view];
        view.innerHTML = `<div class="ph"><div><h2>${t}</h2><p>${s}</p></div><div class="acts"><button class="btn b-gh" data-act="csv">${ic("down")} Ekspor CSV</button><button class="btn b-gh" data-act="print">${ic("printer")} Cetak</button><button class="btn b-pr" data-add>${ic("plus")} Tambah Surat</button></div></div>
  <div class="card flt">${st.view === "semua" ? `<div class="f"><label>Jenis</label><div class="chips" id="jc">${chips("j", [["", "Semua"], ["Masuk", "Masuk"], ["Keluar", "Keluar"]])}</div></div>` : ""}
    <div class="f"><label>Dari tanggal</label><input type="date" id="df" value="${st.from}"></div><div class="f"><label>Sampai tanggal</label><input type="date" id="dto" value="${st.to}"></div>
    <div class="f"><label>Periode cepat</label><div class="chips">${chips("r", [["all", "Semua"], ["7", "7 hari"], ["30", "30 hari"], ["m", "Bulan ini"]])}</div></div>
    <div class="f"><label>Tampilkan</label><select id="pp">${[10, 25, 50, 100].map(n => `<option value="${n}" ${n === st.pp ? "selected" : ""}>${n} data</option>`).join("")}</select></div>
    <button class="btn b-gh sm" data-act="reset">Reset filter</button></div>
  <div class="card tc"><div class="th"><h3>${ic("list")} Data Buku Agenda Surat</h3><span class="mu" id="ci"></span></div><div class="tw"><table><thead><tr><th class="ct">No</th><th>Jenis Surat</th><th class="so" data-act="sort">Tgl/Bln/Tahun <span id="ar"></span></th><th>Nomor Agenda</th><th>Lembaga / Instansi</th><th>Organisasi / Perorangan</th><th>Perihal</th><th class="ct">Aksi</th></tr></thead><tbody id="tb"></tbody></table></div><div class="pg" id="pg"></div></div>`;
        rows();
    }

    function rows() {
        const all = filtered(), pages = Math.max(1, Math.ceil(all.length / st.pp));
        st.page = Math.min(st.page, pages);
        const a = (st.page - 1) * st.pp, sl = all.slice(a, a + st.pp), fl = st.q || st.from || st.to || st.fj;
        $("#ci").textContent = all.length ? `Menampilkan ${a + 1}–${a + sl.length} dari ${all.length} surat` : "0 surat";
        $("#ar").textContent = st.desc ? "↓" : "↑";
        $$("#jc .chip").forEach(c => c.classList.toggle("on", c.dataset.j === st.fj));
        $("#tb").innerHTML = sl.length ? sl.map((r, i) => {
            return `<tr data-id="${r.id}" style="animation-delay:${i * 35}ms"><td class="ct">${a + i + 1}</td>
    <td>${badge(r.jenis)}</td><td>${fmt(r.tanggal)}</td><td><span class="nomor">${hl(r.nomor)}</span></td><td>${hl(r.lembaga)}</td><td>${hl(r.org)}</td><td><div class="pf">${hl(r.isi)}</div></td>
    <td><div class="ac"><button class="btn bi v-view" data-detail="${r.id}" title="Detail">${ic("eye")}</button><button class="btn bi v-edit" data-edit="${r.id}" title="Edit">${ic("edit")}</button><button class="btn bi v-del" data-del="${r.id}" title="Hapus">${ic("trash")}</button></div></td></tr>`;
        }).join("")
            : `<tr><td colspan="8"><div class="empty">${ic("inbox")}<p>${DB.surat.length && fl ? "Tidak ada surat yang cocok dengan filter." : "Belum ada data surat."}</p>${DB.surat.length && fl ? `<button class="btn b-gh" data-act="reset">Reset filter</button>` : `<button class="btn b-pr" data-add>${ic("plus")} Tambah Surat</button>`}</div></td></tr>`;
        let p = "";
        if (pages > 1) {
            p = `<button data-p="${st.page - 1}" ${st.page < 2 ? "disabled" : ""}>‹</button>`;
            for (let i = 1; i <= pages; i++)
                p += `<button data-p="${i}" class="${i === st.page ? "on" : ""}">${i}</button>`;
            p += `<button data-p="${st.page + 1}" ${st.page === pages ? "disabled" : ""}>›</button>`;
        }
        $("#pg").innerHTML = p;
    }

    function setRange(r) {
        const to = today(), f = new Date(Date.now() - (+r - 1) * 864e5);
        st.from = r === "all" ? "" : r === "m" ? to.slice(0, 8) + "01" : dkey(f);
        st.to = r === "all" ? "" : to;
        $("#df").value = st.from;
        $("#dto").value = st.to;
        st.page = 1;
        rows();
    }

    function csv() {
        const r = filtered();
        if (!r.length)
            return toast("Tidak ada data untuk diekspor", "er");
        const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const L = [["No", "Jenis Surat", "Tanggal", "Nomor Agenda", "Lembaga/Instansi", "Organisasi/Perorangan", "Perihal"].map(q).join(",")];
        r.forEach((x, i) => L.push([i + 1, x.jenis, fmt(x.tanggal), x.nomor, x.lembaga, x.org, x.isi].map(q).join(",")));
        download("﻿" + L.join("\r\n"), `agenda-surat-${st.view}-${today()}.csv`, "text/csv;charset=utf-8");
        toast(`${r.length} data diekspor ke CSV`);
    }

    function download(data, name, type) {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(new Blob([data], { type }));
        a.download = name;
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }

    function print() {
        const r = filtered();
        if (!r.length)
            return toast("Tidak ada data untuk dicetak", "er");
        $("#pa").innerHTML = `<h2>Buku Agenda Surat${jenisAktif() ? " — Surat " + jenisAktif() : ""}</h2><p>Universitas Islam Al-Ihya Kuningan • ${st.from || st.to ? `Periode: ${st.from ? fmt(st.from) : "awal"} s/d ${st.to ? fmt(st.to) : "sekarang"}` : "Semua tanggal"} • Dicetak ${fmtL(today())}</p>
  <table><thead><tr><th>No</th><th>Jenis</th><th>Tanggal</th><th>Nomor Agenda</th><th>Lembaga/Instansi</th><th>Organisasi/Perorangan</th><th>Perihal</th></tr></thead><tbody>${r.map((x, i) => `<tr><td>${i + 1}</td><td>${x.jenis}</td><td>${fmt(x.tanggal)}</td><td>${esc(x.nomor)}</td><td>${esc(x.lembaga)}</td><td>${esc(x.org)}</td><td>${esc(x.isi)}</td></tr>`).join("")}</tbody></table>
  <div class="ft">Copyright © ${new Date().getFullYear()} by Rizki — Sistem Administrasi Surat Masuk dan Keluar</div>`;
        window.print();
    }

    // Halaman Riwayat

    function mRiwayat() {
        view.innerHTML = `<div class="ph"><div><h2>${META.riwayat[0]}</h2><p>${META.riwayat[1]}</p></div><div class="acts"><button class="btn b-gh" data-act="clear" ${DB.riwayat.length ? "" : "disabled"}>${ic("trash")} Bersihkan Riwayat</button></div></div>
  <div class="card flt"><div class="f"><label>Jenis aktivitas</label><div class="chips" id="ac">${chips("a", [["", "Semua"], ["tambah", "Ditambahkan"], ["ubah", "Diubah"], ["hapus", "Dihapus"]])}</div></div><div class="mu sp" id="rc"></div></div>
  <div class="card"><div class="tl" id="tl"></div></div>`;
        timeline();
    }

    function timeline() {
        const q = st.q.toLowerCase(), R = DB.riwayat.filter(a => (!st.ra || a.aksi === st.ra) && (!q || [a.nomor, a.detail, a.jenis].some(v => String(v).toLowerCase().includes(q))));
        $$("#ac .chip").forEach(c => c.classList.toggle("on", c.dataset.a === st.ra));
        $("#rc").textContent = R.length + " aktivitas";
        if (!R.length) {
            $("#tl").innerHTML = `<div class="empty">${ic("history")}<p>${DB.riwayat.length ? "Tidak ada aktivitas yang cocok." : "Belum ada riwayat. Tambah, ubah, atau hapus surat untuk mulai mencatat."}</p></div>`;
            return;
        }
        const y = dkey(new Date(Date.now() - 864e5));
        let h = "", last = "", n = 0;
        R.forEach(a => {
            const d = dkey(new Date(a.at)), m = ACT[a.aksi];
            if (d !== last) {
                h += `<div class="day">${d === today() ? "Hari ini" : d === y ? "Kemarin" : fmtL(d)}</div>`;
                last = d;
            }
            h += `<div class="ti" style="animation-delay:${Math.min(n++, 12) * 40}ms"><div class="tic ${m[2]}">${ic(m[1])}</div><div class="tb"><div class="tt"><span class="tag ${m[2]}">${m[0]}</span><b>${hl(a.nomor)}</b>${badge(a.jenis, a.jenis, false)}<time>${jam(a.at)} • ${ago(a.at)}</time></div><div class="td">${hl(a.detail)}</div>
      ${a.aksi !== "hapus" && byId(a.sid) ? `<div class="mt8"><button class="btn b-gh sm" data-detail="${a.sid}">${ic("eye")} Lihat surat</button></div>` : ""}</div></div>`;
        });
        $("#tl").innerHTML = h;
    }

    // Navigasi & event handler

    function refresh() { renderDock(); ({ beranda: mBeranda, riwayat: mRiwayat }[st.view] || mData)(); }

    function setView(v, anim = true) {
        st.view = v;
        st.page = 1;
        document.title = META[v][0] + " • Buku Agenda Surat";
        if (anim) {
            view.classList.remove("view");
            void view.offsetWidth;
            view.classList.add("view");
            window.scrollTo({ top: 0 });
        }
        refresh();
    }
    const fromHash = () => { const v = location.hash.replace(/^#\/?/, ""); return META[v] ? v : "beranda"; };
    addEventListener("hashchange", () => setView(fromHash()));

    document.addEventListener("click", e => {
        const g = id => e.target.closest(id);
        if (g("[data-close]"))
            return closeModal();
        const go = g("[data-go]");
        if (go) {
            closeModal();
            return location.hash === "#/" + go.dataset.go ? setView(go.dataset.go) : (location.hash = "#/" + go.dataset.go);
        }
        const ad = g("[data-add]");
        if (ad)
            return formModal(null, ad.dataset.add || META[st.view][2]);
        const ed = g("[data-edit]");
        if (ed)
            return formModal(byId(ed.dataset.edit));
        const de = g("[data-del]");
        if (de)
            return hapus(byId(de.dataset.del));
        const dt = g("[data-detail]");
        if (dt)
            return detail(byId(dt.dataset.detail));
        const au = g("[data-auto]");
        if (au) {
            const f = $("#fm"), j = f.jenis.value;
            if (!j) {
                f.jenis.closest(".fl").classList.add("bad");
                return toast("Pilih jenis surat dulu", "er");
            }
            const d = f.tanggal.value ? new Date(f.tanggal.value) : new Date();
            f.nomor.value = `${String(DB.surat.filter(r => r.jenis === j).length + 1).padStart(3, "0")}/${j === "Masuk" ? "ASM" : "ASK"}/${ROM[d.getMonth()]}/${d.getFullYear()}`;
            return f.nomor.focus();
        }
        const ac = g("[data-act]");
        if (ac) {
            const a = ac.dataset.act;
            if (a === "csv")
                return csv();
            if (a === "print")
                return print();
            if (a === "demo")
                return demo();
            if (a === "sort") {
                st.desc = !st.desc;
                return rows();
            }
            if (a === "reset") {
                Object.assign(st, { q: "", from: "", to: "", fj: "", page: 1 });
                $("#gs").value = "";
                $("#sbox").classList.remove("has");
                return mData();
            }
            if (a === "backup") {
                download(JSON.stringify(DB, null, 2), `backup-agenda-surat-${today()}.json`, "application/json");
                return toast("Cadangan data diunduh");
            }
            if (a === "restore")
                return $("#file").click();
            if (a === "clear")
                return confirmModal("Bersihkan riwayat?", "Seluruh catatan riwayat akan dihapus. Data surat tidak ikut terhapus.", "Ya, Bersihkan", () => { DB.riwayat = []; toast("Riwayat berhasil dibersihkan"); });
        }
        const j = g("[data-j]");
        if (j) {
            st.fj = j.dataset.j;
            st.page = 1;
            return rows();
        }
        const r = g("[data-r]");
        if (r)
            return setRange(r.dataset.r);
        const ra = g("[data-a]");
        if (ra) {
            st.ra = ra.dataset.a;
            return timeline();
        }
        const p = g("[data-p]");
        if (p && !p.disabled) {
            st.page = +p.dataset.p;
            rows();
            return $(".tc").scrollIntoView({ behavior: "smooth" });
        }
        const tr = g("tbody tr[data-id]");
        if (tr)
            detail(byId(tr.dataset.id));
    });

    document.addEventListener("submit", e => {
        if (e.target.id === "fm") {
            e.preventDefault();
            submitForm(e.target);
        }
    });

    document.addEventListener("input", e => {
        if (e.target.id === "df" || e.target.id === "dto") {
            st.from = $("#df").value;
            st.to = $("#dto").value;
            st.page = 1;
            rows();
        }
        if (e.target.closest(".fl.bad"))
            e.target.closest(".fl").classList.remove("bad");
    });

    document.addEventListener("change", e => { if (e.target.id === "pp") {
        st.pp = +e.target.value;
        st.page = 1;
        rows();
    } });

    let tm;
    $("#gs").addEventListener("input", e => {
        $("#sbox").classList.toggle("has", !!e.target.value);
        clearTimeout(tm);
        tm = setTimeout(() => { st.q = e.target.value.trim(); st.page = 1; if (st.view === "beranda") {
            if (st.q)
                location.hash = "#/semua";
        }
        else if (st.view === "riwayat")
            timeline();
        else
            rows(); }, 180);
    });

    $("#gc").onclick = () => { $("#gs").value = ""; $("#sbox").classList.remove("has"); st.q = ""; st.view === "riwayat" ? timeline() : st.view !== "beranda" && rows(); $("#gs").focus(); };

    $("#file").onchange = e => {
        const f = e.target.files[0];
        if (!f)
            return;
        const rd = new FileReader();
        rd.onload = () => { try {
            const d = JSON.parse(rd.result);
            if (!Array.isArray(d.surat))
                throw 0;
            confirmModal("Pulihkan data?", `File berisi ${d.surat.length} surat. Data saat ini akan <b>diganti</b> dengan data dari file cadangan.`, "Ya, Pulihkan", () => { DB = { surat: d.surat, riwayat: d.riwayat || [], seq: d.seq || Math.max(0, ...d.surat.map(x => x.id)) + 1 }; toast("Data berhasil dipulihkan"); });
        }
        catch {
            toast("File cadangan tidak valid", "er");
        } };
        rd.readAsText(f);
        e.target.value = "";
    };

    document.addEventListener("keydown", e => {
        if (e.key === "Escape")
            closeModal();
        const t = (document.activeElement || {}).tagName;
        if (/INPUT|TEXTAREA|SELECT/.test(t) || e.ctrlKey || e.metaKey || e.altKey)
            return;
        if (e.key === "/") {
            e.preventDefault();
            $("#gs").focus();
        }
        if (e.key.toLowerCase() === "n") {
            e.preventDefault();
            formModal(null, META[st.view][2]);
        }
    });

    if (!location.hash)
        history.replaceState(null, "", "#/beranda");

    // Sinkronisasi data dengan server

    function listen() {
        ref.onSnapshot(snap => {
            if (snap.metadata.hasPendingWrites)
                return;
            const first = !ready;
            if (snap.exists)
                DB = { surat: [], riwayat: [], seq: 1, ...snap.data() };
            else {
                // Dokumen belum ada: pindahkan data lama dari localStorage perangkat ini (jika ada)
                try {
                    const old = JSON.parse(localStorage.getItem(KEY));
                    if (old && Array.isArray(old.surat))
                        DB = { ...DB, ...old };
                }
                catch { }
                ready = true;
                save();
            }
            ready = true;
            first ? setView(fromHash(), false) : refresh();
        }, err => toast("Gagal memuat data: " + err.code, "er"));
    }

    listen();
})();
