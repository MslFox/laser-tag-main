let arrOfTargetSocketKeys = []

function initSockets() {
  Object.keys(points).forEach((key) => {
    if (points[key].connect) {
      // console.log('connect to: ' + gatewaysID[key]);
      initWebSocket(key);
    }
  });
}


function initWebSocket(key) {
  if (points[key].connect) {
    const websocket = new WebSocket(gatewaysID[key]);
    websocket.onopen = function (event) { onOpen(event, key, websocket); };
    websocket.onclose = function (event) { onClose(event, key); };
    websocket.onmessage = function (event) { onMessage(event, key); };
    setConnectionInfoPointView(key, 'подключение', 'goldenrod')
  }
}



function onClose(event, key) {
  if (points[key].connect) {
    websockets[key] = '';
    initWebSocket(key);
  }
}

function onOpen(event, key, websocket) {
  websockets[key] = websocket;
  setConnectionInfoPointView(key, 'в игре', 'green')
}


function setConnectionInfoPointView(key, text, color) {
  let info = document.getElementById('isconnect_' + key)
  info.textContent = text
  info.style.color = color
}

function disconnectSocket(key, connectAgain) {
  if (websockets[key] !== '' && websockets[key].readyState === WebSocket.OPEN) {
    websockets[key].close();
  }
  websockets[key] = '';
  if (individBaseConfig[key])
    delete individBaseConfig[key]
  if (scores_base[key])
    delete scores_base[key]
  if (scores_target[key])
    delete scores_target[key]
  initBaseCommonView()
  fillBaseScoresTable()
  fillTargetScoresTable()
  setConnectionInfoPointView(key, 'не в игре', 'red')
}

function refreshSocket() {
  Object.keys(points).forEach((key) => {
    disconnectSocket(key)
  });
}


function saveBaseSettings(key) {
  Object.keys(individBaseConfig).forEach(function (key) {
    let combinedConfig = {
      cmd: CMD_UPDATE_BASE_SETTING,
      ...baseConfig,
      ...individBaseConfig[key] // Добавляем данные из individBaseConfig[1], если они существуют
    };
    let jsonString = JSON.stringify(combinedConfig);
    console.log(combinedConfig)
    console.log(jsonString)
    websockets[key].send(jsonString)
    delete individBaseConfig[key]
  })

}
function saveTargetSettings() {
  Object.keys(websockets).forEach(function (key) {
    let combinedConfig = {
      cmd: CMD_UPDATE_TARGET_SETTING,
      ...targetConfig
    };
    let jsonString = JSON.stringify(combinedConfig);
    if (websockets[key]) {
      // console.log(jsonString)
      websockets[key].send(jsonString)
    }
  })
}

function sendCMD(command) {
  if (command)
    Object.keys(websockets).forEach(function (key) {
      if (websockets[key])
        websockets[key].send('{"cmd":' + command + '}')
       console.log("Stop target" + websockets[key] + command)
    })
  arrOfTargetSocketKeys = []
  targetId = -1
  last_targetId = -11
}
let last_targetId = -1
let targetId = -1
function sendRandomTargetCMD() {
  if (arrOfTargetSocketKeys.length === 0) {
    Object.keys(websockets).forEach(function (key) {
      if (websockets[key])
        arrOfTargetSocketKeys.push(key)
    })
  }
  console.log(arrOfTargetSocketKeys)
  if (arrOfTargetSocketKeys.length > 1) {
    while (!arrOfTargetSocketKeys[targetId] || last_targetId === targetId) {
      console.log("targetId: " + targetId)
      targetId = getRandomInt(arrOfTargetSocketKeys.length)
    };
    last_targetId = targetId
    if (websockets[arrOfTargetSocketKeys[targetId]]) {
      websockets[arrOfTargetSocketKeys[targetId]].send('{"cmd":' + CMD_START_TARGET_GAME + '}')
      console.log(arrOfTargetSocketKeys[targetId] + '   {"cmd":' + CMD_START_TARGET_GAME + '}')
      arrOfTargetSocketKeys.splice(targetId, 1)
    }
  }
  else if (arrOfTargetSocketKeys.length === 1) {
    websockets[arrOfTargetSocketKeys[0]].send('{"cmd":' + CMD_START_TARGET_GAME + '}')
    last_targetId = arrOfTargetSocketKeys[0]
    arrOfTargetSocketKeys = []
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


function onMessage(event, key) {
  const msg = JSON.parse(event.data);
  // console.log(msg)
  if (msg.cmd)
    switch (msg.cmd) {
      case CMD_UPDATE_BASE_SETTING:
        individBaseConfig[key] = {
          command_color: msg.command_color,
          score_red: msg.score_r,
          score_blue: msg.score_b,
          score_green: msg.score_g,
          score_yellow: msg.score_y,
          score_violete: msg.score_v,
        }
        initBaseCommonView()
        break;

      case CMD_UPDATE_TARGET_SETTING:
        // console.log(msg)
        initTargetCommonView()
        break;

      case CMD_UPDATE_BASE_SCORES:
        // console.log(msg)
        scores_base[key] = {
          red: msg.r,
          blue: msg.b,
          green: msg.g,
          yellow: msg.y
        }
        fillBaseScoresTable()
        break;
      case CMD_UPDATE_TARGET_SCORES:
        scores_target[key] = {
          red: msg.r,
          blue: msg.b,
          green: msg.g,
          yellow: msg.y
        }
        fillTargetScoresTable()
        if (flag_game_target_started) {
          websockets[key].send('{"cmd":' + CMD_STOP_TARGET_GAME + '}')
          console.log("send stop game to websockets[key] key=" + key)
          sendRandomTargetCMD()
        }
        break;
      default:
        break;
    }
}

