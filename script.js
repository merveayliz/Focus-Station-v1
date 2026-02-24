let timeLeft = 25 * 60;
let timerId = null;
let mode = "countdown"; 
let secondsPassed = 0; 

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const saveBtn = document.getElementById('saveBtn');
const clearBtn = document.getElementById('clearDataBtn');
const resetBtn = document.getElementById('resetBtn');



function setTimer(minutes) {
    clearInterval(timerId);
    timerId = null;
    startBtn.textContent = "Başlat";
    
    if (minutes === 0) {
        mode = "stopwatch";
        timeLeft = 0;
        timerDisplay.innerHTML = "00:00";
    } else {
        mode = "countdown";
        timeLeft = minutes * 60;
        updateTimerDisplay();
    }
    secondsPassed = 0;
}

function updateTimerDisplay() {
    const mins = Math.floor(Math.abs(timeLeft) / 60);
    const secs = Math.abs(timeLeft) % 60;
    timerDisplay.innerHTML = `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
}


startBtn.addEventListener('click', () => {
    if (timerId === null) {
        timerId = setInterval(() => {
            if (mode === "countdown") {
                if (timeLeft > 0) {
                    timeLeft--;
                    secondsPassed++;
                } else {
                    alert("Süre bitti!");
                    clearInterval(timerId);
                }
            } else {
                timeLeft++; 
                secondsPassed++;
            }
            updateTimerDisplay();
        }, 1000);
        startBtn.textContent = "Durdur";
    } else {
        clearInterval(timerId);
        timerId = null;
        startBtn.textContent = "Devam Et";
    }
});


saveBtn.addEventListener('click', () => {
    const minsToSave = Math.floor(secondsPassed / 60);
    if (minsToSave > 0) {
        saveProgress(minsToSave);
        alert(`${minsToSave} dakika başarıyla kaydedildi!`);
        secondsPassed = secondsPassed % 60; 
    } else {
        alert("Kaydetmek için en az 1 dakika çalışmalısın kanka!");
    }
});


clearBtn.addEventListener('click', () => {
    if (confirm("Tüm çalışma verilerini silmek istediğine emin misin?")) {
        localStorage.removeItem('focusData');
        loadStats();
    }
});


resetBtn.addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    secondsPassed = 0;
    setTimer(mode === "countdown" ? 25 : 0);
    startBtn.textContent = "Başlat";
});

function setTheme(themeName) {
    document.body.setAttribute('data-theme', themeName);
    localStorage.setItem('activeTheme', themeName);
}


function loadStats() {
    const todayDisplay = document.getElementById('today-total');
    const progressBar = document.getElementById('progress-bar');
    const goalPercent = document.getElementById('goal-percent');
    
    const data = JSON.parse(localStorage.getItem('focusData')) || { todayMins: 0 };
    
    todayDisplay.textContent = data.todayMins;

   
    const goal = 300;
    let percent = (data.todayMins / goal) * 100;
    if (percent > 100) percent = 100; 

    progressBar.style.width = percent + "%";
    goalPercent.textContent = Math.round(percent) + "%";
}


function saveProgress(minutes) {
    const today = new Date().toLocaleDateString();
    let data = JSON.parse(localStorage.getItem('focusData')) || { lastDate: today, todayMins: 0 };

    if (data.lastDate !== today) {
        data.todayMins = minutes;
        data.lastDate = today;
    } else {
        data.todayMins += minutes;
    }

    localStorage.setItem('focusData', JSON.stringify(data));
    loadStats(); 
}


window.onload = () => {
    const savedTheme = localStorage.getItem('activeTheme') || 'yazilim';
    setTheme(savedTheme);
    loadStats();
    updateTimerDisplay();
};

let currentAudio = null;

function toggleSound(type) {
    const audio = document.getElementById(`audio-${type}`);
    
    
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    if (audio.paused) {
        audio.play();
        currentAudio = audio;
    
    } else {
        audio.pause();
        currentAudio = null;
    }
}