var g_resources = [];

var res_img = {
	sprite_background_sunset: 'res/sprite/background_sunset.png',
	sprite_words_title: 'res/sprite/title.png',
	sprite_ui_left: 'res/sprite/ui_left.png',
	sprite_ui_right: 'res/sprite/ui_right.png',
	sprite_ui_shoot: 'res/sprite/shoot.png',
	sprite_ui_hp: 'res/sprite/hp.png',
	sprite_sun: 'res/sprite/sun.png',
	sprite_sunlight: 'res/sprite/sunlight.png',
	sprite_island: 'res/sprite/island.png',
	sprite_ref1: 'res/sprite/ref1.png',
	sprite_ref2: 'res/sprite/ref2.png',
	sprite_ref3: 'res/sprite/ref3.png',
	sprite_ui_bullet: 'res/sprite/bullet.png',
	sprite_role: 'res/sprite/role.png',
	sprite_light: 'res/sprite/light.png',
	sprite_light_fire: 'res/sprite/light_fire.png',
	sprite_fire: 'res/sprite/fire.png',
	sprite_grass: 'res/sprite/grass.png',
	sprite_weapon1: 'res/sprite/weapon1.png',
	sprite_katana: 'res/sprite/katana.png',
	sprite_table: 'res/sprite/table.png',
	sprite_teapot: 'res/sprite/teapot.png',
	sprite_tea_right: 'res/sprite/TeaRight.png',
	sprite_tea_left: 'res/sprite/TeaLeft.png',
	sprite_press_bg: 'res/sprite/press_bg.png',
	sprite_fire: 'res/sprite/fire.png',
	sprite_ammo: 'res/sprite/ammo.png',
	sprite_weapon2: 'res/sprite/weapon2.png',
	sprite_spear: 'res/sprite/spear.png',
	sprite_player: 'res/sprite/player.png',
	sprite_boss: 'res/sprite/boss.png',
	sprite_tea_player: 'res/sprite/tea_player.png',
	sprite_tea_player_start: 'res/sprite/tea_player_start.png',
	sprite_tea_boss: 'res/sprite/tea_boss.png',
	// sprite_ui_tea: 'res/sprite/ui_tea.png',
	// sprite_ui_mountain: 'res/sprite/ui_mountain.png',
	// sprite_ui_talk: 'res/sprite/ui_talk.png',
	sprite_ui_tea: 'res/sprite/choose_drink.png',
	sprite_ui_mountain: 'res/sprite/choose_like.png',
	sprite_ui_talk: 'res/sprite/choose_talk.png',
	sprite_arraw: 'res/sprite/arraw.png',
	sprite_like: 'res/sprite/like.png',
	sprite_mountain: 'res/sprite/mountain.png',
	sprite_pressstart: 'res/sprite/pressstart.png'
};
for (var i in res_img) {
    g_resources.push({src: res_img[i], type: 'png'});
}

var res_plist = {
	p_dust: 'res/sprite/dust.plist',
	p_water: 'res/sprite/water.plist',
	p_tea: 'res/sprite/tea.plist'
};
for (var i in res_plist) {
    g_resources.push({src: res_plist[i], type: 'plist'});
}

var res_audio = {};

if(window.chrome) {
	res_audio = {
		audio_ambient: 'res/audio/ambient.ogg',
		audio_action_talk: 'res/audio/action_talk.ogg',
		audio_action_tea: 'res/audio/action_tea.ogg',
		audio_ammo_teleport: 'res/audio/ammo_teleport.ogg',
		audio_ammo_crush: 'res/audio/ammo_crush.ogg',
		audio_action_mountain: 'res/audio/action_mountain.ogg',
		audio_ambient_mountained: 'res/audio/ambient_mountained.ogg',
		audio_show_tea: 'res/audio/show_tea.ogg',
		audio_tea_drinking_1: 'res/audio/tea_drinking_1.ogg',
		audio_tea_drinking_2: 'res/audio/tea_drinking_2.ogg',
		audio_tea_filling: 'res/audio/tea_filling.ogg',
		audio_tea_unable: 'res/audio/tea_unable.ogg',
		audio_tea_knock_table: 'res/audio/tea_knock_table.ogg'
	}
	for (var i in res_audio) {
	    g_resources.push({src: res_audio[i], type: 'ogg'});
	}
} else {
	res_audio = {
		audio_ambient: 'res/audio/ambient.mp3',
		audio_action_talk: 'res/audio/action_talk.mp3',
		audio_action_tea: 'res/audio/action_tea.mp3',
		audio_ammo_teleport: 'res/audio/ammo_teleport.mp3',
		audio_ammo_crush: 'res/audio/ammo_crush.mp3',
		audio_action_mountain: 'res/audio/action_mountain.mp3',
		audio_ambient_mountained: 'res/audio/ambient_mountained.mp3',
		audio_show_tea: 'res/audio/show_tea.mp3',
		audio_tea_drinking_1: 'res/audio/tea_drinking_1.mp3',
		audio_tea_drinking_2: 'res/audio/tea_drinking_2.mp3',
		audio_tea_filling: 'res/audio/tea_filling.mp3',
		audio_tea_unable: 'res/audio/tea_unable.mp3',
		audio_tea_knock_table: 'res/audio/tea_knock_table.mp3'
	}
	for (var i in res_audio) {
	    g_resources.push({src: res_audio[i], type: 'mp3'});
	}
}