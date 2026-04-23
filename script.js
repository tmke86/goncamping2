document.addEventListener('DOMContentLoaded', function() {
    // ---------- FANESTYRING ----------
    const sections = {
        home: document.getElementById('page-home'),
        leie: document.getElementById('page-leie'),
        fasiliteter: document.getElementById('page-fasiliteter'),
        omoss: document.getElementById('page-omoss'),
        kontakt: document.getElementById('page-kontakt')
    };

    function showPage(pageId) {
        Object.values(sections).forEach(section => {
            if (section) section.classList.remove('active-section');
        });
        if (sections[pageId]) sections[pageId].classList.add('active-section');
        document.querySelectorAll('.nav-link').forEach(link => {
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        history.pushState(null, '', '#' + pageId);
        const navLinks = document.getElementById('navLinks');
        if (navLinks) navLinks.classList.remove('show');
    }

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page && sections[page]) {
                showPage(page);
            }
        });
    });

    function handleHash() {
        const hash = window.location.hash.substring(1);
        if (hash && sections[hash]) {
            showPage(hash);
        } else {
            showPage('home');
        }
    }
    window.addEventListener('hashchange', handleHash);
    handleHash();

    // ---------- MOBILMENY ----------
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }
    document.addEventListener('click', function(event) {
        if (navLinks && navLinks.classList.contains('show')) {
            if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
                navLinks.classList.remove('show');
            }
        }
    });

    // ---------- FORMBEHANDLING (samme som før) ----------
    const FORMSPREE_BOOKING_URL = "https://formspree.io/f/DIN_BOOKING_ID";
    const FORMSPREE_CONTACT_URL = "https://formspree.io/f/DIN_KONTAKT_ID";

    async function submitToFormspree(url, formData, statusElementId, successMsg, errorMsg) {
        const statusDiv = document.getElementById(statusElementId);
        if (!statusDiv) return;
        statusDiv.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Sender...';
        try {
            const response = await fetch(url, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                statusDiv.innerHTML = `<span style="color:green;">✅ ${successMsg}</span>`;
                const form = statusElementId === 'bookingStatus' ? document.getElementById('bookingForm') : document.getElementById('contactForm');
                if (form) form.reset();
                setTimeout(() => statusDiv.innerHTML = '', 5000);
            } else {
                throw new Error(await response.text());
            }
        } catch (error) {
            statusDiv.innerHTML = `<span style="color:red;">❌ ${errorMsg} Prøv igjen senere.</span>`;
            console.error(error);
        }
    }

    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            await submitToFormspree(FORMSPREE_BOOKING_URL, formData, 'bookingStatus',
                'Bookingforespørsel er sendt! Du hører fra oss innen 24 timer.',
                'Noe gikk galt med bookingforespørselen.');
        });
    }
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            await submitToFormspree(FORMSPREE_CONTACT_URL, formData, 'contactStatus',
                'Meldingen er sendt! Vi svarer så snart som mulig.',
                'Kunne ikke sende melding. Vennligst prøv igjen.');
        });
    }

    // ---------- LIGHTBOX ----------
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    if (lightbox) {
        document.querySelectorAll('.lightbox-trigger').forEach(img => {
            img.addEventListener('click', () => {
                lightboxImg.src = img.getAttribute('data-img') || img.src;
                lightbox.style.display = 'flex';
            });
        });
        document.querySelector('.close-lightbox')?.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) lightbox.style.display = 'none';
        });
    }

    // ---------- GOOGLE TRANSLATE ----------
    // Denne funksjonen kalles automatisk når Google Translate-skriptet er lastet
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'no',
            includedLanguages: 'no,en,de',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false
        }, 'google_translate_element');
        
        // Skjul Google Translate sin egen meny og banner
        const googleFrame = document.querySelector('.goog-te-menu-frame');
        if (googleFrame) googleFrame.style.display = 'none';
        setTimeout(() => {
            const googleToolbar = document.querySelector('.goog-te-gadget');
            if (googleToolbar) googleToolbar.style.display = 'none';
        }, 500);
    };
    
    // Opprett en skjult div for Google Translate widget (nødvendig for API)
    const translateDiv = document.createElement('div');
    translateDiv.id = 'google_translate_element';
    translateDiv.style.display = 'none';
    document.body.appendChild(translateDiv);
    
    // Funksjon for å bytte språk via Google Translate sin komboboks
    function setGoogleTranslateLanguage(langCode) {
        // Finn Google Translate sin select-boks
        const select = document.querySelector('.goog-te-combo');
        if (select) {
            select.value = langCode;
            select.dispatchEvent(new Event('change'));
        } else {
            // Hvis select-boksen ikke er lastet ennå, prøv igjen etter kort tid
            setTimeout(() => setGoogleTranslateLanguage(langCode), 200);
        }
    }
    
    // Koble flaggknappene til språkbytte
    const flagButtons = document.querySelectorAll('.flag-btn');
    flagButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = btn.getAttribute('data-lang');
            let googleLang = 'no';
            if (lang === 'en') googleLang = 'en';
            if (lang === 'de') googleLang = 'de';
            setGoogleTranslateLanguage(googleLang);
        });
    });
});