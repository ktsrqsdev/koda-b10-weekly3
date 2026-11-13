const ambil = (selektor, induk = document) => induk.querySelector(selektor);
const ambilSemua = (selektor, induk = document) => [...induk.querySelectorAll(selektor)];

const ID_KASUS_DIKENAL = [
    "CMP-2026-9472",
    "CMP-2026-8841",
    "CMP-2026-8819",
    "CMP-2026-8794",
    "CMP-2026-8720",
    "CMP-2026-8650",
    "CMP-2026-8601",
];

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

const NAMA_HALAMAN = location.pathname.split("/").pop().replace(".html", "") || "index";

const AKUN_DEMO = {
    nama: "Fahrul Septiana",
    email: "fahrul@wargareport.id",
    telepon: "+62 812-9842-1054",
    nik: "3174051809900004",
    sandi: "warga1234",
};

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

function penggunaAktif() {
    const email = localStorage.getItem("wr_sesi");
    return ambilPengguna().find(p => p.email === email) || null;
}

function keluar() {
    localStorage.removeItem("wr_sesi");
}

function sandiKuat(sandi) {
    return sandi.length >= 8 && /[A-Za-z]/.test(sandi) && /\d/.test(sandi);
}

function tujuanSetelahMasuk() {
    const tujuan = new URLSearchParams(location.search).get("next");
    if (/^[\w-]+\.html$/.test(tujuan || "")) return tujuan;
    return location.pathname.split("/").pop() || "index.html";
}

function kirimKeLogin() {
    location.href = `index.html?next=${NAMA_HALAMAN}.html#signin`;
}

function aturHeader() {
    const pengguna = penggunaAktif();
    ambilSemua("[data-tamu]").forEach(el => (el.hidden = Boolean(pengguna)));
    ambilSemua("[data-masuk]").forEach(el => (el.hidden = !pengguna));
    if (!pengguna) return;

    const inisial = pengguna.nama
        .split(" ")
        .slice(0, 2)
        .map(kata => kata[0])
        .join("")
        .toUpperCase();
    ambilSemua("[data-inisial]").forEach(el => (el.textContent = inisial));
    ambilSemua("[data-nama]").forEach(el => (el.textContent = pengguna.nama));
    ambilSemua("[data-email]").forEach(el => (el.textContent = pengguna.email));
    ambilSemua("[data-keluar]").forEach(link => link.addEventListener("click", keluar));
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

function aturUpvote(tombol) {
    if (!tombol || tombol.classList.contains("opacity-60")) return;
    const teksAngka = tombol.lastChild;
    let jumlah = parseInt(teksAngka.textContent.match(/\d+/)[0]);
    let sudahVote = false;

    tombol.addEventListener("click", () => {
        if (!penggunaAktif()) {
            location.hash = "signin";
            return;
        }
        sudahVote = !sudahVote;
        jumlah += sudahVote ? 1 : -1;
        teksAngka.textContent = teksAngka.textContent.replace(/\d+/, jumlah);
        tombol.classList.toggle("bg-(--light-green)", sudahVote);
        tombol.classList.toggle("bg-(--bg-secondary)", !sudahVote);
    });
}

function siapkanBeranda() {
    ambilSemua("main article button").forEach(aturUpvote);
    ambilSemua('main article a[href="#"]').forEach(link => (link.href = "report-detail.html"));
}

function siapkanFeed() {
    const daftar = ambil("main ul");
    const kolomCari = ambil('input[type="search"]');

    kolomCari.addEventListener("input", () => {
        const kataKunci = kolomCari.value.trim().toLowerCase();
        ambilSemua("li", daftar).forEach(baris => {
            baris.hidden = !baris.textContent.toLowerCase().includes(kataKunci);
        });
    });

    ambilSemua("button", daftar).forEach(aturUpvote);
    ambilSemua('a[href="#"]', daftar).forEach(link => (link.href = "report-detail.html"));
}

function siapkanTrack() {
    const kolomId = ambil("#case-id");
    const tombolCari = ambil("main button");

    const pesanError = document.createElement("p");
    pesanError.className = "text-xs text-(--txt-alert)";
    pesanError.hidden = true;
    kolomId.after(pesanError);

    function cariKasus() {
        const id = kolomId.value.trim().toUpperCase();
        if (!ID_KASUS_DIKENAL.includes(id)) {
            pesanError.textContent = id ? `No case found for ${id}.` : "Please enter your complaint reference ID.";
            pesanError.hidden = false;
            return;
        }
        location.href = "report-detail.html";
    }

    tombolCari.addEventListener("click", cariKasus);
    kolomId.addEventListener("keydown", e => {
        if (e.key === "Enter") cariKasus();
    });
    kolomId.addEventListener("input", () => (pesanError.hidden = true));
}

function siapkanDetail() {
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

function tampilkanModalSesuaiHash() {
    ambilSemua("[data-modal]").forEach(modal => {
        const buka = `#${modal.id}` === location.hash;
        modal.classList.toggle("hidden", !buka);
        modal.classList.toggle("flex", buka);
    });
}

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
        if (!sandiKuat(sandi)) return tampilkanError("Password needs at least 8 characters, including a letter and a number.");

        simpan("wr_pengguna", [...daftar, { nama, email, telepon, nik, sandi }]);
        localStorage.setItem("wr_sesi", email);
        location.href = tujuanSetelahMasuk();
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

const HALAMAN = {
    index: siapkanBeranda,
    liveFeed: siapkanFeed,
    track: siapkanTrack,
    "report-detail": siapkanDetail,
};

document.addEventListener("DOMContentLoaded", () => {
    siapkanAkunDemo();

    if (WAJIB_MASUK.includes(NAMA_HALAMAN) && !penggunaAktif()) return kirimKeLogin();

    aturHeader();
    aturDropdown();
    aturLinkFooter();
    if (!penggunaAktif()) siapkanModal();
    if (HALAMAN[NAMA_HALAMAN]) HALAMAN[NAMA_HALAMAN]();
});