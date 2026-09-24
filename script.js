// ============================================================
// 1. НАСТРОЙКИ
// ============================================================

// УСТАНОВИТЕ ДАТУ ВЫХОДА GTA VI ЗДЕСЬ (формат: 'YYYY-MM-DDTHH:MM:SS')
const targetDate = new Date('2026-10-19T00:00:00').getTime();

// ============================================================
// 2. ТАЙМЕР ОБРАТНОГО ОТСЧЁТА
// ============================================================

function updateTimer() {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
        document.getElementById('timer').innerHTML = "<h2 style='font-size: 5vw;'>GTA VI IS OUT!</h2>";
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Добавляем ведущие нули
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');
}

// ============================================================
// 3. СМЕНА ФОНА В ЗАВИСИМОСТИ ОТ ВРЕМЕНИ СУТОК
// ============================================================

// Определяем, какой фон должен быть активен сейчас
function getCurrentBgId() {
    const hour = new Date().getHours();

    if (hour >= 6 && hour < 12) {
        return 'bg-morning';   // Утро: 06:00 – 11:59
    } else if (hour >= 12 && hour < 18) {
        return 'bg-day';       // День: 12:00 – 17:59
    } else if (hour >= 18 && hour < 24) {
        return 'bg-evening';   // Вечер: 18:00 – 23:59
    } else {
        return 'bg-night';     // Ночь: 00:00 – 05:59
    }
}

// Применяем нужный фон (плавно через CSS transition)
function updateBackground() {
    const activeBgId = getCurrentBgId();

    document.querySelectorAll('.bg').forEach(bg => {
        if (bg.id === activeBgId) {
            bg.style.opacity = '1';   // Показываем
        } else {
            bg.style.opacity = '0';   // Скрываем
        }
    });
}

// Планируем следующее переключение ровно в момент смены времени суток
function scheduleNextBackgroundChange() {
    const now = new Date();
    const currentHour = now.getHours();

    // Определяем, в какой час произойдёт следующая смена
    let nextChangeHour;
    if (currentHour < 6) {
        nextChangeHour = 6;
    } else if (currentHour < 12) {
        nextChangeHour = 12;
    } else if (currentHour < 18) {
        nextChangeHour = 18;
    } else {
        nextChangeHour = 24; // Полночь (0:00 следующего дня)
    }

    // Вычисляем, сколько миллисекунд осталось до этого момента
    const nextChange = new Date(now);
    nextChange.setHours(nextChangeHour, 0, 0, 0);
    const msUntilChange = nextChange - now;

    // Ставим таймер на точное время
    setTimeout(() => {
        updateBackground();                 // Меняем фон
        scheduleNextBackgroundChange();     // Планируем следующую смену
    }, msUntilChange);
}

// ============================================================
// 4. УПРАВЛЕНИЕ МУЗЫКОЙ (клик по логотипу)
// ============================================================

function initMusic() {
    const logoBtn = document.getElementById('logo-btn');
    const bgMusic = document.getElementById('bg-music');

    if (!logoBtn || !bgMusic) {
        console.warn('Элементы для музыки не найдены: проверьте id="logo-btn" и id="bg-music".');
        return;
    }

    let isPlaying = false;

    logoBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            isPlaying = false;
            // Возвращаем обычную тень
            logoBtn.style.filter = 'drop-shadow(2px 2px 15px rgba(0, 0, 0, 0.9))';
        } else {
            bgMusic.play()
                .then(() => {
                    isPlaying = true;
                    // Неоновое свечение, пока играет музыка
                    logoBtn.style.filter = 'drop-shadow(0px 0px 25px rgba(255, 0, 128, 0.9))';
                })
                .catch(error => {
                    console.error('Ошибка воспроизведения музыки:', error);
                    // Можно показать пользователю подсказку, но не обязательно
                });
        }
    });
}

// ============================================================
// 5. ЗАПУСК ВСЕГО
// ============================================================

// Таймер обновляем каждую секунду
setInterval(updateTimer, 1000);
updateTimer();

// Инициализация фона
updateBackground();                // Сразу при загрузке
scheduleNextBackgroundChange();    // Запланировать переход в 06:00 / 12:00 / 18:00 / 00:00

// Дополнительная проверка каждые 10 секунд (на случай ручной смены системного времени)
setInterval(updateBackground, 10000);

// Инициализация музыки после полной загрузки DOM
document.addEventListener('DOMContentLoaded', initMusic);
