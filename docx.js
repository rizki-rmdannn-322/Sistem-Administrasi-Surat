/* DocxLite - pembuat file .docx langsung di browser (tanpa library, tanpa internet).
 *
 * Tampilan dokumen mengikuti format surat resmi kampus:
 *   kop surat (logo + nama + alamat) -> Nomor / Lampiran / Perihal + tanggal ->
 *   Kepada Yth. -> salam -> isi -> penutup -> tanda tangan -> catatan agenda.
 *
 * Pemakaian (kompatibel dengan kode lama):
 *   var blob = DocxLite.build(d);                 // langsung (pakai logo yang sudah termuat)
 *   var blob = await DocxLite.buildAsync(d);      // menunggu logo termuat dulu (disarankan)
 *
 * d = { jenis, tanggal, nomor, lembaga, org, isi, oleh, dicatat, cetak }
 *   - tanggal boleh "YYYY-MM-DD" atau "DD-MM-YYYY"
 *   - isi: baris pertama = Perihal. Baris berikutnya (jika ada) = paragraf isi surat.
 */
(function (root) {
  "use strict";
  var MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  var enc = new TextEncoder();

  /* ====== PENGATURAN LOGO / KOP ======
   * UNISA_LOGO  : logo kampus (file yang sudah ada di repo).
   * LOGO_LEMBAGA: logo instansi lain. Taruh file logonya di folder "logos/" lalu tambahkan baris di sini.
   *   cocok = pola nama lembaga (tidak peka huruf besar/kecil), file = lokasi logo.
   *   Jika file tidak ada, surat tetap dibuat tanpa logo (hanya nama instansi).
   */
  var UNISA_LOGO = "logo unisa.png.jpg";
  var LOGO_LEMBAGA = [
    { cocok: /smk\s*pertiwi/i, file: "logos/smk-pertiwi.png" }
    // { cocok: /dinas\s*pendidikan/i, file: "logos/disdik.png" },
  ];
  var UNISA_POLA = /unisa|al-?ihya/i;
  var KAMPUS = {
    arab: "جامعة الإحياء الإسلامية كونجان",
    nama: "UNIVERSITAS ISLAM AL-IHYA KUNINGAN",
    alamat: [
      "Alamat:  Kampus 1 Jl. Mayasih No. 11 Kel. Cigugur Kuningan Telp./Fax. (0232) 873186",
      "Kampus 2 Jl. Cut Nyak Dien No. 38 Kuningan",
      "Kampus 3 Jl. Siliwangi KM. 15 Ciawigebang Kuningan"
    ],
    status: "Status: Terakreditasi BAIK nomor : 274/SK/BAN-PT/Ak-PKP/PT/V/2020"
  };

  /* ---------- CRC32 + ZIP tanpa kompresi ---------- */
  var CRC = (function () {
    var t = new Uint32Array(256);
    for (var n = 0; n < 256; n++) {
      var c = n;
      for (var k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      t[n] = c >>> 0;
    }
    return t;
  })();
  function crc32(b) {
    var c = 0xFFFFFFFF;
    for (var i = 0; i < b.length; i++) c = CRC[(c ^ b[i]) & 255] ^ (c >>> 8);
    return (c ^ 0xFFFFFFFF) >>> 0;
  }
  function zip(files) {
    var parts = [], central = [], off = 0, d = new Date();
    var tm = (d.getHours() << 11) | (d.getMinutes() << 5) | (d.getSeconds() >> 1);
    var dt = ((d.getFullYear() - 1980) << 9) | ((d.getMonth() + 1) << 5) | d.getDate();
    files.forEach(function (f) {
      var name = enc.encode(f.name);
      var data = typeof f.data === "string" ? enc.encode(f.data) : f.data;
      var crc = crc32(data), size = data.length;
      var lh = new DataView(new ArrayBuffer(30));
      lh.setUint32(0, 0x04034b50, true); lh.setUint16(4, 20, true); lh.setUint16(6, 0x0800, true);
      lh.setUint16(10, tm, true); lh.setUint16(12, dt, true); lh.setUint32(14, crc, true);
      lh.setUint32(18, size, true); lh.setUint32(22, size, true); lh.setUint16(26, name.length, true);
      parts.push(new Uint8Array(lh.buffer), name, data);
      var ch = new DataView(new ArrayBuffer(46));
      ch.setUint32(0, 0x02014b50, true); ch.setUint16(4, 20, true); ch.setUint16(6, 20, true); ch.setUint16(8, 0x0800, true);
      ch.setUint16(12, tm, true); ch.setUint16(14, dt, true); ch.setUint32(16, crc, true);
      ch.setUint32(20, size, true); ch.setUint32(24, size, true); ch.setUint16(28, name.length, true);
      ch.setUint32(42, off, true);
      central.push(new Uint8Array(ch.buffer), name);
      off += 30 + name.length + size;
    });
    var csize = 0;
    central.forEach(function (c) { csize += c.length; });
    var end = new DataView(new ArrayBuffer(22));
    end.setUint32(0, 0x06054b50, true); end.setUint16(8, files.length, true); end.setUint16(10, files.length, true);
    end.setUint32(12, csize, true); end.setUint32(16, off, true);
    return new Blob(parts.concat(central, [new Uint8Array(end.buffer)]), { type: MIME });
  }

  /* ---------- Logo: deteksi, muat, cache ---------- */
  function detect(u) {
    if (!u || u.length < 24) return null;
    if (u[0] === 0x89 && u[1] === 0x50 && u[2] === 0x4E && u[3] === 0x47) {
      return {
        ext: "png",
        w: ((u[16] << 24) | (u[17] << 16) | (u[18] << 8) | u[19]) >>> 0,
        h: ((u[20] << 24) | (u[21] << 16) | (u[22] << 8) | u[23]) >>> 0
      };
    }
    if (u[0] === 0xFF && u[1] === 0xD8) {
      var i = 2;
      while (i + 9 < u.length) {
        if (u[i] !== 0xFF) { i++; continue; }
        var m = u[i + 1];
        if (m === 0xFF) { i++; continue; }
        if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
        if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) {
          return { ext: "jpeg", h: (u[i + 5] << 8) | u[i + 6], w: (u[i + 7] << 8) | u[i + 8] };
        }
        i += 2 + ((u[i + 2] << 8) | u[i + 3]);
      }
    }
    return null;
  }
  var cache = {};
  function setLogo(url, bytes) {
    var im = detect(bytes);
    cache[url] = im && im.w && im.h ? { data: bytes, ext: im.ext, w: im.w, h: im.h } : null;
  }
  function load(url) {
    if (!url) return Promise.resolve(null);
    if (cache[url] !== undefined) return Promise.resolve(cache[url]);
    if (typeof fetch !== "function") return Promise.resolve(null);
    return fetch(encodeURI(url))
      .then(function (r) { if (!r.ok) throw new Error("x"); return r.arrayBuffer(); })
      .then(function (b) { setLogo(url, new Uint8Array(b)); return cache[url]; })
      .catch(function () { cache[url] = null; return null; });
  }
  function preload() {
    return Promise.all([UNISA_LOGO].concat(LOGO_LEMBAGA.map(function (l) { return l.file; })).map(load));
  }

  /* ---------- Helper teks / tanggal ---------- */
  var BLN = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
  function longDate(s) {
    s = String(s || "").trim();
    var m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/), y, mo, da;
    if (m) { y = +m[1]; mo = +m[2]; da = +m[3]; }
    else if ((m = s.match(/^(\d{1,2})-(\d{1,2})-(\d{4})/))) { da = +m[1]; mo = +m[2]; y = +m[3]; }
    else return s;
    return da + " " + (BLN[mo - 1] || "") + " " + y;
  }
  var kosong = function (v) { v = String(v == null ? "" : v).trim(); return !v || /^[-–—]+$/.test(v); };

  /* ---------- WordprocessingML ---------- */
  function x(s) {
    return String(s == null ? "" : s)
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function run(t, o) {
    o = o || {};
    var f = o.font ? '<w:rFonts w:ascii="' + o.font + '" w:hAnsi="' + o.font + '" w:cs="' + o.font + '" w:eastAsia="' + o.font + '"/>' : "";
    var pr = f + (o.b ? "<w:b/><w:bCs/>" : "") + (o.i ? "<w:i/><w:iCs/>" : "") +
      (o.color ? '<w:color w:val="' + o.color + '"/>' : "") +
      (o.sz ? '<w:sz w:val="' + o.sz + '"/><w:szCs w:val="' + o.sz + '"/>' : "") +
      (o.u ? '<w:u w:val="single"/>' : "") + (o.rtl ? "<w:rtl/>" : "");
    var lines = String(t == null ? "" : t).split(/\r?\n/);
    return lines.map(function (l, i) {
      var segs = l.split("\t").map(function (s) {
        return '<w:t xml:space="preserve">' + x(s) + "</w:t>";
      }).join("<w:tab/>");
      return "<w:r><w:rPr>" + pr + "</w:rPr>" + (i ? "<w:br/>" : "") + segs + "</w:r>";
    }).join("");
  }
  function para(runs, o) {
    o = o || {};
    var pr = (o.keep ? "<w:keepNext/>" : "") +
      (o.border ? '<w:pBdr><w:bottom w:val="single" w:sz="' + o.border + '" w:space="4" w:color="000000"/></w:pBdr>' : "") +
      (o.tabs ? "<w:tabs>" + o.tabs.map(function (t) { return '<w:tab w:val="' + t[0] + '" w:pos="' + t[1] + '"/>'; }).join("") + "</w:tabs>" : "") +
      '<w:spacing w:before="' + (o.before || 0) + '" w:after="' + (o.after || 0) + '" w:line="' + (o.line || 252) + '" w:lineRule="auto"/>' +
      (o.left || o.hanging ? '<w:ind w:left="' + (o.left || 0) + '"' + (o.hanging ? ' w:hanging="' + o.hanging + '"' : "") + "/>" : "") +
      (o.jc ? '<w:jc w:val="' + o.jc + '"/>' : "");
    return "<w:p><w:pPr>" + pr + "</w:pPr>" + (runs || "") + "</w:p>";
  }
  function noBorders() {
    return "<w:tblBorders>" + ["top", "left", "bottom", "right", "insideH", "insideV"].map(function (s) {
      return "<w:" + s + ' w:val="nil"/>';
    }).join("") + "</w:tblBorders>";
  }
  function drawing(img, id) {
    var h = 936000, w = Math.round(h * img.w / img.h);
    if (w > 1000000) { w = 1000000; h = Math.round(w * img.h / img.w); }
    return '<w:r><w:drawing><wp:inline distT="0" distB="0" distL="0" distR="0"><wp:extent cx="' + w + '" cy="' + h + '"/>' +
      '<wp:docPr id="' + id + '" name="Logo ' + id + '"/><wp:cNvGraphicFramePr><a:graphicFrameLocks noChangeAspect="1"/></wp:cNvGraphicFramePr>' +
      '<a:graphic><a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture"><pic:pic>' +
      '<pic:nvPicPr><pic:cNvPr id="' + id + '" name="logo' + id + '"/><pic:cNvPicPr/></pic:nvPicPr>' +
      '<pic:blipFill><a:blip r:embed="rIdLogo"/><a:stretch><a:fillRect/></a:stretch></pic:blipFill>' +
      '<pic:spPr><a:xfrm><a:off x="0" y="0"/><a:ext cx="' + w + '" cy="' + h + '"/></a:xfrm><a:prstGeom prst="rect"><a:avLst/></a:prstGeom></pic:spPr>' +
      "</pic:pic></a:graphicData></a:graphic></wp:inline></w:drawing></w:r>";
  }

  /* Tentukan kop & logo untuk sebuah surat */
  function pilih(d) {
    var lemb = String(d.lembaga || "");
    var masuk = d.jenis === "Masuk";
    // Surat keluar = surat UNISA. Surat masuk dari UNISA sendiri juga memakai kop UNISA.
    if (!masuk || UNISA_POLA.test(lemb)) return { unisa: true, logo: UNISA_LOGO };
    for (var i = 0; i < LOGO_LEMBAGA.length; i++) {
      if (LOGO_LEMBAGA[i].cocok.test(lemb)) return { unisa: false, logo: LOGO_LEMBAGA[i].file };
    }
    return { unisa: false, logo: null };
  }

  /* Kop surat */
  function kop(d, p, img) {
    var NAVY = "1B2A6B", teks;
    if (p.unisa) {
      teks =
        para(run(KAMPUS.arab, { font: "Traditional Arabic", b: true, sz: 40, color: NAVY, rtl: true }), { jc: "center", line: 240 }) +
        para(run(KAMPUS.nama, { font: "Arial", sz: 38, color: NAVY }), { jc: "center", line: 240, after: 40 }) +
        KAMPUS.alamat.map(function (a, i) {
          return para(run(a, { font: "Arial", sz: 16, color: NAVY }), { jc: "center", line: 240 });
        }).join("") +
        para(run(KAMPUS.status, { font: "Arial", sz: 15, b: true, i: true, color: "000000" }), { jc: "center", line: 240, after: 20, border: 36 });
    } else {
      var nama = String(d.lembaga || "").trim().toUpperCase();
      teks =
        para(run(nama || "-", { font: "Times New Roman", b: true, sz: 34, color: NAVY }), { jc: "center", line: 240, before: 120, after: 160, border: 36 });
    }
    if (!img) return teks;
    return '<w:tbl><w:tblPr><w:tblW w:w="9638" w:type="dxa"/>' + noBorders() + '<w:tblLayout w:type="fixed"/>' +
      '<w:tblCellMar><w:left w:w="0" w:type="dxa"/><w:right w:w="0" w:type="dxa"/></w:tblCellMar></w:tblPr>' +
      '<w:tblGrid><w:gridCol w:w="1700"/><w:gridCol w:w="7938"/></w:tblGrid><w:tr>' +
      '<w:tc><w:tcPr><w:tcW w:w="1700" w:type="dxa"/><w:vAlign w:val="top"/></w:tcPr>' + para(drawing(img, 1), { line: 240 }) + "</w:tc>" +
      '<w:tc><w:tcPr><w:tcW w:w="7938" w:type="dxa"/><w:vAlign w:val="center"/></w:tcPr>' + teks + "</w:tc></w:tr></w:tbl>";
  }

  /* Pecah isi: baris pertama = perihal, sisanya = paragraf isi */
  function pecahIsi(isi) {
    var L = String(isi || "").split(/\r?\n/).map(function (s) { return s.trim(); }).filter(Boolean);
    return { perihal: L[0] || "-", badan: L.slice(1) };
  }

  /**
   * Bangun dokumen .docx. Mengembalikan Blob.
   */
  function build(d) {
    var masuk = d.jenis === "Masuk";
    var p = pilih(d);
    var img = p.logo ? (cache[p.logo] || null) : null;
    var isi = pecahIsi(d.isi);
    var tgl = longDate(d.tanggalIso || d.tanggal);
    var LEFT = 680, FS = 24;
    var T = function (s, o) { o = o || {}; o.font = "Times New Roman"; o.sz = o.sz || FS; return run(s, o); };

    // --- Penerima ---
    var penerima = [];
    if (masuk) {
      penerima = ["Pimpinan Universitas Islam Al-Ihya Kuningan"];
    } else {
      if (!kosong(d.org)) penerima.push(d.org);
      if (!kosong(d.lembaga)) penerima.push(d.lembaga);
      if (!penerima.length) penerima = ["Bapak/Ibu yang bersangkutan"];
    }

    // --- Isi surat ---
    var badan = isi.badan.length ? isi.badan : [
      "Dengan hormat, bersama surat ini kami sampaikan surat perihal " + isi.perihal + "."
    ];
    var body =
      kop(d, p, img) +
      para(T("Nomor") + T("\t: " + (kosong(d.nomor) ? "-" : d.nomor)) + T("\tKuningan, " + tgl),
        { tabs: [["left", 1300], ["right", 9638]], before: 120, line: 276 }) +
      para(T("Lampiran") + T("\t: -"), { tabs: [["left", 1300]], line: 276 }) +
      para(T("Perihal") + T("\t: ") + T(isi.perihal, { b: true }), { tabs: [["left", 1300]], left: 1300, hanging: 1300, line: 276, after: 360 }) +
      para(T("Kepada Yth."), { left: LEFT, line: 276 }) +
      penerima.map(function (n) { return para(T(n, { b: true }), { left: LEFT, line: 276 }); }).join("") +
      para(T("di"), { left: LEFT, line: 276 }) +
      para(T("Tempat"), { left: LEFT + 450, line: 276, after: 280 }) +
      para(T("Assalamu’alaikum wr. wb."), { left: LEFT, line: 276, after: 200 }) +
      badan.map(function (b) { return para(T(b), { left: LEFT, jc: "both", line: 360, after: 160 }); }).join("") +
      para(T("Demikian surat ini kami sampaikan untuk dapat diperhatikan dan dipersiapkan sebagaimana mestinya. Atas perhatian dan kerja samanya kami ucapkan terima kasih."),
        { left: LEFT, jc: "both", line: 360, after: 200 }) +
      para(T("Wassalamu’alaikum wr. wb."), { left: LEFT, line: 276, after: 200, keep: true }) +
      // Tanda tangan
      para(T("Hormat kami,"), { left: 5800, line: 276, keep: true }) +
      para(T(masuk ? (d.lembaga || "") : "Universitas Islam Al-Ihya Kuningan", { b: true }), { left: 5800, line: 276, after: 1000, keep: true }) +
      para(T(masuk && !kosong(d.org) ? "(" + d.org + ")" : "(______________________________)", { u: false }), { left: 5800, line: 276, after: 360 });

    // --- Catatan agenda (ringkas, dari sistem) ---
    var rowC = function (l, v) {
      return "<w:tr>" +
        '<w:tc><w:tcPr><w:tcW w:w="2200" w:type="dxa"/></w:tcPr>' + para(run(l, { font: "Arial", sz: 17, color: "1B2A6B", b: true }), { line: 240 }) + "</w:tc>" +
        '<w:tc><w:tcPr><w:tcW w:w="7438" w:type="dxa"/></w:tcPr>' + para(run(": " + (v || "-"), { font: "Arial", sz: 17 }), { line: 240 }) + "</w:tc></w:tr>";
    };
    var catatan =
      '<w:tbl><w:tblPr><w:tblW w:w="9638" w:type="dxa"/><w:tblBorders>' +
      ["top", "left", "bottom", "right"].map(function (s) { return "<w:" + s + ' w:val="single" w:sz="4" w:space="0" w:color="B8C4DE"/>'; }).join("") +
      '</w:tblBorders><w:shd w:val="clear" w:color="auto" w:fill="F1F5FD"/><w:tblLayout w:type="fixed"/>' +
      '<w:tblCellMar><w:top w:w="40" w:type="dxa"/><w:left w:w="140" w:type="dxa"/><w:bottom w:w="40" w:type="dxa"/><w:right w:w="140" w:type="dxa"/></w:tblCellMar></w:tblPr>' +
      '<w:tblGrid><w:gridCol w:w="2200"/><w:gridCol w:w="7438"/></w:tblGrid>' +
      rowC("CATATAN AGENDA", "Surat " + d.jenis + " • Buku Agenda Surat UNISA Kuningan") +
      rowC("Nomor Agenda", d.nomor) +
      rowC("Dicatat oleh", d.oleh) +
      rowC("Dicatat pada", d.dicatat) +
      "</w:tbl>" +
      para(run("Dokumen ini dihasilkan otomatis oleh Sistem Administrasi Buku Agenda Surat UNISA Kuningan" + (d.cetak ? " • dicetak " + d.cetak : "") + ".",
        { font: "Arial", i: true, color: "8993A5", sz: 15 }), { jc: "center", before: 120 });

    var NS = 'xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" ' +
      'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships" ' +
      'xmlns:wp="http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing" ' +
      'xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" ' +
      'xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture"';
    var HEAD = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
    var REL = "http://schemas.openxmlformats.org/officeDocument/2006/relationships/";
    var files = [
      { name: "[Content_Types].xml", data: HEAD + '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>' +
        (img ? '<Default Extension="' + img.ext + '" ContentType="image/' + img.ext + '"/>' : "") +
        '<Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/word/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/></Types>' },
      { name: "_rels/.rels", data: HEAD + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="' + REL + 'officeDocument" Target="word/document.xml"/></Relationships>' },
      { name: "word/_rels/document.xml.rels", data: HEAD + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="' + REL + 'styles" Target="styles.xml"/>' +
        (img ? '<Relationship Id="rIdLogo" Type="' + REL + 'image" Target="media/logo.' + img.ext + '"/>' : "") + "</Relationships>" },
      { name: "word/styles.xml", data: HEAD + '<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:docDefaults><w:rPrDefault><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman" w:eastAsia="Times New Roman" w:cs="Times New Roman"/><w:sz w:val="24"/><w:szCs w:val="24"/><w:lang w:val="id-ID"/></w:rPr></w:rPrDefault></w:docDefaults><w:style w:type="paragraph" w:default="1" w:styleId="Normal"><w:name w:val="Normal"/></w:style></w:styles>' },
      { name: "word/document.xml", data: HEAD + "<w:document " + NS + "><w:body>" + body + para("", { after: 120 }) + catatan +
        '<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="850" w:right="1134" w:bottom="850" w:left="1134" w:header="567" w:footer="567" w:gutter="0"/></w:sectPr></w:body></w:document>' }
    ];
    if (img) files.push({ name: "word/media/logo." + img.ext, data: img.data });
    return zip(files);
  }

  /** Sama seperti build(), tetapi menunggu logo selesai dimuat dulu. */
  function buildAsync(d) {
    return load(pilih(d).logo).then(function () { return build(d); });
  }

  root.DocxLite = { build: build, buildAsync: buildAsync, preload: preload, setLogo: setLogo, MIME: MIME };
  if (typeof module !== "undefined") module.exports = root.DocxLite;
  if (typeof window !== "undefined") preload();
})(typeof window !== "undefined" ? window : globalThis);
