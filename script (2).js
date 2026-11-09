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
    P.users = '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>';
    P.out = '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>';
    P.eye = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
    P.eyeoff = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';

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
        appId: "1:665939059922:web:21283e7642871f7f46b90b"
    };
    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth(), fdb = firebase.firestore();
    const colS = fdb.collection("surat"), colR = fdb.collection("riwayat"), colU = fdb.collection("users");

    // Admin utama (otomatis dibuatkan profil admin saat pertama login). Harus sama dengan email di Rules Firestore.
    const BOOT = ["adminsuratunisa@gmail.com"];
    // Daftar unit tujuan surat. Ubah sesuai struktur Universitas Islam Al-Ihya Kuningan.
    const UNITS = ["Rektorat", "Wakil Rektor I", "Wakil Rektor II", "Wakil Rektor III", "Biro Administrasi Akademik", "Biro Administrasi Umum", "Keuangan", "Kepegawaian", "Kemahasiswaan", "LPPM", "Perpustakaan", "Fakultas", "Program Studi", "Lainnya"];
    const ROLES = { admin: "Admin", user: "User" };
    const ROLEC = { admin: "c-er", user: "c-ok" };

    const MAP = new Map();
    let DB = { surat: [], riwayat: [] }, USERS = [], ME = null, ready = false, locked = false, unsubs = [];
    const can = {
        add: () => !!ME,
        write: () => !!ME && ME.role === "admin",
        del: () => !!ME && ME.role === "admin",
        hist: () => !!ME && ME.role === "admin",
        users: () => !!ME && ME.role === "admin"
    };
    const clean = o => JSON.parse(JSON.stringify(o));
    const sync = () => { DB.surat = [...MAP.values()]; };
    const byId = id => DB.surat.find(r => String(r.id) === String(id));
    const fail = er => toast("Gagal menyimpan ke server" + (er && er.code ? " (" + er.code + ")" : ""), "er");
    const putSurat = r => {
        r.updatedAt = new Date().toISOString();
        r.updatedBy = ME.nama || ME.email;
        MAP.set(String(r.id), r);
        sync();
        return colS.doc(String(r.id)).set(clean(r)).catch(fail);
    };
    const log = (aksi, r, detail) => {
        if (!ME)
            return;
        const id = Date.now() + "-" + Math.random().toString(36).slice(2, 6);
        colR.doc(id).set({ id, sid: String(r.id), aksi, jenis: r.jenis, nomor: r.nomor, detail: detail + " • oleh " + (ME.nama || ME.email), at: new Date().toISOString() }).catch(() => { });
    };
    const cut = (s, n = 70) => { s = String(s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };
    const FIELD = { jenis: "Jenis Surat", tanggal: "Tanggal", nomor: "Nomor Agenda", lembaga: "Lembaga/Instansi", org: "Organisasi/Perorangan", isi: "Perihal", sifat: "Sifat", kategori: "Kategori", unit: "Unit Tujuan", status: "Status", lampiran: "Lampiran" };
    const SIFAT = ["Biasa", "Penting", "Segera", "Rahasia"], STATUS = ["Baru", "Didisposisikan", "Diproses", "Selesai", "Diarsipkan"], KATEGORI = ["Akademik", "Kemahasiswaan", "Kepegawaian", "Keuangan", "Kerja Sama", "Keagamaan", "Lainnya"];
    const DEF = { sifat: "Biasa", kategori: "", unit: "", status: "", lampiran: "" }, OPEN = ["Baru", "Didisposisikan", "Diproses"];
    const SC = { Biasa: "", Penting: "c-wa", Segera: "c-er", Rahasia: "c-pr" }, TC = { Baru: "c-pr", Didisposisikan: "c-wa", Diproses: "c-wa", Selesai: "c-ok", Diarsipkan: "" };
    const sifatOf = r => r.sifat || "Biasa";
    const pill = (t, c) => t ? `<span class="badge ${c}"${c ? "" : ' style="background:var(--bd);color:var(--mu)"'}>${esc(t)}</span>` : "";
    const opts = (list, cur) => list.map(x => `<option value="${x}" ${x === cur ? "selected" : ""}>${x}</option>`).join("");

    // Konfigurasi halaman & state 

    const META = {
        beranda: ["Beranda", "Ringkasan administrasi surat"], semua: ["Agenda Surat", "Seluruh surat masuk dan keluar", ""],
        masuk: ["Surat Masuk", "Daftar surat yang diterima", "Masuk"], keluar: ["Surat Keluar", "Daftar surat yang dikirim", "Keluar"],
        riwayat: ["Riwayat Aktivitas", "Catatan penambahan, perubahan, dan penghapusan surat"],
        pengguna: ["Kelola Pengguna", "Atur akun admin dan user"]
    };
    const allowed = v => can.write() ? true : v === "masuk" || v === "keluar";
    const home = () => can.write() ? "beranda" : "masuk";

    const st = { view: "beranda", q: "", from: "", to: "", fj: "", fs: "", fz: "", fk: "", page: 1, pp: 10, desc: true, ra: "" };

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

    const NAV_ALL = [["beranda", "home", "Beranda", "Beranda"], ["semua", "list", "Semua", "Semua Surat"], ["masuk", "inbox", "Masuk", "Surat Masuk"], ["add", "plus", "Isi", "Isi Surat"], ["keluar", "send", "Keluar", "Surat Keluar"], ["riwayat", "history", "Riwayat", "Riwayat"], ["pengguna", "users", "Pengguna", "Pengguna"]];
    const navFor = () => NAV_ALL.filter(([id]) => ME && (can.write() || ["masuk", "add", "keluar"].includes(id)));

    function renderDock() {
        const n = { semua: DB.surat.length, masuk: DB.surat.filter(r => r.jenis === "Masuk").length, keluar: DB.surat.filter(r => r.jenis === "Keluar").length };
        $("#dock").innerHTML = navFor().filter(([id]) => id !== "pengguna").map(([id, i, l]) => id === "add"
            ? `<button class="bub add" data-add title="Isi surat (N)" aria-label="Isi surat">${ic(i)}</button>`
            : `<button class="bub ${st.view === id ? "on" : ""}" data-go="${id}" title="${l}">${ic(i)}<span>${l}</span>${n[id] ? `<em class="cnt">${n[id]}</em>` : ""}</button>`).join("");
        $("#nav").innerHTML = navFor().map(([id, i, l, L]) => id === "add"
            ? `<button class="nv cta" data-add>${ic(i)}<span>${L}</span></button>`
            : `<button class="nv ${st.view === id ? "on" : ""}" data-go="${id}">${ic(i)}<span>${L}</span>${n[id] ? `<em>${n[id]}</em>` : ""}</button>`).join("");
    }

    const ov = $("#ov");
    const openModal = html => { $("#md").className = "md"; $("#md").innerHTML = html; ov.classList.add("show"); document.body.style.overflow = "hidden"; };
    const closeModal = () => { if (locked)
        return;
        ov.classList.remove("show"); document.body.style.overflow = ""; };
    ov.addEventListener("mousedown", e => { if (e.target === ov)
        closeModal(); });

    // Form tambah/edit, hapus & detail surat

    function formModal(r, preset) {
        const e = !!r, adm = can.write();
        if (e ? !adm : !can.add())
            return toast("Anda tidak memiliki izin", "er");
        r = r || { jenis: preset || "", tanggal: today(), nomor: "", lembaga: "", org: "", isi: "", sifat: "Biasa", kategori: "", unit: "", status: "Baru", lampiran: "" };
        const unitSel = `<div class="fl"><label>Unit Tujuan</label><select name="unit"><option value="">-- Pilih unit --</option>${opts(!r.unit || UNITS.includes(r.unit) ? UNITS : [...UNITS, r.unit], r.unit || "")}</select></div>`;
        openModal(`<div class="mh ${e ? "edit" : ""}"><h4>${ic(e ? "edit" : "plus")} ${e ? "Edit Data Surat" : "Isi Surat Baru"}</h4><button data-close>${ic("x")}</button></div>
  <form id="fm" novalidate data-id="${e ? r.id : ""}"><div class="mb">
    <div class="r2">
      <div class="fl"><label>Jenis Surat <i>*</i></label><select name="jenis" required><option value="">-- Pilih jenis --</option>
        <option value="Masuk" ${r.jenis === "Masuk" ? "selected" : ""}>Surat Masuk</option><option value="Keluar" ${r.jenis === "Keluar" ? "selected" : ""}>Surat Keluar</option></select></div>
      <div class="fl"><label>Tanggal Surat <i>*</i></label><input type="date" name="tanggal" value="${r.tanggal}" required></div>
    </div>
    <div class="fl"><label>Nomor Agenda ${adm ? "<i>*</i>" : "(opsional)"}</label><div class="ib"><input name="nomor" value="${esc(r.nomor)}" placeholder="Contoh: 001/ASM/IX/2026" ${adm ? "required" : ""}>${adm ? `<button type="button" class="btn b-gh sm" data-auto>${ic("wand")} Otomatis</button>` : ""}</div><small>${adm ? "Nomor agenda dapat disesuaikan dengan administrasi kantor." : "Kosongkan jika belum ada nomor. Admin akan melengkapinya."}</small></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Lembaga / Instansi</label><input name="lembaga" value="${esc(r.lembaga)}" placeholder="Contoh: Dinas Pendidikan"></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Organisasi / Perorangan</label><input name="org" value="${esc(r.org)}" placeholder="Contoh: Universitas / Nama Perorangan"></div>
    <div class="r2">
      <div class="fl"><label>Sifat Surat</label><select name="sifat">${opts(SIFAT, sifatOf(r))}</select></div>
      <div class="fl"><label>Kategori</label><select name="kategori"><option value="">-- Pilih kategori --</option>${opts(KATEGORI, r.kategori || "")}</select></div>
    </div>
    ${adm ? `<div class="r2"><div class="fl"><label>Status</label><select name="status"><option value="">-- Belum diatur --</option>${opts(STATUS, r.status || "")}</select></div>${unitSel}</div>` : unitSel}
    <div class="fl"><label>Isi Surat / Perihal <i>*</i></label><textarea name="isi" rows="4" maxlength="2000" placeholder="Tuliskan isi atau perihal surat..." required>${esc(r.isi)}</textarea></div>
    <div class="fl"><label>Tautan Lampiran (opsional)</label><input name="lampiran" value="${esc(r.lampiran || "")}" placeholder="https://drive.google.com/..."><small>Unggah scan surat ke Google Drive, lalu tempel tautannya di sini.</small></div>
  </div><div class="mf"><button type="button" class="btn b-gh" data-close>Batal</button><button class="btn b-pr">${ic("save")} ${e ? "Simpan Perubahan" : "Kirim Surat"}</button></div></form>`);
        setTimeout(() => $(e || r.jenis ? "[name=lembaga]" : "[name=jenis]").focus(), 260);
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
        if (v.lampiran && !/^https?:\/\//i.test(v.lampiran))
            return toast("Tautan lampiran harus diawali http:// atau https://", "er");
        const id = f.dataset.id;
        if (id) {
            if (!can.write())
                return toast("Anda tidak memiliki izin", "er");
            const r = byId(id), ch = Object.keys(FIELD).filter(k => (r[k] ?? DEF[k] ?? "") !== v[k]).map(k => FIELD[k]);
            Object.assign(r, v);
            log("ubah", r, ch.length ? "Mengubah " + ch.join(", ") : "Disimpan tanpa perubahan data");
            putSurat(r);
            toast("Perubahan berhasil disimpan");
        }
        else {
            if (!can.add())
                return toast("Anda tidak memiliki izin", "er");
            const r = { id: colS.doc().id, ...v, nomor: v.nomor || "", status: can.write() ? (v.status || "Baru") : "Baru", ownerUid: ME.uid, createdBy: ME.nama || ME.email, createdAt: new Date().toISOString() };
            log("tambah", r, `Menambahkan surat ${r.jenis.toLowerCase()}: ${cut(r.isi)}`);
            putSurat(r);
            toast(can.write() ? "Surat berhasil ditambahkan" : "Surat berhasil dikirim");
        }
        closeModal();
        refresh();
    }

    function confirmModal(title, text, btn, fn) {
        openModal(`<div class="wi">${ic("alert")}</div><h4>${title}</h4><p>${text}</p><div class="mf"><button class="btn b-gh" data-close>Batal</button><button class="btn b-er" id="yes">${ic("trash")} ${btn}</button></div>`);
        $("#md").classList.add("sm");
        $("#yes").onclick = () => { fn(); closeModal(); refresh(); };
    }
    const hapus = r => confirmModal("Hapus surat ini?", `Surat dengan nomor agenda "${esc(r.nomor)}" akan dihapus permanen.`, "Ya, Hapus", () => {
        MAP.delete(String(r.id));
        sync();
        colS.doc(String(r.id)).delete().catch(fail);
        log("hapus", r, `Menghapus surat ${r.jenis.toLowerCase()}${r.lembaga || r.org ? " (" + cut(r.lembaga + " " + r.org, 50) + ")" : ""}: ${cut(r.isi, 60)}`);
        toast("Surat berhasil dihapus");
    });

    const linkOf = u => /^https?:\/\//i.test(u || "") ? `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">Buka lampiran</a>` : "-";

    function detail(r) {
        if (!r)
            return;
        const adm = can.write();
        openModal(`<div class="mh"><h4>${ic("eye")} Detail Surat</h4><button data-close>${ic("x")}</button></div><div class="mb">
    <div class="dh">${badge(r.jenis, "Surat " + r.jenis)}<span class="nomor big">${esc(r.nomor) || "Menunggu nomor"}</span></div>
    <div class="r2"><div class="dg"><label>Tanggal</label><div>${fmtL(r.tanggal)}</div></div><div class="dg"><label>Dicatat pada</label><div>${r.createdAt ? fmt(dkey(new Date(r.createdAt))) + " " + jam(r.createdAt) : "-"}</div></div>
    <div class="dg"><label>Lembaga / Instansi</label><div>${esc(r.lembaga) || "-"}</div></div><div class="dg"><label>Organisasi / Perorangan</label><div>${esc(r.org) || "-"}</div></div>
    <div class="dg"><label>Sifat</label><div>${pill(sifatOf(r), SC[sifatOf(r)])}</div></div><div class="dg"><label>Status</label><div>${pill(r.status, TC[r.status]) || "-"}</div></div>
    <div class="dg"><label>Kategori</label><div>${esc(r.kategori) || "-"}</div></div><div class="dg"><label>Unit Tujuan</label><div>${esc(r.unit) || "-"}</div></div>
    <div class="dg"><label>Lampiran</label><div>${linkOf(r.lampiran)}</div></div><div class="dg"><label>Diinput oleh</label><div>${esc(r.createdBy) || "-"}</div></div>
    <div class="dg full"><label>Isi Surat / Perihal</label><div class="isi">${esc(r.isi)}</div></div></div></div>
    <div class="mf"><button class="btn b-gh" data-close>Tutup</button>${adm ? `<button class="btn b-gh" data-word="${r.id}">${ic("down")} Unduh Word</button><button class="btn b-gh" data-edit="${r.id}">${ic("edit")} Edit</button><button class="btn b-er" data-del="${r.id}">${ic("trash")} Hapus</button>` : ""}</div>`);
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

    function mBeranda() {
        const S = DB.surat, tot = S.length, mk = S.filter(r => r.jenis === "Masuk").length, kl = tot - mk, bi = S.filter(r => r.tanggal.slice(0, 7) === today().slice(0, 7)).length;
        const sorted = [...S].sort((a, b) => b.tanggal.localeCompare(a.tanggal) || String(b.createdAt || "").localeCompare(String(a.createdAt || ""))), h = new Date().getHours(), C = 2 * Math.PI * 54;
        const lastM = sorted.find(r => r.jenis === "Masuk"), lastK = sorted.find(r => r.jenis === "Keluar");
        const li = (r) => `<div class="li" data-detail="${r.id}"><div class="dot ${JN[r.jenis][0]}">${ic(JN[r.jenis][1])}</div><div><div class="t">${esc(r.nomor)}</div><div class="s">${esc(cut(r.isi))}</div></div><div class="r">${fmt(r.tanggal)}</div></div>`;
        const rank = { Segera: 0, Penting: 1, Rahasia: 2, Biasa: 3 };
        const todo = S.filter(r => OPEN.includes(r.status)).sort((a, b) => rank[sifatOf(a)] - rank[sifatOf(b)] || a.tanggal.localeCompare(b.tanggal));
        const lt = r => `<div class="li" data-detail="${r.id}"><div class="dot ${JN[r.jenis][0]}">${ic(JN[r.jenis][1])}</div><div><div class="t">${esc(r.nomor)} ${pill(sifatOf(r) !== "Biasa" ? sifatOf(r) : "", SC[sifatOf(r)])}</div><div class="s">${esc(r.status)} · ${esc(cut(r.isi, 50))}</div></div><div class="r">${fmt(r.tanggal)}</div></div>`;
        const sr = (t, c, n) => `<div class="li"><div><div class="t">${pill(t, c)}</div></div><div class="r"><b>${n}</b></div></div>`;
        const nos = S.filter(r => !r.status).length;
        const none = (i, t) => `<div class="empty tight">${ic(i)}<p>${t}</p></div>`;
        view.innerHTML = `
  <section class="hero"><div><h2>${h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 19 ? "Selamat sore" : "Selamat malam"}! 👋</h2>
    <p>Kelola surat masuk dan keluar dalam satu tempat. Saat ini tercatat <b>${tot}</b> surat, <b>${bi}</b> di antaranya pada bulan ${BLNP[new Date().getMonth()]}. Anda masuk sebagai <b>${esc(ME.nama || ME.email)}</b> (${ROLES[ME.role]}${ME.unit ? ", " + esc(ME.unit) : ""}).</p></div>
    ${can.write() ? `<div class="acts"><button class="btn b-wh" data-add="Masuk">${ic("inbox")} Catat Surat Masuk</button><button class="btn b-gl" data-add="Keluar">${ic("send")} Catat Surat Keluar</button></div>` : ""}</section>
  <section class="stats">${[["Total Surat", tot, "mail", "c-pr", "semua"], ["Surat Masuk", mk, "inbox", "c-ok", "masuk"], ["Surat Keluar", kl, "send", "c-er", "keluar"], ["Bulan Ini", bi, "cal", "c-wa", "semua"]]
            .map(([l, n, i, c, g], k) => `<div class="card stat" style="animation-delay:${k * 80}ms" data-go="${g}"><div class="si ${c}">${ic(i)}</div><div><small>${l}</small><h3 data-n="${n}">0</h3></div></div>`).join("")}</section>
  <section class="g2"><div class="card pn"><div class="pnh"><h3>${ic("chart")} Statistik 6 Bulan Terakhir</h3><div class="lg"><span><i class="bg-ok"></i>Masuk</span><span><i class="bg-er"></i>Keluar</span></div></div><div class="chart">${chart(monthly())}</div></div>
    <div class="card pn"><div class="pnh"><h3>${ic("trend")} Perbandingan</h3></div><div class="dw"><div class="dn"><svg viewBox="0 0 140 140" width="160" height="160">
      <circle cx="70" cy="70" r="54" fill="none" stroke="${tot ? "var(--er)" : "var(--bd)"}" stroke-width="18"/><circle id="dn" cx="70" cy="70" r="54" fill="none" stroke="var(--ok)" stroke-width="18" stroke-dasharray="0 ${C}" data-d="${tot ? C * mk / tot : 0} ${C}"/></svg>
      <div class="mid"><b>${tot}</b><small>Total surat</small></div></div>
      <div class="dl"><div><i class="bg-ok"></i>Masuk<b>${tot ? Math.round(mk * 100 / tot) : 0}%</b></div><div><i class="bg-er"></i>Keluar<b>${tot ? Math.round(kl * 100 / tot) : 0}%</b></div></div></div></div></section>
  <section class="g2b"><div class="card pn"><div class="pnh"><h3>${ic("alert")} Perlu Ditindaklanjuti</h3><span class="mu">${todo.length} surat</span></div>${todo.length ? todo.slice(0, 5).map(lt).join("") : none("check", "Tidak ada surat yang menunggu tindak lanjut.")}</div>
    <div class="card pn"><div class="pnh"><h3>${ic("list")} Ringkasan Status</h3></div>${STATUS.map(x => sr(x, TC[x], S.filter(r => r.status === x).length)).join("")}${nos ? sr("Belum diatur", "", nos) : ""}</div></section>
  <section class="g2b"><div class="card pn"><div class="pnh"><h3>${ic("mail")} Surat Terbaru</h3><button class="lk" data-go="semua">Lihat semua →</button></div>${sorted.length ? sorted.slice(0, 5).map(li).join("") : none("inbox", "Belum ada surat.")}</div>
    <div class="card pn"><div class="pnh"><h3>${ic("history")} Aktivitas Terakhir</h3><button class="lk" data-go="riwayat">Lihat riwayat →</button></div>${DB.riwayat.length ? DB.riwayat.slice(0, 5).map(a => { const m = ACT[a.aksi]; return `<div class="li" data-go="riwayat"><div class="dot ${m[2]}">${ic(m[1])}</div><div><div class="t">${m[0]} • ${esc(a.nomor)}</div><div class="s">${esc(a.detail)}</div></div><div class="r">${ago(a.at)}</div></div>`; }).join("") : none("history", can.hist() ? "Belum ada aktivitas." : "Riwayat aktivitas hanya untuk admin.")}</div></section>
  ${can.users() ? `<section class="card bk"><div><b>Data &amp; Cadangan</b><div class="mu">Data tersimpan di server dan dipakai bersama semua perangkat. Cadangkan secara berkala agar aman.</div></div>
    <div class="acts"><button class="btn b-gh sm" data-act="backup">${ic("down")} Cadangkan (JSON)</button><button class="btn b-gh sm" data-act="restore">${ic("up")} Pulihkan</button><button class="btn b-gh sm" data-act="import">${ic("up")} Impor Data Lama</button></div></section>` : ""}`;
        $$("[data-n]", view).forEach(e => numAnim(e, +e.dataset.n));
        setTimeout(() => { const c = $("#dn"); if (c)
            c.setAttribute("stroke-dasharray", c.dataset.d); }, 150);
    }

    // Halaman Data Surat: tabel, filter, ekspor, cetak

    function filtered() {
        const q = st.q.toLowerCase(), j = jenisAktif();
        return DB.surat.filter(r => (!j || r.jenis === j) && (!st.fs || r.status === st.fs) && (!st.fz || sifatOf(r) === st.fz) && (!st.fk || r.kategori === st.fk) && (!st.from || r.tanggal >= st.from) && (!st.to || r.tanggal <= st.to) &&
            (!q || [r.nomor, r.lembaga, r.org, r.isi, r.unit, r.kategori, r.status, r.sifat].some(v => String(v || "").toLowerCase().includes(q))))
            .sort((a, b) => (st.desc ? -1 : 1) * (a.tanggal.localeCompare(b.tanggal) || String(a.createdAt || "").localeCompare(String(b.createdAt || ""))));
    }
    const hl = t => st.q ? esc(t).replace(new RegExp("(" + reEsc(esc(st.q)) + ")", "gi"), "<mark>$1</mark>") : esc(t);

    function mData() {
        const [t, s0] = META[st.view], s = can.write() ? s0 : "Surat yang Anda isi. Admin yang akan memprosesnya.";
        view.innerHTML = `<div class="ph"><div><h2>${t}</h2><p>${s}</p></div><div class="acts">${can.write() ? `<button class="btn b-gh" data-act="csv">${ic("down")} Ekspor CSV</button><button class="btn b-gh" data-act="print">${ic("printer")} Cetak</button>` : ""}<button class="btn b-pr" data-add>${ic("plus")} Isi Surat</button></div></div>
  <div class="card flt">${st.view === "semua" ? `<div class="f"><label>Jenis</label><div class="chips" id="jc">${chips("j", [["", "Semua"], ["Masuk", "Masuk"], ["Keluar", "Keluar"]])}</div></div>` : ""}
    ${can.write() ? `<div class="f"><label>Status</label><div class="chips" id="sc">${chips("fs", [["", "Semua"], ...STATUS.map(x => [x, x])])}</div></div>
    <div class="f"><label>Sifat</label><div class="chips" id="zc">${chips("fz", [["", "Semua"], ...SIFAT.map(x => [x, x])])}</div></div>
    <div class="f"><label>Kategori</label><select id="kt"><option value="">Semua</option>${opts(KATEGORI, st.fk)}</select></div>` : ""}
    <div class="f"><label>Dari tanggal</label><input type="date" id="df" value="${st.from}"></div><div class="f"><label>Sampai tanggal</label><input type="date" id="dto" value="${st.to}"></div>
    <div class="f"><label>Periode cepat</label><div class="chips">${chips("r", [["all", "Semua"], ["7", "7 hari"], ["30", "30 hari"], ["m", "Bulan ini"]])}</div></div>
    <div class="f"><label>Tampilkan</label><select id="pp">${[10, 25, 50, 100].map(n => `<option value="${n}" ${n === st.pp ? "selected" : ""}>${n} data</option>`).join("")}</select></div>
    <button class="btn b-gh sm" data-act="reset">Reset filter</button></div>
  <div class="card tc"><div class="th"><h3>${ic("list")} Data Buku Agenda Surat</h3><span class="mu" id="ci"></span></div><div class="tw"><table><thead><tr><th class="ct">No</th><th>Jenis Surat</th><th class="so" data-act="sort">Tgl/Bln/Tahun <span id="ar"></span></th><th>Nomor Agenda</th><th>Lembaga / Instansi</th><th>Organisasi / Perorangan</th><th>Perihal</th><th>Sifat &amp; Status</th><th class="ct">Aksi</th></tr></thead><tbody id="tb"></tbody></table></div><div class="pg" id="pg"></div></div>`;
        rows();
    }

    function rows() {
        const all = filtered(), pages = Math.max(1, Math.ceil(all.length / st.pp));
        st.page = Math.min(st.page, pages);
        const a = (st.page - 1) * st.pp, sl = all.slice(a, a + st.pp), fl = st.q || st.from || st.to || st.fj || st.fs || st.fz || st.fk;
        $("#ci").textContent = all.length ? `Menampilkan ${a + 1}–${a + sl.length} dari ${all.length} surat` : "0 surat";
        $("#ar").textContent = st.desc ? "↓" : "↑";
        $$("#jc .chip").forEach(c => c.classList.toggle("on", c.dataset.j === st.fj));
        $$("#sc .chip").forEach(c => c.classList.toggle("on", c.dataset.fs === st.fs));
        $$("#zc .chip").forEach(c => c.classList.toggle("on", c.dataset.fz === st.fz));
        $("#tb").innerHTML = sl.length ? sl.map((r, i) => {
            return `<tr data-id="${r.id}" style="animation-delay:${i * 35}ms"><td class="ct">${a + i + 1}</td>
    <td>${badge(r.jenis)}</td><td>${fmt(r.tanggal)}</td><td>${r.nomor ? `<span class="nomor">${hl(r.nomor)}</span>` : '<i class="mu">Menunggu nomor</i>'}</td><td>${hl(r.lembaga)}</td><td>${hl(r.org)}</td><td><div class="pf">${hl(r.isi)}</div>${can.write() && r.createdBy ? `<small class="mu">Diinput: ${esc(r.createdBy)}</small>` : ""}</td><td>${(pill(sifatOf(r) !== "Biasa" ? sifatOf(r) : "", SC[sifatOf(r)]) + " " + pill(r.status, TC[r.status])).trim() || "-"}</td>
    <td><div class="ac"><button class="btn bi v-view" data-detail="${r.id}" title="Detail">${ic("eye")}</button>${can.write() ? `<button class="btn bi v-edit" data-edit="${r.id}" title="Edit">${ic("edit")}</button><button class="btn bi v-word" data-word="${r.id}" title="Unduh Word">${ic("down")}</button>` : ""}${can.del() ? `<button class="btn bi v-del" data-del="${r.id}" title="Hapus">${ic("trash")}</button>` : ""}</div></td></tr>`;
        }).join("")
            : `<tr><td colspan="9"><div class="empty">${ic("inbox")}<p>${DB.surat.length && fl ? "Tidak ada surat yang cocok dengan filter." : "Belum ada data surat."}</p>${DB.surat.length && fl ? `<button class="btn b-gh" data-act="reset">Reset filter</button>` : `<button class="btn b-pr" data-add>${ic("plus")} Tambah Surat</button>`}</div></td></tr>`;
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
        const L = [["No", "Jenis Surat", "Tanggal", "Nomor Agenda", "Lembaga/Instansi", "Organisasi/Perorangan", "Perihal", "Sifat", "Kategori", "Unit Tujuan", "Status"].map(q).join(",")];
        r.forEach((x, i) => L.push([i + 1, x.jenis, fmt(x.tanggal), x.nomor, x.lembaga, x.org, x.isi, sifatOf(x), x.kategori, x.unit, x.status].map(q).join(",")));
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
  <table><thead><tr><th>No</th><th>Jenis</th><th>Tanggal</th><th>Nomor Agenda</th><th>Lembaga/Instansi</th><th>Organisasi/Perorangan</th><th>Perihal</th><th>Sifat</th><th>Kategori</th><th>Unit Tujuan</th><th>Status</th></tr></thead><tbody>${r.map((x, i) => `<tr><td>${i + 1}</td><td>${x.jenis}</td><td>${fmt(x.tanggal)}</td><td>${esc(x.nomor)}</td><td>${esc(x.lembaga)}</td><td>${esc(x.org)}</td><td>${esc(x.isi)}</td><td>${esc(sifatOf(x))}</td><td>${esc(x.kategori)}</td><td>${esc(x.unit)}</td><td>${esc(x.status)}</td></tr>`).join("")}</tbody></table>
  <div class="ft">Copyright © ${new Date().getFullYear()} by Rizki — Sistem Administrasi Surat Masuk dan Keluar</div>`;
        window.print();
    }

    // Halaman Riwayat

    function mRiwayat() {
        view.innerHTML = `<div class="ph"><div><h2>${META.riwayat[0]}</h2><p>${META.riwayat[1]}</p></div><div class="acts">${can.del() ? `<button class="btn b-gh" data-act="clear" ${DB.riwayat.length ? "" : "disabled"}>${ic("trash")} Bersihkan Riwayat</button>` : ""}</div></div>
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

    function refresh() { renderDock(); ({ beranda: mBeranda, riwayat: mRiwayat, pengguna: mPengguna }[st.view] || mData)(); }

    function setView(v, anim = true) {
        if (!allowed(v))
            v = home();
        if (location.hash !== "#/" + v)
            history.replaceState(null, "", "#/" + v);
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
    const fromHash = () => { const v = location.hash.replace(/^#\/?/, ""); return META[v] && allowed(v) ? v : home(); };
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
            return can.del() ? hapus(byId(de.dataset.del)) : toast("Hanya admin yang dapat menghapus surat", "er");
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
            if (a === "import")
                return importOld();
            if (a === "sort") {
                st.desc = !st.desc;
                return rows();
            }
            if (a === "reset") {
                Object.assign(st, { q: "", from: "", to: "", fj: "", fs: "", fz: "", fk: "", page: 1 });
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
                return confirmModal("Bersihkan riwayat?", "Seluruh catatan riwayat akan dihapus. Data surat tidak ikut terhapus.", "Ya, Bersihkan", clearRiwayat);
        }
        const wd = g("[data-word]");
        if (wd)
            return unduhWord(byId(wd.dataset.word));
        const us = g("[data-user]");
        if (us)
            return userModal(us.dataset.user === "new" ? null : USERS.find(u => u.uid === us.dataset.user));
        const rs = g("[data-reset]");
        if (rs)
            return auth.sendPasswordResetEmail(rs.dataset.reset).then(() => toast("Tautan reset kata sandi dikirim ke " + rs.dataset.reset)).catch(er => toast("Gagal mengirim: " + (er.code || ""), "er"));
        const j = g("[data-j]");
        if (j) {
            st.fj = j.dataset.j;
            st.page = 1;
            return rows();
        }
        const r = g("[data-r]");
        if (r)
            return setRange(r.dataset.r);
        const fs = g("[data-fs]");
        if (fs) {
            st.fs = fs.dataset.fs;
            st.page = 1;
            return rows();
        }
        const fz = g("[data-fz]");
        if (fz) {
            st.fz = fz.dataset.fz;
            st.page = 1;
            return rows();
        }
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
        if (e.target.id === "um") {
            e.preventDefault();
            submitUser(e.target);
        }
        if (e.target.id === "lg") {
            e.preventDefault();
            const v = Object.fromEntries(new FormData(e.target));
            auth.signInWithEmailAndPassword(v.email.trim(), v.pw).catch(er => toast(/invalid-credential|wrong-password|user-not-found|invalid-email|missing-password/.test(er.code) ? "Email atau kata sandi salah" : "Gagal masuk: " + er.code, "er"));
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

    document.addEventListener("change", e => {
        if (e.target.id === "pp") {
            st.pp = +e.target.value;
            st.page = 1;
            rows();
        }
        if (e.target.id === "kt") {
            st.fk = e.target.value;
            st.page = 1;
            rows();
        }
    });

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
        else if (st.view !== "pengguna")
            rows(); }, 180);
    });

    $("#gc").onclick = () => { $("#gs").value = ""; $("#sbox").classList.remove("has"); st.q = ""; st.view === "riwayat" ? timeline() : st.view !== "beranda" && st.view !== "pengguna" && rows(); $("#gs").focus(); };

    $("#file").onchange = e => {
        const f = e.target.files[0];
        if (!f)
            return;
        const rd = new FileReader();
        rd.onload = () => { try {
            const d = JSON.parse(rd.result);
            if (!Array.isArray(d.surat))
                throw 0;
            confirmModal("Pulihkan data?", `File berisi ${d.surat.length} surat. Surat dengan ID yang sama akan <b>ditimpa</b>, data lainnya tetap.`, "Ya, Pulihkan", () => importData(d));
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
        if (e.key.toLowerCase() === "n" && can.add()) {
            e.preventDefault();
            formModal(null, META[st.view][2]);
        }
    });

    if (!location.hash)
        history.replaceState(null, "", "#/beranda");

    // Impor data, riwayat, dan pengelolaan pengguna

    async function importData(d) {
        const S = (d.surat || []).map(r => ({ ...r, id: String(r.id), ownerUid: r.ownerUid || "" }));
        const R = (d.riwayat || []).map(x => ({ ...x, id: String(x.id).replace(/[./]/g, "-"), sid: String(x.sid) }));
        try {
            for (const [col, list] of [[colS, S], [colR, R]])
                for (let i = 0; i < list.length; i += 400) {
                    const b = fdb.batch();
                    list.slice(i, i + 400).forEach(x => b.set(col.doc(x.id), clean(x)));
                    await b.commit();
                }
            toast(`${S.length} surat dan ${R.length} riwayat diimpor`);
        }
        catch (er) {
            toast("Gagal mengimpor: " + (er.code || er.message), "er");
        }
    }

    async function importOld() {
        try {
            const sn = await fdb.collection("agenda").doc("main").get();
            if (!sn.exists)
                return toast("Data lama tidak ditemukan", "er");
            const d = sn.data();
            confirmModal("Impor data lama?", `Ditemukan ${(d.surat || []).length} surat dari versi sebelumnya. Data akan disalin ke sistem baru (aman dijalankan ulang).`, "Ya, Impor", () => importData(d));
        }
        catch (er) {
            toast("Gagal membaca data lama: " + (er.code || er.message), "er");
        }
    }

    async function clearRiwayat() {
        try {
            const sn = await colR.get();
            for (let i = 0; i < sn.docs.length; i += 400) {
                const b = fdb.batch();
                sn.docs.slice(i, i + 400).forEach(d => b.delete(d.ref));
                await b.commit();
            }
            toast("Riwayat berhasil dibersihkan");
        }
        catch (er) {
            toast("Gagal membersihkan riwayat: " + (er.code || ""), "er");
        }
    }

    function mPengguna() {
        view.innerHTML = `<div class="ph"><div><h2>${META.pengguna[0]}</h2><p>${META.pengguna[1]}</p></div><div class="acts"><button class="btn b-pr" data-user="new">${ic("plus")} Tambah Pengguna</button></div></div>
  <div class="card tc"><div class="th"><h3>${ic("users")} Daftar Pengguna</h3><span class="mu">${USERS.length} akun</span></div><div class="tw"><table class="tb-user"><thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Status</th><th class="ct">Aksi</th></tr></thead><tbody>${USERS.map(u => `<tr><td>${esc(u.nama)}</td><td>${esc(u.email)}</td><td>${pill(ROLES[u.role] || u.role, ROLEC[u.role] || "")}</td><td>${u.aktif === false ? pill("Nonaktif", "c-er") : pill("Aktif", "c-ok")}</td><td><div class="ac"><button class="btn bi v-edit" data-user="${u.uid}" title="Ubah">${ic("edit")}</button><button class="btn bi v-view" data-reset="${esc(u.email)}" title="Kirim tautan reset kata sandi">${ic("mail")}</button></div></td></tr>`).join("") || `<tr><td colspan="5"><div class="empty tight">${ic("users")}<p>Belum ada pengguna.</p></div></td></tr>`}</tbody></table></div></div>
  <section class="card bk"><div><b>Peran pengguna</b><div class="mu"><b>Admin</b>: mengelola semua surat (tambah, ubah, hapus, unduh Word) dan akun pengguna. <b>User</b>: mengisi surat dan melihat surat masuk serta keluar yang ia input sendiri.</div></div></section>`;
    }

    function userModal(u) {
        const e = !!u;
        u = u || { nama: "", email: "", role: "user", aktif: true };
        openModal(`<div class="mh ${e ? "edit" : ""}"><h4>${ic(e ? "edit" : "plus")} ${e ? "Ubah Pengguna" : "Tambah Pengguna"}</h4><button data-close>${ic("x")}</button></div>
  <form id="um" novalidate data-uid="${e ? u.uid : ""}"><div class="mb">
    <div class="fl"><label>Nama lengkap <i>*</i></label><input name="nama" value="${esc(u.nama)}" required></div>
    <div class="fl"><label>Email <i>*</i></label><input type="email" name="email" value="${esc(u.email)}" ${e ? "readonly" : ""} required autocomplete="off"></div>
    ${e ? "" : `<div class="fl"><label>Kata sandi awal <i>*</i></label><input type="text" name="pw" required placeholder="Minimal 8 karakter" autocomplete="off"><small>Berikan kepada pengguna lewat jalur pribadi. Pengguna dapat menggantinya lewat tautan reset.</small></div>`}
    <div class="r2"><div class="fl"><label>Peran</label><select name="role">${Object.entries(ROLES).map(([k, v]) => `<option value="${k}" ${u.role === k ? "selected" : ""}>${v}</option>`).join("")}</select></div>
    ${e ? `<div class="fl"><label>Status akun</label><select name="aktif"><option value="1" ${u.aktif !== false ? "selected" : ""}>Aktif</option><option value="0" ${u.aktif === false ? "selected" : ""}>Nonaktif</option></select></div>` : ""}</div>
  </div><div class="mf"><button type="button" class="btn b-gh" data-close>Batal</button><button class="btn b-pr">${ic("save")} Simpan</button></div></form>`);
    }

    async function submitUser(f) {
        const v = Object.fromEntries([...new FormData(f)].map(([k, x]) => [k, x.trim()]));
        if (!v.nama || !v.email)
            return toast("Nama dan email wajib diisi", "er");
        const uid = f.dataset.uid;
        if (uid) {
            if (uid === ME.uid && (v.role !== "admin" || v.aktif === "0"))
                return toast("Anda tidak dapat menurunkan atau menonaktifkan akun sendiri", "er");
            try {
                await colU.doc(uid).update({ nama: v.nama, role: v.role, aktif: v.aktif !== "0" });
                toast("Pengguna diperbarui");
                closeModal();
            }
            catch (er) {
                toast("Gagal menyimpan: " + (er.code || ""), "er");
            }
            return;
        }
        if ((v.pw || "").length < 8)
            return toast("Kata sandi minimal 8 karakter", "er");
        try {
            const sec = firebase.apps.find(a => a.name === "sec") || firebase.initializeApp(FIREBASE_CONFIG, "sec");
            const email = v.email.toLowerCase();
            const cred = await sec.auth().createUserWithEmailAndPassword(email, v.pw);
            await sec.auth().signOut();
            await colU.doc(cred.user.uid).set({ uid: cred.user.uid, email, nama: v.nama, role: v.role, aktif: true, createdAt: new Date().toISOString() });
            toast("Pengguna ditambahkan");
            closeModal();
        }
        catch (er) {
            toast(er.code === "auth/email-already-in-use" ? "Email sudah ada di Firebase. Hapus dulu akunnya di Authentication, lalu tambahkan lagi dari sini." : er.code === "auth/weak-password" ? "Kata sandi terlalu lemah" : er.code === "auth/invalid-email" ? "Format email tidak valid" : "Gagal menambah pengguna: " + (er.code || er.message), "er");
        }
    }

    // Unduh surat dalam format Word (.docx)

    function unduhWord(r) {
        if (!r)
            return;
        if (!window.docx)
            return toast("Pustaka Word belum termuat. Muat ulang halaman lalu coba lagi.", "er");
        const { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, ShadingType, UnderlineType } = window.docx;
        const FN = "Times New Roman";
        const tx = (s, o = {}) => new TextRun({ text: String(s ?? ""), font: FN, size: 24, ...o });
        const pr = (kids, o = {}) => new Paragraph({ children: [].concat(kids), spacing: { after: 80 }, ...o });
        const edge = { style: BorderStyle.SINGLE, size: 4, color: "808080" };
        const box = { top: edge, bottom: edge, left: edge, right: edge };
        const margins = { top: 70, bottom: 70, left: 120, right: 120 };
        const fld = (k, v) => new TableRow({ children: [
                new TableCell({ width: { size: 32, type: WidthType.PERCENTAGE }, borders: box, margins, shading: { type: ShadingType.CLEAR, color: "auto", fill: "EAF1EE" }, children: [pr(tx(k, { bold: true }), { spacing: { after: 0 } })] }),
                new TableCell({ width: { size: 68, type: WidthType.PERCENTAGE }, borders: box, margins, children: [pr(tx(v || "-"), { spacing: { after: 0 } })] })
            ] });
        const isi = String(r.isi || "").split(/\r?\n/).map(x => pr(tx(x), { alignment: AlignmentType.JUSTIFIED }));
        const doc = new Document({
            creator: "Sistem Administrasi Surat UNISA",
            title: `Surat ${r.jenis} ${r.nomor || ""}`.trim(),
            sections: [{
                    properties: { page: { margin: { top: 1134, bottom: 1134, left: 1304, right: 1304 } } },
                    children: [
                        pr(tx("UNIVERSITAS ISLAM AL-IHYA KUNINGAN", { bold: true, size: 32 }), { alignment: AlignmentType.CENTER, spacing: { after: 20 } }),
                        pr(tx("Sistem Administrasi Surat Masuk dan Keluar", { size: 22 }), { alignment: AlignmentType.CENTER, border: { bottom: { style: BorderStyle.DOUBLE, size: 6, color: "000000", space: 6 } }, spacing: { after: 240 } }),
                        pr(tx(`LEMBAR SURAT ${String(r.jenis).toUpperCase()}`, { bold: true, size: 28, underline: { type: UnderlineType.SINGLE } }), { alignment: AlignmentType.CENTER, spacing: { after: 40 } }),
                        pr(tx(`Nomor Agenda: ${r.nomor || "-"}`), { alignment: AlignmentType.CENTER, spacing: { after: 240 } }),
                        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [
                                fld("Jenis Surat", "Surat " + r.jenis),
                                fld("Tanggal Surat", fmtL(r.tanggal)),
                                fld(r.jenis === "Masuk" ? "Diterima Dari" : "Dikirim Kepada", r.lembaga),
                                fld("Organisasi / Perorangan", r.org),
                                fld("Sifat Surat", sifatOf(r)),
                                fld("Kategori", r.kategori),
                                fld("Unit Tujuan", r.unit),
                                fld("Status", r.status),
                                fld("Lampiran", r.lampiran)
                            ] }),
                        pr(tx("Isi Surat / Perihal", { bold: true }), { spacing: { before: 280, after: 80 } }),
                        new Table({ width: { size: 100, type: WidthType.PERCENTAGE }, rows: [new TableRow({ children: [new TableCell({ borders: box, margins: { top: 140, bottom: 140, left: 160, right: 160 }, children: isi })] })] }),
                        pr(tx(`Diinput oleh ${r.createdBy || "-"}${r.createdAt ? " pada " + fmt(dkey(new Date(r.createdAt))) + " " + jam(r.createdAt) : ""}`, { size: 20, italics: true }), { spacing: { before: 200, after: 400 } }),
                        pr(tx(`Kuningan, ${fmtL(today())}`), { alignment: AlignmentType.RIGHT, spacing: { after: 20 } }),
                        pr(tx("Admin Surat"), { alignment: AlignmentType.RIGHT, spacing: { after: 700 } }),
                        pr(tx("( ................................. )"), { alignment: AlignmentType.RIGHT })
                    ]
                }]
        });
        Packer.toBlob(doc).then(b => {
            download(b, `Surat-${r.jenis}-${String(r.nomor || "tanpa-nomor").replace(/[^\w]+/g, "-")}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            toast("Surat diunduh dalam format Word");
        }).catch(() => toast("Gagal membuat file Word", "er"));
    }

    // Login, profil pengguna & sinkronisasi data

    function loginModal() {
        locked = false;
        openModal(`<div class="mh"><h4>${ic("mail")} Masuk</h4></div>
  <form id="lg" novalidate><div class="mb">
    <div class="fl"><label>Email</label><input type="email" name="email" autocomplete="username" required></div>
    <div class="fl"><label>Kata sandi</label><div style="position:relative"><input type="password" name="pw" autocomplete="current-password" required style="padding-right:46px"><button type="button" class="pwt" aria-label="Tampilkan kata sandi" style="position:absolute;right:8px;top:50%;transform:translateY(-50%);background:none;border:0;padding:6px;cursor:pointer;color:var(--mu);display:flex;line-height:0">${ic("eye")}</button></div></div>
  </div><div class="mf"><button class="btn b-pr">Masuk</button></div></form>`);
        locked = true;
    }

    function noAccess(u) {
        locked = false;
        openModal(`<div class="wi">${ic("alert")}</div><h4>Akun belum terdaftar</h4><p>Akun <b>${esc(u.email)}</b> berhasil masuk, tetapi belum didaftarkan di sistem atau sudah dinonaktifkan. Hubungi admin agar didaftarkan.</p><div class="mf"><button class="btn b-gh" id="lo">Keluar</button></div>`);
        $("#md").classList.add("sm");
        locked = true;
        $("#lo").onclick = () => auth.signOut();
    }

    const stopAll = () => { unsubs.forEach(f => f()); unsubs = []; };

    function listen() {
        stopAll();
        ready = false;
        MAP.clear();
        DB = { surat: [], riwayat: [] };
        USERS = [];
        const onS = sn => { sn.docChanges().forEach(c => c.type === "removed" ? MAP.delete(c.doc.id) : MAP.set(c.doc.id, { ...c.doc.data(), id: c.doc.id })); sync(); };
        const jobs = [[can.write() ? colS : colS.where("ownerUid", "==", ME.uid), onS]];
        if (can.hist())
            jobs.push([colR.orderBy("at", "desc").limit(300), sn => { DB.riwayat = sn.docs.map(d => d.data()); }]);
        if (can.users())
            jobs.push([colU, sn => { USERS = sn.docs.map(d => ({ uid: d.id, ...d.data() })).sort((a, b) => String(a.nama).localeCompare(String(b.nama))); }]);
        let need = jobs.length;
        const done = () => {
            if (ready)
                return refresh();
            if (need === 0) {
                ready = true;
                setView(fromHash(), false);
            }
        };
        jobs.forEach(([q, fn]) => {
            let first = true;
            const once = () => { if (first) {
                first = false;
                need--;
            } };
            unsubs.push(q.onSnapshot(sn => { fn(sn); once(); done(); }, er => { toast("Gagal memuat data: " + er.code, "er"); once(); done(); }));
        });
    }

    function start() {
        locked = false;
        closeModal();
        const nm = ME.nama || ME.email;
        $("#unm").textContent = nm;
        $("#urole").textContent = ROLES[ME.role] || ME.role;
        $("#uav").textContent = nm.trim().charAt(0).toUpperCase();
        document.body.dataset.role = ME.role;
        $("#usr").style.display = can.users() ? "" : "none";
        unsubs.push(colU.doc(ME.uid).onSnapshot(sn => {
            if (!sn.exists)
                return;
            const p = sn.data();
            if (p.aktif === false) {
                toast("Akun Anda dinonaktifkan", "er");
                return auth.signOut();
            }
            if (p.role !== ME.role)
                location.reload();
        }));
        listen();
    }

    document.addEventListener("click", e => {
        const b = e.target.closest(".pwt");
        if (!b)
            return;
        const i = b.previousElementSibling, show = i.type === "password";
        i.type = show ? "text" : "password";
        b.innerHTML = ic(show ? "eyeoff" : "eye");
        b.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    });
    $$("[data-logout]").forEach(b => { b.innerHTML = ic("out"); b.onclick = () => auth.signOut(); });
    $("#usr").innerHTML = ic("users");
    $("#usr").onclick = () => { location.hash = "#/pengguna"; };
    $("#cta").innerHTML = ic("plus") + " Isi Surat";

    auth.onAuthStateChanged(async (u) => {
        if (!u) {
            stopAll();
            ME = null;
            ready = false;
            MAP.clear();
            DB = { surat: [], riwayat: [] };
            view.innerHTML = "";
            $("#dock").innerHTML = "";
            $("#nav").innerHTML = "";
            $("#unm").textContent = "";
            $("#urole").textContent = "";
            $("#uav").textContent = "";
            $("#usr").style.display = "none";
            document.body.dataset.role = "";
            return loginModal();
        }
        try {
            const email = (u.email || "").toLowerCase();
            let sn = await colU.doc(u.uid).get();
            if (!sn.exists && BOOT.includes(email)) {
                await colU.doc(u.uid).set({ uid: u.uid, email, nama: "Admin Utama", role: "admin", aktif: true, createdAt: new Date().toISOString() });
                sn = await colU.doc(u.uid).get();
            }
            if (!sn.exists || sn.data().aktif === false)
                return noAccess({ email });
            ME = { uid: u.uid, ...sn.data() };
            start();
        }
        catch (er) {
            toast("Gagal memuat profil: " + (er.code || er.message), "er");
        }
    });
})();
