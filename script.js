// ============================================================
// 1. НАСТРОЙКИ
// ============================================================

// Дата выхода GTA VI
const targetDate = new Date('2026-11-19T00:00:00').getTime();

// ============================================================
// 2. ПЛАВНОЕ РАСТВОРЕНИЕ ЦИФР (без сдвигов)
// ============================================================
function setDigit(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const newVal = value.toString().padStart(2, '0');
    if (el.innerText === newVal) return;

    // Растворяем (opacity → 0)
    el.classList.add('fade-out');

    // Когда цифра исчезла — меняем значение и проявляем обратно
    setTimeout(() => {
        el.innerText = newVal;
        el.classList.remove('fade-out');
    }, 300);
}

// ============================================================
// 3. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
// ============================================================
function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('timer').innerHTML =
            "<h2 style='font-size: 5vw;'>GTA VI IS OUT!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    setDigit('days', days);
    setDigit('hours', hours);
    setDigit('minutes', minutes);
    setDigit('seconds', seconds);
}

// ============================================================
// 4. СМЕНА ФОНА В ЗАВИСИМОСТИ ОТ ВРЕМЕНИ СУТОК
// ============================================================
function getCurrentBgId() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12)  return 'bg-morning';
    if (hour >= 12 && hour < 18) return 'bg-day';
    if (hour >= 18 && hour < 24) return 'bg-evening';
    return 'bg-night';
}

function updateBackground() {
    const activeBgId = getCurrentBgId();

    document.querySelectorAll('.bg').forEach(bg => {
        bg.style.opacity = (bg.id === activeBgId) ? '1' : '0';
    });
}

function scheduleNextBackgroundChange() {
    const now = new Date();
    const currentHour = now.getHours();

    let nextChangeHour;
    if (currentHour < 6)       nextChangeHour = 6;
    else if (currentHour < 12) nextChangeHour = 12;
    else if (currentHour < 18) nextChangeHour = 18;
    else                       nextChangeHour = 24;

    const nextChange = new Date(now);
    nextChange.setHours(nextChangeHour, 0, 0, 0);
    const msUntilChange = nextChange - now;

    setTimeout(() => {
        updateBackground();
        scheduleNextBackgroundChange();
    }, msUntilChange);
}

// ============================================================
// 5. PARALLAX — ФОН СЛЕДУЕТ ЗА КУРСОРОМ
// ============================================================
// Знаки изменены на противоположные, чтобы фон двигался в ту же
// сторону, куда движется курсор (раньше сдвиг был обратным).
function applyParallax(x, y) {
    document.querySelectorAll('.bg').forEach(bg => {
        bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
}

document.addEventListener('mousemove', (e) => {
    // Cursor right → x > 0 → фон сдвигается вправо (следует за курсором)
    const x = (e.clientX / window.innerWidth  - 0.5) * -30;
    const y = (e.clientY / window.innerHeight - 0.5) * -30;
    applyParallax(x, y);
});

applyParallax(0, 0);

// ============================================================
// 6. УПРАВЛЕНИЕ МУЗЫКОЙ
// ============================================================
function initMusic() {
    const logoBtn = document.getElementById('logo-btn');
    const bgMusic = document.getElementById('bg-music');

    if (!logoBtn || !bgMusic) {
        console.warn('Элементы для музыки не найдены.');
        return;
    }

    let isPlaying = false;

    logoBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            logoBtn.style.filter = 'drop-shadow(2px 2px 15px rgba(0, 0, 0, 0.9))';
        } else {
            bgMusic.play()
                .then(() => {
                    isPlaying = true;
                    logoBtn.style.filter = 'drop-shadow(0px 0px 25px rgba(255, 0, 128, 0.9))';
                })
                .catch(error => console.error('Ошибка воспроизведения музыки:', error));
        }
    });
}

// ============================================================
// 7. ЗАПУСК
// ============================================================
setInterval(updateTimer, 1000);
updateTimer();

updateBackground();
scheduleNextBackgroundChange();
setInterval(updateBackground, 10000);

document.addEventListener('DOMContentLoaded', initMusic);
