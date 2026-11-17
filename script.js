const ambil = (selektor, induk = document) => induk.querySelector(selektor);
const ambilSemua = (selektor, induk = document) => [...induk.querySelectorAll(selektor)];

const KASUS = {
    "CMP-2026-9472": {
        judul: "Pohon tumbang di depan Kebun Binatang samping Kampus ITB",
        lokasi: "Jl. Tamansari depan Kebun Binatang",
        wilayah: "Coblong, Kota Bandung",
        instansi: "Dinas Pertamanan dan Hutan Kota Bandung",
        kategori: "Public Parks & Trees",
        suara: 0,
    },
    "CMP-2026-8841": {
        judul: "PAM clean drinking water pipeline burst flooding sidewalk in front of Cipete Raya MRT",
        lokasi: "Jl. Fatmawati Raya No. 42 (depan Stasiun MRT Cipete Raya)",
        wilayah: "Cilandak Barat, Jakarta Selatan",
        instansi: "Perumda PAM JAYA (Clean Drinking Water)",
        kategori: "Water & Sewage",
        suara: 148,
    },
    "CMP-2026-8819": {
        judul: "Severe 15cm asphalt cavity in TransJakarta corridor causing motorbike rim damage",
        lokasi: "Jl. Gatot Subroto Kav. 38 (depan Menara Mulia, Jalur TransJakarta)",
        wilayah: "Setiabudi, Jakarta Selatan",
        instansi: "Dinas Bina Marga DKI Jakarta (Roads & Sidewalks)",
        kategori: "Roads & Transit",
        suara: 92,
    },
    "CMP-2026-8794": {
        judul: "Complete PJU streetlight outage spanning 300 meters along residential corridor",
        lokasi: "Jl. Tebet Barat Dalam Raya No. 24, RT 08 / RW 03",
        wilayah: "Tebet, Jakarta Selatan",
        instansi: "Dinas Perhubungan DKI Jakarta (PJU & Traffic)",
        kategori: "Street Lighting",
        suara: 64,
    },
    "CMP-2026-8720": {
        judul: "Illegal household trash accumulation obstructing drainage at Kali Krukut Kemang",
        lokasi: "Kampung Kemang, RT 02 / RW 01 (bantaran Kali Krukut)",
        wilayah: "Mampang Prapatan, Jakarta Selatan",
        instansi: "Dinas Lingkungan Hidup DKI Jakarta (Waste & Rivers)",
        kategori: "Sanitation & Waste",
        suara: 78,
    },
    "CMP-2026-8650": {
        judul: "Hazardous decayed Trembesi tree limb at risk of collapse over walking path",
        lokasi: "Taman Suropati (sisi timur, dekat patung ASEAN)",
        wilayah: "Menteng, Jakarta Pusat",
        instansi: "Dinas Pertamanan dan Hutan Kota DKI Jakarta",
        kategori: "Public Parks & Trees",
        suara: 45,
    },
    "CMP-2026-8601": {
        judul: "Heavy excavation equipment operating past 22:00 WIB in residential alley",
        lokasi: "Jl. Senopati No. 18, RT 06 / RW 02",
        wilayah: "Kebayoran Baru, Jakarta Selatan",
        instansi: "Satpol PP Provinsi DKI Jakarta (Public Order)",
        kategori: "Noise & Disturbance",
        suara: 39,
    },
};

const KASUS_AKUN_DEMO = ["CMP-2026-9472", "CMP-2026-8841"];

const INSTANSI = {
    "Roads & Transit": "Dinas Bina Marga",
    "Water & Sewage": "Perumda PAM JAYA",
    "Street Lighting": "Dinas Perhubungan",
    "Sanitation & Waste": "Dinas Lingkungan Hidup",
    "Public Parks & Trees": "Dinas Pertamanan dan Hutan Kota",
    "Noise & Disturbance": "Satpol PP",
    "Building & Zoning": "Citata",
};

const JALAN_UMUM = {
    Coblong: ["Jl. Dago", "Institut Teknologi Bandung (ITB)", "Simpang Dago", "Pasar Dago", "Jl. Ir. H. Juanda"],
    "Bandung Wetan": ["Jl. Diponegoro (Gedung Sate)", "Taman Lansia", "Jl. Riau", "Jl. Cihapit", "Pasar Cihapit"],
    Cicendo: ["Jl. Pasteur", "Stasiun Bandung", "Jl. Arjuna", "Jl. Pajajaran", "Jl. Kebon Kawung"],
};

const IKON_STATUS = { Submitted: "submitted", Received: "received", "In review": "review" };

const NAMA_HALAMAN = location.pathname.split("/").pop().replace(".html", "") || "index";

const AKUN_DEMO = {
    nama: "Fahrul Septiana",
    email: "fahrul@wargareport.id",
    telepon: "+62 812-9842-1054",
    nik: "3174051809900004",
    sandi: "warga1234",
    demo: true,
};

const NOTIF_DEMO = [
    {
        email: AKUN_DEMO.email,
        kasus: "CMP-2026-9472",
        tanggal: "Oct 30",
        jam: "04:41 PM",
        judul: "Report received — verification pending",
        jenis: "Status Change",
        status: "Submitted",
        isi: "Your report CMP-2026-9472 is queued for WargaReport evidence verification. Proposed bureau: Dinas Pertamanan dan Hutan Kota DKI Jakarta. The SLA countdown starts once the report is routed.",
        dibaca: false,
    },
    {
        email: AKUN_DEMO.email,
        kasus: "CMP-2026-8841",
        tanggal: "Oct 29",
        jam: "03:10 PM",
        judul: "Officer reply: valve isolation team dispatched",
        jenis: "Reply",
        status: "In review",
        isi: "Hendra Kurniawan: Dispatched secondary valve isolation team from Cilandak maintenance station.",
        dibaca: false,
    },
    {
        email: AKUN_DEMO.email,
        kasus: "CMP-2026-8841",
        tanggal: "Oct 29",
        jam: "01:28 PM",
        judul: "Status changed to In review",
        jenis: "Status Change",
        status: "In review",
        isi: "Your report CMP-2026-8841 was accepted by the duty triage coordinator and is now in review by Perumda PAM JAYA.",
        dibaca: false,
    },
];

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

// Helpers

function simpan(kunci, nilai) {
    localStorage.setItem(kunci, JSON.stringify(nilai));
}

function muat(kunci, awal = null) {
    try {
        return JSON.parse(localStorage.getItem(kunci)) ?? awal;
    } catch {
        return awal;
    }
}

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

function buatPesan(target, posisi = "before", kelas = "") {
    const pesan = document.createElement("p");
    pesan.className = `${kelas} text-xs text-(--txt-alert)`;
    pesan.hidden = true;
    target[posisi](pesan);
    return pesan;
}

function tampilkanPesan(pesan, teks) {
    pesan.textContent = teks;
    pesan.hidden = false;
}

function idKasusDi(elemen) {
    return (elemen.textContent.match(/CMP-\d{4}-\d{4}/) || [])[0];
}

function inisialDari(nama) {
    return nama
        .split(" ")
        .slice(0, 2)
        .map(kata => kata[0])
        .join("")
        .toUpperCase();
}

function formatWaktu(iso) {
    const waktu = new Date(iso);
    return {
        tanggal: waktu.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        tanggalLengkap: waktu.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        jam: waktu.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
    };
}

const KELAS_AKTIF = ["border-(--success)", "bg-(--success)", "text-(--light)"];
const KELAS_BIASA = ["border-(--bd-primary)", "bg-(--bg-secondary)", "text-(--disabled)"];

function tandaiAktif(semua, terpilih) {
    semua.forEach(el => {
        const aktif = el === terpilih;
        el.classList.remove(...(aktif ? [...KELAS_BIASA, "text-(--dark)"] : KELAS_AKTIF));
        el.classList.add(...(aktif ? KELAS_AKTIF : KELAS_BIASA));
    });
}

// AKUN, LAPORAN, NOTIFIKASI (disimpan di localStorage)

function siapkanAkunDemo() {
    if (!muat("wr_pengguna")) simpan("wr_pengguna", [AKUN_DEMO]);
    if (!muat("wr_notif")) simpan("wr_notif", NOTIF_DEMO);
}

function ambilPengguna() {
    return muat("wr_pengguna", []);
}

function penggunaAktif() {
    const email = localStorage.getItem("wr_sesi");
    return ambilPengguna().find(p => p.email === email) || null;
}

function ubahPengguna(email, perubahan) {
    simpan(
        "wr_pengguna",
        ambilPengguna().map(p => (p.email === email ? { ...p, ...perubahan } : p)),
    );
}

function adalahAkunDemo(pengguna) {
    return Boolean(pengguna.demo) || pengguna.email === AKUN_DEMO.email;
}

function keluar() {
    localStorage.removeItem("wr_sesi");
}

function sandiKuat(sandi) {
    return sandi.length >= 8 && /[A-Za-z]/.test(sandi) && /\d/.test(sandi);
}

function semuaLaporan() {
    return muat("wr_laporan", []);
}

function laporanBuatan(pengguna) {
    return semuaLaporan().filter(l => l.email === pengguna.email);
}

function laporanSaya(pengguna) {
    const demo = adalahAkunDemo(pengguna) ? KASUS_AKUN_DEMO.map(id => ({ id, ...KASUS[id] })) : [];
    return [...laporanBuatan(pengguna), ...demo];
}

function cariKasus(id) {
    return KASUS[id] || semuaLaporan().find(l => l.id === id);
}

function namaValid(nama) {
    return /^\p{L}[\p{L} .'-]+$/u.test(nama);
}

function teleponValid(telepon) {
    return /^(\+62|62|0)8\d{8,11}$/.test(telepon.replace(/[\s-]/g, ""));
}

function tujuanSetelahMasuk() {
    const tujuan = new URLSearchParams(location.search).get("next");
    if (/^[\w-]+\.html$/.test(tujuan || "")) return tujuan;
    return location.pathname.split("/").pop() || "index.html";
}

function kirimKeLogin() {
    location.href = `index.html?next=${NAMA_HALAMAN}.html#signin`;
}

function aturTitikNotif() {
    const pengguna = penggunaAktif();
    const adaBaru = Boolean(pengguna) && muat("wr_notif", []).some(n => n.email === pengguna.email && !n.dibaca);
    ambilSemua("[data-titik]").forEach(el => (el.hidden = !adaBaru));
}

function aturHeader() {
    const pengguna = penggunaAktif();
    ambilSemua("[data-tamu]").forEach(el => (el.hidden = Boolean(pengguna)));
    ambilSemua("[data-masuk]").forEach(el => (el.hidden = !pengguna));
    if (!pengguna) return;

    ambilSemua("[data-inisial]").forEach(el => (el.textContent = inisialDari(pengguna.nama)));
    ambilSemua("[data-nama]").forEach(el => (el.textContent = pengguna.nama));
    ambilSemua("[data-email]").forEach(el => (el.textContent = pengguna.email));
    ambilSemua("[data-keluar]").forEach(link => link.addEventListener("click", keluar));
    aturTitikNotif();
}

function aturDropdown() {
    document.addEventListener("click", e => {
        ambilSemua("header details").forEach(menu => {
            if (!menu.contains(e.target) || e.target.closest("a")) menu.open = false;
        });
    });
}

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

function aturLihatSandi() {
    ambilSemua('input[type="password"]').forEach(kolom => {
        const mata = kolom.nextElementSibling;
        if (!mata) return;
        mata.classList.add("cursor-pointer");
        mata.addEventListener("click", () => {
            kolom.type = kolom.type === "password" ? "text" : "password";
        });
    });
}

function aturUpvote(tombol) {
    if (!tombol || tombol.classList.contains("opacity-60")) return;
    const id = idKasusDi(tombol.closest("article, li") || ambil("main"));
    const teksAngka = tombol.lastChild;
    const jumlahAwal = parseInt(teksAngka.textContent.match(/\d+/)[0]);

    function sudahVote() {
        const pengguna = penggunaAktif();
        return Boolean(pengguna) && muat("wr_upvote", []).includes(`${pengguna.email}|${id}`);
    }

    function gambar() {
        const aktif = sudahVote();
        teksAngka.textContent = teksAngka.textContent.replace(/\d+/, jumlahAwal + (aktif ? 1 : 0));
        tombol.classList.toggle("bg-(--light-green)", aktif);
        tombol.classList.toggle("bg-(--bg-secondary)", !aktif);
    }

    gambar();
    tombol.addEventListener("click", () => {
        const pengguna = penggunaAktif();
        if (!pengguna) {
            location.hash = "signin";
            return;
        }
        const kunci = `${pengguna.email}|${id}`;
        const daftar = muat("wr_upvote", []);
        simpan("wr_upvote", sudahVote() ? daftar.filter(k => k !== kunci) : [...daftar, kunci]);
        gambar();
    });
}

// MODAL SIGN IN / REGISTER

const IKON = {
    email: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.33333 2.33331H11.6667C12.311 2.33331 12.8333 2.85565 12.8333 3.49998V10.5C12.8333 11.1443 12.311 11.6666 11.6667 11.6666H2.33333C1.689 11.6666 1.16667 11.1443 1.16667 10.5V3.49998C1.16667 2.85565 1.689 2.33331 2.33333 2.33331Z" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/><path d="M12.8333 4.08331L7 7.58331L1.16667 4.08331" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/></svg>`,
    sandi: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2.91667 6.41669H11.0833C11.7277 6.41669 12.25 6.93902 12.25 7.58335V11.6667C12.25 12.311 11.7277 12.8334 11.0833 12.8334H2.91667C2.27233 12.8334 1.75 12.311 1.75 11.6667V7.58335C1.75 6.93902 2.27233 6.41669 2.91667 6.41669Z" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/><path d="M4.08333 6.41669V4.08335C4.08333 3.30981 4.39062 2.56794 4.9376 2.02096C5.48459 1.47398 6.22645 1.16669 7 1.16669C7.77355 1.16669 8.51541 1.47398 9.06239 2.02096C9.60937 2.56794 9.91667 3.30981 9.91667 4.08335V6.41669" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/></svg>`,
    nama: `<svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M11.6667 12.25V11.0833C11.6667 10.4645 11.4209 9.871 10.9833 9.43342C10.5457 8.99583 9.95221 8.75 9.33337 8.75H4.66671C4.04787 8.75 3.45438 8.99583 3.01679 9.43342C2.57921 9.871 2.33337 10.4645 2.33337 11.0833V12.25" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/><path d="M9.33329 4.08333C9.33329 5.372 8.28862 6.41667 6.99996 6.41667C5.71129 6.41667 4.66663 5.372 4.66663 4.08333C4.66663 2.79467 5.71129 1.75 6.99996 1.75C8.28862 1.75 9.33329 2.79467 9.33329 4.08333Z" stroke-width="1.16667" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/></svg>`,
    mata: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.33331 7.99998C1.33331 7.99998 3.73331 3.33331 7.99998 3.33331C12.2666 3.33331 14.6666 7.99998 14.6666 7.99998C14.6666 7.99998 12.2666 12.6666 7.99998 12.6666C3.73331 12.6666 1.33331 7.99998 1.33331 7.99998Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/><path d="M10 8C10 9.10457 9.10457 10 8 10C6.89543 10 6 9.10457 6 8C6 6.89543 6.89543 6 8 6C9.10457 6 10 6.89543 10 8Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round" stroke="#84928A"/></svg>`,
    tutup: `<svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M12.75 4.25L4.25 12.75" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round" stroke="#4C5B52"/><path d="M4.25 4.25L12.75 12.75" stroke-width="1.41667" stroke-linecap="round" stroke-linejoin="round" stroke="#4C5B52"/></svg>`,
    panah: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2.70834 6.5H10.2917" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round" stroke="white"/><path d="M6.5 2.70831L10.2917 6.49998L6.5 10.2916" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round" stroke="white"/></svg>`,
    buatAkun: `<svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M11.9167 6.0017V6.50003C11.916 7.66809 11.5378 8.80464 10.8384 9.74018C10.139 10.6757 9.15599 11.3601 8.03586 11.6913C6.91573 12.0225 5.71856 11.9827 4.62288 11.5779C3.5272 11.1731 2.59173 10.425 1.95598 9.44511C1.32023 8.46521 1.01826 7.30606 1.09512 6.14053C1.17197 4.975 1.62353 3.86554 2.38244 2.97761C3.14136 2.08968 4.16697 1.47086 5.30631 1.21344C6.44565 0.956021 7.63769 1.07379 8.70463 1.5492" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round" stroke="white"/><path d="M4.875 5.95835L6.5 7.58335L11.9167 2.16669" stroke-width="1.08333" stroke-linecap="round" stroke-linejoin="round" stroke="white"/></svg>`,
};

const KELAS_KOLOM =
    "flex items-center gap-2.5 rounded-xl border border-(--bd-primary) bg-(--bg-secondary) px-3.5 focus-within:border-(--green) focus-within:ring-4 focus-within:ring-(--green-20)";
const KELAS_INPUT =
    "min-w-0 flex-1 bg-transparent py-3 text-sm text-(--dark) outline-none placeholder:text-(--disabled2)";
const TOMBOL_MODAL =
    "inline-flex w-full items-center justify-center gap-1.75 rounded-full border border-(--success) bg-(--success) px-6 py-3.5 text-[15px] font-semibold text-(--light)";

function kolomModal(id, label, tipe, placeholder, ikonKiri, ikonKanan = "", classTambahan = "") {
    return `
        <div class="flex flex-col gap-1.5">
            <label for="${id}" class="font-(family-name:--font-pm) text-[10px] uppercase tracking-wider text-(--dark)">${label}</label>
            <div class="${KELAS_KOLOM}">
                ${ikonKiri}
                <input id="${id}" type="${tipe}" placeholder="${placeholder}" class="${KELAS_INPUT} ${classTambahan}">
                ${ikonKanan}
            </div>
        </div>`;
}

function kerangkaModal(id, judul, deskripsi, isi) {
    const tabAktif = "bg-(--success) text-(--light)";
    const tabBiasa = "bg-(--bg-submitted) text-(--dark)";
    return `
    <div id="${id}" class="fixed inset-0 z-50 hidden overflow-y-auto bg-(--dark-70) p-4">
        <a href="#close" aria-label="Close" class="fixed inset-0"></a>
        <div role="dialog" aria-labelledby="${id}-title" class="relative m-auto w-full max-w-135 overflow-hidden rounded-[18px] border border-(--bd-secondary) bg-(--bg-secondary) shadow-2xl">
            <div class="flex items-start justify-between gap-4 border-b border-(--bd-secondary) bg-(--bg-primary) px-5.5 pb-4 pt-5">
                <div>
                    <h2 id="${id}-title" class="font-(family-name:--font-f) text-xl font-semibold">${judul}</h2>
                    <p class="text-xs leading-relaxed text-(--disabled)">${deskripsi}</p>
                </div>
                <a href="#close" aria-label="Close" class="text-2xl leading-none text-(--disabled)">${IKON.tutup}</a>
            </div>
            <div class="grid grid-cols-2 gap-2.5 border-b border-(--bd-secondary) px-5.5 py-3.5">
                <a href="#signin" class="block rounded-full px-4 py-3 text-center text-[13px] font-medium ${id === "signin" ? tabAktif : tabBiasa}">Sign In Existing Account</a>
                <a href="#register" class="block rounded-full px-4 py-3 text-center text-[13px] font-medium ${id === "register" ? tabAktif : tabBiasa}">Register as Citizen</a>
            </div>
            <div class="flex flex-col gap-4 px-5.5 pb-5.5 pt-4.5">${isi}</div>
        </div>
    </div>`;
}

function buatModalMasuk() {
    return kerangkaModal(
        "signin",
        "Sign In to WargaReport",
        "Sign in to lodge a complaint or upvote issues.",
        `${kolomModal("signin-email", "Email Address", "email", "Enter your Email", IKON.email)}
        ${kolomModal("signin-password", "Password", "password", "Enter your password", IKON.sandi, IKON.mata)}
        <button type="button" class="${TOMBOL_MODAL}">Sign In${IKON.panah}</button>`,
    );
}

function buatModalDaftar() {
    return kerangkaModal(
        "register",
        "Register Citizen Account",
        "Create an account to lodge a complaint or upvote issues.",
        `${kolomModal("reg-name", "Full Name (Nama Lengkap) *", "text", "e.g. Budi Santoso", IKON.nama)}
        <div class="grid gap-3 sm:grid-cols-2">
            ${kolomModal("reg-email", "Email Address *", "email", "e.g. budi@wargareport.id", IKON.email)}
            ${kolomModal("reg-phone", "Phone / WhatsApp *", "tel", "+62 812 ...", "")}
        </div>
        ${kolomModal("reg-nik", "NIK", "text", "16 digits for verified resident badge", "", "", "font-(family-name:--font-pm) text-[13px]")}
        <p class="-mt-2 text-[10.5px] text-(--disabled)">Used exclusively for verification under UU PDP and never shown to the public.</p>
        ${kolomModal("reg-password", "Password *", "password", "Create a password", IKON.sandi, IKON.mata)}
        <button type="button" class="${TOMBOL_MODAL}">${IKON.buatAkun}Create Account &amp; Continue</button>`,
    );
}

function tampilkanModalSesuaiHash() {
    ambilSemua("#signin, #register").forEach(modal => {
        const buka = `#${modal.id}` === location.hash;
        modal.classList.toggle("hidden", !buka);
        modal.classList.toggle("flex", buka);
    });
}

function siapkanPesanModal(modal, tombol) {
    const pesan = buatPesan(tombol);
    modal.addEventListener("input", () => (pesan.hidden = true));
    modal.addEventListener("keydown", e => {
        if (e.key === "Enter") tombol.click();
    });
    return pesan;
}

function siapkanModalMasuk() {
    const modal = ambil("#signin");
    const tombol = ambil("button", modal);
    const pesan = siapkanPesanModal(modal, tombol);

    tombol.addEventListener("click", () => {
        const email = ambil("#signin-email").value.trim().toLowerCase();
        const sandi = ambil("#signin-password").value;

        const pengguna = ambilPengguna().find(p => p.email === email && p.sandi === sandi);
        if (!pengguna) return tampilkanPesan(pesan, "Incorrect email or password.");

        localStorage.setItem("wr_sesi", pengguna.email);
        location.href = tujuanSetelahMasuk();
    });
}

function siapkanModalDaftar() {
    const modal = ambil("#register");
    const tombol = ambil("button", modal);
    const pesan = siapkanPesanModal(modal, tombol);
    // aturKolomTelepon(ambil("#reg-phone"));

    tombol.addEventListener("click", () => {
        const nama = ambil("#reg-name").value.trim();
        const email = ambil("#reg-email").value.trim().toLowerCase();
        const telepon = ambil("#reg-phone").value.trim();
        const nik = ambil("#reg-nik").value.trim();
        const sandi = ambil("#reg-password").value;
        const daftar = ambilPengguna();

        if (!namaValid(nama)) return tampilkanPesan(pesan, "Name must be letters only and at least 2 characters.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return tampilkanPesan(pesan, "Please enter a valid email address.");
        if (daftar.some(p => p.email === email)) return tampilkanPesan(pesan, "That email is already registered.");
        if (!teleponValid(telepon)) return tampilkanPesan(pesan, "Enter a valid mobile number, e.g. 0812 3456 7890 or +62 812 3456 7890.");
        if (nik && !/^\d{16}$/.test(nik)) return tampilkanPesan(pesan, "NIK must be 16 digits.");
        if (!sandiKuat(sandi)) return tampilkanPesan(pesan, "Password needs at least 8 characters, including a letter and a number.");

        simpan("wr_pengguna", [...daftar, { nama, email, telepon, nik, sandi }]);
        localStorage.setItem("wr_sesi", email);
        location.href = tujuanSetelahMasuk();
    });
}

function siapkanModal() {
    if (!ambil("#signin")) document.body.insertAdjacentHTML("beforeend", buatModalMasuk() + buatModalDaftar());

    siapkanModalMasuk();
    siapkanModalDaftar();

    window.addEventListener("hashchange", tampilkanModalSesuaiHash);
    tampilkanModalSesuaiHash();
}

// INDEX, LIVE FEED, TRACK, DETAIL

function siapkanBeranda() {
    ambilSemua("main article button").forEach(aturUpvote);
    ambilSemua('main article a[href="#"]').forEach(link => {
        link.href = `report-detail.html?id=${idKasusDi(link.closest("article"))}`;
    });
}

function siapkanFeed() {
    const daftar = ambil("main ul");
    const baris = ambilSemua("li", daftar);
    const kolomCari = ambil('input[type="search"]');

    const [, kotakKategori, kotakStatus] = ambil('[aria-label="Filters"]').children;
    const tombolKategori = ambilSemua("button", kotakKategori);
    const tombolStatus = ambilSemua("button", kotakStatus);
    const cekFoto = ambil('input[type="checkbox"]', kotakStatus);

    const pesanKosong = document.createElement("p");
    pesanKosong.className = "py-10 text-center text-sm text-(--disabled)";
    pesanKosong.textContent = "No reports match your filters.";
    pesanKosong.hidden = true;
    daftar.after(pesanKosong);

    let kategori = "";
    let status = "";

    function terapkanFilter() {
        const kataKunci = kolomCari.value.trim().toLowerCase();
        baris.forEach(li => {
            const statusLi = ambil("span", li).textContent.trim();
            const kategoriLi = ambil("p span", li).textContent.replace("·", "").trim();
            li.hidden = !(
                li.textContent.toLowerCase().includes(kataKunci) &&
                (!kategori || kategoriLi === kategori) &&
                (!status || statusLi === status) &&
                (!cekFoto.checked || ambil(":scope > img", li))
            );
        });
        pesanKosong.hidden = baris.some(li => !li.hidden);
    }

    kolomCari.addEventListener("input", terapkanFilter);
    cekFoto.addEventListener("change", terapkanFilter);

    tombolKategori.forEach((tombol, i) => {
        tombol.addEventListener("click", () => {
            kategori = i === 0 ? "" : tombol.textContent.trim();
            tandaiAktif(tombolKategori, tombol);
            terapkanFilter();
        });
    });

    tombolStatus.forEach((tombol, i) => {
        tombol.addEventListener("click", () => {
            status = i === 0 ? "" : tombol.textContent.trim();
            tandaiAktif(tombolStatus, tombol);
            terapkanFilter();
        });
    });

    const tombolPeta = ambilSemua("button", ambil("main section"))[1];
    tombolPeta.addEventListener("click", () => kedipTeks(tombolPeta, "Coming soon"));

    ambilSemua("button", daftar).forEach(aturUpvote);
    baris.forEach(li => {
        ambilSemua('a[href="#"]', li).forEach(link => (link.href = `report-detail.html?id=${idKasusDi(li)}`));
    });
}

function siapkanTrack() {
    const kolomId = ambil("#case-id");
    const tombolCari = ambil("main button");
    const pesanError = buatPesan(kolomId, "after");

    function cari() {
        const id = kolomId.value.trim().toUpperCase();
        if (!cariKasus(id)) {
            tampilkanPesan(pesanError, id ? `No case found for ${id}.` : "Please enter your complaint reference ID.");
            return;
        }
        location.href = `report-detail.html?id=${id}`;
    }

    kolomId.value = new URLSearchParams(location.search).get("id") || "";

    ambilSemua('main a[href="#"]').forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            kolomId.value = idKasusDi(link);
            cari();
        });
    });

    tombolCari.addEventListener("click", cari);
    kolomId.addEventListener("keydown", e => {
        if (e.key === "Enter") cari();
    });
    kolomId.addEventListener("input", () => (pesanError.hidden = true));
}

function isiInfoDetail(label, isi) {
    const teksLabel = ambilSemua("aside p").find(p => p.textContent.trim() === label);
    if (teksLabel) isi(teksLabel.nextElementSibling);
}

function isiDetail(id, kasus) {
    const judul = ambil("main h1");
    judul.textContent = kasus.judul;
    if (kasus.detail) judul.nextElementSibling.textContent = kasus.detail;

    isiInfoDetail("Tracking Code", el => (el.textContent = id));
    isiInfoDetail("Assigned Authority", el => (el.textContent = kasus.instansi));
    isiInfoDetail("Category", el => (el.textContent = kasus.kategori));
    isiInfoDetail("Location", el => {
        const [baris, kota] = ambilSemua("p", el);
        baris.lastChild.textContent = kasus.lokasi;
        kota.textContent = kasus.wilayah;
    });

    if (kasus.waktu) {
        isiInfoDetail("Reported On", el => (ambil("span", el).textContent = formatWaktu(kasus.waktu).tanggalLengkap));
        isiInfoDetail("Reported By", el => (el.textContent = kasus.pelapor));
    }

    const tombolUpvote = ambilSemua("main button").find(t => t.textContent.includes("Upvote"));
    tombolUpvote.lastChild.textContent = `Upvote (${kasus.suara})`;
}

function siapkanDetail() {
    const id = new URLSearchParams(location.search).get("id");
    const kasus = cariKasus(id);
    if (kasus) isiDetail(id, kasus);

    const semuaTombol = ambilSemua("main button");
    const tombolBagikan = semuaTombol.find(t => t.textContent.includes("Share"));
    const tombolUpvote = semuaTombol.find(t => t.textContent.includes("Upvote"));

    aturUpvote(tombolUpvote);

    tombolBagikan.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(location.href);
            kedipTeks(tombolBagikan, "Link copied");
        } catch {
            kedipTeks(tombolBagikan, "Copy failed");
        }
    });
}

// ALUR LAPORAN: topic -> location -> proof -> review -> receipt

function aturLanjut(periksa, simpanDraf) {
    const tautan = ambilSemua("main > section a").find(a => a.textContent.trim() === "Continue");
    const pesan = buatPesan(tautan.parentElement, "before", "mt-4");

    tautan.addEventListener("click", e => {
        const salah = periksa();
        if (salah) {
            e.preventDefault();
            tampilkanPesan(pesan, salah);
            return;
        }
        simpanDraf();
    });
    return pesan;
}

function siapkanTopik() {
    const draf = muat("wr_draf", {});
    const kartu = ambilSemua("main .grid > div");
    const PILIH = ["border-(color:--green)", "bg-(color:--light-green)"];
    const BIASA = ["border-(color:--bd-secondary)", "bg-(color:--bg-secondary)"];

    function dataKartu(el) {
        const judulKartu = el.firstElementChild;
        const nama = [...judulKartu.childNodes].find(n => n.nodeType === 3).textContent.trim();
        return {
            kategori: nama,
            jenis: ambil("p", el).textContent.trim(),
            instansi: INSTANSI[nama],
            sla: ambil("span", judulKartu).textContent.replace(/\D/g, ""),
        };
    }

    let terpilih = null;

    function pilih(el) {
        terpilih = el;
        kartu.forEach(k => {
            k.classList.remove(...(k === el ? BIASA : PILIH));
            k.classList.add(...(k === el ? PILIH : BIASA));
        });
    }

    kartu.forEach(el => {
        el.classList.add("cursor-pointer");
        el.addEventListener("click", () => pilih(el));
        if (dataKartu(el).kategori === draf.kategori) terpilih = el;
    });

    pilih(terpilih);

    aturLanjut(
        () => (terpilih ? "" : "Please choose a category first."),
        () => simpan("wr_draf", { ...draf, ...dataKartu(terpilih) }),
    );
}

function siapkanLokasi() {
    const draf = muat("wr_draf", {});
    if (!draf.kategori) return (location.href = "report-topic.html");

    const pilihArea = ambil("#area");
    const kolomAlamat = ambil("#address");
    const chip = ambilSemua("main button");
    const labelChip = chip[0].parentElement.previousElementSibling;

    function isiChip() {
        JALAN_UMUM[pilihArea.value].forEach((nama, i) => (chip[i].textContent = nama));
        labelChip.textContent = `Common areas in ${pilihArea.value} · Kota Bandung`;
    }

    if (draf.wilayah) pilihArea.value = draf.wilayah;
    if (draf.alamat) kolomAlamat.value = draf.alamat;
    isiChip();
    pilihArea.addEventListener("change", isiChip);

    const pesan = aturLanjut(
        () =>
            kolomAlamat.value.trim().length < 5 ? "Please enter a street address or landmark (min 5 characters)." : "",
        () => simpan("wr_draf", { ...draf, wilayah: pilihArea.value, alamat: kolomAlamat.value.trim() }),
    );

    chip.forEach(tombol => {
        tombol.addEventListener("click", () => {
            kolomAlamat.value = tombol.textContent.trim();
            pesan.hidden = true;
        });
    });
}

function siapkanBukti() {
    const draf = muat("wr_draf", {});
    if (!draf.alamat) return (location.href = "report-topic.html");

    const [artikelFoto, artikelVideo] = ambilSemua("main > section article");
    const wadah = artikelFoto.parentElement;
    const cetakanFoto = artikelFoto.cloneNode(true);
    const cetakanVideo = artikelVideo.cloneNode(true);
    const hitung = ambilSemua("main p").find(p => p.textContent.startsWith("Attached evidence"));

    const CONTOH = {
        foto: {
            nama: "incident_capture",
            ekstensi: "jpg",
            info: "Image · 1.8 MB",
            catatan: "Photographed live on site by resident camera.",
        },
        audio: {
            nama: "voice_memo",
            ekstensi: "m4a",
            info: "Audio · 0.9 MB",
            catatan: "Voice note recorded on site.",
            durasi: "0:15",
        },
        video: {
            nama: "site_clip",
            ekstensi: "mp4",
            info: "Video · 5.2 MB",
            catatan: "Short clip of the incident.",
            durasi: "0:12",
        },
    };

    const semuaBukti = () => ambilSemua("article", wadah);
    const perbaruiHitungan = () => (hitung.textContent = `Attached evidence (${semuaBukti().length})`);

    const pesan = aturLanjut(
        () => (semuaBukti().length ? "" : "Please attach at least one evidence file."),
        () => simpan("wr_draf", { ...draf, bukti: semuaBukti().map(a => ambil("p", a).textContent.trim()) }),
    );

    function tambah(jenis) {
        if (semuaBukti().length >= 5) return tampilkanPesan(pesan, "Maximum 5 evidence files.");
        pesan.hidden = true;

        const data = CONTOH[jenis];
        const baris = (jenis === "foto" ? cetakanFoto : cetakanVideo).cloneNode(true);
        const [nama, info, catatan] = ambilSemua("p", baris);
        nama.textContent = `${data.nama}_${semuaBukti().length + 1}.${data.ekstensi}`;
        info.textContent = data.info;
        catatan.textContent = data.catatan;
        if (data.durasi) ambil("span", baris).textContent = data.durasi;
        wadah.append(baris);
        perbaruiHitungan();
    }

    const [tombolFoto, tombolAudio, tombolVideo] = ambilSemua("main button").filter(t => !t.closest("article"));
    tombolFoto.addEventListener("click", () => tambah("foto"));
    tombolAudio.addEventListener("click", () => tambah("audio"));
    tombolVideo.addEventListener("click", () => tambah("video"));

    wadah.addEventListener("click", e => {
        if (!e.target.closest("button")) return;
        e.target.closest("article").remove();
        perbaruiHitungan();
    });
}

function siapkanRingkasan() {
    const draf = muat("wr_draf", {});
    if (!draf.alamat || !draf.bukti) return (location.href = "report-topic.html");

    const pengguna = penggunaAktif();
    const kolomJudul = ambil("#title");
    const kolomDetail = ambil("#details");
    const kolomNama = ambil("#filer");
    const kolomEmail = ambil("#alert-email");
    const kolomTelepon = ambil("#phone");
    const [cekAnonim, cekEmail, cekSms, cekSetuju] = ambilSemua('main input[type="checkbox"]');
    const tombolKirim = ambil("main button");
    const pesan = buatPesan(tombolKirim.parentElement, "before", "mt-4");

    kolomNama.value = pengguna.nama;
    kolomEmail.value = pengguna.email;
    kolomTelepon.value = pengguna.telepon;

    const penghitung = ambil("span", kolomDetail.parentElement);
    const hitungKarakter = () => (penghitung.textContent = `${kolomDetail.value.length} chars (min 15)`);
    hitungKarakter();
    kolomDetail.addEventListener("input", hitungKarakter);

    tombolKirim.addEventListener("click", () => {
        const judul = kolomJudul.value.trim();
        const detail = kolomDetail.value.trim();
        const nama = kolomNama.value.trim();
        const email = kolomEmail.value.trim().toLowerCase();
        const telepon = kolomTelepon.value.trim();

        if (judul.length < 10) return tampilkanPesan(pesan, "Title is too short (min 10 characters).");
        if (detail.length < 15) return tampilkanPesan(pesan, "Please describe the incident in at least 15 characters.");
        if (!namaValid(nama)) return tampilkanPesan(pesan, "Filer name must be letters only and at least 2 characters.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return tampilkanPesan(pesan, "Please enter a valid email for status alerts.");
        if (!cekEmail.checked && !cekSms.checked) return tampilkanPesan(pesan, "Pick at least one status alert channel.");
        if ((cekSms.checked || telepon) && !teleponValid(telepon)) return tampilkanPesan(pesan, "Enter a valid mobile number, e.g. 0812 3456 7890.");
        if (!cekSetuju.checked) return tampilkanPesan(pesan, "Please confirm the declaration before sending.");

        const waktu = new Date().toISOString();
        const laporan = {
            id: `CMP-2026-${9473 + semuaLaporan().length}`,
            email: pengguna.email,
            pelapor: cekAnonim.checked ? "Warga Anonim" : nama,
            judul,
            detail,
            kategori: draf.kategori,
            instansi: draf.instansi,
            sla: draf.sla,
            lokasi: draf.alamat,
            wilayah: `${draf.wilayah}, Kota Bandung`,
            bukti: draf.bukti.length,
            suara: 0,
            waktu,
        };
        simpan("wr_laporan", [laporan, ...semuaLaporan()]);

        // notifikasi pertama untuk laporan ini
        const { tanggal, jam } = formatWaktu(waktu);
        simpan("wr_notif", [
            {
                email: pengguna.email,
                kasus: laporan.id,
                tanggal,
                jam,
                judul: "Report received — verification pending",
                jenis: "Status Change",
                status: "Submitted",
                isi: `Your report ${laporan.id} is queued for WargaReport evidence verification. Proposed bureau: ${laporan.instansi}. The SLA countdown starts once the report is routed.`,
                dibaca: false,
            },
            ...muat("wr_notif", []),
        ]);

        localStorage.removeItem("wr_draf");
        location.href = "report-receipt.html";
    });
}

function siapkanTanda() {
    const laporan = laporanBuatan(penggunaAktif())[0];
    if (laporan) {
        const [, kode, ringkas] = ambilSemua("main p");
        const langkah = ambilSemua("main ol li p");

        kode.textContent = laporan.id;
        ambil("main h1").textContent = laporan.judul;
        ringkas.textContent = `${laporan.instansi} · ${laporan.lokasi}`;
        ambil("main section > div").children[1].textContent = `Logged ${formatWaktu(laporan.waktu).jam}`;
        langkah[0].textContent = `Your report is awaiting evidence verification. Proposed bureau: ${laporan.instansi}.`;
        langkah[1].textContent = `A duty inspector will assess site urgency within the target ${laporan.sla}-hour SLA window once routed.`;
        ambil('main a[href="report-detail.html"]').href = `report-detail.html?id=${laporan.id}`;
    }

    ambil("main button").addEventListener("click", () => window.print());
}

// NOTIFIKASI

function siapkanNotifikasi() {
    const pengguna = penggunaAktif();
    const semua = muat("wr_notif", []);
    const milik = () => semua.filter(n => n.email === pengguna.email);

    const daftarUl = ambil("main ul");
    const cetakan = ambil("li", daftarUl).cloneNode(true);
    const panel = ambil("main section");
    const linkFilter = ambilSemua("main a").filter(a =>
        ["All", "Unread", "Status", "Replies"].includes(a.textContent.trim()),
    );
    const tombolTandaiSemua = ambilSemua("main a").find(a => a.textContent.includes("Mark all"));

    let filter = "All";
    let terpilih = milik()[0] || null;

    function cocokFilter(n) {
        if (filter === "Unread") return !n.dibaca;
        if (filter === "Status") return n.jenis === "Status Change";
        if (filter === "Replies") return n.jenis === "Reply";
        return true;
    }

    function buatItem(n) {
        const li = cetakan.cloneNode(true);
        const tautan = ambil("a", li);
        const [kolomId, kolomJam] = ambilSemua("div > span", li);
        const [judul, jenis] = ambilSemua("p", li);

        kolomId.textContent = n.kasus;
        kolomJam.textContent = n.jam;
        judul.textContent = n.judul;
        jenis.firstChild.textContent = n.jenis;
        ambil("span", jenis).hidden = n.dibaca;

        ["border-l-2", "border-(--green)", "bg-(--light-green)"].forEach(kelas =>
            tautan.classList.toggle(kelas, n === terpilih),
        );

        tautan.addEventListener("click", e => {
            e.preventDefault();
            n.dibaca = true;
            terpilih = n;
            simpan("wr_notif", semua);
            gambar();
        });
        return li;
    }

    function isiPanel(n) {
        panel.hidden = !n;
        if (!n) return;
        const [, kode, tanggal, isi] = ambilSemua("p", panel);
        const lencana = ambil("span", panel);

        kode.textContent = n.kasus;
        ambil("h2", panel).textContent = n.judul;
        tanggal.textContent = `Dispatched ${n.tanggal}, ${n.jam} GMT+7`;
        isi.textContent = n.isi;
        lencana.lastChild.textContent = n.status;
        ambil("img", lencana).src = `assets/${IKON_STATUS[n.status] || "submitted"}.svg`;
        ambil("a", panel).href = `report-detail.html?id=${n.kasus}`;
    }

    function gambar() {
        const tampil = milik().filter(cocokFilter);
        daftarUl.replaceChildren(...tampil.map(buatItem));
        if (!tampil.length) {
            daftarUl.innerHTML =
                '<li class="px-4 py-6 text-center text-xs text-(--disabled)">No notifications here.</li>';
        }
        isiPanel(terpilih);
        aturTitikNotif();
    }

    linkFilter.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            filter = link.textContent.trim();
            tandaiAktif(linkFilter, link);
            gambar();
        });
    });

    tombolTandaiSemua.addEventListener("click", e => {
        e.preventDefault();
        milik().forEach(n => (n.dibaca = true));
        simpan("wr_notif", semua);
        gambar();
    });

    gambar();
}

// HALAMAN AKUN

function siapkanKeluhan() {
    const pengguna = penggunaAktif();
    const isiTabel = ambil("tbody");
    const barisAwal = ambilSemua("tr", isiTabel);
    const cetakan = barisAwal[0].cloneNode(true);

    if (!adalahAkunDemo(pengguna)) barisAwal.forEach(tr => tr.remove());

    function buatBaris(laporan) {
        const tr = cetakan.cloneNode(true);
        const sel = ambilSemua("td", tr);
        sel[0].textContent = laporan.id;
        ambil("a", sel[1]).textContent = laporan.judul;
        ambil("p", sel[1]).lastChild.textContent = laporan.lokasi;
        sel[2].textContent = laporan.instansi;
        sel[5].textContent = formatWaktu(laporan.waktu).tanggal;
        return tr;
    }
    isiTabel.prepend(...laporanBuatan(pengguna).map(buatBaris));

    const semuaBaris = ambilSemua("tr", isiTabel);
    semuaBaris.forEach(tr => (ambil("a", tr).href = `report-detail.html?id=${idKasusDi(tr)}`));

    if (!semuaBaris.length) {
        isiTabel.innerHTML =
            '<tr><td colspan="6" class="px-4 py-8 text-center text-xs text-(--disabled)">You have not filed any complaints yet.</td></tr>';
    }

    const judulDaftar = ambilSemua("main p").find(p => p.textContent.startsWith("Your tracked records"));
    judulDaftar.textContent = `Your tracked records (${semuaBaris.length})`;
}

function siapkanProfil() {
    const pengguna = penggunaAktif();
    const kolomNama = ambil("#full-name");
    const kolomEmail = ambil("#primary-email");
    const kolomTelepon = ambil("#sms-number");
    const kolomNik = ambil("#nik");
    const avatar = ambil("main section span");
    const [tombolFoto, tombolSimpan] = ambilSemua("main button");
    const pesan = buatPesan(tombolSimpan);

    let foto = pengguna.foto || "";

    function tampilkanAvatar() {
        avatar.textContent = foto ? "" : inisialDari(pengguna.nama);
        avatar.style.backgroundImage = foto ? `url(${foto})` : "";
        avatar.style.backgroundSize = "cover";
    }

    kolomNama.value = pengguna.nama;
    kolomEmail.value = pengguna.email;
    kolomTelepon.value = pengguna.telepon;
    kolomNik.value = pengguna.nik || "";
    tampilkanAvatar();

    const pilihFoto = document.createElement("input");
    pilihFoto.type = "file";
    pilihFoto.accept = "image/*";
    tombolFoto.addEventListener("click", () => pilihFoto.click());
    pilihFoto.addEventListener("change", () => {
        const file = pilihFoto.files[0];
        if (!file) return;
        if (file.size > 300000) return tampilkanPesan(pesan, "Photo must be smaller than 300 KB.");
        const pembaca = new FileReader();
        pembaca.onload = () => {
            foto = pembaca.result;
            pesan.hidden = true;
            tampilkanAvatar();
        };
        pembaca.readAsDataURL(file);
    });

    tombolSimpan.addEventListener("click", () => {
        const nama = kolomNama.value.trim();
        const email = kolomEmail.value.trim().toLowerCase();
        const telepon = kolomTelepon.value.trim();
        const nik = kolomNik.value.trim();

        if (!namaValid(nama)) return tampilkanPesan(pesan, "Name must be letters only and at least 2 characters.");
        if (!/^\S+@\S+\.\S+$/.test(email)) return tampilkanPesan(pesan, "Please enter a valid email address.");
        if (email !== pengguna.email && ambilPengguna().some(p => p.email === email)) {
            return tampilkanPesan(pesan, "That email is already registered.");
        }
        if (!teleponValid(telepon)) return tampilkanPesan(pesan, "Enter a valid mobile number, e.g. 0812 3456 7890.");
        if (nik && !/^\d{16}$/.test(nik)) return tampilkanPesan(pesan, "NIK must be 16 digits.");

        if (email !== pengguna.email) {
            ["wr_laporan", "wr_notif"].forEach(kunci => {
                simpan(kunci, muat(kunci, []).map(x => (x.email === pengguna.email ? { ...x, email } : x)));
            });
        }
        ubahPengguna(pengguna.email, { nama, email, telepon, nik, foto });
        localStorage.setItem("wr_sesi", email);

        pesan.hidden = true;
        aturHeader();
        kedipTeks(tombolSimpan, "Profile saved");
    });
}

function siapkanPengaturanNotif() {
    const pengguna = penggunaAktif();
    const kotakCentang = ambilSemua('main input[type="checkbox"]');
    const tombol = ambil("main button");

    if (pengguna.notif) kotakCentang.forEach((cek, i) => (cek.checked = pengguna.notif[i]));

    tombol.addEventListener("click", () => {
        ubahPengguna(pengguna.email, { notif: kotakCentang.map(cek => cek.checked) });
        kedipTeks(tombol, "Preferences saved");
    });
}

function siapkanPrivasi() {
    const pengguna = penggunaAktif();
    const tombol = ambil("main button");

    tombol.addEventListener("click", () => {
        const arsip = {
            profile: { nama: pengguna.nama, email: pengguna.email, telepon: pengguna.telepon, nik: pengguna.nik },
            complaints: laporanSaya(pengguna),
            notifications: muat("wr_notif", []).filter(n => n.email === pengguna.email),
        };
        const berkas = new Blob([JSON.stringify(arsip, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(berkas);
        link.download = "wargareport-archive.json";
        link.click();
        URL.revokeObjectURL(link.href);
    });
}

function siapkanKeamanan() {
    const pengguna = penggunaAktif();
    const kolomLama = ambil("#current-password");
    const kolomBaru = ambil("#new-password");
    const kolomKonfirmasi = ambil("#confirm-password");
    const tombol = ambil("main button");
    const pesan = buatPesan(tombol);

    [kolomLama, kolomBaru, kolomKonfirmasi].forEach(kolom =>
        kolom.addEventListener("input", () => (pesan.hidden = true)),
    );

    tombol.addEventListener("click", () => {
        if (kolomLama.value !== pengguna.sandi) return tampilkanPesan(pesan, "Current password is incorrect.");
        if (!sandiKuat(kolomBaru.value))
            return tampilkanPesan(pesan, "New password needs at least 8 characters, including a letter and a number.");
        if (kolomBaru.value === kolomLama.value)
            return tampilkanPesan(pesan, "New password must be different from the current one.");
        if (kolomBaru.value !== kolomKonfirmasi.value) return tampilkanPesan(pesan, "New passwords do not match.");

        ubahPengguna(pengguna.email, { sandi: kolomBaru.value });
        [kolomLama, kolomBaru, kolomKonfirmasi].forEach(kolom => (kolom.value = ""));
        kedipTeks(tombol, "Password updated");
    });
}

const HALAMAN = {
    index: siapkanBeranda,
    liveFeed: siapkanFeed,
    track: siapkanTrack,
    "report-detail": siapkanDetail,
    "report-topic": siapkanTopik,
    "report-location": siapkanLokasi,
    "report-proof": siapkanBukti,
    "report-review": siapkanRingkasan,
    "report-receipt": siapkanTanda,
    notifications: siapkanNotifikasi,
    "account-complaints": siapkanKeluhan,
    "account-profile": siapkanProfil,
    "account-notifications": siapkanPengaturanNotif,
    "account-privacy": siapkanPrivasi,
    "account-security": siapkanKeamanan,
};

document.addEventListener("DOMContentLoaded", () => {
    siapkanAkunDemo();

    if (WAJIB_MASUK.includes(NAMA_HALAMAN) && !penggunaAktif()) return kirimKeLogin();

    aturHeader();
    aturDropdown();
    aturLinkFooter();
    if (!penggunaAktif()) siapkanModal();
    if (HALAMAN[NAMA_HALAMAN]) HALAMAN[NAMA_HALAMAN]();
    aturLihatSandi();
});
