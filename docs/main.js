$(function() {

	const FLAG_INIT = 1;
	const FLAG_DATA = 2;
	const FLAG_ABILITY = 3;
	const FLAG_HPMP = 4;
	const FLAG_LV = 5;
	const FLAG_SKILL = 6;
	const FLAG_WEAPON = 7;
	const FLAG_EQUIP = 8;
	const FLAG_INVENTORY = 9;

	var data = {};
	data.common = {};
	const name_regexp = /キャラクター名：(.+)/g;
	data.common.name = "";
	data.common.size = 1;
	// dataの階層構造
	data.resource = {}
	const longing_regexp = /穢れ度：(.+)/g;
	const hpmp_regexp = /(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)/g;
	data.resource.rehp = 0;
	data.resource.remp = 0;
	data.resource.hp = 0;
	data.resource.mp = 0;
	data.resource.longing = 0;
	const ability_regexp = /=合計=[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)/g;
	const abilityplus_regexp = /ﾎﾞｰﾅｽ[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)/g;
	data.ability = {};
	data.abilityplus = {};
	data.ability.dex = 0;
	data.ability.agi = 0;
	data.ability.str = 0;
	data.ability.vit = 0;
	data.ability.int = 0;
	data.ability.mnd = 0;
	data.abilityplus.dex = 0;
	data.abilityplus.agi = 0;
	data.abilityplus.str = 0;
	data.abilityplus.vit = 0;
	data.abilityplus.int = 0;
	data.abilityplus.mnd = 0;
	const lv_regexp = /([^／\s]+)：(\d+)[\s]+Lv/g;
	const lv1_regexp = /([^／\s]+)[\s]+(\d+)[\s]+Lv/g;
	const lv2_regexp = /([^／\s]+)[\s]+(\d+)[\s]+Lv[\s]+／[\s]+([^／\s]+)[\s]+(\d+)[\s]+Lv/g;
	data.lv_name = [];
	data.lv_value = [];
	let skill_flag = 0;
	const skill_regexp = /\[.+\]([^:]+) : ([^:]+) :/g;
	data.skill_name = [];
	data.skill_ex = [];
	const weapon_regexp =/[\d]+[\s]+.+[\s]+[\d]+[\s]+[\d]+[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]+(\d+)[\s]\[.+\][\s]+(.+)[\s]+\//g;
	data.weapon_hit = [];
	data.weapon_k = [];
	data.weapon_c = [];
	data.weapon_add = [];
	data.weapon_name = [];
	const armour_regexp =/鎧 ：+[\s]+[\d]*[\s]+[\d]*[\s]+[\d]*[\s]+[\d]*[\s]+(.*) \//g;
	data.armour = {};
	data.armour.name = "";
	const shield_regexp =/盾 ：+[\s]+[\d]*[\s]+[\d]*[\s]+[\d]*[\s]+[\d]*[\s]+(.*) \//g;
	data.shield = {};
	data.shield.name = "";
	const equip_regexp =/\= 合計 \=+[\s]+(\d*)[\s]+(\d*)[\s]+[\d]*[\s]+G/g;
	data.equip = {};
	data.equip.agi = "";
	data.equip.vit = "";
        const head_regexp = / 頭 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.head = "";
        const ear_regexp = / 耳 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.ear = "";
        const face_regexp = / 顔 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.face = "";
	const neck_regexp = / 首 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.neck = "";
	const back_regexp = /背中：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.back = "";
 	const right_regexp = /右手：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.right = "";
 	const left_regexp = /左手：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.left = "";
	const hip_regexp = / 腰 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.hip = "";
	const leg_regexp = / 足 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.leg = "";
	const other_regexp = / 他 ：[\d]*[\s]+(\S*)[\s]*\//g;
	data.equip.other = "";
	const inventory_regexp = /(\D+)[\s]+[\d]+[\s]+(\d+)[\s]+[\d]+/g;
	data.inventory = {};
	data.inventory.name = [];
	data.inventory.count = [];


	$('#inputFile').on("change", function() {
		var file = this.files[0];
		var reader = new FileReader()
		reader.readAsText(file)
		reader.onload = function (){
			let result = reader.result;
			let match;
			let matches = []
			while ((match = name_regexp.exec(result))!== null) {
				matches.push(match[1]);
			}
			let lineArr = result.split('\n');
			var flag = FLAG_INIT;
			for (var i = 0; i < lineArr.length; i++) {
				// フラグチェック
				if(lineArr[i].indexOf('パーソナルデータ・経歴') > -1){
					flag = FLAG_DATA;
				} else if(lineArr[i].indexOf('能力値') > -1){
					flag = FLAG_ABILITY;
				} else if(lineArr[i].indexOf('抵抗') > -1 && lineArr[i].indexOf('HP') > -1 && lineArr[i].indexOf('MP') > -1){
					flag = FLAG_HPMP;
				} else if(lineArr[i].indexOf('レベル・技能') > -1){
					flag = FLAG_LV;
				} else if(lineArr[i].indexOf('戦闘特技・値') > -1){
					flag = FLAG_SKILL;
				} else if(lineArr[i].indexOf('・武器') > -1){
                                        flag = FLAG_WEAPON;
				} else if(lineArr[i].indexOf('・防具') > -1){
                                        flag = FLAG_EQUIP;
				} else if(lineArr[i].indexOf('■所持品■') > -1){
                                        flag = FLAG_INVENTORY;
				}





				if(flag == FLAG_INIT){
					let match;
					while ((match = name_regexp.exec(lineArr[i]))!== null) {
						data.common.name = match[1];
					}
				} else if(flag == FLAG_DATA){
					let match;
					while ((match = longing_regexp.exec(lineArr[i]))!== null) {
						data.resource.longing = match[1];
					}
				} else if(flag == FLAG_ABILITY){
					let match;
					while ((match = ability_regexp.exec(lineArr[i]))!== null) {
						data.ability.dex = match[1];
						data.ability.agi = match[2];
						data.ability.str = match[3];
						data.ability.vit = match[4];
						data.ability.int = match[5];
						data.ability.mnd = match[6];
					}
					while ((match = abilityplus_regexp.exec(lineArr[i]))!== null) {
						data.abilityplus.dex = match[1];
						data.abilityplus.agi = match[2];
						data.abilityplus.str = match[3];
						data.abilityplus.vit = match[4];
						data.abilityplus.int = match[5];
						data.abilityplus.mnd = match[6];
					}
				} else if(flag == FLAG_HPMP){
					let match;
					while ((match = hpmp_regexp.exec(lineArr[i]))!== null) {
						data.resource.rehp = match[1];
						data.resource.remp = match[2];
						data.resource.hp = match[3];
						data.resource.mp = match[4];
					}
				} else if(flag == FLAG_LV){
					let match;
					while ((match = lv_regexp.exec(lineArr[i]))!== null) {
						data.lv_name.push(match[1]);
						data.lv_value.push(match[2]);
					}
					while ((match = lv2_regexp.exec(lineArr[i]))!== null) {
						if(data.lv_name.indexOf(match[1]) == -1){
							data.lv_name.push(match[1]);
							data.lv_value.push(match[2]);
						}
						if(data.lv_name.indexOf(match[3]) == -1){
							data.lv_name.push(match[3]);
							data.lv_value.push(match[4]);
						}
					}
					while ((match = lv1_regexp.exec(lineArr[i]))!== null) {
						if(data.lv_name.indexOf(match[1]) == -1){
							data.lv_name.push(match[1]);
							data.lv_value.push(match[2]);
						}
					}
				} else if(flag == FLAG_SKILL){
					if(skill_flag == 0){
						skill_flag = 1;
					} else if(skill_flag == 1){
						skill_flag = 2;
					} else {
						let match;
						while ((match = skill_regexp.exec(lineArr[i]))!== null) {
							data.skill_name.push(match[1]);
							data.skill_ex.push(match[2]);
						}
					}
				} else if(flag == FLAG_WEAPON){
					let match;
					while ((match = weapon_regexp.exec(lineArr[i]))!== null) {
						data.weapon_hit.push(match[1]);
						data.weapon_k.push(match[2]);
						data.weapon_c.push(match[3]);
						data.weapon_add.push(match[4]);
						data.weapon_name.push(match[5]);
					}
				} else if(flag == FLAG_EQUIP){
					let match;
					while ((match = armour_regexp.exec(lineArr[i]))!== null) {
						data.armour.name = match[1];
					}
					while ((match = shield_regexp.exec(lineArr[i]))!== null) {
						data.shield.name = match[1];
					}
					while ((match = equip_regexp.exec(lineArr[i]))!== null) {
						data.equip.agi = match[1];
						data.equip.vit = match[2];
					}
					while ((match = head_regexp.exec(lineArr[i]))!== null) {
						data.equip.head = match[1];
					}
					while ((match = ear_regexp.exec(lineArr[i]))!== null) {
						data.equip.ear = match[1];
					}
					while ((match = neck_regexp.exec(lineArr[i]))!== null) {
						data.equip.neck = match[1];
					}
					while ((match = back_regexp.exec(lineArr[i]))!== null) {
						data.equip.back = match[1];
					}
					while ((match = right_regexp.exec(lineArr[i]))!== null) {
						data.equip.right = match[1];
					}
					while ((match = left_regexp.exec(lineArr[i]))!== null) {
						data.equip.left = match[1];
					}
					while ((match = hip_regexp.exec(lineArr[i]))!== null) {
						data.equip.hip = match[1];
					}
					while ((match = leg_regexp.exec(lineArr[i]))!== null) {
						data.equip.leg = match[1];
					}
					while ((match = other_regexp.exec(lineArr[i]))!== null) {
						data.equip.other = match[1];
					}
				} else if(flag = FLAG_INVENTORY){
					console.log(lineArr[i])
					let match;
					while ((match = inventory_regexp.exec(lineArr[i]))!== null) {
						console.log(match);
						data.inventory.name.push(match[1].trim());
						data.inventory.count.push(match[2]);
					}
				}
			}
			generate_xml(data);
		}
	});
});

var content = null
function generate_xml(data){

	content = "";
	//init
	content = '<character location.name="table" location.x="650" location.y="125" posZ="0" rotate="0" roll="0">\n';
	//character
	content += '  <data name="character">\n';
	content += '    <data name="image">\n';
	content += '      <data type="image" name="imageIdentifier"></data>\n';
	content += '    </data>\n';
	content += '    <data name="common">\n';
	content += '      <data name="name">' + data.common.name + '</data>\n';
	content += '      <data name="size">1</data>\n';
	content += '    </data>\n';
        content += '    <data name="detail">\n'
	content += '      <data name="リソース">\n';
        content += '        <data type="numberResource" currentValue="'+ data.resource.hp + '" name="HP">'+ data.resource.hp +'</data>\n';
        content += '        <data type="numberResource" currentValue="'+ data.resource.mp + '" name="MP">'+ data.resource.mp +'</data>\n';
        content += '        <data type="numberResource" currentValue="0" name="1ゾロ">100</data>\n';
        content += '        <data type="numberResource" currentValue="'+ data.resource.longing +'" name="穢れ度">100</data>\n';
        content += '      </data>\n';
        content += '      <data name="抵抗">\n';
        content += '        <data name="生命抵抗">'+ data.resource.rehp +'</data>\n';
        content += '        <data name="精神抵抗">'+ data.resource.remp +'</data>\n';
        content += '      </data>\n';
        content += '      <data name="能力値">\n';
        content += '        <data name="器用">'+ data.ability.dex +'</data>\n';
        content += '        <data name="俊敏">'+ data.ability.agi +'</data>\n';
        content += '        <data name="筋力">'+ data.ability.str +'</data>\n';
        content += '        <data name="生命">'+ data.ability.vit +'</data>\n';
        content += '        <data name="知力">'+ data.ability.int +'</data>\n';
        content += '        <data name="精神">'+ data.ability.mnd +'</data>\n';
        content += '      </data>\n';
        content += '      <data name="能力値ボーナス">\n';
        content += '        <data name="器用度ボーナス">'+ data.abilityplus.dex +'</data>\n';
        content += '        <data name="俊敏度ボーナス">'+ data.abilityplus.agi +'</data>\n';
        content += '        <data name="筋力ボーナス">'+ data.abilityplus.str +'</data>\n';
        content += '        <data name="生命ボーナス">'+ data.abilityplus.vit +'</data>\n';
        content += '        <data name="知力ボーナス">'+ data.abilityplus.int +'</data>\n';
        content += '        <data name="精神ボーナス">'+ data.abilityplus.mnd +'</data>\n';
        content += '      </data>\n';
        content += '      <data name="技能・経験点">\n';
        for(var i=0 ; data.lv_name.length > i; i++){
	content += '        <data name="'+ data.lv_name[i]+'">'+ data.lv_value[i] +'</data>\n';
        }
	content += '      </data>\n';
       	content += '      <data name="戦闘特技">\n';
	for(var i=0 ; data.skill_name.length > i; i++){
	content += '        <data name="'+ data.skill_name[i]+'">'+ data.skill_ex[i] +'</data>\n';
        }
	content += '      </data>\n';
	for(var i=1 ; data.weapon_name.length >= i; i++){
	content += '      <data name="武器'+ i +'">\n';
        content += '        <data name="武器'+ i +'名前">'+ data.weapon_name[i-1] + '</data>\n';
	content += '        <data name="武器'+ i +'命中">'+ data.weapon_hit[i-1] + '</data>\n';
	content += '        <data name="武器'+ i +'威力">'+ data.weapon_k[i-1] + '</data>\n';
	content += '        <data name="武器'+ i +'クリティカル">'+ data.weapon_c[i-1] + '</data>\n';
	content += '        <data name="武器'+ i +'ダメージボーナス">'+ data.weapon_add[i-1] + '</data>\n';
	content += '      </data>\n';
	}
        content += '      <data name="防具">\n';
        content += '        <data name="鎧">'+ data.armour.name + '</data>\n';
	content += '        <data name="盾">'+ data.shield.name + '</data>\n';
	content += '        <data name="回避">'+ data.equip.agi + '</data>\n';
	content += '        <data name="防御">'+ data.equip.vit + '</data>\n';
	content += '      </data>\n';
	content += '      <data name="装飾品">\n';
        content += '        <data name="頭">'+ data.equip.head + '</data>\n';
	content += '        <data name="耳">'+ data.equip.ear + '</data>\n';
	content += '        <data name="顔">'+ data.equip.face + '</data>\n';
	content += '        <data name="首">'+ data.equip.neck + '</data>\n';
	content += '        <data name="背中">'+ data.equip.back + '</data>\n';
	content += '        <data name="右手">'+ data.equip.right + '</data>\n';
	content += '        <data name="左手">'+ data.equip.left + '</data>\n';
	content += '        <data name="腰">'+ data.equip.hip + '</data>\n';
	content += '        <data name="足">'+ data.equip.leg + '</data>\n';
	content += '        <data name="他">'+ data.equip.other + '</data>\n';
	content += '      </data>\n';
	content += '      <data name="所持品">\n';
	for(var i=0 ; data.inventory.name.length > i; i++){
	content += '        <data name="'+ data.inventory.name[i]+'">'+ data.inventory.count[i] +'</data>\n';
        }
	content += '      </data>\n';
	content += '    </data>\n';
	content += '  </data>\n';
	//chat-palette
	content += '  <chat-palette dicebot="SwordWorld2_0">SW2.0・SW2.5判定例\n';
        content += '// 武器1命中判定\n';
        content += '2d6+{武器1命中力}+{器用度ボーナス} {武器1名前}\n';
        content += '// 武器1威力判定\n';
        content += 'k{武器1威力}+{武器1ダメージボーナス}@{武器1クリティカル} {武器1名前}\n';
        content += '\n';
        content += '// 抵抗\n';
	content += '2d6+{生命抵抗} 生命抵抗\n';
	content += '2d6+{精神抵抗} 精神抵抗\n';
        content += '// 隠蔽判定\n';
        content += '2d6+{スカウト}+{器用度ボーナス} スカウト隠蔽判定\n';
        content += '2d6+{レンジャー}+{器用度ボーナス} レンジャー隠蔽判定\n';
        content += '// 応急手当判定\n';
        content += '2d6+{レンジャー}+{器用度ボーナス} 応急手当判定\n';
        content += '// 解除判定\n';
        content += '2d6+{スカウト}+{器用度ボーナス} スカウト解除判定\n';
        content += '2d6+{レンジャー}+{器用度ボーナス} レンジャー解除判定\n';
        content += '// スリ判定\n';
        content += '2d6+{スカウト}+{器用度ボーナス} スリ判定\n';
        content += '// 変装判定\n';
        content += '2d6+{スカウト}+{器用度ボーナス} 変装判定\n';
        content += '// 命中力判定\n';
        content += '2d6+{ファイター}+{器用度ボーナス} ファイター命中力判定\n';
        content += '2d6+{グラップラー}+{器用度ボーナス} グラップラー命中力判定\n';
        content += '2d6+{フェンサー}+{器用度ボーナス} ファイター命中力判定\n';
        content += '2d6+{シューター}+{器用度ボーナス} ファイター命中力判定\n';
        content += '// 罠設置判定\n';
        content += '2d6+{スカウト}+{器用度ボーナス} スカウト罠設置判定\n';
        content += '2d6+{レンジャー}+{器用度ボーナス} レンジャー罠設置判定\n';
        content += '// 受け身判定\n';
        content += '2d6+{スカウト}+{敏捷度ボーナス} スカウト受け身判定\n';
        content += '2d6+{レンジャー}+{敏捷度ボーナス} レンジャー受け身判定\n';
        content += '// 隠密判定\n';
        content += '2d6+{スカウト}+{敏捷度ボーナス} スカウト隠密判定\n';
        content += '2d6+{レンジャー}+{敏捷度ボーナス} レンジャー隠密判定\n';
        content += '// 回避判定\n';
        content += '2d6+{ファイター}+{器用度ボーナス} ファイター回避判定\n';
        content += '2d6+{グラップラー}+{器用度ボーナス} グラップラー回避判定\n';
        content += '2d6+{フェンサー}+{器用度ボーナス} ファイター回避判定\n';
        content += '// 軽業判定\n';
        content += '2d6+{スカウト}+{敏捷度ボーナス} スカウト軽業判定\n';
        content += '2d6+{レンジャー}+{敏捷度ボーナス} レンジャー軽業判定\n';
        content += '// 先制判定\n';
        content += '2d6+{スカウト}+{敏捷度ボーナス} 先制判定\n';
        content += '// 尾行判定\n';
        content += '2d6+{スカウト}+{敏捷度ボーナス} スカウト尾行判定\n';
        content += '2d6+{レンジャー}+{敏捷度ボーナス} レンジャー尾行判定\n';
        content += '// 足跡追跡判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト足跡追跡判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー足跡追跡判定\n';
        content += '// 異常感知判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト異常感知判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー異常感知判定\n';
        content += '// 聞き耳判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト聞き耳判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー聞き耳判定\n';
        content += '// 危機感知判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト危機感知判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー危機感知判定\n';
        content += '// 見識判定\n';
        content += '2d6+{セージ}+{知力ボーナス} 見識判定\n';
        content += '// 探索判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト探索判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー探索判定\n';
        content += '// 地図作製判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト地図作成判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー地図作成判定\n';
        content += '2d6+{セージ}+{知力ボーナス} セージ地図作成判定\n';
        content += '// 天候予測判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト天候予測判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー天候予測判定\n';
        content += '// 病気知識判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー病気知識判定\n';
        content += '2d6+{セージ}+{知力ボーナス} セージ病気知識判定\n';
        content += '// 文献判定\n';
        content += '2d6+{セージ}+{知力ボーナス} 文献判定\n';
        content += '// 文明鑑定判定\n';
        content += '2d6+{セージ}+{知力ボーナス} 文明鑑定判定\n';
        content += '// 宝物鑑定判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト宝物鑑定判定\n';
        content += '2d6+{セージ}+{知力ボーナス} セージ宝物鑑定判定\n';
        content += '// 魔法行使判定\n';
        content += '2d6+{ソーサラー}+{知力ボーナス} ソーサラー魔法行使判定\n';
        content += '2d6+{コンジャラー}+{知力ボーナス} コンジャラー魔法行使判定\n';
        content += '2d6+{プリースト}+{知力ボーナス} プリースト魔法行使判定\n';
        content += '2d6+{フェアリーテイマー}+{知力ボーナス} フェアリーテイマー魔法行使判定\n';
        content += '2d6+{マギテック}+{知力ボーナス} マギテック魔法行使判定\n';
        content += '2d6+{デーモンルーラー}+{知力ボーナス} デーモンルーラー魔法行使判定\n';
        content += '// 魔物知識判定\n';
        content += '2d6+{セージ}+{知力ボーナス} 魔物知識判定\n';
        content += '// 薬品学判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー薬品学判定\n';
        content += '2d6+{セージ}+{知力ボーナス} セージ薬品学判定\n';
        content += '// 罠回避判定\n';
        content += '2d6+{スカウト}+{知力ボーナス} スカウト罠回避判定\n';
        content += '2d6+{レンジャー}+{知力ボーナス} レンジャー罠回避判定\n';
        content += '  </chat-palette>\n';
        content += '</character>';
}

function handleDownload() {
	if(content == null){
		alert("xmlが空です。")
		return;
	}
	var bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
	var blob = new Blob([ bom, content ], { "type" : "application/xml" });
	if (window.navigator.msSaveBlob) {
		window.navigator.msSaveBlob(blob, "data.xml");
                window.navigator.msSaveOrOpenBlob(blob, "data.xml");
	} else {
		document.getElementById("download").href = window.URL.createObjectURL(blob);
	}
}
