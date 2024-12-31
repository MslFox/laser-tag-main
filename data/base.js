function initBaseCommonView() {
   const individContent = document.getElementById('individ__content_base')
   removeChilds(individContent)

   Object.keys(individBaseConfig).forEach(key => {
      const row = document.createElement('div')
      row.classList.add('individ__row')
      const name = document.createElement('span')
      name.textContent = key
      name.style.color = individBaseConfig[key].command_color

      row.appendChild(name)
      row.appendChild(createColorSelector(key, name))

      Object.keys(individBaseConfig[key]).forEach(score_key => {

         if (score_key.includes('score'))
            row.appendChild(createScoreSelector(key, score_key))
      })
      individContent.appendChild(row)
   })
   const saveButton = document.createElement('button')
   saveButton.textContent = 'Сохранить настройки и перевсти устройства в режим WEB-БАЗА '
   saveButton.classList.add('btn', 'btn-success', 'd-block', 'mx-auto', 'mt-3')
   saveButton.addEventListener('click', function () {
      stopBaseTimer()
      removeChilds(individContent)
      saveBaseSettings()

   })
   const saveWarning = document.createElement('div')
   saveWarning.innerHTML = '* - при нажатии кнопки <span style="color: lightgreen">"СОХРАНИТЬ" или "СМЕНА СТОРОН"</span>, все подключенные устройства закроют текущие режимы и перейдут в <span style="color: lightgreen"> WEB-БАЗА </span> режим без сохранения текущих локальных данных'
   const reverseSideButton = document.createElement('button')
   reverseSideButton.classList.add('btn', 'btn-warning', 'd-block', 'mx-auto', 'mt-3')
   reverseSideButton.textContent = 'Смена цветов сторон и сохранение'
   reverseSideButton.id = 'btn_reverse_side'
   reverseSideButton.addEventListener('click', function () {
      reverseColorSide();
   })
   saveWarning.classList.add('red')
   saveWarning.style.maxWidth = '300px'
   saveWarning.style.margin = 'auto'
   saveWarning.style.fontWeight = 'bold'
   saveWarning.style.textAlign = 'center'

   individContent.appendChild(saveButton)
   individContent.appendChild(saveWarning)
}

function initBASE_statistic_start_restart_view() {

   const start_base_game_btn = document.getElementById('btn_start_base_game')
   const reset_base_scores_btn = document.getElementById('btn_reset_scores_base_game')
   const stop_base_game_btn = document.getElementById('btn_stop_base_game')
   stop_base_game_btn.disabled = true
   // запустить игру
   start_base_game_btn.addEventListener('click', function () {
      sendCMD(CMD_START_BASE_GAME);
      document.getElementById("game_base_timer").style.display = 'block';
      reset_base_scores_btn.disabled = true
      start_base_game_btn.disabled = true
      stop_base_game_btn.disabled = false
      document.getElementById('overlay').style.display = 'block'
      startBaseTimers(baseConfig.time_before_start, baseConfig.round_duration)
   })
   // сбросить баллы
   reset_base_scores_btn.addEventListener('click', function () {
      sendCMD(CMD_RESET_SCORES_BASE);
   })
   // остановить игру
   stop_base_game_btn.addEventListener('click', function () {
      reset_base_scores_btn.disabled = false
      start_base_game_btn.disabled = false
      stop_base_game_btn.disabled = true
      document.getElementById('overlay').style.display = 'none'
      stopBaseTimer();
      sendCMD(CMD_STOP_BASE_GAME);
   })
}

function initCommonSettingsBaseView() {
   Object.keys(baseConfig).forEach(function (key) {
      if (key === 'player_id') {
         document.getElementById(key).value = baseConfig[key] === 'true' ? 'ДА' : 'НЕТ'
         document.getElementById(key).setAttribute('data-toggle', baseConfig[key])
      }
      else
         document.getElementById(key).value = baseConfig[key]
      // console.log(key)
      // console.log(baseConfig[key])
   })
}

function reverseColorSide() {
   const colorMap = {
      red: false,
      blue: false,
      green: false,
      yellow: false
   }
   Object.keys(individBaseConfig).forEach(function (key) {
      if (!colorMap[individBaseConfig[key].command_color] && individBaseConfig[key].command_color !== 'violete')
         colorMap[individBaseConfig[key].command_color] = true
   })
   Object.keys(individBaseConfig).forEach(function (key) {
      let command_color = individBaseConfig[key].command_color
      individBaseConfig[key].command_color = getReversedColor(command_color, colorMap)
   })
   console.log(individBaseConfig)
   saveBaseSettings()
}
function getReversedColor(color, colorMap) {
   console.log(colorMap)
   switch (color) {
      case 'red':
         if (colorMap['blue'])
            return 'blue'
         else if (colorMap['green'])
            return 'green'
         else if (colorMap['yellow'])
            return 'yellow'
         else
            return 'red'
      case 'blue':
         if (colorMap['green'])
            return 'green'
         else if (colorMap['yellow'])
            return 'yellow'
         else if (colorMap['red'])
            return 'red'
         else
            return 'blue'
         break;
      case 'green':
         if (colorMap['yellow'])
            return 'yellow'
         else if (colorMap['red'])
            return 'red'
         else if (colorMap['blue'])
            return 'blue'
         else
            return 'green'
      case 'yellow':
         if (colorMap['red'])
            return 'red'
         if (colorMap['blue'])
            return 'blue'
         else if (colorMap['green'])
            return 'green'
         else
            return 'yellow'
      default:
         return 'violete'
   }
}

function fillBaseScoresTable() {
   const base_statistic = document.getElementById('base_statistic')
   let stat_list = document.getElementById('stat_list')
   if (stat_list)
      stat_list.innerHTML = ''
   else {
      stat_list = document.createElement('div');
      stat_list.id = 'stat_list'
   }
   Object.keys(scores_base).forEach(function (key) {
      stat_list.innerHTML += `
                 <div class="row fw-normal">
                     <div class="col-3 fw-bold" id="score_base_id${key}" style="color:${individBaseConfig[key].command_color}">${key}:</div>
                     <div class="col-2" style="color:${colors.red}" id="score_red-${key}">${scores_base[key].red}</div>
                     <div class="col-2" style="color:${colors.blue}" id="score_blue-${key}">${scores_base[key].blue}</div>
                     <div class="col-2" style="color:${colors.green}" id="score_green-${key}">${scores_base[key].green}</div>
                     <div class="col-2" style="color:${colors.yellow}" id="score_yellow-${key}">${scores_base[key].yellow}</div>
                 </div>
                 <hr>
             `;
   })
   base_statistic.appendChild(stat_list)
   let red_score = 0
   let blue_score = 0
   let green_score = 0
   let yellow_score = 0
   Object.keys(scores_base).forEach(function (key) {
      red_score += scores_base[key].red
      blue_score += scores_base[key].blue
      green_score += scores_base[key].green
      yellow_score += scores_base[key].yellow
   })
   let totalStat = document.getElementById('stat_total')
   if (totalStat)
      totalStat.innerHTML = ''
   else {
      totalStat = document.createElement('div');
      totalStat.id = 'stat_total'
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
   base_statistic.appendChild(totalStat)
}


// ****************  TIMERS

function stopBaseTimer() {
   clearInterval(baseTimerIntervalId)
   document.getElementById("game_base_timer").style.display = 'none';
}


function startBaseTimers(seconds_before, minutes_game_duration) {
   let timeBeforeInSeconds = --seconds_before;
   let gameDurationTimeInSeconds = (minutes_game_duration * 60) - 1;
   let timer_indicator = document.getElementById("game_base_timer_indicator");
   let game_state = document.getElementById('game_base_state')
   game_state.textContent = 'ОБРАТНЫЙ ОТСЧЕТ'
   timer_indicator.textContent = updateBaseTimer(timeBeforeInSeconds)
   function updateBaseTimer(time) {
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
      clearInterval(baseTimerIntervalId);
      return;
   }

   baseTimerIntervalId = setInterval(function () {
      if (timeBeforeInSeconds > -1)
         --timeBeforeInSeconds
      else if (gameDurationTimeInSeconds > -1)
         --gameDurationTimeInSeconds
      if (timeBeforeInSeconds > -1)
         timer_indicator.textContent = updateBaseTimer(timeBeforeInSeconds)
      else if (gameDurationTimeInSeconds > -1) {
         game_state.textContent = 'ИДЕТ ИГРА'
         timer_indicator.textContent = updateBaseTimer(gameDurationTimeInSeconds)
      }
      else {
         timer_indicator.textContent = updateBaseTimer(0)
         game_state.textContent = 'ИГРА  ОКОНЧЕНА'
         clearInterval(baseTimerIntervalId)
      }
   }, 1000);
}
