$(function() {

	const FLAG_INIT = 1;
	const FLAG_DATA = 2;
	const FLAG_ABILITY = 3;
	
	var common = {};
	const name_regexp = /キャラクター名：(.+)/g;
	common.name = "";
	common.size = 1;
	var detail = {};
	// detailの階層構造
	var resource = {}
	resource.HP = 0;
	resource.MP = 0;
	resource.zoro = 0;
	resource.longing = 0;
	detail.resource = resource;

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
				}
				if(flag == FLAG_INIT){
					let match;
					let matches = []
					while ((match = name_regexp.exec(lineArr[i]))!== null) {
						common.name = match[1];
					}
				}
			}
			generate_xml(common, detail);
		}
	});
});

var content = null
function generate_xml(common, detail){

	content = "";
	//init
	content = '<character location.name="table" location.x="650" location.y="125" posZ="0" rotate="0" roll="0">\n';
	//character
	content += '  <data name="character">\n';
	content += '    <data name="image">\n';
	content += '      <data type="image" name="imageIdentifier"></data>\n';
	content += '    </data>\n';
	content += '    <data name="common">\n';
	content += '      <data name="name">'+common.name+'</data>\n';
	content += '      <data name="size">1</data>\n';
	content += '    </data>\n';
	content += '  </data>\n';
	//chat-palette
	content += '  <chat-palette dicebot="SwordWorld2_0">SW2.0・SW2.5判定例\n';
        content += '// 武器1命中判定\n';
        content += '2d6+{武器1命中力}+{器用度ボーナス} {武器1名前}\n';
        content += '// 武器1威力判定\n';
        content += 'k{武器1威力}@{武器1クリティカル} {武器1名前}\n';
        content += '\n';
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
