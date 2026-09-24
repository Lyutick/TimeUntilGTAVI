// ============================================================
// 1. НАСТРОЙКИ
// ============================================================

// Дата выхода GTA VI (конец отсчёта)
const targetDate = new Date('2026-11-19T00:00:00').getTime();

// Дата анонса GTA VI (начало для прогресс-бара)
// 4 декабря 2023 — день выхода первого трейлера GTA VI
const startDate = new Date('2023-12-04T00:00:00').getTime();

// ============================================================
// 2. АНИМАЦИЯ СМЕНЫ ЦИФР (п. 9)
// ============================================================
function setDigit(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const newVal = value.toString().padStart(2, '0');
    if (el.innerText === newVal) return;

    // 1) Уводим старую цифру вверх и делаем прозрачной
    el.style.transition = 'transform 0.15s ease-in, opacity 0.15s ease-in';
    el.style.transform = 'translateY(-0.6em)';
    el.style.opacity = '0';

    // 2) В середине анимации меняем значение и готовим новую цифру снизу
    setTimeout(() => {
        el.innerText = newVal;
        el.style.transition = 'none';
        el.style.transform = 'translateY(0.6em)';
        void el.offsetWidth; // форсируем reflow
        // 3) Плавно возвращаем на место
        el.style.transition = 'transform 0.2s ease-out, opacity 0.2s ease-out';
        el.style.transform = 'translateY(0)';
        el.style.opacity = '1';
    }, 150);
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
// 4. ПРОГРЕСС-БАР (п. 15)
// ============================================================
function updateProgress() {
    const now = new Date().getTime();
    const total = targetDate - startDate;
    const passed = now - startDate;

    let percent = (passed / total) * 100;
    percent = Math.min(100, Math.max(0, percent));

    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');

    if (fill) fill.style.width = percent.toFixed(2) + '%';
    if (text) text.innerText = percent.toFixed(1) + '% WAITED';
}

// ============================================================
// 5. СМЕНА ФОНА В ЗАВИСИМОСТИ ОТ ВРЕМЕНИ СУТОК
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
// 6. PARALLAX-ЭФФЕКТ (п. 7)
// ============================================================
function applyParallax(x, y) {
    document.querySelectorAll('.bg').forEach(bg => {
        // scale(1.05) нужен, чтобы при сдвиге не было видно краёв
        bg.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
    });
}

document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth  - 0.5) * 30; // ±15 px
    const y = (e.clientY / window.innerHeight - 0.5) * 30;
    applyParallax(x, y);
});

// Начальное положение фона (до первого движения мыши)
applyParallax(0, 0);

// ============================================================
// 7. УПРАВЛЕНИЕ МУЗЫКОЙ
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
// 8. ЗАПУСК
// ============================================================

// Таймер — каждую секунду
setInterval(updateTimer, 1000);
updateTimer();

// Прогресс — каждую секунду (значение меняется плавно)
setInterval(updateProgress, 1000);
updateProgress();

// Фон — сразу + запланировать переход + резервная проверка раз в 10 секунд
updateBackground();
scheduleNextBackgroundChange();
setInterval(updateBackground, 10000);

// Музыка — после загрузки DOM
document.addEventListener('DOMContentLoaded', initMusic);
