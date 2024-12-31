function initTargetCommonView() {
   const individContent = document.getElementById('individ__content_target')
   removeChilds(individContent)
   const saveButton = document.createElement('button')
   saveButton.textContent = 'Сохранить настройки и перевсти устройства в режим WEB-МИШЕНЬ'
   saveButton.classList.add('btn', 'btn-success', 'd-block', 'mx-auto', 'mt-3')
   saveButton.addEventListener('click', function () {
      stopTargetTimer()
      removeChilds(individContent)
      saveTargetSettings()
   })
   const saveWarning = document.createElement('div')
   saveWarning.innerHTML = '* - при нажатии кнопки <span style="color: lightgreen">"СОХРАНИТЬ"</span>, все подключенные устройства закроют текущие режимы и перейдут в <span style="color: lightgreen"> WEB-МИШЕНЬ </span>режим без сохранения текущих локальных данных"'
   saveWarning.classList.add('red')
   saveWarning.style.maxWidth = '300px'
   saveWarning.style.margin = 'auto'
   saveWarning.style.fontWeight = 'bold'
   saveWarning.style.textAlign = 'center'

   individContent.appendChild(saveButton)
   individContent.appendChild(saveWarning)
}
function initCommonSettingsTargetView() {
   Object.keys(targetConfig).forEach(function (key) {
      if (key === 'round_duration_min') {
         document.getElementById('round_duration_target').value = targetConfig[key]
      } else
         document.getElementById(key).value = targetConfig[key]
   })
}


function fillTargetScoresTable() {
   const target_statistic = document.getElementById('target_statistic')
   let stat_list = document.getElementById('stat_list_target')
   if (stat_list)
      stat_list.innerHTML = ''
   else {
      stat_list = document.createElement('div');
      stat_list.id = 'stat_list_target'
   }

   Object.keys(scores_target).forEach(function (key) {
      stat_list.innerHTML += `
                 <div class="row fw-normal">
                     <div class="col-3 fw-bold" id="score_target_id${key}" style="color:white">${key}:</div>
                     <div class="col-2" style="color:${colors.red}" id="score_red-${key}">${scores_target[key].red}</div>
                     <div class="col-2" style="color:${colors.blue}" id="score_blue-${key}">${scores_target[key].blue}</div>
                     <div class="col-2" style="color:${colors.green}" id="score_green-${key}">${scores_target[key].green}</div>
                     <div class="col-2" style="color:${colors.yellow}" id="score_yellow-${key}">${scores_target[key].yellow}</div>
                 </div>
                 <hr>
             `;
   })
   target_statistic.appendChild(stat_list)
   let red_score = 0
   let blue_score = 0
   let green_score = 0
   let yellow_score = 0
   Object.keys(scores_target).forEach(function (key) {
      red_score += scores_target[key].red
      blue_score += scores_target[key].blue
      green_score += scores_target[key].green
      yellow_score += scores_target[key].yellow
   })
   let totalStat = document.getElementById('stat_total_target')
   if (totalStat)
      totalStat.innerHTML = ''
   else {
      totalStat = document.createElement('div');
      totalStat.id = 'stat_total_target'
   }
   totalStat.innerHTML = `
   <div class="row fw-bold">
       <div class="col-3 text-white">Счет:</div>
       <div class="col-2" style="color:${colors.red}">${red_score}</div>
       <div class="col-2" style="color:${colors.blue}">${blue_score}</div>
       <div class="col-2" style="color:${colors.green}">${green_score}</div>
       <div class="col-2" style="color:${colors.yellow}">${yellow_score}</div>
   </div>
`;
   target_statistic.appendChild(totalStat)
}

function initTARGET_statistic_start_restart_view() {
   // console.log('initTARGET_statistic_start_restart_view()')
   const start_target_game_btn = document.getElementById('btn_start_target_game')
   const reset_target_scores_btn = document.getElementById('btn_reset_scores_target_game')
   const stop_target_game_btn = document.getElementById('btn_stop_target_game')
   stop_target_game_btn.disabled = true
   // запустить игру
   start_target_game_btn.addEventListener('click', function () {
      console.log("sendRandomTargetCMD")
      document.getElementById("game_target_timer").style.display = 'block';
      reset_target_scores_btn.disabled = true
      start_target_game_btn.disabled = true
      stop_target_game_btn.disabled = false
      document.getElementById('overlay').style.display = 'block'
      startTargetTimers(3, targetConfig.round_duration_min)
      flag_game_target_started = true
   })
   // сбросить баллы
   reset_target_scores_btn.addEventListener('click', function () {
      sendCMD(CMD_RESET_SCORES_TARGET);
   })
   // остановить игру
   stop_target_game_btn.addEventListener('click', function () {
      flag_game_target_started = false
      reset_target_scores_btn.disabled = false
      start_target_game_btn.disabled = false
      stop_target_game_btn.disabled = true
      document.getElementById('overlay').style.display = 'none'
      stopTargetTimer();
      sendCMD(CMD_STOP_TARGET_GAME);
   })
}

// TIMERS
function stopTargetTimer() {
   clearInterval(targetTimerIntervalId)
   document.getElementById("game_target_timer").style.display = 'none';
}

function startTargetTimers(seconds_before, minutes_game_duration) {
   let timeBeforeInSeconds = --seconds_before;
   let gameDurationTimeInSeconds = (minutes_game_duration * 6) - 1;
   let timer_indicator = document.getElementById("game_target_timer_indicator");
   let game_state = document.getElementById('game_target_state')
   game_state.textContent = 'ОБРАТНЫЙ ОТСЧЕТ'
   timer_indicator.textContent = updateTargetTimer(timeBeforeInSeconds)
   function updateTargetTimer(time) {
      let hrs = Math.floor(time / 3600);
      let mins = Math.floor((time % 3600) / 60);
      let secs = time % 60;
      let timeString =
         String(hrs).padStart(2, '0') + ':' +
         String(mins).padStart(2, '0') + ':' +
         String(secs).padStart(2, '0');
      return timeString;

   }
   if (timeBeforeInSeconds < 0 || gameDurationTimeInSeconds < 0) {
      clearInterval(targetTimerIntervalId);
      return;
   }

   targetTimerIntervalId = setInterval(function () {
      if (timeBeforeInSeconds > -1)
         --timeBeforeInSeconds
      else if (gameDurationTimeInSeconds > -1)
         --gameDurationTimeInSeconds
      if (timeBeforeInSeconds > -1)
         timer_indicator.textContent = updateTargetTimer(timeBeforeInSeconds)
      else if (gameDurationTimeInSeconds > -1) {
         game_state.textContent = 'ИДЕТ ИГРА'
         if(timeBeforeInSeconds === -1){
            sendRandomTargetCMD();
            --timeBeforeInSeconds
         }
         timer_indicator.textContent = updateTargetTimer(gameDurationTimeInSeconds)
      }
      else {
         timer_indicator.textContent = updateTargetTimer(0)
         sendCMD(CMD_STOP_TARGET_GAME);

         game_state.textContent = 'ИГРА ОКОНЧЕНА'
         clearInterval(targetTimerIntervalId)
      }
   }, 1000);
}
