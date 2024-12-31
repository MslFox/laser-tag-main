const gatewaysID = {
   1: 'ws://192.168.1.111/ws',
   2: 'ws://192.168.1.112/ws',
   3: 'ws://192.168.1.113/ws',
   4: 'ws://192.168.1.114/ws',
   5: 'ws://192.168.1.115/ws',
   6: 'ws://192.168.1.116/ws',
   7: 'ws://192.168.1.117/ws',
   8: 'ws://192.168.1.118/ws',
   9: 'ws://192.168.1.119/ws',
   10: 'ws://192.168.1.120/ws',
   11: 'ws://192.168.1.121/ws',
   12: 'ws://192.168.1.122/ws',
   13: 'ws://192.168.1.123/ws',
   14: 'ws://192.168.1.124/ws',
   15: 'ws://192.168.1.125/ws',
}

const websockets = { 1: '', 2: '', 3: '', 4: '', 5: '', 6: '', 7: '', 8: '', 9: '', 10: '', 11: '', 12: '', 13: '', 14: '', 15: '' };

let points = {
   1: { connect: false },
   2: { connect: false },
   3: { connect: false },
   4: { connect: false },
   5: { connect: false },
   6: { connect: false },
   7: { connect: false },
   8: { connect: false },
   9: { connect: false },
   10: { connect: false },
   11: { connect: false },
   12: { connect: false },
   13: { connect: false },
   14: { connect: false },
   15: { connect: false }
}

let baseConfig = {
   time_before_start: 10,
   round_duration: 10,
   player_id: false,
   time_retantion: 10,
   time_confirm: 10,
   timeout_after_capture: 10,
   max_qnty_capture: 10
}
let targetConfig = {
   // время прицеливания При значении 0 параметр не работает, при значении от 1 - 5 лента загорается и горит указанное время белым цветом до момента попадания игроком. Как только игрок попал, включается время вспышки.
   time_aim_sec: 1,
   // время вспышки  Время на которое загорается лента цветом стрелявшего игрока.
   time_flashlight_sec: 0.2,
   // время паузы При 0 параметр не работает. Если значение 1-5 это время в течении которого нельзя поразить мишень. Время паузы работает поочередно с временем прицеливания.
   time_pause_sec: 1,
   round_duration_min: 1
}
const colors = {
   red: 'red',
   blue: 'blue',
   yellow: 'yellow',
   green: 'green',
   violet: 'violet'
}


let individBaseConfig = {
   //  15: { command_color: colors.red, score_red: 1, score_blue: 1, score_green: 1, score_yellow: 1, score_violet: 1 },
}

let scores_base = {
   // 15: {red:99, blue:99, green:999, yellow:999}
}
let scores_target = {
   // 15: {red:99, blue:99, green:999, yellow:999}
}

// commands
const CMD_UPDATE_BASE_SETTING = 10;
const CMD_UPDATE_BASE_SCORES = 12;

const CMD_UPDATE_TARGET_SETTING = 13;
const CMD_UPDATE_TARGET_SCORES = 14;


const CMD_START_BASE_GAME = 20;
const CMD_START_TARGET_GAME = 22;
const CMD_STOP_BASE_GAME = 40;
const CMD_STOP_TARGET_GAME = 44;
const CMD_RESET_SCORES_BASE = 50;
const CMD_RESET_SCORES_TARGET = 55;

// Target game started flag
let flag_game_target_started = false

// Timer for Base Game
let baseTimerIntervalId;
// Timer for Target Game
let targetTimerIntervalId;
