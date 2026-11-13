const ambil = (selektor, induk = document) => induk.querySelector(selektor);
const ambilSemua = (selektor, induk = document) => [...induk.querySelectorAll(selektor)];

/* ============================================================
   DATA
   ============================================================ */

const LAPORAN_SAYA = [
    {
        id: "CMP-2026-9472",
        judul: "Pohon tumbang di depan Kebun Binatang samping Kampus ITB",
        lokasi: "Jl. Tamansari depan Kebun Binatang",
        instansi: "Dinas Pertamanan dan Hutan Kota Bandung",
        status: "Submitted",
    },
    {
        id: "CMP-2026-8841",
        judul: "PAM clean drinking water pipeline burst flooding sidewalk in front of Cipete Raya MRT",
        lokasi: "Jl. Fatmawati Raya No. 42 (depan Stasiun MRT Cipete Raya)",
        instansi: "Perumda PAM JAYA (Clean Drinking Water)",
        status: "In review",
    },
];

// ID yang dikenal di halaman Track
const ID_KASUS_DIKENAL = [
    "CMP-2026-9472",
    "CMP-2026-8841",
    "CMP-2026-8819",
    "CMP-2026-8794",
    "CMP-2026-8720",
    "CMP-2026-8650",
    "CMP-2026-8601",
];

// Kategori (halaman report-topic) -> instansi
const INSTANSI = {
    "Roads & Transit": "Dinas Bina Marga",
    "Water & Sewage": "Perumda PAM JAYA",
    "Street Lighting": "Dinas Perhubungan",
    "Sanitation & Waste": "Dinas Lingkungan Hidup",
    "Public Parks & Trees": "Dinas Pertamanan dan Hutan Kota",
    "Noise & Disturbance": "Satpol PP",
    "Building & Zoning": "Dinas Citata",
};

// Chip lokasi per kecamatan (halaman report-location)
const KECAMATAN = {
    Coblong: ["Jl. Dago", "Institut Teknologi Bandung (ITB)", "Simpang Dago", "Pasar Dago", "Jl. Ir. H. Juanda"],
    "Bandung Wetan": ["Jl. Riau (R.E. Martadinata)", "Gedung Sate", "Jl. Diponegoro", "Taman Lansia", "Jl. Cihapit"],
    Cicendo: ["Jl. Pasteur", "Stasiun Bandung", "Jl. Sukajadi", "Bandara Husein Sastranegara", "Jl. Arjuna"],
};

// Isi panel detail di halaman notifications
const NOTIFIKASI = {
    "CMP-2026-9472": {
        status: "Submitted",
        waktu: "Dispatched Oct 30, 04:41 PM GMT+7",
        judul: "Report received \u2014 verification pending",
        pesan: "Your report CMP-2026-9472 is queued for WargaReport evidence verification. Proposed bureau: Dinas Pertamanan dan Hutan Kota DKI Jakarta. The SLA countdown starts once the report is routed.",
    },
    "CMP-2026-8841": {
        status: "In review",
        waktu: "Dispatched Oct 29, 01:28 PM GMT+7",
        judul: "Status changed to In review",
        pesan: "Your report CMP-2026-8841 is now in review. Agency coordinators at Perumda PAM JAYA are assessing field safety and equipment.",
    },
};

const DASAR_LENCANA =
    "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 font-(family-name:--font-pm) text-[10px]";
const LENCANA = {
    Submitted: {
        kelas: "bg-(--bg-submitted) text-(--txt-submitted) [border:var(--bd-submitted)]",
        ikon: "assets/submitted.svg",
    },
    "In review": { kelas: "bg-(--bg-review) text-(--txt-review) [border:var(--bd-review)]", ikon: "assets/review.svg" },
};

/* ============================================================
   FUNGSI BANTU
   ============================================================ */

// localStorage dengan JSON
function simpan(kunci, nilai) {
    localStorage.setItem(kunci, JSON.stringify(nilai));
}

function muat(kunci) {
    try {
        return JSON.parse(localStorage.getItem(kunci));
    } catch {
        return null;
    }
}

// Tukar class "aktif" / "tidak aktif" pada sekelompok tombol
function setAktif(daftarTombol, tombolAktif, kelasAktif, kelasNonAktif) {
    daftarTombol.forEach(tombol => {
        const aktif = tombol === tombolAktif;
        tombol.classList.remove(...(aktif ? kelasNonAktif : kelasAktif).split(" "));
        tombol.classList.add(...(aktif ? kelasAktif : kelasNonAktif).split(" "));
    });
}

// Ubah teks tombol sebentar (untuk tanda "berhasil")
function kedipTeks(tombol, teks) {
    if (tombol.dataset.sibuk) return;
    tombol.dataset.sibuk = "1";
    const isiAsli = tombol.innerHTML;
    tombol.textContent = teks;
    setTimeout(() => {
        tombol.innerHTML = isiAsli;
        delete tombol.dataset.sibuk;
    }, 1500);
}

// Baris "tidak ada hasil" untuk daftar yang bisa difilter
function tambahBarisKosong(daftar, teks) {
    const baris = document.createElement("li");
    baris.className = "px-5 py-6 text-center text-xs text-(--disabled)";
    baris.textContent = teks;
    baris.style.display = "none";
    daftar.append(baris);
    return baris;
}

// Tombol upvote: klik = +1, klik lagi = batal
function aturUpvote(tombol) {
    if (!tombol || tombol.classList.contains("opacity-60")) return; // laporan yang sudah resolved
    const teksAngka = tombol.lastChild; // text node yang berisi angka
    let jumlah = parseInt(teksAngka.textContent.match(/\d+/)[0]);
    let sudahVote = false;

    tombol.addEventListener("click", () => {
        if (!penggunaAktif()) {
            location.hash = "signin"; // buka modal Sign In di halaman ini
            return;
        }
        sudahVote = !sudahVote;
        jumlah += sudahVote ? 1 : -1;
        teksAngka.textContent = teksAngka.textContent.replace(/\d+/, jumlah);
        tombol.classList.toggle("bg-(--light-green)", sudahVote);
        tombol.classList.toggle("bg-(--bg-secondary)", !sudahVote);
    });
}

// Draf laporan yang sedang diisi (topic -> location -> review)
function ambilDraf() {
    return muat("wr_draf") || {};
}

function perbaruiDraf(data) {
    simpan("wr_draf", { ...ambilDraf(), ...data });
}

/* ============================================================
   AKUN & SESI (disimpan di localStorage)
   Catatan: ini simulasi untuk front-end saja. Sandi disimpan apa adanya
   di browser, jadi jangan dipakai untuk akun sungguhan.
   ============================================================ */

const NAMA_HALAMAN = location.pathname.split("/").pop().replace(".html", "") || "index";

// Akun contoh supaya data demo di HTML (Fahrul Septiana) punya pemilik
const AKUN_DEMO = {
    nama: "Fahrul Septiana",
    email: "fahrul@wargareport.id",
    telepon: "+62 812-9842-1054",
    nik: "3174051809900004",
    sandi: "warga1234",
};

// Halaman yang hanya boleh dibuka setelah login
const WAJIB_MASUK = [
    "notifications",
    "report-topic",
    "report-location",
    "report-proof",
    "report-review",
    "report-receipt",
    "account-complaints",
    "account-profile",
    "account-notifications",
    "account-privacy",
    "account-security",
];

function siapkanAkunDemo() {
    if (!muat("wr_pengguna")) simpan("wr_pengguna", [AKUN_DEMO]);
}

function ambilPengguna() {
    return muat("wr_pengguna") || [];
}

// pengguna yang sedang login (atau null)
function penggunaAktif() {
    const email = localStorage.getItem("wr_sesi");
    return ambilPengguna().find(p => p.email === email) || null;
}

// profil = data pengguna tanpa sandi
function ambilProfil() {
    const pengguna = penggunaAktif();
    if (!pengguna) return null;
    const { sandi, ...profil } = pengguna;
    return profil;
}

function keluar() {
    localStorage.removeItem("wr_sesi");
}

function sandiKuat(sandi) {
    return sandi.length >= 8 && /[A-Za-z]/.test(sandi) && /\d/.test(sandi);
}

// halaman tujuan setelah login (dari ?next=...), hanya nama file .html biasa.
// Kalau tidak ada, tetap di halaman yang sekarang.
function tujuanSetelahMasuk() {
    const tujuan = new URLSearchParams(location.search).get("next");
    if (/^[\w-]+\.html$/.test(tujuan || "")) return tujuan;
    return location.pathname.split("/").pop() || "index.html";
}

// alamat index.html dengan modal Sign In terbuka (#signin) dan halaman tujuan (?next=)
function alamatLogin() {
    return `index.html?next=${NAMA_HALAMAN}.html#signin`;
}

function kirimKeLogin() {
    location.href = alamatLogin();
}

/* ============================================================
   HEADER & FOOTER (semua halaman)
   ============================================================ */

function sembunyikanTitikLonceng() {
    ambilSemua("[data-titik]").forEach(titik => titik.remove());
}

// Navbar ditulis langsung di HTML. Di sini cuma pilih tampilan:
// [data-tamu] tampil kalau belum login, [data-masuk] tampil kalau sudah login.
function aturHeader() {
    const profil = ambilProfil();
    ambilSemua("[data-tamu]").forEach(el => (el.hidden = Boolean(profil)));
    ambilSemua("[data-masuk]").forEach(el => (el.hidden = !profil));

    if (localStorage.getItem("wr_dibaca")) sembunyikanTitikLonceng();
    if (!profil) return;

    const inisial = profil.nama
        .split(" ")
        .slice(0, 2)
        .map(kata => kata[0])
        .join("")
        .toUpperCase();
    ambilSemua("[data-inisial]").forEach(el => (el.textContent = inisial));
    ambilSemua("[data-nama]").forEach(el => (el.textContent = profil.nama));
    ambilSemua("[data-email]").forEach(el => (el.textContent = profil.email));
    ambilSemua("[data-keluar]").forEach(link => link.addEventListener("click", keluar));
}

// dropdown (profil & hamburger): tutup kalau klik di luar atau klik sebuah link
function aturDropdownProfil() {
    document.addEventListener("click", e => {
        ambilSemua("header details").forEach(menu => {
            if (!menu.contains(e.target) || e.target.closest("a")) menu.open = false;
        });
    });
}

// link footer yang masih "#"
function aturLinkFooter() {
    const linkFooter = {
        "File a report": "report-topic.html",
        "Track complaint": "track.html",
        "Public reports registry": "liveFeed.html",
        "My filing history": "account-complaints.html",
        "Help & FAQs": "help.html",
    };
    ambilSemua("footer a").forEach(link => {
        const tujuan = linkFooter[link.textContent.trim()];
        if (tujuan) link.href = tujuan;
    });
}

/* ============================================================
   BERANDA (index.html)
   ============================================================ */

function siapkanBeranda() {
    ambilSemua("main article button").forEach(aturUpvote);
    ambilSemua('main article a[href="#"]').forEach(link => (link.href = "report-detail.html"));
}

/* ============================================================
   LIVE FEED (liveFeed.html)
   ============================================================ */

function siapkanFeed() {
    const daftar = ambil("main ul");
    const semuaBaris = ambilSemua("li", daftar);
    const kolomCari = ambil('input[type="search"]');
    const area = ambil('[aria-label="Filters"]');
    const tombolKategori = ambilSemua(":scope > div:nth-of-type(1) > button", area);
    const tombolStatus = ambilSemua(":scope > div:nth-of-type(2) button", area);
    const cekFoto = ambil('input[type="checkbox"]', area);
    const barisKosong = tambahBarisKosong(daftar, "No reports match your filters.");

    let kategoriDipilih = "all";
    let statusDipilih = "all";

    function terapkanFilter() {
        const kataKunci = kolomCari.value.trim().toLowerCase();
        let jumlahTampil = 0;

        semuaBaris.forEach(baris => {
            const teks = baris.textContent.toLowerCase();
            const statusBaris = ambil("span", baris).textContent.trim().toLowerCase(); // badge status

            const cocok =
                teks.includes(kataKunci) &&
                (kategoriDipilih === "all" || teks.includes(kategoriDipilih)) &&
                (statusDipilih === "all" || statusBaris === statusDipilih) &&
                (!cekFoto.checked || ambil("img", baris));

            baris.style.display = cocok ? "" : "none";
            if (cocok) jumlahTampil++;
        });

        barisKosong.style.display = jumlahTampil ? "none" : "";
    }

    const KATEGORI_AKTIF = "border-(--success) bg-(--success) text-(--light)";
    const KATEGORI_NONAKTIF = "border-(--bd-primary) bg-(--bg-secondary) text-(--disabled)";
    tombolKategori.forEach((tombol, urutan) => {
        tombol.addEventListener("click", () => {
            kategoriDipilih = urutan === 0 ? "all" : tombol.textContent.trim().toLowerCase();
            setAktif(tombolKategori, tombol, KATEGORI_AKTIF, KATEGORI_NONAKTIF);
            terapkanFilter();
        });
    });

    const STATUS_AKTIF = "bg-(--success) text-(--light)";
    const STATUS_NONAKTIF = "text-(--disabled)";
    tombolStatus.forEach((tombol, urutan) => {
        tombol.addEventListener("click", () => {
            statusDipilih = urutan === 0 ? "all" : tombol.textContent.trim().toLowerCase();
            setAktif(tombolStatus, tombol, STATUS_AKTIF, STATUS_NONAKTIF);
            terapkanFilter();
        });
    });

    kolomCari.addEventListener("input", terapkanFilter);
    cekFoto.addEventListener("change", terapkanFilter);

    ambilSemua("button", daftar).forEach(aturUpvote);
    ambilSemua('a[href="#"]', daftar).forEach(link => (link.href = "report-detail.html"));
}

/* ============================================================
   TRACK (track.html)
   ============================================================ */

function siapkanTrack() {
    const kolomId = ambil("#case-id");
    const kolomKontak = ambil("#contact");
    const tombolCari = ambil("main button");

    const idDikenal = [...ID_KASUS_DIKENAL];
    const laporanTerakhir = muat("wr_terakhir");
    if (laporanTerakhir) idDikenal.push(laporanTerakhir.id);

    const pesanError = document.createElement("p");
    pesanError.className = "text-xs text-(--txt-alert)";
    pesanError.hidden = true;
    kolomId.after(pesanError);

    function tampilkanError(pesan) {
        pesanError.textContent = pesan;
        pesanError.hidden = false;
    }

    function cariKasus() {
        const id = kolomId.value.trim().toUpperCase();
        if (!id) return tampilkanError("Please enter your complaint reference ID.");
        if (!idDikenal.includes(id)) return tampilkanError(`No case found for ${id}. Check the ID and try again.`);
        location.href = "report-detail.html";
    }

    tombolCari.addEventListener("click", cariKasus);
    [kolomId, kolomKontak].forEach(kolom => {
        kolom.addEventListener("keydown", e => {
            if (e.key === "Enter") cariKasus();
        });
    });
    kolomId.addEventListener("input", () => (pesanError.hidden = true));

    // contoh ID: klik untuk mengisi input
    ambilSemua('main section a[href="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            kolomId.value = link.textContent.match(/CMP-\d{4}-\d{4}/)[0];
            pesanError.hidden = true;
            kolomId.focus();
        });
    });
}

/* ============================================================
   NOTIFICATIONS (notifications.html)
   ============================================================ */

function siapkanNotifikasi() {
    const daftar = ambil("main ul");
    const semuaItem = ambilSemua("a", daftar);
    const panel = ambil("main section");
    const barisKosong = tambahBarisKosong(daftar, "No notifications here.");
    const KELAS_SOROT = ["border-l-2", "border-(--green)", "bg-(--light-green)"];

    // titik hijau = belum dibaca
    const belumDibaca = item => Boolean(ambil(".rounded-full", item));

    function bukaItem(item) {
        semuaItem.forEach(i => i.classList.remove(...KELAS_SOROT));
        item.classList.add(...KELAS_SOROT);
        ambil(".rounded-full", item)?.remove();

        const id = ambil("span", item).textContent.trim();
        const data = NOTIFIKASI[id];
        if (!data) return;

        const [, teksId, teksWaktu, teksPesan] = ambilSemua("p", panel);
        teksId.textContent = id;
        teksWaktu.textContent = data.waktu;
        teksPesan.textContent = data.pesan;
        ambil("h2", panel).textContent = data.judul;

        const lencana = ambil("span", panel);
        const gaya = LENCANA[data.status];
        lencana.className = `${DASAR_LENCANA} ${gaya.kelas}`;
        lencana.innerHTML = `<img src="${gaya.ikon}" alt="" class="h-3 w-3">${data.status}`;
    }

    semuaItem.forEach(item => {
        item.addEventListener("click", e => {
            e.preventDefault();
            bukaItem(item);
        });
    });

    // filter All / Unread / Status / Replies
    const FILTER = {
        All: () => true,
        Unread: belumDibaca,
        Status: item => item.textContent.includes("Status Change"),
        Replies: item => item.textContent.includes("Reply"),
    };
    const linkFilter = ambilSemua('main a[href="#"]').filter(link => link.textContent.trim() in FILTER);
    const FILTER_AKTIF = "border-(--success) bg-(--success) text-(--light)";
    const FILTER_NONAKTIF = "border-(--bd-primary) bg-(--bg-secondary) text-(--dark)";

    linkFilter.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            setAktif(linkFilter, link, FILTER_AKTIF, FILTER_NONAKTIF);

            const uji = FILTER[link.textContent.trim()];
            let jumlahTampil = 0;
            semuaItem.forEach(item => {
                const tampil = uji(item);
                item.parentElement.style.display = tampil ? "" : "none";
                if (tampil) jumlahTampil++;
            });
            barisKosong.style.display = jumlahTampil ? "none" : "";
        });
    });

    // Mark all as read
    function tandaiSemuaDibaca() {
        semuaItem.forEach(item => ambil(".rounded-full", item)?.remove());
        sembunyikanTitikLonceng();
        localStorage.setItem("wr_dibaca", "1");
    }

    const linkTandaiSemua = ambilSemua("main a").find(link => link.textContent.includes("Mark all"));
    linkTandaiSemua.addEventListener("click", e => {
        e.preventDefault();
        tandaiSemuaDibaca();
    });

    if (localStorage.getItem("wr_dibaca")) tandaiSemuaDibaca();
}

/* ============================================================
   DETAIL LAPORAN (report-detail.html)
   ============================================================ */

function siapkanDetail() {
    const semuaTombol = ambilSemua("main button");
    const tombolBagikan = semuaTombol.find(t => t.textContent.includes("Share"));
    const tombolUpvote = semuaTombol.find(t => t.textContent.includes("Upvote"));

    aturUpvote(tombolUpvote);

    // Share = salin link halaman
    tombolBagikan.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(location.href);
            kedipTeks(tombolBagikan, "Link copied");
        } catch {
            kedipTeks(tombolBagikan, "Copy failed");
        }
    });

    // Hitung mundur SLA ("18h 59m left")
    const ikonJam = ambil('main img[src$="clock.svg"]');
    const teksJam = ikonJam?.parentElement.lastChild;
    const hasil = teksJam?.textContent.match(/(\d+)h (\d+)m/);
    if (hasil) {
        const menitAwal = Number(hasil[1]) * 60 + Number(hasil[2]);
        const waktuMulai = Date.now();

        setInterval(() => {
            const menitBerlalu = Math.floor((Date.now() - waktuMulai) / 60000);
            const sisa = Math.max(0, menitAwal - menitBerlalu);
            teksJam.textContent = `${Math.floor(sisa / 60)}h ${sisa % 60}m left`;
        }, 30000);
    }
}

/* ============================================================
   FORM LAPORAN - LANGKAH 1: TOPIK (report-topic.html)
   ============================================================ */

function ambilInfoTopik(kartu) {
    const atas = ambil(".topic-card-top", kartu);
    const teksSla = ambil(".topic-card-sla", atas).textContent;
    return {
        kategori: atas.textContent.replace(teksSla, "").trim(),
        judul: ambil(".topic-card-title", kartu).textContent.trim(),
        sla: parseInt(teksSla), // "48h SLA" -> 48
    };
}

function siapkanTopik() {
    const semuaKartu = ambilSemua(".topic-card");

    function pilih(kartu) {
        semuaKartu.forEach(k => k.classList.toggle("is-selected", k === kartu));
    }

    // pulihkan pilihan sebelumnya (kalau user kembali ke langkah ini)
    const tersimpan = ambilDraf().topik;
    if (tersimpan) {
        const kartuSebelumnya = semuaKartu.find(kartu => ambilInfoTopik(kartu).judul === tersimpan.judul);
        if (kartuSebelumnya) pilih(kartuSebelumnya);
    }

    semuaKartu.forEach(kartu => kartu.addEventListener("click", () => pilih(kartu)));

    ambil("a.btn-green").addEventListener("click", () => {
        perbaruiDraf({ topik: ambilInfoTopik(ambil(".topic-card.is-selected")) });
    });
}

/* ============================================================
   FORM LAPORAN - LANGKAH 2: LOKASI (report-location.html)
   ============================================================ */

function siapkanLokasi() {
    const pilihKecamatan = ambil("#area");
    const kolomAlamat = ambil("#address");
    const barisChip = ambil(".chip-row");
    const labelChip = ambil(".field-label", barisChip.parentElement);

    function tampilkanChip() {
        labelChip.textContent = `Common areas in ${pilihKecamatan.value} \u00B7 Kota Bandung`;
        barisChip.innerHTML = "";
        KECAMATAN[pilihKecamatan.value].forEach(nama => {
            const chip = document.createElement("button");
            chip.type = "button";
            chip.className = "chip";
            chip.textContent = nama;
            barisChip.append(chip);
        });
    }

    const tersimpan = ambilDraf().lokasi;
    if (tersimpan) {
        pilihKecamatan.value = tersimpan.kecamatan;
        kolomAlamat.value = tersimpan.alamat;
    }
    tampilkanChip();

    pilihKecamatan.addEventListener("change", tampilkanChip);

    // klik chip = isi alamat
    barisChip.addEventListener("click", e => {
        const chip = e.target.closest(".chip");
        if (chip) kolomAlamat.value = chip.textContent;
    });

    ambil("a.btn-green").addEventListener("click", e => {
        if (!kolomAlamat.value.trim()) {
            e.preventDefault();
            alert("Please enter a street address, RT/RW, or landmark.");
            kolomAlamat.focus();
            return;
        }
        perbaruiDraf({ lokasi: { kecamatan: pilihKecamatan.value, alamat: kolomAlamat.value.trim() } });
    });
}

/* ============================================================
   FORM LAPORAN - LANGKAH 3: BUKTI (report-proof.html)
   ============================================================ */

function siapkanBukti() {
    const kisi = ambil(".grid-2");
    const penghitung = ambil(".file-list-header .field-label");
    const ikonHapus = ambil(".btn-ghost")?.innerHTML || "Remove"; // ikon tombol hapus dipakai ulang

    const JENIS_FILE = {
        "Capture Photo": "image/*",
        "Record Audio Memo": "audio/*",
        "Attach Video Clip": "video/*",
    };

    function perbaruiPenghitung() {
        penghitung.textContent = `Attached evidence (${ambilSemua(".file-card", kisi).length})`;
    }

    function tambahFile(file) {
        const gambar = file.type.startsWith("image/");
        const jenis = gambar ? "Image" : file.type.startsWith("audio/") ? "Audio" : "Video";
        const ukuran = (file.size / 1024 / 1024).toFixed(1);

        const pratinjau = gambar
            ? `<img class="file-preview" src="${URL.createObjectURL(file)}" alt="">`
            : '<div class="file-preview file-preview-video"><span class="play-button"></span></div>';

        const kartu = document.createElement("article");
        kartu.className = "file-card";
        kartu.innerHTML = `
      ${pratinjau}
      <div class="file-info">
        <div>
          <p class="file-name"></p>
          <p class="file-size">${jenis} &middot; ${ukuran} MB</p>
          <p class="note">Added from your device.</p>
        </div>
        <button class="btn btn-ghost" type="button">${ikonHapus}</button>
      </div>`;
        ambil(".file-name", kartu).textContent = file.name; // textContent supaya nama file aman
        kisi.append(kartu);
        perbaruiPenghitung();
    }

    // tombol Capture / Record / Attach -> buka pemilih file
    ambilSemua(".upload-box .chip").forEach(chip => {
        chip.addEventListener("click", () => {
            const pemilih = document.createElement("input");
            pemilih.type = "file";
            pemilih.accept = JENIS_FILE[chip.textContent.trim()];
            pemilih.addEventListener("change", () => {
                if (pemilih.files[0]) tambahFile(pemilih.files[0]);
            });
            pemilih.click();
        });
    });

    // tombol hapus (berlaku juga untuk file yang baru ditambah)
    kisi.addEventListener("click", e => {
        const tombol = e.target.closest(".btn-ghost");
        if (!tombol) return;
        tombol.closest(".file-card").remove();
        perbaruiPenghitung();
    });
}

/* ============================================================
   FORM LAPORAN - LANGKAH 4: REVIEW (report-review.html)
   ============================================================ */

function siapkanReview() {
    const kolomJudul = ambil("#title");
    const kolomDetail = ambil("#details");
    const kolomNama = ambil("#filer");
    const kolomEmail = ambil("#alert-email");
    const kolomTelepon = ambil("#phone");
    const petunjuk = ambil(".field-hint");
    const cekPernyataan = ambil(".checkbox-row input");
    const cekAnonim = ambil(".info-bar input");

    // isi otomatis dari halaman Profile
    const profil = ambilProfil();
    if (profil) {
        kolomNama.value = profil.nama;
        kolomEmail.value = profil.email;
        kolomTelepon.value = profil.telepon;
    }

    // penghitung karakter
    function perbaruiPetunjuk() {
        petunjuk.textContent = `${kolomDetail.value.trim().length} chars (min 15)`;
    }
    kolomDetail.addEventListener("input", perbaruiPetunjuk);
    perbaruiPetunjuk();

    ambil("button.btn-green").addEventListener("click", () => {
        if (!kolomJudul.value.trim()) return alert("Please enter a title.");
        if (kolomDetail.value.trim().length < 15) return alert("Incident details must be at least 15 characters.");
        if (!kolomNama.value.trim()) return alert("Please enter your name.");
        if (!kolomEmail.value.includes("@")) return alert("Please enter a valid email address.");
        if (!cekPernyataan.checked) return alert("Please confirm the declaration before sending.");

        const draf = ambilDraf();
        const kategori = draf.topik ? draf.topik.kategori : "Public Parks & Trees"; // sama dengan pilihan default di langkah 1
        const sekarang = new Date();

        simpan("wr_terakhir", {
            id: `CMP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            pemilik: penggunaAktif().email,
            judul: kolomJudul.value.trim(),
            detail: kolomDetail.value.trim(),
            instansi: INSTANSI[kategori],
            lokasi: draf.lokasi ? draf.lokasi.alamat : "Jl. Tamansari depan Kebun Binatang",
            sla: draf.topik ? draf.topik.sla : 48,
            anonim: cekAnonim.checked,
            tanggal: sekarang.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            jam: sekarang.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        });
        localStorage.removeItem("wr_draf");
        location.href = "report-receipt.html";
    });
}

/* ============================================================
   TANDA TERIMA (report-receipt.html)
   ============================================================ */

function siapkanTandaTerima() {
    const laporan = muat("wr_terakhir");

    if (laporan) {
        const kartu = ambil("main section");
        const [, teksId, teksInstansi] = ambilSemua(":scope > p", kartu);
        const [langkah1, langkah2] = ambilSemua("ol li p", kartu);

        teksId.textContent = laporan.id;
        ambil("h1", kartu).textContent = laporan.judul;
        teksInstansi.textContent = `${laporan.instansi} \u00B7 ${laporan.lokasi}`;
        kartu.firstElementChild.lastElementChild.textContent = `Logged ${laporan.jam}`;
        langkah1.textContent = `Your report is awaiting evidence verification. Proposed bureau: ${laporan.instansi}.`;
        langkah2.textContent = `A duty inspector will assess site urgency within the target ${laporan.sla}-hour SLA window once routed.`;
    }

    ambil("main button").addEventListener("click", () => window.print());
}

/* ============================================================
   AKUN - LAPORAN SAYA (account-complaints.html)
   ============================================================ */

function siapkanLaporanSaya() {
    const email = penggunaAktif().email;
    const badanTabel = ambil("tbody");
    const contohBaris = ambil("tr", badanTabel).cloneNode(true); // dipakai sebagai cetakan baris baru

    // baris bawaan di HTML adalah contoh milik akun demo
    if (email !== AKUN_DEMO.email) ambilSemua("tr", badanTabel).forEach(baris => baris.remove());

    // laporan yang baru dikirim = salinan cetakan dengan isi diganti
    const laporan = muat("wr_terakhir");
    if (laporan && laporan.pemilik === email) {
        const kolom = ambilSemua("td", contohBaris);
        kolom[0].textContent = laporan.id;
        ambil("a", kolom[1]).textContent = laporan.judul;
        ambil("p", kolom[1]).lastChild.textContent = laporan.lokasi;
        kolom[2].textContent = laporan.instansi;
        kolom[5].textContent = laporan.tanggal;
        badanTabel.prepend(contohBaris);
    }

    const jumlah = ambilSemua("tr", badanTabel).length;
    const teksJumlah = ambilSemua("main p").find(p => p.textContent.includes("tracked records"));
    teksJumlah.textContent = `Your tracked records (${jumlah})`;

    if (!jumlah) {
        badanTabel.innerHTML =
            '<tr><td colspan="6" class="px-5 py-6 text-center text-xs text-(--disabled)">You have not filed any complaints yet.</td></tr>';
    }
}

/* ============================================================
   AKUN - PROFIL (account-profile.html)
   ============================================================ */

function siapkanProfil() {
    const kolom = {
        nama: ambil("#full-name"),
        email: ambil("#primary-email"),
        telepon: ambil("#sms-number"),
        nik: ambil("#nik"),
    };
    const [tombolFoto, tombolSimpan] = ambilSemua("main button");
    const avatar = ambil("main span.grid");

    const tersimpan = ambilProfil();
    for (const nama in kolom) kolom[nama].value = tersimpan[nama] ?? "";

    // upload foto: hanya pratinjau (tidak disimpan)
    const pemilihFoto = document.createElement("input");
    pemilihFoto.type = "file";
    pemilihFoto.accept = "image/*";
    tombolFoto.addEventListener("click", () => pemilihFoto.click());
    pemilihFoto.addEventListener("change", () => {
        if (!pemilihFoto.files[0]) return;
        avatar.innerHTML = `<img src="${URL.createObjectURL(pemilihFoto.files[0])}" alt="" class="h-full w-full rounded-full object-cover">`;
    });

    tombolSimpan.addEventListener("click", () => {
        const profil = {
            nama: kolom.nama.value.trim(),
            email: kolom.email.value.trim(),
            telepon: kolom.telepon.value.trim(),
            nik: kolom.nik.value.trim(),
        };

        if (!profil.nama) return alert("Please enter your full name.");
        if (!profil.email.includes("@")) return alert("Please enter a valid email address.");
        if (profil.nik && !/^\d{16}$/.test(profil.nik)) return alert("NIK must be 16 digits.");

        const emailLama = penggunaAktif().email;
        const daftar = ambilPengguna();
        if (daftar.some(p => p.email === profil.email && p.email !== emailLama))
            return alert("That email is already registered.");

        simpan(
            "wr_pengguna",
            daftar.map(p => (p.email === emailLama ? { ...p, ...profil } : p)),
        );
        localStorage.setItem("wr_sesi", profil.email);
        aturHeader();
        kedipTeks(tombolSimpan, "Profile saved");
    });
}

/* ============================================================
   AKUN - NOTIFIKASI (account-notifications.html)
   ============================================================ */

function siapkanNotifikasiAkun() {
    const kotakCentang = ambilSemua('main input[type="checkbox"]');
    const tombol = ambil("main button");

    const tersimpan = muat("wr_peringatan");
    if (tersimpan) kotakCentang.forEach((kotak, i) => (kotak.checked = tersimpan[i]));

    tombol.addEventListener("click", () => {
        simpan(
            "wr_peringatan",
            kotakCentang.map(kotak => kotak.checked),
        );
        kedipTeks(tombol, "Preferences saved");
    });
}

/* ============================================================
   AKUN - PRIVASI (account-privacy.html)
   ============================================================ */

function siapkanPrivasi() {
    const tombol = ambil("main button");

    tombol.addEventListener("click", () => {
        const email = penggunaAktif().email;
        const daftarLaporan = email === AKUN_DEMO.email ? [...LAPORAN_SAYA] : [];
        const laporanTerakhir = muat("wr_terakhir");
        if (laporanTerakhir && laporanTerakhir.pemilik === email) daftarLaporan.unshift(laporanTerakhir);

        const arsip = {
            diekspor: new Date().toISOString(),
            profil: ambilProfil(),
            laporan: daftarLaporan,
        };

        const berkas = new Blob([JSON.stringify(arsip, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(berkas);
        link.download = "wargareport-case-archive.json";
        link.click();
        setTimeout(() => URL.revokeObjectURL(link.href), 1000);
    });
}

/* ============================================================
   AKUN - KEAMANAN (account-security.html)
   ============================================================ */

function siapkanKeamanan() {
    const semuaKolom = ambilSemua('main input[type="password"]');
    const [sandiLama, sandiBaru, sandiUlang] = semuaKolom;
    const tombol = ambil("main button");

    // ikon mata = tampilkan / sembunyikan password
    semuaKolom.forEach(kolom => {
        const ikonMata = kolom.nextElementSibling;
        ikonMata.addEventListener("click", () => {
            kolom.type = kolom.type === "password" ? "text" : "password";
        });
    });

    tombol.addEventListener("click", () => {
        const pengguna = penggunaAktif();
        if (sandiLama.value !== pengguna.sandi) return alert("Current password is incorrect.");
        if (!sandiKuat(sandiBaru.value)) {
            return alert("New password needs at least 8 characters, including a letter and a number.");
        }
        if (sandiBaru.value === sandiLama.value) return alert("New password must be different from the current one.");
        if (sandiBaru.value !== sandiUlang.value) return alert("New passwords do not match.");

        simpan(
            "wr_pengguna",
            ambilPengguna().map(p => (p.email === pengguna.email ? { ...p, sandi: sandiBaru.value } : p)),
        );
        semuaKolom.forEach(kolom => (kolom.value = ""));
        kedipTeks(tombol, "Password updated");
    });
}

/* ============================================================
   MODAL SIGN IN & REGISTER (disuntik ke semua halaman kalau belum login)
   Dibuka lewat hash di URL: #signin, #register. Hash lain (#close) = tutup.
   ============================================================ */

const KELAS_INPUT =
    "w-full rounded-xl border border-(--bd-primary) bg-(--bg-secondary) px-4 py-3 text-sm text-(--dark) placeholder:text-(--disabled2) focus:border-(--green) focus:outline-none focus:ring-4 focus:ring-(--green-20)";
const TOMBOL_MODAL =
    "inline-flex w-full items-center justify-center gap-1.75 rounded-full border border-(--success) bg-(--success) px-6 py-3.5 text-[15px] font-semibold text-(--light)";

function kolomModal(id, label, tipe, placeholder, kelasTambahan = "") {
    return `
        <div class="flex flex-col gap-1.5">
            <label for="${id}" class="font-(family-name:--font-pm) text-[10px] uppercase tracking-wider text-(--dark)">${label}</label>
            <input id="${id}" type="${tipe}" placeholder="${placeholder}" class="${KELAS_INPUT} ${kelasTambahan}">
        </div>`;
}

function kerangkaModal(id, judul, deskripsi, isi) {
    const tabAktif = "bg-(--success) text-(--light)";
    const tabBiasa = "bg-(--bg-submitted) text-(--dark)";
    return `
    <div id="${id}" data-modal class="fixed inset-0 z-50 hidden overflow-y-auto bg-(--dark-70) p-4">
        <a href="#close" aria-label="Close" class="fixed inset-0"></a>
        <div role="dialog" aria-labelledby="${id}-title" class="relative m-auto w-full max-w-135 overflow-hidden rounded-[18px] border border-(--bd-secondary) bg-(--bg-secondary) shadow-2xl">
            <div class="flex items-start justify-between gap-4 border-b border-(--bd-secondary) px-5.5 pb-4 pt-5">
                <div>
                    <h2 id="${id}-title" class="font-(family-name:--font-f) text-xl font-semibold">${judul}</h2>
                    <p class="text-xs leading-relaxed text-(--disabled)">${deskripsi}</p>
                </div>
                <a href="#close" aria-label="Close" class="text-2xl leading-none text-(--disabled)">&times;</a>
            </div>
            <div class="grid grid-cols-2 gap-2.5 border-b border-(--bd-secondary) px-5.5 py-3.5">
                <a href="#signin" class="block rounded-full px-4 py-3 text-center text-[13px] font-semibold ${id === "signin" ? tabAktif : tabBiasa}">Sign In Existing Account</a>
                <a href="#register" class="block rounded-full px-4 py-3 text-center text-[13px] font-semibold ${id === "register" ? tabAktif : tabBiasa}">Register as Citizen</a>
            </div>
            <div class="flex flex-col gap-4 px-5.5 pb-5.5 pt-4.5">${isi}</div>
        </div>
    </div>`;
}

// tampilkan modal yang id-nya sama dengan hash di URL
function tampilkanModalSesuaiHash() {
    ambilSemua("[data-modal]").forEach(modal => {
        const buka = `#${modal.id}` === location.hash;
        modal.classList.toggle("hidden", !buka);
        modal.classList.toggle("flex", buka);
    });
}

function siapkanModal() {
    const modalMasuk = kerangkaModal(
        "signin",
        "Sign In to WargaReport",
        "Sign in to lodge a complaint or upvote issues.",
        `${kolomModal("signin-email", "Email Address", "email", "Enter your Email")}
        ${kolomModal("signin-password", "Password", "password", "Enter your password")}
        <button type="button" class="${TOMBOL_MODAL}">Sign In</button>`,
    );
    const modalDaftar = kerangkaModal(
        "register",
        "Register Citizen Account",
        "Create an account to lodge a complaint or upvote issues.",
        `${kolomModal("reg-name", "Full Name (Nama Lengkap) *", "text", "e.g. Budi Santoso")}
        <div class="grid gap-3 sm:grid-cols-2">
            ${kolomModal("reg-email", "Email Address *", "email", "e.g. budi@wargareport.id")}
            ${kolomModal("reg-phone", "Phone / WhatsApp *", "tel", "+62 812 ...")}
        </div>
        ${kolomModal("reg-nik", "NIK", "text", "16 digits for verified resident badge", "font-(family-name:--font-pm) text-[13px]")}
        <p class="-mt-2 text-[10.5px] text-(--disabled)">Used exclusively for verification under UU PDP and never shown to the public.</p>
        ${kolomModal("reg-password", "Password *", "password", "Create a password")}
        <button type="button" class="${TOMBOL_MODAL}">Create Account &amp; Continue</button>`,
    );
    document.body.insertAdjacentHTML("beforeend", modalMasuk + modalDaftar);

    siapkanModalMasuk();
    siapkanModalDaftar();

    window.addEventListener("hashchange", tampilkanModalSesuaiHash);
    tampilkanModalSesuaiHash();
}

// Pesan error kecil di atas tombol modal; hilang saat user mengetik lagi
function siapkanPesanError(modal, tombol) {
    const pesan = document.createElement("p");
    pesan.className = "text-xs text-(--txt-alert)";
    pesan.hidden = true;
    tombol.before(pesan);

    modal.addEventListener("input", () => (pesan.hidden = true));
    modal.addEventListener("keydown", e => {
        if (e.key === "Enter") tombol.click();
    });

    return teks => {
        pesan.textContent = teks;
        pesan.hidden = false;
    };
}

function siapkanModalMasuk() {
    const modal = ambil("#signin");
    const tombol = ambil("button", modal);
    const tampilkanError = siapkanPesanError(modal, tombol);

    tombol.addEventListener("click", () => {
        const email = ambil("#signin-email").value.trim().toLowerCase();
        const sandi = ambil("#signin-password").value;

        const pengguna = ambilPengguna().find(p => p.email === email && p.sandi === sandi);
        if (!pengguna) return tampilkanError("Incorrect email or password.");

        localStorage.setItem("wr_sesi", pengguna.email);
        location.href = tujuanSetelahMasuk();
    });
}

function siapkanModalDaftar() {
    const modal = ambil("#register");
    const tombol = ambil("button", modal);
    const tampilkanError = siapkanPesanError(modal, tombol);

    tombol.addEventListener("click", () => {
        const nama = ambil("#reg-name").value.trim();
        const email = ambil("#reg-email").value.trim().toLowerCase();
        const telepon = ambil("#reg-phone").value.trim();
        const nik = ambil("#reg-nik").value.trim();
        const sandi = ambil("#reg-password").value;
        const daftar = ambilPengguna();

        if (!nama) return tampilkanError("Please enter your full name.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return tampilkanError("Please enter a valid email address.");
        if (daftar.some(p => p.email === email)) return tampilkanError("That email is already registered.");
        if (!telepon) return tampilkanError("Please enter your phone / WhatsApp number.");
        if (nik && !/^\d{16}$/.test(nik)) return tampilkanError("NIK must be 16 digits.");
        if (!sandiKuat(sandi))
            return tampilkanError("Password needs at least 8 characters, including a letter and a number.");

        simpan("wr_pengguna", [...daftar, { nama, email, telepon, nik, sandi }]);
        localStorage.setItem("wr_sesi", email); // langsung login
        location.href = tujuanSetelahMasuk();
    });
}

/* ============================================================
   JALANKAN SESUAI HALAMAN
   (help.html tidak butuh script: FAQ sudah pakai <details>)
   ============================================================ */

const HALAMAN = {
    index: siapkanBeranda,
    liveFeed: siapkanFeed,
    track: siapkanTrack,
    notifications: siapkanNotifikasi,
    "report-detail": siapkanDetail,
    "report-topic": siapkanTopik,
    "report-location": siapkanLokasi,
    "report-proof": siapkanBukti,
    "report-review": siapkanReview,
    "report-receipt": siapkanTandaTerima,
    "account-complaints": siapkanLaporanSaya,
    "account-profile": siapkanProfil,
    "account-notifications": siapkanNotifikasiAkun,
    "account-privacy": siapkanPrivasi,
    "account-security": siapkanKeamanan,
};

document.addEventListener("DOMContentLoaded", () => {
    siapkanAkunDemo();

    // halaman akun wajib login
    if (WAJIB_MASUK.includes(NAMA_HALAMAN) && !penggunaAktif()) return kirimKeLogin();

    aturHeader();
    aturDropdownProfil();
    aturLinkFooter();
    if (!penggunaAktif()) siapkanModal(); // modal Sign In / Register di semua halaman
    if (HALAMAN[NAMA_HALAMAN]) HALAMAN[NAMA_HALAMAN]();
});