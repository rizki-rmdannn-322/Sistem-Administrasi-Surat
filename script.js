(() => {
    "use strict";
    //  Helper DOM & keamanan teks
    const $ = (s, r = document) => r.querySelector(s);
    const $$ = (s, r = document) => [...r.querySelectorAll(s)];
    const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const reEsc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    //  Ikon SVG
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
        down: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>',
        up: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>',
        printer: '<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
        eye: '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
        eyeoff: '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>',
        check: '<path d="M20 6 9 17l-5-5"/>', alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0ZM12 9v4M12 17h.01"/>',
        cal: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
        wand: '<path d="m15 4 5 5L8 21l-5-5Z"/><path d="M5 2v3M3.5 3.5h3M19 15v3M17.5 16.5h3"/>',
        mail: '<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
        trend: '<path d="m22 7-8.5 8.5-5-5L2 17"/><path d="M16 7h6v6"/>', chart: '<path d="M3 3v18h18"/><path d="M7 16v-5M12 16V8M17 16v-3"/>',
        save: '<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z"/><path d="M17 21v-8H7v8M7 3v5h8"/>',
        lock: '<rect x="3" y="10" width="18" height="11" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>',
        out: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
        doc: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
        users: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>',
        user: '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
        shield: '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
        info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>'
    };
    const ic = n => `<svg class="ic" viewBox="0 0 24 24">${P[n]}</svg>`;
    $$("[data-ic]").forEach(e => e.innerHTML = ic(e.dataset.ic));
    
    //  Format tanggal & waktu
    const pad = n => String(n).padStart(2, "0");
    const dkey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const today = () => dkey(new Date());
    const BLN = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const BLNP = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const ROM = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
    const fmt = t => t ? t.split("-").reverse().join("-") : "";
    const fmtL = t => { const p = String(t).split("-"); return `${+p[2]} ${BLNP[+p[1] - 1]} ${p[0]}`; };
    const ago = iso => {
        const s = Math.floor((Date.now() - new Date(iso)) / 1000);
        return s < 60 ? "Baru saja" : s < 3600 ? Math.floor(s / 60) + " menit lalu" : s < 86400 ? Math.floor(s / 3600) + " jam lalu" : s < 604800 ? Math.floor(s / 86400) + " hari lalu" : fmt(dkey(new Date(iso)));
    };
    const jam = iso => { const d = new Date(iso); return pad(d.getHours()) + ":" + pad(d.getMinutes()); };
    const cut = (s, n = 70) => { s = String(s ?? "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n) + "…" : s; };

    //  Firebase (Auth + Firestore)
    //  Koleksi: users/{uid} • surat/{id} • riwayat/{id} • meta/counters
    const FIREBASE_CONFIG = {
        apiKey: "AIzaSyAiLylQl2B4jtoBJT47CmWwNobesgKHNgM",
        authDomain: "sistem-administrasi-sura-1413b.firebaseapp.com",
        projectId: "sistem-administrasi-sura-1413b",
        appId: "1:665939059922:web:21283e7642871f7f46b90b"
    };
    firebase.initializeApp(FIREBASE_CONFIG);
    const auth = firebase.auth();
    const db = firebase.firestore();
    const C = {
        surat: db.collection("surat"), riwayat: db.collection("riwayat"), users: db.collection("users"),
        meta: db.collection("meta").doc("counters"), legacy: db.collection("agenda").doc("main")
    };

    let ME = null, SURAT = [], RIWAYAT = [], USERS = [], LEGACY = null;
    let ready = false, locked = false, unsubs = [], pendingRole = null, flash = "", LOGO;
    const isAdm = () => ME && ME.role === "admin";
    const byId = id => SURAT.find(r => r.id === String(id));
    const FIELD = { jenis: "Jenis Surat", tanggal: "Tanggal", nomor: "Nomor Agenda", lembaga: "Lembaga/Instansi", org: "Organisasi/Perorangan", isi: "Perihal" };
    const logDoc = (aksi, r, detail) => ({ aksi, sid: r.id || "", jenis: r.jenis, nomor: r.nomor, detail, at: new Date().toISOString(), by: ME.nama });
    const errMsg = er => (er && (er.code || er.message)) || "tidak diketahui";

    //  Konfigurasi halaman & status
    // [judul, subjudul, jenis, peran yang boleh]
    const META = {
        beranda: ["Beranda", "Ringkasan administrasi surat", "", ["admin"]],
        semua: ["Semua Surat", "Seluruh surat masuk dan keluar", "", ["admin"]],
        masuk: ["Surat Masuk", "Daftar surat yang diterima", "Masuk", ["admin", "user"]],
        keluar: ["Surat Keluar", "Daftar surat yang dikirim", "Keluar", ["admin", "user"]],
        riwayat: ["Riwayat Aktivitas", "Catatan penambahan, perubahan, dan penghapusan surat", "", ["admin"]],
        pengguna: ["Kelola Pengguna", "Akun Admin dan User yang dapat mengakses sistem", "", ["admin"]]
    };
    const allowed = v => !!(ME && META[v] && META[v][3].includes(ME.role));
    const home = () => isAdm() ? "beranda" : "masuk";
    const st = { view: "beranda", q: "", from: "", to: "", fj: "", page: 1, pp: 10, desc: true, ra: "" };
    const view = $("#view");
    const ACT = { tambah: ["Ditambahkan", "plus", "c-ok"], ubah: ["Diubah", "edit", "c-wa"], hapus: ["Dihapus", "trash", "c-er"] };
    const jenisAktif = () => st.view === "semua" ? st.fj : META[st.view][2];
    const JN = { Masuk: ["c-in", "inbox"], Keluar: ["c-out", "send"] };
    const badge = (j, text = j, icon = true) => `<span class="badge ${JN[j][0]}">${icon ? ic(JN[j][1]) + " " : ""}${text}</span>`;
    const chips = (attr, items) => items.map(([v, l]) => `<button class="chip" data-${attr}="${v}">${l}</button>`).join("");
    const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase();
    
    //  Komponen UI: toast, navigasi, modal
    function toast(msg, t) {
        const e = document.createElement("div");
        e.className = "toast " + (t || "");
        e.innerHTML = ic(t === "er" ? "alert" : "check") + `<span>${esc(msg)}</span>`;
        $("#toasts").append(e);
        setTimeout(() => { e.classList.add("out"); setTimeout(() => e.remove(), 400); }, 3200);
    }

    $("#login-year").textContent = new Date().getFullYear();
    $("#sIc").innerHTML = ic("search");
    $("#gc").innerHTML = ic("x");
    $("#out").innerHTML = ic("out");
    $("#yr").textContent = new Date().getFullYear();
    const tick = () => { const d = new Date(); $("#dt").innerHTML = ic("cal") + " " + d.toLocaleDateString("id-ID", { weekday: "short", day: "numeric", month: "short", year: "numeric" }) + " • " + jam(d); };
    tick();
    setInterval(tick, 30000);

    const NAV = [["beranda", "home", "Beranda"], ["semua", "list", "Semua Surat"], ["masuk", "inbox", "Surat Masuk"], ["keluar", "send", "Surat Keluar"], ["riwayat", "history", "Riwayat"], ["pengguna", "users", "Pengguna"]];

    function renderNav() {
        if (!ME) return;
        const n = { semua: SURAT.length, masuk: SURAT.filter(r => r.jenis === "Masuk").length, keluar: SURAT.filter(r => r.jenis === "Keluar").length, pengguna: USERS.length };
        const items = NAV.filter(([id]) => allowed(id));
        $("#side-nav").innerHTML = items.map(([id, i, l]) => `<button class="nv ${st.view === id ? "on" : ""}" data-go="${id}">${ic(i)}<span>${l}</span>${n[id] ? `<em class="cnt">${n[id]}</em>` : ""}</button>`).join("");
        const mid = Math.ceil(items.length / 2);
        const dk = items.map(([id, i, l]) => `<button class="bub ${st.view === id ? "on" : ""}" data-go="${id}" title="${l}">${ic(i)}<span>${l === "Semua Surat" ? "Semua" : l.replace("Surat ", "")}</span></button>`);
        dk.splice(mid, 0, `<button class="bub add" data-add title="Tambah surat (N)" aria-label="Tambah surat">${ic("plus")}</button>`);
        $("#dock").innerHTML = dk.join("");
    }

    function renderMe() {
        $("#me").innerHTML = `<span class="av">${esc(initials(ME.nama))}</span><span class="mi"><b>${esc(cut(ME.nama, 22))}</b><small>${isAdm() ? "Administrator" : "User"}</small></span>`;
        $("#side-note").innerHTML = isAdm()
            ? `<div class="sn-h">${ic("shield")} Akses Administrator</div><p>Kelola seluruh surat, riwayat, dan akun pengguna.</p>`
            : `<div class="sn-h">${ic("user")} Akses User</div><p>Anda dapat menambah surat dan mengunduh Word. Edit &amp; hapus hanya oleh admin.</p>`;
    }

    const ov = $("#ov");
    const openModal = html => { $("#md").className = "md"; $("#md").innerHTML = html; ov.classList.add("show"); document.body.style.overflow = "hidden"; };
    const closeModal = () => { if (locked) return; ov.classList.remove("show"); document.body.style.overflow = ""; };
    ov.addEventListener("mousedown", e => { if (e.target === ov) closeModal(); });

    //  Form tambah/edit, hapus & detail surat
    function formModal(r, preset) {
        const e = !!r;
        if (e && !isAdm()) return;
        r = r || { jenis: preset || "", tanggal: today(), nomor: "", lembaga: "", org: "", isi: "" };
        openModal(`<div class="mh ${e ? "edit" : ""}"><h4>${ic(e ? "edit" : "plus")} ${e ? "Edit Data Surat" : "Tambah Agenda Surat"}</h4><button data-close>${ic("x")}</button></div>
  <form id="fm" novalidate data-id="${e ? r.id : ""}"><div class="mb">
    <div class="r2">
      <div class="fl"><label>Jenis Surat <i>*</i></label><select name="jenis" required><option value="">-- Pilih jenis --</option>
        <option value="Masuk" ${r.jenis === "Masuk" ? "selected" : ""}>Surat Masuk</option><option value="Keluar" ${r.jenis === "Keluar" ? "selected" : ""}>Surat Keluar</option></select></div>
      <div class="fl"><label>Tgl/Bln/Tahun <i>*</i></label><input type="date" name="tanggal" value="${r.tanggal}" required></div>
    </div>
    <div class="fl"><label>Nomor Agenda ${e ? "<i>*</i>" : ""}</label><div class="ib"><input name="nomor" value="${esc(r.nomor)}" placeholder="${e ? "Contoh: 001/ASM/IX/2026" : "Kosongkan agar dibuat otomatis"}" ${e ? "required" : ""}>
      <button type="button" class="btn b-gh sm" data-auto>${ic("wand")} Otomatis</button></div><small>${e ? "Nomor agenda dapat disesuaikan dengan administrasi kantor." : "Dibuat otomatis berurutan jika dikosongkan."}</small></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Lembaga / Instansi</label><input name="lembaga" value="${esc(r.lembaga)}" placeholder="Contoh: Dinas Pendidikan"></div>
    <div class="fl"><label>Diterima Dari / Dikirim Kepada - Organisasi / Perorangan</label><input name="org" value="${esc(r.org)}" placeholder="Contoh: Universitas / Nama Perorangan"></div>
    <div class="fl"><label>Isi Surat / Perihal <i>*</i></label><textarea name="isi" rows="4" maxlength="2000" placeholder="Tuliskan isi atau perihal surat..." required>${esc(r.isi)}</textarea></div>
  </div><div class="mf"><button type="button" class="btn b-gh" data-close>Batal</button><button class="btn b-pr">${ic("save")} ${e ? "Simpan Perubahan" : "Simpan Surat"}</button></div></form>`);
        setTimeout(() => $(e || r.jenis ? "[name=nomor]" : "[name=jenis]").focus(), 260);
    }

    const genNomor = (j, tgl, n) => { const d = tgl ? new Date(tgl) : new Date(); return `${String(n).padStart(3, "0")}/${j === "Masuk" ? "ASM" : "ASK"}/${ROM[d.getMonth()]}/${d.getFullYear()}`; };

    async function submitForm(f) {
        const bad = $$("[required]", f).filter(i => !i.value.trim());
        $$(".fl.bad", f).forEach(x => x.classList.remove("bad"));
        if (bad.length) {
            bad.forEach(i => { const w = i.closest(".fl"); void w.offsetWidth; w.classList.add("bad"); });
            bad[0].focus();
            return toast("Data wajib belum lengkap!", "er");
        }
        const v = Object.fromEntries([...new FormData(f)].map(([k, x]) => [k, x.trim()]));
        const id = f.dataset.id, btn = $(".b-pr", f);
        btn.disabled = true;
        try {
            if (id) {
                if (!isAdm()) throw { code: "izin-ditolak" };
                const old = byId(id), ch = Object.keys(FIELD).filter(k => old[k] !== v[k]).map(k => FIELD[k]);
                const b = db.batch();
                b.update(C.surat.doc(id), v);
                b.set(C.riwayat.doc(), logDoc("ubah", { ...old, ...v }, ch.length ? "Mengubah " + ch.join(", ") : "Disimpan tanpa perubahan data"));
                await b.commit();
                toast("Perubahan berhasil disimpan");
            } else {
                const k = v.jenis === "Masuk" ? "masuk" : "keluar", nr = C.surat.doc(), auto = !v.nomor;
                await db.runTransaction(async tx => {
                    const c = await tx.get(C.meta), n = ((c.exists && c.data()[k]) || 0) + 1;
                    const nomor = auto ? genNomor(v.jenis, v.tanggal, n) : v.nomor;
                    tx.set(C.meta, { [k]: n }, { merge: true });
                    tx.set(nr, { ...v, nomor, createdAt: new Date().toISOString(), uid: ME.uid, by: ME.nama, byEmail: ME.email });
                    tx.set(C.riwayat.doc(), logDoc("tambah", { id: nr.id, jenis: v.jenis, nomor }, `Menambahkan surat ${v.jenis.toLowerCase()}: ${cut(v.isi)}`));
                });
                toast("Surat berhasil ditambahkan");
            }
            closeModal();
        } catch (er) {
            btn.disabled = false;
            toast("Gagal menyimpan: " + errMsg(er), "er");
        }
    }

    function confirmModal(title, text, btn, fn) {
        openModal(`<div class="wi">${ic("alert")}</div><h4>${title}</h4><p>${text}</p><div class="mf"><button class="btn b-gh" data-close>Batal</button><button class="btn b-er" id="yes">${ic("trash")} ${btn}</button></div>`);
        $("#md").classList.add("sm");
        $("#yes").onclick = async () => {
            const b = $("#yes"); b.disabled = true;
            try { await fn(); closeModal(); }
            catch (er) { b.disabled = false; toast("Gagal: " + errMsg(er), "er"); }
        };
    }

    const hapus = r => isAdm() && confirmModal("Hapus surat ini?", `Surat dengan nomor agenda "${esc(r.nomor)}" akan dihapus permanen.`, "Ya, Hapus", async () => {
        const b = db.batch();
        b.delete(C.surat.doc(r.id));
        b.set(C.riwayat.doc(), logDoc("hapus", r, `Menghapus surat ${r.jenis.toLowerCase()}${r.lembaga || r.org ? " (" + cut((r.lembaga || "") + " " + (r.org || ""), 50) + ")" : ""}: ${cut(r.isi, 60)}`));
        await b.commit();
        toast("Surat berhasil dihapus");
    });

    function detail(r) {
        if (!r) return;
        openModal(`<div class="mh"><h4>${ic("eye")} Detail Surat</h4><button data-close>${ic("x")}</button></div><div class="mb">
    <div class="dh">${badge(r.jenis, "Surat " + r.jenis)}<span class="nomor big">${esc(r.nomor)}</span></div>
    <div class="r2"><div class="dg"><label>Tanggal</label><div>${fmtL(r.tanggal)}</div></div><div class="dg"><label>Dicatat pada</label><div>${r.createdAt ? fmt(dkey(new Date(r.createdAt))) + " " + jam(r.createdAt) : "-"}</div></div>
    <div class="dg"><label>${r.jenis === "Masuk" ? "Diterima dari" : "Dikirim kepada"} (Lembaga)</label><div>${esc(r.lembaga) || "-"}</div></div><div class="dg"><label>Organisasi / Perorangan</label><div>${esc(r.org) || "-"}</div></div>
    <div class="dg"><label>Dicatat oleh</label><div>${esc(r.by) || "-"}</div></div><div class="dg"><label>Email pencatat</label><div>${esc(r.byEmail) || "-"}</div></div>
    <div class="dg full"><label>Isi Surat / Perihal</label><div class="isi">${esc(r.isi)}</div></div></div></div>
    <div class="mf"><button class="btn b-gh" data-close>Tutup</button>${isAdm() ? `<button class="btn b-gh" data-edit="${r.id}">${ic("edit")} Edit</button><button class="btn b-er" data-del="${r.id}">${ic("trash")} Hapus</button>` : ""}<button class="btn b-pr" data-dl="${r.id}">${ic("doc")} Download Word</button></div>`);
    }

    //  Ekspor Word (.docx) — dibuat langsung di browser, tanpa library
    const crcT = (() => { const t = new Uint32Array(256); for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1; t[n] = c >>> 0; } return t; })();
    const crc32 = b => { let c = ~0; for (let i = 0; i < b.length; i++) c = crcT[(c ^ b[i]) & 255] ^ (c >>> 8); return ~c >>> 0; };

    function zip(files) {
        const enc = new TextEncoder(), loc = [], cen = [];
        let off = 0;
        files.forEach(f => {
            const n = enc.encode(f.name), d = f.data, crc = crc32(d);
            const h = new DataView(new ArrayBuffer(30));
            h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(6, 0x0800, true); h.setUint16(10, 0, true); h.setUint16(12, 0x21, true);
            h.setUint32(14, crc, true); h.setUint32(18, d.length, true); h.setUint32(22, d.length, true); h.setUint16(26, n.length, true);
            const c = new DataView(new ArrayBuffer(46));
            c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint16(8, 0x0800, true); c.setUint16(14, 0x21, true);
            c.setUint32(16, crc, true); c.setUint32(20, d.length, true); c.setUint32(24, d.length, true); c.setUint16(28, n.length, true); c.setUint32(42, off, true);
            loc.push(new Uint8Array(h.buffer), n, d);
            cen.push(new Uint8Array(c.buffer), n);
            off += 30 + n.length + d.length;
        });
        const csz = cen.reduce((s, p) => s + p.length, 0), e = new DataView(new ArrayBuffer(22));
        e.setUint32(0, 0x06054b50, true); e.setUint16(8, files.length, true); e.setUint16(10, files.length, true); e.setUint32(12, csz, true); e.setUint32(16, off, true);
        const parts = [...loc, ...cen, new Uint8Array(e.buffer)], out = new Uint8Array(off + csz + 22);
        let p = 0; parts.forEach(x => { out.set(x, p); p += x.length; });
        return out;
    }

    const X = s => String(s ?? "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const rn = (t, o = {}) => `<w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>${o.b ? "<w:b/>" : ""}${o.i ? "<w:i/>" : ""}${o.c ? `<w:color w:val="${o.c}"/>` : ""}<w:sz w:val="${(o.s || 11) * 2}"/></w:rPr><w:t xml:space="preserve">${X(t)}</w:t></w:r>`;
    const pp = (inner, o = {}) => `<w:p><w:pPr>${o.bd ? '<w:pBdr><w:bottom w:val="thickThinSmallGap" w:sz="18" w:space="4" w:color="1E40AF"/></w:pBdr>' : ""}<w:spacing w:before="${o.bf || 0}" w:after="${o.af || 0}"/>${o.ind ? `<w:ind w:left="${o.ind}"/>` : ""}${o.jc ? `<w:jc w:val="${o.jc}"/>` : ""}</w:pPr>${inner}</w:p>`;
    const lines = (t, o) => String(t || "-").split(/\r?\n/).map(l => pp(rn(l || " ", o), { af: 40 })).join("");
    const tc = (w, inner, o = {}) => `<w:tc><w:tcPr><w:tcW w:w="${w}" w:type="dxa"/>${o.span ? `<w:gridSpan w:val="${o.span}"/>` : ""}${o.sh ? `<w:shd w:val="clear" w:color="auto" w:fill="${o.sh}"/>` : ""}<w:vAlign w:val="${o.va || "top"}"/></w:tcPr>${inner}</w:tc>`;
    const tbl = (cols, body, border) => `<w:tbl><w:tblPr><w:tblW w:w="${cols.reduce((a, b) => a + b)}" w:type="dxa"/><w:tblBorders>${["top", "left", "bottom", "right", "insideH", "insideV"].map(s => border ? `<w:${s} w:val="single" w:sz="6" w:space="0" w:color="${border}"/>` : `<w:${s} w:val="nil"/>`).join("")}</w:tblBorders><w:tblLayout w:type="fixed"/><w:tblCellMar><w:top w:w="90" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:bottom w:w="90" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tblCellMar></w:tblPr><w:tblGrid>${cols.map(c => `<w:gridCol w:w="${c}"/>`).join("")}</w:tblGrid>${body}</w:tbl>`;

    function buildDocx(r, logo, now = new Date()) {
        const masuk = r.jenis === "Masuk", W = 9638, L = 2900, V = W - L;
        const tgl = `${now.getDate()} ${BLNP[now.getMonth()]} ${now.getFullYear()}`;
        const row = (k, v, h) => `<w:tr>${h ? `<w:trPr><w:trHeight w:val="${h}" w:hRule="atLeast"/></w:trPr>` : ""}${tc(L, pp(rn(k, { b: 1, c: "1E3A8A" })), { sh: "EAF1FF" })}${tc(V, lines(v))}</w:tr>`;
        const sec = t => `<w:tr>${tc(W, pp(rn(t, { b: 1, c: "FFFFFF", s: 11 })), { span: 2, sh: "1E40AF" })}</w:tr>`;
        const kopText = pp(rn("UNIVERSITAS ISLAM AL-IHYA KUNINGAN", { b: 1, s: 16, c: "1E3A8A" }), { jc: "center" }) + pp(rn("Sistem Administrasi Buku Agenda Surat Masuk dan Keluar", { s: 11, c: "475569" }), { jc: "center" });
        let kop = kopText, img = "";
        if (logo) {
            const m = 860000, k = m / Math.max(logo.w, logo.h), cx = Math.round(logo.w * k), cy = Math.round(logo.h * k);
            img = `<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="${cx}" cy="${cy}"/><wp:docPr id="1" name="Logo"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr><a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic><pic:nvPicPr><pic:cNvPr id="0" name="logo"/><pic:cNvPicPr/></pic:nvPicPr><pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill><pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="${cx}" cy="${cy}"/></a:xfrm><a:prstGeom prst="rect"/></pic:spPr></pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>`;
            kop = tbl([1500, W - 1500], `<w:tr>${tc(1500, pp(img, { jc: "center" }), { va: "center" })}${tc(W - 1500, kopText, { va: "center" })}</w:tr>`, null);
        }
        const body = kop + pp("", { bd: 1, af: 200 }) +
            pp(rn(`LEMBAR AGENDA SURAT ${r.jenis.toUpperCase()}`, { b: 1, s: 15, c: "1E3A8A" }), { jc: "center", af: 40 }) +
            pp(rn(`Nomor Agenda: ${r.nomor}`, { s: 11, c: "475569" }), { jc: "center", af: 240 }) +
            tbl([L, V], row("Jenis Surat", "Surat " + r.jenis) + row("Nomor Agenda", r.nomor) + row("Tanggal Surat", fmtL(r.tanggal)) +
                sec(masuk ? "DITERIMA DARI" : "DIKIRIM KEPADA") + row("Lembaga / Instansi", r.lembaga) + row("Organisasi / Perorangan", r.org) +
                sec("ISI SURAT") + row("Isi Surat / Perihal", r.isi, 1900) +
                sec("INFORMASI PENCATATAN") + row("Dicatat oleh", r.by) + row("Dicatat pada", r.createdAt ? `${fmtL(dkey(new Date(r.createdAt)))} pukul ${jam(r.createdAt)}` : "-"), "BFD3F5") +
            pp(rn(`Kuningan, ${tgl}`, { s: 11 }), { ind: 6000, bf: 480 }) + pp(rn("Administrator", { s: 11, b: 1 }), { ind: 6000, af: 900 }) +
            pp(rn("( ................................................ )", { s: 11 }), { ind: 6000, af: 360 }) +
            pp(rn(`Dokumen ini dihasilkan otomatis dari Sistem Administrasi Buku Agenda Surat pada ${tgl}, ${pad(now.getHours())}:${pad(now.getMinutes())}.`, { s: 8, i: 1, c: "64748B" }), { bf: 200 });
        const doc = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"><w:body>${body}<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="1134" w:right="1134" w:bottom="1134" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>`;
        const enc = new TextEncoder(), H = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
        const files = [
            { name: "[Content_Types].xml", data: enc.encode(`${H}<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Default Extension="png" ContentType="image/png"/><Default Extension="jpeg" ContentType="image/jpeg"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>`) },
            { name: "_rels/.rels", data: enc.encode(`${H}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>`) },
            { name: "word/_rels/document.xml.rels", data: enc.encode(`${H}<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${logo ? `<Relationship Id="rIdLogo" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="media/logo.${logo.ext}"/>` : ""}</Relationships>`) },
            { name: "word/document.xml", data: enc.encode(doc) }
        ];
        if (logo) files.push({ name: `word/media/logo.${logo.ext}`, data: logo.bytes });
        return zip(files);
    }

    async function loadLogo() {
        if (LOGO !== undefined) return LOGO;
        try {
            const res = await fetch(encodeURI("logo unisa.png.jpg"));
            if (!res.ok) throw 0;
            const b = new Uint8Array(await res.arrayBuffer()), dv = new DataView(b.buffer);
            const png = b[0] === 0x89 && b[1] === 0x50, jpg = b[0] === 0xFF && b[1] === 0xD8;
            if (!png && !jpg) throw 0;
            let w, h;
            if (png) { w = dv.getUint32(16); h = dv.getUint32(20); }
            else for (let i = 2; i < b.length - 9;) {
                if (b[i] !== 0xFF) { i++; continue; }
                const m = b[i + 1];
                if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) { h = dv.getUint16(i + 5); w = dv.getUint16(i + 7); break; }
                i += 2 + dv.getUint16(i + 2);
            }
            LOGO = w && h ? { bytes: b, w, h, ext: png ? "png" : "jpeg" } : null;
        } catch { LOGO = null; }
        return LOGO;
    }

    async function downloadWord(id) {
        const r = byId(id);
        if (!r) return;
        try {
            const data = buildDocx(r, await loadLogo());
            const nm = `Agenda-Surat-${r.jenis}_${String(r.nomor).replace(/[^\w]+/g, "-")}.docx`;
            download(data, nm, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
            toast("Dokumen Word berhasil diunduh");
        } catch (er) { toast("Gagal membuat dokumen Word", "er"); }
    }
    
    //  Beranda (Admin): statistik & grafik
    function monthly(n = 6) {
        const o = [], now = new Date();
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            o.push({ k: `${d.getFullYear()}-${pad(d.getMonth() + 1)}`, l: BLN[d.getMonth()], Masuk: 0, Keluar: 0 });
        }
        SURAT.forEach(r => { const m = o.find(x => x.k === String(r.tanggal).slice(0, 7)); if (m) m[r.jenis]++; });
        return o;
    }

    function chart(d) {
        const W = 640, H = 260, L = 36, T = 14, B = 32, iw = W - L - 8, ih = H - T - B, top = Math.ceil(Math.max(4, ...d.map(x => Math.max(x.Masuk, x.Keluar))) / 4) * 4, gw = iw / d.length, bw = Math.min(26, gw / 3);
        let s = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Grafik surat per bulan"><defs><linearGradient id="gIn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#38bdf8"/><stop offset="1" stop-color="#0284c7"/></linearGradient><linearGradient id="gOut" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#818cf8"/><stop offset="1" stop-color="#4338ca"/></linearGradient></defs>`;
        for (let i = 0; i <= 4; i++) {
            const y = T + ih - ih * i / 4;
            s += `<line x1="${L}" x2="${W - 8}" y1="${y}" y2="${y}" stroke="#dbe5f7" stroke-dasharray="${i ? "4 5" : 0}"/><text x="${L - 8}" y="${y + 4}" text-anchor="end" font-size="11" fill="#6b7a99">${top * i / 4}</text>`;
        }
        d.forEach((m, i) => {
            const cx = L + gw * i + gw / 2;
            [["Masuk", "url(#gIn)", -bw - 2], ["Keluar", "url(#gOut)", 2]].forEach(([k, c, o], j) => {
                const h = Math.max(m[k] ? 4 : 0, ih * m[k] / top);
                s += `<rect class="bar" style="animation-delay:${i * 80 + j * 40}ms" x="${cx + o}" y="${T + ih - h}" width="${bw}" height="${h}" rx="6" fill="${c}"><title>${m.l}: ${m[k]} surat ${k.toLowerCase()}</title></rect>`;
            });
            s += `<text x="${cx}" y="${H - 10}" text-anchor="middle" font-size="12" fill="#6b7a99">${m.l}</text>`;
        });
        return s + "</svg>";
    }

    function numAnim(el, to) {
        let t0;
        const step = ts => { t0 ??= ts; const p = Math.min((ts - t0) / 800, 1); el.textContent = Math.round(to * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(step); };
        requestAnimationFrame(step);
    }

    function mBeranda() {
        const S = SURAT, tot = S.length, mk = S.filter(r => r.jenis === "Masuk").length, kl = tot - mk, bi = S.filter(r => String(r.tanggal).slice(0, 7) === today().slice(0, 7)).length;
        const sorted = [...S].sort((a, b) => String(b.tanggal).localeCompare(a.tanggal) || String(b.createdAt).localeCompare(String(a.createdAt))), h = new Date().getHours(), Cc = 2 * Math.PI * 54;
        const li = r => `<div class="li" data-detail="${r.id}"><div class="dot ${JN[r.jenis][0]}">${ic(JN[r.jenis][1])}</div><div><div class="t">${esc(r.nomor)}</div><div class="s">${esc(cut(r.isi))}</div></div><div class="r">${fmt(r.tanggal)}</div></div>`;
        const none = (i, t) => `<div class="empty tight">${ic(i)}<p>${t}</p></div>`;
        view.innerHTML = `
  <section class="hero"><div class="hero-t"><span class="hero-pill">${ic("shield")} Administrator</span><h2>${h < 11 ? "Selamat pagi" : h < 15 ? "Selamat siang" : h < 19 ? "Selamat sore" : "Selamat malam"}, ${esc(ME.nama.split(" ")[0])}! 👋</h2>
    <p>Kelola surat masuk dan keluar dalam satu tempat. Saat ini tercatat <b>${tot}</b> surat, <b>${bi}</b> di antaranya pada bulan ${BLNP[new Date().getMonth()]}.</p></div>
    <div class="acts"><button class="btn b-wh" data-add="Masuk">${ic("inbox")} Catat Surat Masuk</button><button class="btn b-gl" data-add="Keluar">${ic("send")} Catat Surat Keluar</button></div></section>
  <section class="stats">${[["Total Surat", tot, "mail", "c-pr", "semua"], ["Surat Masuk", mk, "inbox", "c-in", "masuk"], ["Surat Keluar", kl, "send", "c-out", "keluar"], ["Bulan Ini", bi, "cal", "c-wa", "semua"]]
                .map(([l, n, i, c, g], k) => `<div class="card stat ${c}" style="animation-delay:${k * 80}ms" data-go="${g}"><div class="si">${ic(i)}</div><div><small>${l}</small><h3 data-n="${n}">0</h3></div></div>`).join("")}</section>
  <section class="g2"><div class="card pn"><div class="pnh"><h3>${ic("chart")} Statistik 6 Bulan Terakhir</h3><div class="lg"><span><i class="bg-in"></i>Masuk</span><span><i class="bg-out"></i>Keluar</span></div></div><div class="chart">${chart(monthly())}</div></div>
    <div class="card pn"><div class="pnh"><h3>${ic("trend")} Perbandingan</h3></div><div class="dw"><div class="dn"><svg viewBox="0 0 140 140" width="160" height="160">
      <circle cx="70" cy="70" r="54" fill="none" stroke="${tot ? "#6366f1" : "#dbe5f7"}" stroke-width="18"/><circle id="dn" cx="70" cy="70" r="54" fill="none" stroke="#0ea5e9" stroke-width="18" stroke-linecap="round" stroke-dasharray="0 ${Cc}" data-d="${tot ? Cc * mk / tot : 0} ${Cc}"/></svg>
      <div class="mid"><b>${tot}</b><small>Total surat</small></div></div>
      <div class="dl"><div><i class="bg-in"></i>Masuk<b>${tot ? Math.round(mk * 100 / tot) : 0}%</b></div><div><i class="bg-out"></i>Keluar<b>${tot ? Math.round(kl * 100 / tot) : 0}%</b></div></div></div></div></section>
  <section class="g2b"><div class="card pn"><div class="pnh"><h3>${ic("mail")} Surat Terbaru</h3><button class="lk" data-go="semua">Lihat semua →</button></div>${sorted.length ? sorted.slice(0, 5).map(li).join("") : none("inbox", "Belum ada surat.")}</div>
    <div class="card pn"><div class="pnh"><h3>${ic("history")} Aktivitas Terakhir</h3><button class="lk" data-go="riwayat">Lihat riwayat →</button></div>${RIWAYAT.length ? RIWAYAT.slice(0, 5).map(a => { const m = ACT[a.aksi] || ACT.ubah; return `<div class="li" data-go="riwayat"><div class="dot ${m[2]}">${ic(m[1])}</div><div><div class="t">${m[0]} • ${esc(a.nomor)}</div><div class="s">${esc(a.detail)}</div></div><div class="r">${ago(a.at)}</div></div>`; }).join("") : none("history", "Belum ada aktivitas.")}</div></section>
  <section class="card bk"><div><b>Data &amp; Cadangan</b><div class="mu">Data tersimpan di server dan dipakai bersama semua perangkat. Cadangkan secara berkala agar aman.</div></div>
    <div class="acts"><button class="btn b-gh sm" data-act="backup">${ic("down")} Cadangkan (JSON)</button><button class="btn b-gh sm" data-act="restore">${ic("up")} Pulihkan</button>${LEGACY ? `<button class="btn b-pr sm" data-act="legacy">${ic("wand")} Impor Data Lama (${LEGACY.surat.length})</button>` : ""}</div></section>`;
        $$("[data-n]", view).forEach(e => numAnim(e, +e.dataset.n));
        setTimeout(() => { const c = $("#dn"); if (c) c.setAttribute("stroke-dasharray", c.dataset.d); }, 150);
    }

    //  Halaman Data Surat: tabel, filter, ekspor, cetak
    function filtered() {
        const q = st.q.toLowerCase(), j = jenisAktif();
        return SURAT.filter(r => (!j || r.jenis === j) && (!st.from || r.tanggal >= st.from) && (!st.to || r.tanggal <= st.to) &&
            (!q || [r.nomor, r.lembaga, r.org, r.isi, r.by].some(v => String(v || "").toLowerCase().includes(q))))
            .sort((a, b) => (st.desc ? -1 : 1) * (String(a.tanggal).localeCompare(b.tanggal) || String(a.createdAt).localeCompare(String(b.createdAt))));
    }
    const hl = t => st.q ? esc(t).replace(new RegExp("(" + reEsc(esc(st.q)) + ")", "gi"), "<mark>$1</mark>") : esc(t);

    function mData() {
        const [t, s] = META[st.view], adm = isAdm();
        view.innerHTML = `<div class="ph"><div><h2>${t}</h2><p>${s}</p></div><div class="acts"><button class="btn b-gh" data-act="csv">${ic("down")} Ekspor CSV</button><button class="btn b-gh" data-act="print">${ic("printer")} Cetak</button><button class="btn b-pr" data-add>${ic("plus")} Tambah Surat</button></div></div>
  ${adm ? "" : `<div class="note">${ic("info")}<span>Anda masuk sebagai <b>User</b>: Anda dapat menambah surat, melihat surat yang Anda input, dan mengunduh dokumen Word. Mengubah atau menghapus surat hanya dapat dilakukan oleh Admin.</span></div>`}
  <div class="card flt">${st.view === "semua" ? `<div class="f"><label>Jenis</label><div class="chips" id="jc">${chips("j", [["", "Semua"], ["Masuk", "Masuk"], ["Keluar", "Keluar"]])}</div></div>` : ""}
    <div class="f"><label>Dari tanggal</label><input type="date" id="df" value="${st.from}"></div><div class="f"><label>Sampai tanggal</label><input type="date" id="dto" value="${st.to}"></div>
    <div class="f"><label>Periode cepat</label><div class="chips">${chips("r", [["all", "Semua"], ["7", "7 hari"], ["30", "30 hari"], ["m", "Bulan ini"]])}</div></div>
    <div class="f"><label>Tampilkan</label><select id="pp">${[10, 25, 50, 100].map(n => `<option value="${n}" ${n === st.pp ? "selected" : ""}>${n} data</option>`).join("")}</select></div>
    <button class="btn b-gh sm" data-act="reset">Reset filter</button></div>
  <div class="card tc"><div class="th"><h3>${ic("list")} Data Buku Agenda Surat</h3><span class="mu" id="ci"></span></div><div class="tw"><table><thead><tr><th class="ct">No</th><th>Jenis Surat</th><th class="so" data-act="sort">Tgl/Bln/Tahun <span id="ar"></span></th><th>Nomor Agenda</th><th>Lembaga / Instansi</th><th>Organisasi / Perorangan</th><th>Perihal</th>${adm ? "<th>Dicatat Oleh</th>" : ""}<th class="ct">Aksi</th></tr></thead><tbody id="tb"></tbody></table></div><div class="pg" id="pg"></div></div>`;
        rows();
    }

    function rows() {
        const all = filtered(), adm = isAdm(), pages = Math.max(1, Math.ceil(all.length / st.pp));
        st.page = Math.min(st.page, pages);
        const a = (st.page - 1) * st.pp, sl = all.slice(a, a + st.pp), fl = st.q || st.from || st.to || st.fj;
        $("#ci").textContent = all.length ? `Menampilkan ${a + 1}–${a + sl.length} dari ${all.length} surat` : "0 surat";
        $("#ar").textContent = st.desc ? "↓" : "↑";
        $$("#jc .chip").forEach(c => c.classList.toggle("on", c.dataset.j === st.fj));
        $("#tb").innerHTML = sl.length ? sl.map((r, i) => `<tr data-id="${r.id}" style="animation-delay:${i * 35}ms"><td class="ct">${a + i + 1}</td>
    <td>${badge(r.jenis)}</td><td>${fmt(r.tanggal)}</td><td><span class="nomor">${hl(r.nomor)}</span></td><td>${hl(r.lembaga)}</td><td>${hl(r.org)}</td><td><div class="pf">${hl(r.isi)}</div></td>${adm ? `<td><span class="by">${hl(r.by || "-")}</span></td>` : ""}
    <td><div class="ac"><button class="btn bi v-view" data-detail="${r.id}" title="Detail">${ic("eye")}</button><button class="btn bi v-dl" data-dl="${r.id}" title="Download Word">${ic("doc")}</button>${adm ? `<button class="btn bi v-edit" data-edit="${r.id}" title="Edit">${ic("edit")}</button><button class="btn bi v-del" data-del="${r.id}" title="Hapus">${ic("trash")}</button>` : ""}</div></td></tr>`).join("")
            : `<tr><td colspan="${adm ? 9 : 8}"><div class="empty">${ic("inbox")}<p>${SURAT.length && fl ? "Tidak ada surat yang cocok dengan filter." : "Belum ada data surat."}</p>${SURAT.length && fl ? `<button class="btn b-gh" data-act="reset">Reset filter</button>` : `<button class="btn b-pr" data-add>${ic("plus")} Tambah Surat</button>`}</div></td></tr>`;
        let p = "";
        if (pages > 1) {
            p = `<button data-p="${st.page - 1}" ${st.page < 2 ? "disabled" : ""}>‹</button>`;
            for (let i = 1; i <= pages; i++) p += `<button data-p="${i}" class="${i === st.page ? "on" : ""}">${i}</button>`;
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
        if (!r.length) return toast("Tidak ada data untuk diekspor", "er");
        const q = v => `"${String(v ?? "").replace(/"/g, '""')}"`;
        const L = [["No", "Jenis Surat", "Tanggal", "Nomor Agenda", "Lembaga/Instansi", "Organisasi/Perorangan", "Perihal", "Dicatat Oleh"].map(q).join(",")];
        r.forEach((x, i) => L.push([i + 1, x.jenis, fmt(x.tanggal), x.nomor, x.lembaga, x.org, x.isi, x.by].map(q).join(",")));
        download("\uFEFF" + L.join("\r\n"), `agenda-surat-${st.view}-${today()}.csv`, "text/csv;charset=utf-8");
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
        if (!r.length) return toast("Tidak ada data untuk dicetak", "er");
        $("#pa").innerHTML = `<h2>Buku Agenda Surat${jenisAktif() ? " — Surat " + jenisAktif() : ""}</h2><p>Universitas Islam Al-Ihya Kuningan • ${st.from || st.to ? `Periode: ${st.from ? fmt(st.from) : "awal"} s/d ${st.to ? fmt(st.to) : "sekarang"}` : "Semua tanggal"} • Dicetak ${fmtL(today())}</p>
  <table><thead><tr><th>No</th><th>Jenis</th><th>Tanggal</th><th>Nomor Agenda</th><th>Lembaga/Instansi</th><th>Organisasi/Perorangan</th><th>Perihal</th></tr></thead><tbody>${r.map((x, i) => `<tr><td>${i + 1}</td><td>${x.jenis}</td><td>${fmt(x.tanggal)}</td><td>${esc(x.nomor)}</td><td>${esc(x.lembaga)}</td><td>${esc(x.org)}</td><td>${esc(x.isi)}</td></tr>`).join("")}</tbody></table>
  <div class="ft">Copyright © ${new Date().getFullYear()} by Muhamad Rizki Ramdani — Sistem Administrasi Surat Masuk dan Keluar</div>`;
        window.print();
    }

    //  Riwayat (Admin)
    function mRiwayat() {
        view.innerHTML = `<div class="ph"><div><h2>${META.riwayat[0]}</h2><p>${META.riwayat[1]}</p></div><div class="acts"><button class="btn b-gh" data-act="clear" ${RIWAYAT.length ? "" : "disabled"}>${ic("trash")} Bersihkan Riwayat</button></div></div>
  <div class="card flt"><div class="f"><label>Jenis aktivitas</label><div class="chips" id="ac">${chips("a", [["", "Semua"], ["tambah", "Ditambahkan"], ["ubah", "Diubah"], ["hapus", "Dihapus"]])}</div></div><div class="mu sp" id="rc"></div></div>
  <div class="card"><div class="tl" id="tl"></div></div>`;
        timeline();
    }

    function timeline() {
        const q = st.q.toLowerCase(), R = RIWAYAT.filter(a => (!st.ra || a.aksi === st.ra) && (!q || [a.nomor, a.detail, a.jenis, a.by].some(v => String(v || "").toLowerCase().includes(q))));
        $$("#ac .chip").forEach(c => c.classList.toggle("on", c.dataset.a === st.ra));
        $("#rc").textContent = R.length + " aktivitas";
        if (!R.length) {
            $("#tl").innerHTML = `<div class="empty">${ic("history")}<p>${RIWAYAT.length ? "Tidak ada aktivitas yang cocok." : "Belum ada riwayat. Tambah, ubah, atau hapus surat untuk mulai mencatat."}</p></div>`;
            return;
        }
        const y = dkey(new Date(Date.now() - 864e5));
        let h = "", last = "", n = 0;
        R.forEach(a => {
            const d = dkey(new Date(a.at)), m = ACT[a.aksi] || ACT.ubah;
            if (d !== last) {
                h += `<div class="day">${d === today() ? "Hari ini" : d === y ? "Kemarin" : fmtL(d)}</div>`;
                last = d;
            }
            h += `<div class="ti" style="animation-delay:${Math.min(n++, 12) * 40}ms"><div class="tic ${m[2]}">${ic(m[1])}</div><div class="tcn"><div class="tt"><span class="tag ${m[2]}">${m[0]}</span><b>${hl(a.nomor)}</b>${badge(a.jenis, a.jenis, false)}<time>${jam(a.at)} • ${ago(a.at)}${a.by ? " • oleh " + esc(a.by) : ""}</time></div><div class="td">${hl(a.detail)}</div>
      ${a.aksi !== "hapus" && byId(a.sid) ? `<div class="mt8"><button class="btn b-gh sm" data-detail="${a.sid}">${ic("eye")} Lihat surat</button></div>` : ""}</div></div>`;
        });
        $("#tl").innerHTML = h;
    }

    //  Kelola Pengguna (Admin)
    function mPengguna() {
        const q = st.q.toLowerCase();
        const U = USERS.filter(u => !q || [u.nama, u.email, u.role].some(v => String(v || "").toLowerCase().includes(q)))
            .sort((a, b) => (a.role === b.role ? 0 : a.role === "admin" ? -1 : 1) || String(a.nama).localeCompare(String(b.nama)));
        view.innerHTML = `<div class="ph"><div><h2>${META.pengguna[0]}</h2><p>${META.pengguna[1]}</p></div><div class="acts"><button class="btn b-pr" data-newuser>${ic("plus")} Tambah Pengguna</button></div></div>
  <div class="note">${ic("info")}<span><b>Admin</b> dapat mengelola semua surat dan pengguna. <b>User</b> hanya dapat menambah surat dan mengunduh Word. Akun baru dibuat di sini lalu dibagikan ke pengguna (email &amp; kata sandi).</span></div>
  <div class="card tc"><div class="th"><h3>${ic("users")} Daftar Pengguna</h3><span class="mu">${U.length} akun</span></div><div class="tw"><table class="tu"><thead><tr><th>Pengguna</th><th>Email</th><th>Peran</th><th>Dibuat</th><th class="ct">Aksi</th></tr></thead><tbody>${U.length ? U.map((u, i) => {
            const me = u.id === ME.uid;
            return `<tr class="nc" style="animation-delay:${i * 35}ms"><td><div class="ucell"><span class="av ${u.role === "admin" ? "adm" : ""}">${esc(initials(u.nama))}</span><b>${esc(u.nama)}</b>${me ? '<span class="you">Anda</span>' : ""}</div></td><td>${esc(u.email)}</td>
      <td>${me ? '<span class="badge c-pr">Admin</span>' : `<select class="rsel" data-role="${u.id}"><option value="user" ${u.role === "user" ? "selected" : ""}>User</option><option value="admin" ${u.role === "admin" ? "selected" : ""}>Admin</option></select>`}</td>
      <td>${u.createdAt ? fmt(dkey(new Date(u.createdAt))) : "-"}</td><td><div class="ac">${me ? "" : `<button class="btn bi v-del" data-rmuser="${u.id}" title="Cabut akses">${ic("trash")}</button>`}</div></td></tr>`;
        }).join("") : `<tr class="nc"><td colspan="5"><div class="empty">${ic("users")}<p>Tidak ada pengguna.</p></div></td></tr>`}</tbody></table></div></div>`;
    }

    function userModal() {
        openModal(`<div class="mh"><h4>${ic("users")} Tambah Pengguna</h4><button data-close>${ic("x")}</button></div>
  <form id="fu" novalidate><div class="mb">
    <div class="fl"><label>Nama Lengkap <i>*</i></label><input name="nama" placeholder="Contoh: Siti Aminah" required></div>
    <div class="fl"><label>Email <i>*</i></label><input type="email" name="email" placeholder="nama@unisa.ac.id" autocomplete="off" required></div>
    <div class="r2"><div class="fl"><label>Kata Sandi <i>*</i></label><input type="text" name="pw" placeholder="Minimal 6 karakter" autocomplete="off" required></div>
    <div class="fl"><label>Peran</label><select name="role"><option value="user">User (input surat)</option><option value="admin">Admin (kelola penuh)</option></select></div></div>
    <small class="hint">Bagikan email dan kata sandi ini kepada pengguna. Kata sandi dapat diubah lewat fitur reset di Firebase.</small>
  </div><div class="mf"><button type="button" class="btn b-gh" data-close>Batal</button><button class="btn b-pr">${ic("plus")} Buat Akun</button></div></form>`);
        setTimeout(() => $("[name=nama]").focus(), 260);
    }

    async function submitUser(f) {
        const bad = $$("[required]", f).filter(i => !i.value.trim());
        $$(".fl.bad", f).forEach(x => x.classList.remove("bad"));
        const v = Object.fromEntries([...new FormData(f)].map(([k, x]) => [k, x.trim()]));
        if (bad.length || !f.email.validity.valid || v.pw.length < 6) {
            (bad[0] ? bad : [v.pw.length < 6 ? f.pw : f.email]).forEach(i => { const w = i.closest(".fl"); void w.offsetWidth; w.classList.add("bad"); });
            return toast(v.pw && v.pw.length < 6 ? "Kata sandi minimal 6 karakter" : "Data belum lengkap atau email tidak valid", "er");
        }
        const btn = $(".b-pr", f);
        btn.disabled = true;
        try {
            // Akun dibuat lewat instance Firebase kedua agar sesi Admin tidak ikut berganti
            const sec = firebase.apps.find(a => a.name === "sec") || firebase.initializeApp(FIREBASE_CONFIG, "sec");
            const cred = await sec.auth().createUserWithEmailAndPassword(v.email, v.pw);
            await sec.auth().signOut();
            await C.users.doc(cred.user.uid).set({ nama: v.nama, email: v.email, role: v.role, createdAt: new Date().toISOString(), createdBy: ME.email });
            toast(`Akun ${v.role === "admin" ? "Admin" : "User"} untuk ${v.nama} berhasil dibuat`);
            closeModal();
        } catch (er) {
            btn.disabled = false;
            toast(er.code === "auth/email-already-in-use" ? "Email sudah terdaftar di Firebase" : er.code === "auth/weak-password" ? "Kata sandi terlalu lemah" : "Gagal membuat akun: " + errMsg(er), "er");
        }
    }
    
    //  Cadangan, pemulihan & impor data lama
    async function importData(d, tag) {
        const ops = [], now = new Date().toISOString();
        d.surat.forEach(r => { const { id, ...x } = r; ops.push(b => b.set(C.surat.doc(tag + id), { ...x, createdAt: x.createdAt || now, uid: ME.uid, by: x.by || "Impor data", byEmail: x.byEmail || "" })); });
        (d.riwayat || []).forEach(a => { const { id, ...x } = a; ops.push(b => b.set(C.riwayat.doc(tag + "r" + String(id).replace(/[./]/g, "_")), { ...x, sid: x.sid ? tag + x.sid : "", by: x.by || "Impor data" })); });
        for (let i = 0; i < ops.length; i += 400) { const b = db.batch(); ops.slice(i, i + 400).forEach(f => f(b)); await b.commit(); }
        const c = await C.meta.get(), cur = c.exists ? c.data() : {};
        await C.meta.set({ masuk: Math.max(cur.masuk || 0, d.surat.filter(r => r.jenis === "Masuk").length), keluar: Math.max(cur.keluar || 0, d.surat.filter(r => r.jenis === "Keluar").length) }, { merge: true });
    }
    const tagOf = d => typeof (d.surat[0] || {}).id === "number" ? "L" : "";

    //  Navigasi & event handler
    function refresh() { renderNav(); ({ beranda: mBeranda, riwayat: mRiwayat, pengguna: mPengguna }[st.view] || mData)(); }

    function setView(v, anim = true) {
        if (!allowed(v)) v = home();
        st.view = v;
        st.page = 1;
        document.title = META[v][0] + " • Buku Agenda Surat";
        if (location.hash !== "#/" + v) history.replaceState(null, "", "#/" + v);
        if (anim) {
            view.classList.remove("view");
            void view.offsetWidth;
            view.classList.add("view");
            window.scrollTo({ top: 0 });
        }
        refresh();
    }
    const fromHash = () => { const v = location.hash.replace(/^#\/?/, ""); return allowed(v) ? v : home(); };
    addEventListener("hashchange", () => {
        if (!ME) { if (location.hash !== "#/login") history.replaceState(null, "", "#/login"); return; }
        setView(fromHash());
    });

    document.addEventListener("click", e => {
        const g = id => e.target.closest(id);
        const rp = g("[data-role-pick]");
        if (rp) {
            $("#role-tab").dataset.v = rp.dataset.rolePick;
            $$("#role-tab button").forEach(b => b.classList.toggle("on", b === rp));
            $(".login-submit-label").textContent = "Masuk sebagai " + (rp.dataset.rolePick === "admin" ? "Admin" : "User");
            $("#login-error").hidden = true;
            return;
        }
        if (g("[data-close]")) return closeModal();
        const go = g("[data-go]");
        if (go) {
            closeModal();
            return location.hash === "#/" + go.dataset.go ? setView(go.dataset.go) : (location.hash = "#/" + go.dataset.go);
        }
        const ad = g("[data-add]");
        if (ad) return formModal(null, ad.dataset.add || META[st.view][2]);
        const ed = g("[data-edit]");
        if (ed) return formModal(byId(ed.dataset.edit));
        const de = g("[data-del]");
        if (de) return hapus(byId(de.dataset.del));
        const dl = g("[data-dl]");
        if (dl) return downloadWord(dl.dataset.dl);
        const dt = g("[data-detail]");
        if (dt) return detail(byId(dt.dataset.detail));
        if (g("[data-newuser]")) return isAdm() && userModal();
        const ru = g("[data-rmuser]");
        if (ru) {
            const u = USERS.find(x => x.id === ru.dataset.rmuser);
            return isAdm() && u && confirmModal("Cabut akses pengguna?", `<b>${esc(u.nama)}</b> (${esc(u.email)}) tidak akan bisa masuk lagi. Akun loginnya tetap ada di Firebase Authentication dan dapat dihapus manual dari konsol.`, "Ya, Cabut Akses", async () => { await C.users.doc(u.id).delete(); toast("Akses pengguna dicabut"); });
        }
        const au = g("[data-auto]");
        if (au) {
            const f = $("#fm"), j = f.jenis.value;
            if (!j) {
                f.jenis.closest(".fl").classList.add("bad");
                return toast("Pilih jenis surat dulu", "er");
            }
            return C.meta.get().then(c => { f.nomor.value = genNomor(j, f.tanggal.value, ((c.exists && c.data()[j === "Masuk" ? "masuk" : "keluar"]) || 0) + 1); f.nomor.focus(); }).catch(() => toast("Gagal mengambil nomor berikutnya", "er"));
        }
        const ac = g("[data-act]");
        if (ac) {
            const a = ac.dataset.act;
            if (a === "csv") return csv();
            if (a === "print") return print();
            if (a === "sort") { st.desc = !st.desc; return rows(); }
            if (a === "reset") {
                Object.assign(st, { q: "", from: "", to: "", fj: "", page: 1 });
                $("#gs").value = "";
                $("#sbox").classList.remove("has");
                return mData();
            }
            if (!isAdm()) return;
            if (a === "backup") {
                download(JSON.stringify({ v: 2, surat: SURAT, riwayat: RIWAYAT }, null, 2), `backup-agenda-surat-${today()}.json`, "application/json");
                return toast("Cadangan data diunduh");
            }
            if (a === "restore") return $("#file").click();
            if (a === "legacy") return confirmModal("Impor data lama?", `Ditemukan <b>${LEGACY.surat.length}</b> surat dari sistem sebelumnya. Data akan disalin ke struktur baru (aman dijalankan ulang, tidak membuat duplikat).`, "Ya, Impor", async () => { await importData(LEGACY, "L"); toast("Data lama berhasil diimpor"); });
            if (a === "clear") return confirmModal("Bersihkan riwayat?", "Seluruh catatan riwayat akan dihapus. Data surat tidak ikut terhapus.", "Ya, Bersihkan", async () => {
                for (let i = 0; i < RIWAYAT.length; i += 400) { const b = db.batch(); RIWAYAT.slice(i, i + 400).forEach(x => b.delete(C.riwayat.doc(x.id))); await b.commit(); }
                toast("Riwayat berhasil dibersihkan");
            });
        }
        const j = g("[data-j]");
        if (j) { st.fj = j.dataset.j; st.page = 1; return rows(); }
        const r = g("[data-r]");
        if (r) return setRange(r.dataset.r);
        const ra = g("[data-a]");
        if (ra) { st.ra = ra.dataset.a; return timeline(); }
        const p = g("[data-p]");
        if (p && !p.disabled) { st.page = +p.dataset.p; rows(); return $(".tc").scrollIntoView({ behavior: "smooth" }); }
        const tr = g("tbody tr[data-id]");
        if (tr) detail(byId(tr.dataset.id));
    });

    document.addEventListener("submit", e => {
        if (e.target.id === "fm") { e.preventDefault(); submitForm(e.target); }
        if (e.target.id === "fu") { e.preventDefault(); isAdm() && submitUser(e.target); }
        if (e.target.id === "lg") {
            e.preventDefault();
            const form = e.target, email = form.elements.email, password = form.elements.pw;
            const emailError = $("[data-error-for=email]"), passwordError = $("[data-error-for=pw]"), message = $("#login-error");
            emailError.hidden = passwordError.hidden = message.hidden = true;
            if (!email.value.trim()) { emailError.textContent = "Masukkan alamat email Anda."; emailError.hidden = false; return email.focus(); }
            if (!email.validity.valid) { emailError.hidden = false; return email.focus(); }
            if (!password.value) { passwordError.hidden = false; return password.focus(); }
            const button = $("#login-submit"), label = $(".login-submit-label", button), role = $("#role-tab").dataset.v;
            const idle = "Masuk sebagai " + (role === "admin" ? "Admin" : "User");
            button.disabled = true;
            button.classList.add("loading");
            button.setAttribute("aria-busy", "true");
            label.textContent = "Memverifikasi akun...";
            pendingRole = role;
            auth.signInWithEmailAndPassword(email.value.trim(), password.value).catch(er => {
                pendingRole = null;
                message.textContent = /invalid-credential|wrong-password|user-not-found|invalid-email|missing-password/.test(er.code) ? "Email atau kata sandi salah" : er.code === "auth/too-many-requests" ? "Terlalu banyak percobaan. Coba lagi beberapa saat." : "Gagal masuk: " + er.code;
                message.hidden = false;
                button.disabled = false;
                button.classList.remove("loading");
                button.removeAttribute("aria-busy");
                label.textContent = idle;
                password.focus();
            });
        }
    });

    document.addEventListener("input", e => {
        if (e.target.name === "email" || e.target.name === "pw") {
            const fe = $(`[data-error-for=${e.target.name}]`);
            if (fe) fe.hidden = true;
            $("#login-error").hidden = true;
        }
        if (e.target.id === "df" || e.target.id === "dto") {
            st.from = $("#df").value;
            st.to = $("#dto").value;
            st.page = 1;
            rows();
        }
        if (e.target.closest(".fl.bad")) e.target.closest(".fl").classList.remove("bad");
    });

    document.addEventListener("change", e => {
        if (e.target.id === "pp") { st.pp = +e.target.value; st.page = 1; rows(); }
        const rs = e.target.closest("[data-role]");
        if (rs && isAdm()) C.users.doc(rs.dataset.role).update({ role: rs.value }).then(() => toast("Peran pengguna diperbarui")).catch(er => toast("Gagal mengubah peran: " + errMsg(er), "er"));
    });

    let tm;
    $("#gs").addEventListener("input", e => {
        $("#sbox").classList.toggle("has", !!e.target.value);
        clearTimeout(tm);
        tm = setTimeout(() => {
            st.q = e.target.value.trim(); st.page = 1;
            if (st.view === "beranda") { if (st.q) location.hash = "#/semua"; }
            else if (st.view === "riwayat") timeline();
            else if (st.view === "pengguna") mPengguna();
            else rows();
        }, 180);
    });

    $("#gc").onclick = () => {
        $("#gs").value = ""; $("#sbox").classList.remove("has"); st.q = "";
        st.view === "riwayat" ? timeline() : st.view === "pengguna" ? mPengguna() : st.view !== "beranda" && rows();
        $("#gs").focus();
    };

    $("#file").onchange = e => {
        const f = e.target.files[0];
        if (!f || !isAdm()) return;
        const rd = new FileReader();
        rd.onload = () => {
            try {
                const d = JSON.parse(rd.result);
                if (!Array.isArray(d.surat)) throw 0;
                confirmModal("Pulihkan data?", `File berisi ${d.surat.length} surat. Data dengan ID yang sama akan <b>ditimpa</b>, data lain tetap dipertahankan.`, "Ya, Pulihkan", async () => { await importData(d, tagOf(d)); toast("Data berhasil dipulihkan"); });
            } catch { toast("File cadangan tidak valid", "er"); }
        };
        rd.readAsText(f);
        e.target.value = "";
    };

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") closeModal();
        const t = (document.activeElement || {}).tagName;
        if (!ME || /INPUT|TEXTAREA|SELECT/.test(t) || e.ctrlKey || e.metaKey || e.altKey) return;
        if (e.key === "/") { e.preventDefault(); $("#gs").focus(); }
        if (e.key.toLowerCase() === "n") { e.preventDefault(); formModal(null, META[st.view][2]); }
    });

    document.addEventListener("click", e => {
        const b = e.target.closest(".pwt");
        if (!b) return;
        const i = b.previousElementSibling, show = i.type === "password";
        i.type = show ? "text" : "password";
        b.innerHTML = ic(show ? "eyeoff" : "eye");
        b.setAttribute("aria-label", show ? "Sembunyikan kata sandi" : "Tampilkan kata sandi");
    });

    if (!location.hash) history.replaceState(null, "", "#/login");
    $("#out").onclick = () => auth.signOut();

    //  Login, peran & sinkronisasi data real-time
    const stop = () => { unsubs.forEach(u => u()); unsubs = []; };

    function listen() {
        stop();
        view.innerHTML = `<div class="sk-wrap"><div class="sk h1"></div><div class="sk-row"><div class="sk"></div><div class="sk"></div><div class="sk"></div><div class="sk"></div></div><div class="sk tall"></div></div>`;
        const q = isAdm() ? C.surat : C.surat.where("uid", "==", ME.uid);
        unsubs.push(q.onSnapshot(s => {
            SURAT = s.docs.map(d => ({ id: d.id, ...d.data() }));
            const first = !ready;
            ready = true;
            first ? setView(fromHash(), false) : refresh();
        }, er => { view.innerHTML = `<div class="card empty">${ic("alert")}<p>Gagal memuat data: ${esc(errMsg(er))}. Pastikan Firestore Rules sudah dipasang.</p></div>`; }));
        if (isAdm()) {
            unsubs.push(C.riwayat.orderBy("at", "desc").limit(300).onSnapshot(s => { RIWAYAT = s.docs.map(d => ({ id: d.id, ...d.data() })); if (ready && ["beranda", "riwayat"].includes(st.view)) refresh(); }, () => { }));
            unsubs.push(C.users.onSnapshot(s => { USERS = s.docs.map(d => ({ id: d.id, ...d.data() })); if (ready && ["pengguna"].includes(st.view)) refresh(); else renderNav(); }, () => { }));
            C.legacy.get().then(d => { const x = d.exists && d.data(); LEGACY = x && Array.isArray(x.surat) && x.surat.length ? x : null; if (ready && st.view === "beranda") refresh(); }).catch(() => { });
        }
    }

    function deny(msg) { flash = msg; auth.signOut(); }

    auth.onAuthStateChanged(async u => {
        if (!u) {
            stop();
            ME = null; ready = false; SURAT = []; RIWAYAT = []; USERS = []; LEGACY = null;
            view.innerHTML = "";
            const lb = $("#login-submit"), ll = $(".login-submit-label", lb), role = $("#role-tab").dataset.v;
            lb.disabled = false;
            lb.classList.remove("loading");
            lb.removeAttribute("aria-busy");
            ll.textContent = "Masuk sebagai " + (role === "admin" ? "Admin" : "User");
            const er = $("#login-error");
            er.textContent = flash; er.hidden = !flash; flash = "";
            $("#app-shell").hidden = true;
            $("#login-page").hidden = false;
            $("#login-password").value = "";
            if (location.hash !== "#/login") history.replaceState(null, "", "#/login");
            return;
        }
        try {
            const d = await C.users.doc(u.uid).get();
            if (!d.exists) return deny(`Akun ini belum terdaftar sebagai pengguna sistem. Hubungi admin. (UID: ${u.uid})`);
            const p = d.data();
            if (p.role !== "admin" && p.role !== "user") return deny("Peran akun tidak valid. Hubungi admin.");
            if (pendingRole && p.role !== pendingRole) return deny(`Akun ini terdaftar sebagai ${p.role === "admin" ? "Admin" : "User"}. Pilih tab "${p.role === "admin" ? "Admin" : "User"}" lalu masuk kembali.`);
            ME = { uid: u.uid, email: u.email, nama: p.nama || u.email, role: p.role };
        } catch (er) { return deny("Gagal memeriksa akun: " + errMsg(er)); }
        pendingRole = null;
        locked = false;
        closeModal();
        st.q = ""; $("#gs").value = ""; $("#sbox").classList.remove("has");
        renderMe();
        $("#login-page").hidden = true;
        $("#app-shell").hidden = false;
        if (location.hash === "#/login") history.replaceState(null, "", "#/" + home());
        renderNav();
        listen();
    });
})();
