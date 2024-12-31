
// ************************ OnLOAD
window.onload = function () {
   const savedConfiguration = getPointsConfig()
   if (savedConfiguration) {
      points = savedConfiguration
   }

   const savedBaseConfig = getBaseConfig()
   if (savedBaseConfig) {
      baseConfig = savedBaseConfig
   }

   const savedTargetConfig = getTargetConfig()
   if (savedTargetConfig) {
      targetConfig = savedTargetConfig
   }

   $('#tabs a').eq(4).tab('show');

   $('#tabs a').click(function (e) {
      e.preventDefault();
      $(this).tab('show');
   });
   initCommonSettingsBaseView()
   initPointView()
   initSockets()
   initBASE_statistic_start_restart_view()
   initTARGET_statistic_start_restart_view()
   initCommonSettingsTargetView()
   initTargetCommonView()
}

// ********************** POINT  VIEW
function initPointView() {
   let checkboxList = document.getElementById('point__list')
   Object.keys(points).forEach(function (key) {
      let listItem = document.createElement("li");
      let checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.id = 'checkbox_' + key;
      if (points[key].connect) {
         checkbox.checked = true
      }
      let label = document.createElement("label");
      label.htmlFor = 'label_' + checkbox.id;
      label.appendChild(document.createTextNode('Точка ' + key));
      let connectItem = document.createElement("span");
      connectItem.className = 'bordered-item'
      connectItem.id = 'isconnect_' + key
      connectItem.textContent = 'не в игре'
      connectItem.style.color = 'red'
      checkbox.addEventListener("change", function () {
         if (!checkbox.checked) {
            points[key].connect = false
            disconnectSocket(key)
         } else {
            points[key].connect = true
            initWebSocket(key)
         }
         savePointsConfig();
      });
      listItem.appendChild(checkbox);
      listItem.appendChild(label);
      listItem.appendChild(connectItem)
      checkboxList.appendChild(listItem);
   });
}

// ********************** CONFIG  VIEW



function createColorSelector(key, name) {
   const selector = document.createElement("div")
   selector.classList.add('custom-dropdown-select')
   selector.style.background = individBaseConfig[key].command_color
   const options = document.createElement("ul")
   options.classList.add('custom-dropdown-options')
   options.style.zIndex = 1000;

   Object.keys(colors).forEach(function (colorKey) {
      const li = document.createElement("li")
      li.setAttribute('data-color', colors[colorKey])
      li.style.background = colors[colorKey]
      li.addEventListener('click', function (event) {
         let color = event.target.getAttribute('data-color')
         individBaseConfig[key].command_color = color
         selector.style.background = color
         individBaseConfig[key].command_color = color
         name.style.color = color
      });
      options.appendChild(li)
   })
   selector.addEventListener('click', function () {
      options.classList.toggle('show')
   })
   selector.appendChild(options)
   document.addEventListener('click', function (event) {
      if (!selector.contains(event.target)) {
         options.classList.remove('show');
      }
   });
   return selector
}

function createScoreSelector(config_key, score_key) {
   const selectedScore = document.createElement("select")
   for (let i = 1; i < 11; i++) {
      let opt = document.createElement("option")
      opt.value = i
      opt.textContent = i
      selectedScore.appendChild(opt)
   }
   selectedScore.value = individBaseConfig[config_key][score_key]
   if (score_key.includes('red'))
      selectedScore.style.color = colors.red
   if (score_key.includes('green'))
      selectedScore.style.color = colors.green
   if (score_key.includes('violet'))
      selectedScore.style.color = colors.violet
   if (score_key.includes('yellow'))
      selectedScore.style.color = colors.yellow
   if (score_key.includes('blue'))
      selectedScore.style.color = colors.blue
   selectedScore.addEventListener('change', function () {
      individBaseConfig[config_key][score_key] = selectedScore.value
   });
   return selectedScore
}

// ************** SAVE SET CONFIGURATION FUNCTIONS

function savePointsConfig() {

   localStorage.setItem('pointConfig', JSON.stringify(points))
}
function saveBaseConfig() {
   // console.log(commonConfig)
   localStorage.setItem('baseConfig', JSON.stringify(baseConfig))
}
function saveTargetConfig() {
   // console.log(commonConfig)
   localStorage.setItem('targetConfig', JSON.stringify(targetConfig))
   // localStorage.setItem('targetConfig', '')
}
function getBaseConfig() {
   if (localStorage.getItem('baseConfig')) {
      try {
         const savedConfig = JSON.parse(localStorage.getItem('baseConfig'));
         if (isValidBaseStructure(savedConfig)) {
            // console.log('Структура валидна:', savedConfig);
            return savedConfig;
         } else {
            console.error('Структура не соответствует ожидаемому формату');
         }
      } catch (error) {
         console.error('Ошибка при разборе JSON:', error);
      }
   } else {
      console.error('В localStorage нет сохранённой структуры BaseConfig');
   }
}
function getTargetConfig() {
   if (localStorage.getItem('targetConfig')) {
      try {
         const savedConfig = JSON.parse(localStorage.getItem('targetConfig'));
         if (isValidTargetStructure(savedConfig)) {
            // console.log('Структура TargetConfig валидна:', savedConfig);
            return savedConfig;
         } else {
            console.error('Структура TargetConfig не соответствует ожидаемому формату');
         }
      } catch (error) {
         console.error('Ошибка при разборе JSON:', error);
      }
   } else {
      console.error('В localStorage нет сохранённой структуры TargetConfig');
   }
}
function getPointsConfig() {
   if (localStorage.getItem('pointConfig')) {
      try {
         const savedConfig = JSON.parse(localStorage.getItem('pointConfig'));
         if (isValidPointsStructure(savedConfig)) {
            // console.log('Структура PointsConfig валидна:', savedCommon);
            return savedConfig;
         } else {
            console.error('Структура PointsConfig не соответствует ожидаемому формату');
         }
      } catch (error) {
         console.error('Ошибка при разборе JSON:', error);
      }
   } else {
      console.log('В localStorage нет сохранённой структуры PointsConfig');
   }
}
function isValidBaseStructure(structure) {
   if (typeof structure === 'object' && structure !== null) {
      if (!structure || typeof structure !== 'object' ||
         !structure.hasOwnProperty('time_before_start') ||
         !structure.hasOwnProperty('round_duration') ||
         !structure.hasOwnProperty('player_id') ||
         !structure.hasOwnProperty('time_retantion') ||
         !structure.hasOwnProperty('time_confirm') ||
         !structure.hasOwnProperty('timeout_after_capture') ||
         !structure.hasOwnProperty('max_qnty_capture')) {
         return false;
      }
      return true;
   }
   return false;
}

function isValidTargetStructure(structure) {
   if (typeof structure === 'object' && structure !== null) {
      if (!structure || typeof structure !== 'object' ||
         !structure.hasOwnProperty('time_aim_sec') ||
         !structure.hasOwnProperty('time_flashlight_sec') ||
         !structure.hasOwnProperty('time_pause_sec') ||
         !structure.hasOwnProperty('round_duration_min')) {
         return false;
      }
      return true;
   }
   return false;
}
function isValidPointsStructure(structure) {
   if (typeof structure === 'object' && structure !== null) {
      for (let i = 1; i <= 15; i++) {
         const item = structure[i];
         if (
            !item || typeof item !== 'object' ||
            !item.hasOwnProperty('connect')) {
            return false;
         }
      }
      return true;
   }
   return false;
}


// ************************  UTILITIES
function removeChilds(elem) {
   while (elem.firstChild)
      elem.removeChild(elem.firstChild)
}

function implementSaveFunction(id, value, saveFunc) {
   if (typeof saveFunc === 'function' && saveFunc === saveBaseConfig) {
      baseConfig[id] = value
      saveFunc()
   }
   if (typeof saveFunc === 'function' && saveFunc === saveTargetConfig) {
      if(id === 'round_duration_target')
         id = 'round_duration_min'
      targetConfig[id] = value
      saveFunc()
   }
}

function increment(id, min, max, saveFunc) {
   const input = document.getElementById(id)
   let currentValue = parseInt(input.value)
   if (currentValue < max) {
      input.value = currentValue + 1
   } else if (currentValue === max)
      input.value = min
   implementSaveFunction(id, input.value, saveFunc)
}


function decrement(id, min, max, saveFunc) {
   const input = document.getElementById(id)
   let currentValue = parseInt(input.value)
   if (currentValue > min) {
      input.value = currentValue - 1
   } else if (currentValue == min)
      input.value = currentValue = max
   implementSaveFunction(id, input.value, saveFunc)
}

function incrementDouble(id, min, max, saveFunc) {
   const input = document.getElementById(id)
   let currentValue = parseFloat(input.value)
   if (currentValue < max) {
      input.value = (currentValue + 0.1).toFixed(1)
   } else if (currentValue === max)
      input.value = min
   implementSaveFunction(id, input.value, saveFunc)
}

function decrementDouble(id, min, max, saveFunc) {
   const input = document.getElementById(id)
   let currentValue = parseFloat(input.value)
   if (currentValue > min) {
      input.value = (currentValue - 0.1).toFixed(1)
   } else if (currentValue <= min)
      input.value = currentValue = max
   implementSaveFunction(id, input.value, saveFunc)
}
function toggleValue(key, saveFunc) {
   const input = document.getElementById(key)
   input.value = input.getAttribute('data-toggle') === 'true' ? 'НЕТ' : 'ДА'
   input.getAttribute('data-toggle') === 'true' ? input.setAttribute('data-toggle', 'false') : input.setAttribute('data-toggle', 'true')

   if (typeof saveFunc === 'function' && saveFunc === saveBaseConfig) {
      baseConfig[key] = input.getAttribute('data-toggle')
      saveFunc()
   }

}

