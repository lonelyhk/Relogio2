const hr = document.getElementById("hour");
const min = document.getElementById("min");
const sec = document.getElementById("sec");

const setAlarmButton = document.getElementById("set-alarm");
const alarmModal = document.getElementById("alarm-modal");
const closeModalButton = document.getElementById("close-modal");

const alarmTimeInput = document.getElementById("alarm-time");
const saveAlarmButton = document.getElementById("save-alarm");

const alarmSound = document.getElementById("alarm-sound");
const stopAlarmButton = document.getElementById("stop-alarm");

let alarmTime = null;
let alarmPlaying = false;
let alarmInterval; // Tornar a variável global

function updateClock() {
  const now = new Date();

  const hours = now.getHours();     // hora local
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const hourDeg = (hours % 12) * 30 + (minutes / 60) * 30;
  const minuteDeg = minutes * 6 + (seconds / 60) * 6;
  const secondDeg = seconds * 6;

  hr.style.transform = `rotate(${hourDeg}deg)`;
  min.style.transform = `rotate(${minuteDeg}deg)`;
  sec.style.transform = `rotate(${secondDeg}deg)`;
}

// Abrir o modal ao clicar no botão "Definir Alarme"
setAlarmButton.addEventListener("click", () => {
  alarmModal.classList.remove("hidden");
});

// Fechar o modal ao clicar no botão "Fechar"
closeModalButton.addEventListener("click", () => {
  alarmModal.classList.add("hidden");
});

// Remover alertas ao salvar o alarme e ao atingir o horário
saveAlarmButton.addEventListener("click", () => {
  alarmTime = alarmTimeInput.value;
  if (alarmTime) {
    alarmModal.classList.add("hidden");
  }
});

// Parar o alarme ao clicar no botão "Parar Alarme"
stopAlarmButton.addEventListener("click", () => {
  if (alarmPlaying) {
    alarmSound.pause();
    alarmSound.currentTime = 0; // Reiniciar o som
    alarmPlaying = false;
    alarmTime = null; // Resetar o alarme
  }
  if (alarmInterval) {
    clearInterval(alarmInterval); // Parar o intervalo do alarme
  }
});

function checkAlarm() {
  if (alarmTime) {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); // Formato HH:MM

    if (currentTime === alarmTime && !alarmPlaying) {
      alarmPlaying = true;
      let currentSecond = 0; // Começar pelo traço de número 12 (0 segundos)

      alarmInterval = setInterval(() => {
        alarmSound.play(); // Tocar o som do alarme

        if (currentSecond === 0 && alarmPlaying === false) {
          clearInterval(alarmInterval); // Parar o intervalo ao completar a volta
          alarmSound.pause();
          alarmSound.currentTime = 0; // Reiniciar o som
          alarmPlaying = false;
          alarmTime = null; // Resetar o alarme após tocar
        } else {
          currentSecond = currentSecond === 54 ? 0 : currentSecond + 6; // Avançar 6 segundos
          if (currentSecond === 0) {
            alarmPlaying = false; // Marcar que completou a volta
          }
        }
      }, 6000); // Intervalo de 6 segundos para cada traço
    }
  }
}

// Solicitar permissão para executar áudio
function requestAudioPermission() {
  const permissionModal = document.createElement('div');
  permissionModal.classList.add('modal');
  permissionModal.innerHTML = `
    <div class="modal-content">
      <h2>Permissão Necessária</h2>
      <p>Este site precisa de permissão para executar áudio. Deseja permitir?</p>
      <button id="allow-audio">Permitir</button>
    </div>
  `;
  document.body.appendChild(permissionModal);

  const allowAudioButton = document.getElementById('allow-audio');
  allowAudioButton.addEventListener('click', () => {
    permissionModal.remove();
    alarmSound.play().catch(() => {
      console.log('Permissão para áudio concedida.');
    });
    alarmSound.pause();
    alarmSound.currentTime = 0;
  });
}

// Chamar a função de solicitação de permissão ao carregar a página
window.addEventListener('load', requestAudioPermission);

setInterval(updateClock, 1000);
updateClock(); // chama já no início

setInterval(checkAlarm, 1000);
