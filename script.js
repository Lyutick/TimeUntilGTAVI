// УСТАНОВИТЕ ДАТУ ВЫХОДА GTA VI ЗДЕСЬ
// Формат: 'YYYY-MM-DDTHH:MM:SS'
const targetDate = new Date('2026-11-19T00:00:00').getTime();

// Функция обновления таймера
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

// Функция смены фона в зависимости от времени суток
function updateBackground() {
    const hour = new Date().getHours();
    let activeBgId = '';
    
    if (hour >= 6 && hour < 12) {
        activeBgId = 'bg-morning';
    } else if (hour >= 12 && hour < 18) {
        activeBgId = 'bg-day';
    } else if (hour >= 18 && hour < 24) {
        activeBgId = 'bg-evening';
    } else {
        activeBgId = 'bg-night';
    }

    document.querySelectorAll('.bg').forEach(bg => {
        if (bg.id === activeBgId) {
            bg.style.opacity = '1';
        } else {
            bg.style.opacity = '0';
        }
    });
}

// Запускаем таймер каждую секунду
setInterval(updateTimer, 1000);
updateTimer();

// Проверяем время суток каждую минуту
setInterval(updateBackground, 60000);
updateBackground();

// --- УПРАВЛЕНИЕ МУЗЫКОЙ ---
const logoBtn = document.getElementById('logo-btn');
const bgMusic = document.getElementById('bg-music');
let isPlaying = false;

logoBtn.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        isPlaying = false;
        // Возвращаем логотипу обычный вид (убираем постоянное свечение, если нужно)
        logoBtn.style.filter = "drop-shadow(2px 2px 15px rgba(0, 0, 0, 0.9))";
    } else {
        bgMusic.play();
        isPlaying = true;
        // Добавляем логотипу постоянное свечение, пока играет музыка
        logoBtn.style.filter = "drop-shadow(0px 0px 25px rgba(255, 0, 128, 0.9))"; 
    }
});