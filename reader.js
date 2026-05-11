// ======================================================
// 教育クイズ 音声学習アプリ reader.js
// display_id 完全対応版
// ======================================================

let allMenus = [];
let selectedMenu = null;
let selectedQuiz = null;
let questions = [];
let currentIndex = 0;
let isReading = false;
let isAutoReading = false;

const ALL_MENUS_PATH = "./all_menus.json";

// ======================================================
// 読み上げ補正辞書
// 追加ルールはここに追記する
// ======================================================

const SPEECH_REPLACE_RULES = [

  // ------------------------------
  // 建築用語
  // ------------------------------
  [/埋戻し/g, "うめもどし"],
  [/ALCパネル/g, "えーえるしーぱねる"]
  [/CD管/g "しーでぃーかん"]
  [/CL/g "しーりんぐれべる"]
  [/D10/g "でぃーじゅう"]
  [/D13/g, "でぃーじゅうさん"]
  [/D16/g "でぃーじゅうろく"]
  [/D19/g "でぃーじゅうきゅう"]
  [/D22/g "でぃーにじゅうに"]
  [/D25/g "でぃーにじゅうご"]
  [/EL/g "えれべーたー"]
  [/FL/g "ふろあれべる"]
  [/GL/g "ぐらうんどれべる"]
  [/GL/g, "ぐらうんどれべる"], 
  [/H形鋼/g, "えいちがたこう"]
  [/kN/g "きろにゅーとん"]
  [/LGS/g, "えるじーえす"]
  [/N\/mm²/g "にゅーとんぱーへいほうみりめーとる"]
  [/N値/g, "えぬち"]
  [/PC鋼線/g "ぴーしーこうせん"]
  [/PC鋼棒/g "ぴーしーこうぼう"]
  [/pH/g "ぴーえいち"]
  [/PH階/g, "ぺんとはうすかい"]
  [/RC造/g, "あーるしーぞう"]
  [/SD295/g "えすでぃーにひゃくきゅうじゅうご"]
  [/SL/g "すらぶれべる"]
  [/SRC造/g, "えすあーるしーぞう"]
  [/S造/g, "えすぞう"]
  [/Uカットシール材充填工法/g, "ゆーかっとしーるざいじゅうてんこうほう"]
  [/VE/g "ばりゅーえんじにありんぐ"]
  [/W/C/g, "みずせめんと
  [/アスペクト比/g, "あすぺくとひ"]
  [/かかり代/g, "かかりしろ"],
  [/かぶり厚/g, "かぶりあつ"]
  [/クリープ変形/g, "くりーぷへんけい"]
  [/コンクリートブロック造/g, "こんくりーとぶろっくぞう"]
  [/スラブ厚/g, "すらぶあつ"]
  [/スラブ配筋/g "すらぶはいきん"]
  [/せん断耐力/g, "せんだんたいりょく"]
  [/せん断補強筋/g, "せんだんほきょうきん"]
  [/プレキャストコンクリート造/g, "ぷれきゃすとこんくりーとぞう"]
  [/べた基礎/g, "べたきそ"]
  [/ラーメン構造/g, "らーめんこうぞう"]
  [/圧縮強度/g, "あっしゅくきょうど"]
  [/圧接/g, "あっせつ"]
  [/圧入/g "あつにゅう"]
  [/異形鉄筋/g, "いけいてっきん"]
  [/引き抜き/g "ひきぬき"]
  [/引張/g, "ひっぱり"]
  [/引張強度/g, "ひっぱりきょうど"]
  [/羽子板ボルト/g, "はごいたぼると"]
  [/液性限界/g, "えきせいげんかい"]
  [/煙突効果/g, "えんとつこうか"]
  [/縁石/g "えんせき"]
  [/縁切り/g "えんきり"]
  [/奥行/g, "おくゆき"]
  [/押出し成形/g "おしだしせいけい"]
  [/横架材/g, "おうかざい"]
  [/横樋/g, "よこどい"]
  [/下塗り/g, "したぬり"]
  [/化学物質管理/g, "かがくぶっしつかんり"]
  [/仮固め/g "かりがため"]
  [/仮設工事/g, "かせつこうじ"]
  [/可とう管/g, "かとうかん"]
  [/火災時管制運転/g, "かさいじかんせいうんてん"]
  [/火打ち/g, "ひうち"]
  [/火打ち土台/g, "ひうちどだい"]
  [/火打土台/g, "ひうちどだい"]
  [/火打梁/g, "ひうちばり"]
  [/荷役/g "にやく"]
  [/会所桝/g, "かいしょます"]
  [/懐/g, "ふところ"]
  [/開口部/g, "かいこうぶ"],
  [/開先/g, "かいさき"]
  [/開先角度/g "かいさきかくど"]
  [/階高/g, "かいだか"]
  [/外断熱/g, "そとだんねつ"]
  [/外部足場/g "がいぶあしば"]
  [/外壁/g "がいへき"]
  [/外壁改修工事/g, "がいへきかいしゅうこうじ"]
  [/角波/g, "かくなみ"]
  [/隔離養生/g, "かくりようじょう"]
  [/掛矢/g "かけや"]
  [/笠木/g, "かさぎ"]
  [/笠木天端/g "かさぎてんば"]
  [/割裂/g, "かつれつ"]
  [/活荷重/g, "かつかじゅう"]
  [/鴨居/g, "かもい"]
  [/乾式/g "かんしき"]
  [/幹線設備/g, "かんせんせつび"]
  [/管径/g, "かんけい"]
  [/間欠/g "かんけつ"]
  [/間口/g, "まぐち"]
  [/間仕切/g, "まじきり"]
  [/間柱/g, "まばしら"]
  [/間柱筋/g, "まばしらきん"]
  [/含浸/g "がんしん"]
  [/含水比/g, "がんすいひ"]
  [/寄棟屋根/g, "よせむね"]
  [/既製杭/g "きせいぐい"]
  [/既存/g, "きそん"],
  [/気密試験/g, "きみつしけん"]
  [/起振機/g "きしんき"]
  [/蟻継ぎ/g, "ありつぎ"]
  [/逆打ち/g, "ぎゃくうち"]
  [/逆打ち工法/g "ぎゃくうちこうほう"]
  [/逆梁/g, "さかばり"]
  [/許容応力度/g, "きょようおうりょくど"]
  [/共上がり/g "ともあがり"]
  [/曲げモーメント/g, "まげもーめんと"]
  [/均しコンクリート/g "ならしこんくりーと"]
  [/均しモルタル/g "ならしもるたる"]
  [/巾止め/g, "はばどめ"]
  [/巾木/g, "はばき"]
  [/金鏝/g, "かなごて"]
  [/躯体/g, "くたい"],
  [/躯体工事/g, "くたいこうじ"]
  [/躯体図/g, "くたいず"],
  [/空隙率/g, "くうげきりつ"]
  [/空調/g "くうちょう"]
  [/隅木/g, "すみぎ"]
  [/屈撓性/g "くっとうせい"]
  [/沓石/g, "ふみいし"]
  [/栗石/g, "くりいし"]
  [/型枠/g, "かたわく"]
  [/型枠/g, "かたわく"]
  [/継手/g, "つぎて"]
  [/計画供用期間/g, "けいかくきょうようきかん"]
  [/軽量形鋼/g, "けいりょうけいこう"]
  [/軽量鉄骨造/g, "けいりょうてっこつぞう"]
  [/桁下/g "けたした"]
  [/桁行/g, "けたゆき"]
  [/桁梁/g, "けたばり"]
  [/欠損部/g, "けっそんぶ"]
  [/堅梁/g, "たてばり"]
  [/建具/g, "たてぐ"]
  [/建入れ/g "たていれ"]
  [/建入れ直し/g "たていれなおし"]
  [/建方/g, "たてかた"],
  [/見切り/g, "みきり"],
  [/見切り材/g, "みきりざい"]
  [/見当たり/g "けんとうたり"]
  [/見付/g, "みつけ"]
  [/軒高/g, "のきたか"]
  [/軒裏/g, "のきうら"]
  [/減衰/g, "げんすい"]
  [/呼び強度/g "よびきょうど"]
  [/呼び径/g "よびけい"]
  [/雇い実/g, "やといざね"]
  [/勾配/g, "こうばい"]
  [/勾配天井/g, "こうばいてんじょう"]
  [/控柱/g, "ひかえばしら"]
  [/控梁/g, "ひかえばり"]
  [/杭基礎/g, "くいきそ"]
  [/溝形鋼/g, "みぞがたこう"]
  [/鋼矢板/g, "こうやいた"]
  [/降伏強度/g, "こうふくきょうど"]
  [/高欄/g "こうらん"]
  [/剛性/g, "ごうせい"]
  [/剛性率/g, "ごうせいりつ"]
  [/剛接合/g, "ごうせつごう"]
  [/合成スラブ/g, "ごうせいすらぶ"]
  [/告示/g "こくじ"]
  [/腰折れ屋根/g, "こしおれやね"]
  [/腰壁/g, "こしかべ"]
  [/根固め/g "ねがため"]
  [/根切り/g, "ねぎり"]
  [/根太/g, "ねだ"]
  [/根伐り/g "ねぎり"]
  [/左官/g, "さかん"]
  [/砂地盤/g, "すなじばん"]
  [/座屈/g, "ざくつ"]
  [/座屈長さ/g, "ざくつながさ"]
  [/妻側/g, "つまがわ"]
  [/採光補正係数/g, "さいこうほせいけいすう"]
  [/砕石/g "さいせき"]
  [/細長比/g, "ほそながひ"]
  [/際根太/g "きわねだ"]
  [/在来工法/g "ざいらいこうほう"]
  [/雑排水/g "ざつはいすい"]
  [/錆止め/g, "さびどめ"]
  [/山形鋼/g, "やまがたこう"]
  [/山留め/g, "やまどめ"]
  [/桟橋/g "さんばし"]
  [/桟木/g, "さんぎ"]
  [/仕口/g, "しぐち"]
  [/支持杭/g, "しじぐい"]
  [/支持地盤/g, "しじじばん"]
  [/支保工/g, "しほこう"]
  [/施主/g "せしゅ"]
  [/止水栓/g, "しすいせん"]
  [/軸組/g, "じくぐみ"]
  [/軸力/g, "じくりょく"]
  [/湿式工法/g, "しっしきこうほう"]
  [/捨てコン/g, "すてこん"],
  [/捨てコンクリート/g, "すてこんくりーと"]
  [/斜材/g "ななめざい"]
  [/斜面/g "しゃめん"]
  [/遮音性能/g "しゃおんせいのう"]
  [/主筋/g, "しゅきん"]
  [/受変電設備/g, "じゅへんでんせつび"]
  [/修正板/g, "しゅうせいばん"]
  [/縦樋/g "たてどい"]
  [/重錘/g "おもり"]
  [/重量物/g, "じゅうりょうぶつ"]
  [/縮尺/g, "しゅくしゃく"]
  [/出隅/g, "ですみ"]
  [/竣工/g, "しゅんこう"],
  [/準耐火構造/g, "じゅんたいかこうぞう"]
  [/準耐火構造/g, "じゅんたいかこうぞう"]
  [/小屋束/g, "こやづか"]
  [/小返り/g "こがえり"]
  [/昇降路/g, "しょうこうろ"]
  [/障子/g, "しょうじ"]
  [/上弦材/g "じょうげんざい"]
  [/上塗り/g, "うわぬり"]
  [/植栽/g "しょくさい"]
  [/伸び能力/g "のびのうりょく"]
  [/伸縮目地/g, "しんしゅくめじ"]
  [/真壁/g, "しんかべ"]
  [/芯々/g, "しんしん"]
  [/親杭/g, "おやぐい"]
  [/親杭横矢板/g, "おやぐいよこやいた"]
  [/親綱/g, "おやづな"]
  [/靭性/g, "じんせい"]
  [/吹付け/g, "ふきつけ"]
  [/吹付け石綿/g, "ふきつけいしわた"]
  [/垂木/g, "たるき"]
  [/水セメント比/g, "みずせめんとひ"]
  [/水勾配/g, "みずこうばい"]
  [/水切り/g, "みずきり"]
  [/水密性/g "すいみつせい"]
  [/是正/g, "ぜせい"],
  [/成形板/g "せいけいばん"] 
  [/静定構造/g, "せいていこうぞう"]
  [/石綿含有建材/g, "いしわたがんゆうけんざい"]
  [/積載荷重/g, "せきさいかじゅう"]
  [/切妻屋根/g, "きりづまやね"]
  [/切梁/g, "きりばり"]
  [/接地抵抗/g, "せっちていこう"]
  [/設計荷重/g "せっけいかじゅう"]
  [/設計図書/g "せっけいとしょ"]
  [/雪止め/g, "ゆきどめ"]
  [/絶縁抵抗/g, "ぜつえんていこう"]
  [/先行/g "せんこう"]
  [/先行足場/g, "せんこうあしば"]
  [/先付け/g "さきづけ"]
  [/洗浄剤/g "せんじょうざい"]
  [/繊維補強/g "せんいほきょう"]
  [/塑性/g, "そせい"]
  [/塑性ヒンジ/g, "そせいひんじ"]
  [/塑性化/g, "そせいか"]
  [/塑性指数/g, "そせいしすう"]
  [/相番/g, "あいばん"],
  [/増打ち/g, "ましうち"]
  [/増打ち/g, "ましうち"],
  [/束石/g, "つかいし"]
  [/束立て/g, "つかだて"]
  [/足場/g, "あしば"]
  [/袖壁/g "そでかべ"]
  [/打継ぎ/g, "うちつぎ"]
  [/打放し/g, "うちはなし"]
  [/耐火被覆/g, "たいかひふく"]
  [/耐候性/g "たいこうせい"]
  [/耐震スリット/g, "たいしんすりっと"]
  [/耐震改修/g, "たいしんかいしゅう"]
  [/耐力壁/g, "たいりょくへき"]
  [/耐力壁/g, "たいりょくへき"]
  [/帯筋/g, "おびきん"]
  [/大壁/g, "おおかべ"]
  [/脱型/g "だっけい"]
  [/竪穴/g, "たてあな"]
  [/竪樋/g, "たてどい"]
  [/竪樋/g, "たてどい"],
  [/棚板/g "たないた"]
  [/谷樋/g, "たにどい"]
  [/短絡/g, "たんらく"]
  [/端太角/g, "ばたかく"]
  [/断熱材/g, "だんねつざい"]
  [/断面欠損/g "だんめんけっそん"]
  [/段差修正/g, "だんさしゅうせい"]
  [/地下水位/g, "ちかすいい"]
  [/地業/g, "じぎょう"]
  [/地上権/g "ちじょうけん"]
  [/地耐力/g, "ちたいりょく"]
  [/地中梁/g, "ちちゅうばり"]
  [/地盤/g, "じばん"]
  [/地盤改良/g, "じばんかいりょう"]
  [/地墨/g "じすみ"]
  [/中空/g "ちゅうくう"]
  [/中性化/g, "ちゅうせいか"]
  [/中塗り/g, "なかぬり"]
  [/柱断面/g, "はしらだんめん"]
  [/丁番/g "ちょうばん"]
  [/張出し/g, "はりだし"]
  [/調合強度/g, "ちょうごうきょうど"]
  [/調合比/g, "ちょうごうひ"]
  [/長尺シート/g, "ちょうじゃくしーと"]
  [/直交方向/g, "ちょっこうほうこう"]
  [/追掛大栓継ぎ/g, "おいかけおおせんつぎ"]
  [/通り芯/g "とおりしん"]
  [/通気口/g, "つうきこう"]
  [/通気層/g, "つうきそう"]
  [/通水試験/g, "つうすいしけん"]
  [/定着長さ/g, "ていちゃくながさ"]
  [/締固め/g "しめかため"]
  [/鉄筋コンクリート造/g, "てっきんこんくりーとぞう"]
  [/鉄筋径/g, "てっきんけい"]
  [/鉄骨造/g, "てっこつぞう"]
  [/鉄骨鉄筋コンクリート造/g, "てっこつてっきんこんくりーとぞう"]
  [/天打ち/g, "てんうち"]
  [/転圧/g, "てんあつ"]
  [/塗膜防水/g, "とまくぼうすい"]
  [/土圧/g "どあつ"]
  [/土間/g, "どま"]
  [/土層/g, "どそう"]
  [/棟木/g, "むなぎ"]
  [/踏段/g, "とうだん"]
  [/踏面/g "ふみづら"]
  [/透水係数/g, "とうすいけいすう"]
  [/胴縁/g, "どうぶち"]
  [/胴縁/g, "どうぶち"]
  [/胴縁間隔/g, "どうぶちかんかく"]
  [/胴差/g, "どうさし"]
  [/胴差梁/g, "どうさしばり"]
  [/特定粉じん/g, "とくていふんじん"]
  [/独立基礎/g, "どくりつきそ"]
  [/内部足場/g "ないぶあしば"]
  [/軟弱地盤/g "なんじゃくじばん"]
  [/二次覆工/g "にじふっこう"]
  [/入隅/g, "いりすみ"]
  [/熱貫流率/g "ねつかんりゅうりつ"]
  [/燃えしろ厚/g, "もえしろあつ"]
  [/粘性土/g, "ねんせいど"]
  [/納まり/g, "おさまり"]
  [/破風板/g, "はふいた"]
  [/配管勾配/g, "はいかんこうばい"]
  [/配筋/g, "はいきん"]
  [/配合設計/g "はいごうせっけい"]
  [/被覆厚/g, "ひふくあつ"]
  [/避難階段/g, "ひなんかいだん"]
  [/避雷設備/g, "ひらいせつび"]
  [/鼻隠し/g, "はなかくし"]
  [/表面波試験/g "ひょうめんはしけん"]
  [/不静定構造/g, "ふせいていこうぞう"]
  [/不同沈下/g "ふどうちんか"]
  [/不陸/g, "ふりく"]
  [/付着強度/g "ふちゃくきょうど"]
  [/布基礎/g, "ぬのきそ"]
  [/敷居/g, "しきい"]
  [/敷桁/g, "しきげた"]
  [/浮き部/g, "うきぶ"]
  [/腐食/g "ふしょく"]
  [/負圧除じん装置/g, "ふあつじょじんそうち"]
  [/封水/g, "ふうすい"]
  [/伏図/g, "ふせず"]
  [/幅員/g, "ふくいん"]
  [/幅厚比/g, "はばあつひ"]
  [/幅止め筋/g, "はばどめきん"]
  [/幅木/g, "はばき"]
  [/腹起し/g, "はらおこし"]
  [/腹起し材/g, "はらおこしざい"]
  [/複層ガラス/g, "ふくそうがらす"]
  [/分割発注/g "ぶんかつはっちゅう"]
  [/平場/g, "ひらば"]
  [/平積み/g, "ひらづみ"],
  [/閉合/g "へいごう"]
  [/壁式構造/g, "かべしきこうぞう"]
  [/偏心/g, "へんしん"]
  [/偏心モーメント/g, "へんしんもーめんと"]
  [/偏心荷重/g, "へんしんかじゅう"]
  [/偏心距離/g, "へんしんきょり"]
  [/偏心率/g, "へんしんりつ"]
  [/偏平率/g, "へんぺいりつ"]
  [/片流れ屋根/g, "かたながれやね"]
  [/返り水/g "かえりみず"]
  [/保護管/g, "ほごかん"]
  [/保護具着用管理責任者/g, "ほごぐちゃくようかんりせきにんしゃ"]
  [/補強筋/g, "ほきょうきん"]
  [/補強筋比/g, "ほきょうきんひ"]
  [/母屋/g, "もや"]
  [/崩壊/g "ほうかい"]
  [/法面/g "のりめん"]
  [/膨張材/g, "ぼうちょうざい"]
  [/防火区画/g, "ぼうかくかく"]
  [/防湿層/g, "ぼうしつそう"]
  [/防水押え/g, "ぼうすいおさえ"]
  [/防水層/g, "ぼうすいそう"],
  [/防水立上り/g, "ぼうすいたちあがり"]
  [/墨出し/g, "すみだし"]
  [/埋戻/g, "うめもどし"],
  [/埋戻し/g, "うめもどし"]
  [/幕板/g, "まくいた"]
  [/免震構造/g, "めんしんこうぞう"]
  [/面戸板/g, "めんどいた"]
  [/木摺/g "きずり"]
  [/木造/g, "もくぞう"]
  [/木毛セメント板/g, "もくもうせめんとばん"]
  [/木鏝/g, "きごて"]
  [/目違い/g "めちがい"]
  [/目荒し/g, "めあらし"]
  [/目荒らし/g, "めあらし"]
  [/目地/g, "めじ"]
  [/目地棒/g, "めじぼう"]
  [/門型/g "もんがた"]
  [/野縁/g, "のぶち"]
  [/野地板/g, "のじいた"]
  [/矢板/g, "やいた"]
  [/有機溶剤/g, "ゆうきようざい"]
  [/誘発目地/g, "ゆうはつめじ"]
  [/遊間/g "ゆうかん"]
  [/余盛/g, "よもり"]
  [/余長/g "よちょう"]
  [/揚重/g, "ようじゅう"]
  [/溶接/g, "ようせつ"]
  [/溶断/g "ようだん"]
  [/溶融亜鉛めっき/g, "ようゆうあえんめっき"]
  [/養生/g, "ようじょう"]
  [/養生期間/g, "ようじょうきかん"]
  [/落下防止/g "らっかぼうし"]
  [/陸屋根/g, "りくやね"]
  [/流動化剤/g, "りゅうどうかざい"]
  [/梁間/g, "はりま"]
  [/梁間方向/g "はりまほうこう"]
  [/梁成/g, "はりせい"]
  [/力桁/g "ちからげた"]
  [/林立/g "りんりつ"]
  [/隣棟間隔/g, "りんとうかんかく"]
  [/冷間成形/g, "れいかんせいけい"]
  [/劣化診断/g, "れっかしんだん"]
  [/路盤/g "ろばん"]
  [/漏水/g "ろうすい"]
  [/漏電/g, "ろうでん"]
  [/斫り/g, "はつり"],
  [/瑕疵/g, "かし"],



  // ------------------------------
  // 略語・英数字
  // ------------------------------
  [/Q\s*&\s*A/gi, " キュウアンドエー "],
  [/Q\s*\/\s*A/gi, " キュウアンドエー "],
  [/Q\s*A/gi, " キュウアンドエー "],
  [/RC造/g, "アールシーぞう"],
  [/S造/g, "エスぞう"],
  [/SRC造/g, "エスアールシーぞう"],
  [/ALC/g, "エーエルシー"],

  // ------------------------------
  // 記号：読まない文字
  // ------------------------------
  [/\*/g, " "],
  [/\[/g, " "],
  [/\]/g, " "],
  [/【/g, " "],
  [/】/g, " "],
  [/_/g, " "],
  [/-/g, " "],
  [/(1建施)/g, " "],
  [/(1建施過去問)/g, " "],
  [/(2建施)/g, " "],
  [/(2建施過去問)/g, " "],

];





// 初期化
document.addEventListener("DOMContentLoaded", () => {
  initReaderApp();
});

// ------------------------------------------------------
// 初期処理
// ------------------------------------------------------
function initReaderApp() {
  setupSpeedControl();
  loadAllMenus();
}

// ------------------------------------------------------
// all_menus.json 読み込み
// ------------------------------------------------------
function loadAllMenus() {
  fetch(ALL_MENUS_PATH)
    .then(res => {
      if (!res.ok) {
        throw new Error(`all_menus.json の読み込みに失敗しました: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      allMenus = normalizeMenus(data);
      renderMenuList();
    })
    .catch(err => {
      console.error(err);
      setHTML("menuList", `<p class="error">メニュー読込エラー<br>${escapeHtml(err.message)}</p>`);
    });
}

// all_menus.json の形式差を吸収
function normalizeMenus(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.menus)) return data.menus;
  if (Array.isArray(data.groups)) return data.groups;
  if (Array.isArray(data.items)) return data.items;
  return [];
}

// ------------------------------------------------------
// メニュー一覧表示
// ------------------------------------------------------
function renderMenuList() {
  const menuList = document.getElementById("menuList");

  if (!allMenus.length) {
    menuList.innerHTML = "<p>メニューが見つかりません。</p>";
    return;
  }

  menuList.innerHTML = "";

  allMenus.forEach(menu => {
    const title = getMenuTitle(menu);
    const path = getMenuPath(menu);

    const btn = document.createElement("button");
    btn.className = "card-btn";
    btn.textContent = title;
    btn.onclick = () => selectMenu(menu, path, title);

    menuList.appendChild(btn);
  });
}

function getMenuTitle(menu) {
  return (
    menu.menu_name ||
    menu.title ||
    menu.name ||
    menu.group ||
    menu.label ||
    "無題メニュー"
  );
}

function getMenuPath(menu) {
  return (
    menu.relative_path ||
    menu.path ||
    menu.file ||
    menu.json ||
    menu.url ||
    menu.menu_name ||
    menu.title ||
    menu.name ||
    ""
  );
}

// ------------------------------------------------------
// メニュー選択 → グループJSON読込
// ------------------------------------------------------
function selectMenu(menu, path, title) {
  if (!path) {
    alert("このメニューにはJSONファイルのパスが設定されていません。");
    return;
  }

  selectedMenu = {
    raw: menu,
    title: title,
    path: path
  };

  const jsonPath = path.endsWith(".json") ? path : `${path}.json`;

  fetch(`./${jsonPath}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`メニューJSON読込失敗: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      selectedMenu.data = data;
      showQuizList(data);
    })
    .catch(err => {
      console.error(err);
      alert(`メニュー読込エラー\n${err.message}\n\n対象: ${jsonPath}`);
    });
}

// ------------------------------------------------------
// テーマ一覧表示
// ------------------------------------------------------
function showQuizList(menuData) {
  showArea("quizArea");
  setText("selectedMenuTitle", selectedMenu.title);

  const quizList = document.getElementById("quizList");
  quizList.innerHTML = "";

  const quizzes = Array.isArray(menuData.quizzes) ? menuData.quizzes : [];

  if (!quizzes.length) {
    quizList.innerHTML = "<p>このメニューにはテーマがありません。</p>";
    return;
  }

  quizzes.forEach(quiz => {
    const title = quiz.title || quiz.file_stem || "無題テーマ";
    const count = Number.isFinite(quiz.question_count) ? quiz.question_count : "";

    const btn = document.createElement("button");
    btn.className = "card-btn";
    btn.textContent = count ? `${title} (${count}問)` : title;
    btn.onclick = () => selectQuiz(quiz);

    quizList.appendChild(btn);
  });
}

// ------------------------------------------------------
// テーマ選択 → 問題JSON読込
// ------------------------------------------------------
function selectQuiz(quiz) {
  if (!quiz || !quiz.relative_path) {
    alert("クイズファイルのパスが設定されていません。");
    return;
  }

  selectedQuiz = quiz;

  fetch(`./${quiz.relative_path}`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`問題JSON読込失敗: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      questions = normalizeQuestions(data);

      if (!questions.length) {
        throw new Error("問題データが0件です。");
      }

      shuffleArray(questions);
      currentIndex = 0;

      showReaderArea();
      displayCurrentQuestion();
    })
    .catch(err => {
      console.error(err);
      alert(`問題読込エラー\n${err.message}\n\n対象: ${quiz.relative_path}`);
    });
}

// 問題JSONの形式差を吸収
function normalizeQuestions(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.questions)) return data.questions;
  if (Array.isArray(data.quizzes)) return data.quizzes;
  if (Array.isArray(data.items)) return data.items;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

// ------------------------------------------------------
// 音声学習画面表示
// ------------------------------------------------------
function showReaderArea() {
  showArea("readerArea");

  const title = selectedQuiz.title || selectedQuiz.file_stem || "音声学習";
  setText("readerTitle", title);
  setText("playStatus", "停止中");
}

function displayCurrentQuestion() {
  const q = questions[currentIndex];
  if (!q) return;

  const questionId = getQuestionDisplayId(q);
  const questionFormat = getQuestionField(q, ["question_type", "question_format", "format", "type", "問題形式", "形式"]);
  const question = getQuestionField(q, ["question", "問題", "問題文"]);
  const answer = getQuestionField(q, ["answer", "解答", "正解"]);
  const explanation1 = getQuestionField(q, ["explanation", "explanation1", "解説", "解説1"]);
  const explanation2 = getQuestionField(q, ["explanation2", "explanation_2", "解説2"]);

  setText("counter", `${currentIndex + 1} / ${questions.length}`);
  setText("questionId", questionId ? `問題番号: ${questionId}` : "");
  setText("questionFormat", questionFormat ? `問題形式: ${questionFormat}` : "");

  setHTML("questionText", escapeHtml(question).replace(/\n/g, "<br>"));
  setHTML("answerText", escapeHtml(answer).replace(/\n/g, "<br>"));
  setHTML("explanation1Text", escapeHtml(explanation1).replace(/\n/g, "<br>"));
  setHTML("explanation2Text", escapeHtml(explanation2).replace(/\n/g, "<br>"));
}

// ------------------------------------------------------
// 読み上げ制御
// ------------------------------------------------------
function startReading() {
  if (!questions.length) {
    alert("問題が読み込まれていません。");
    return;
  }

  stopReading();
  isAutoReading = true;
  isReading = true;
  setText("playStatus", "読み上げ中");

  readCurrentQuestion(true);
}

function readCurrentQuestion(autoNext = false) {
  if (!questions.length) {
    alert("問題が読み込まれていません。");
    return;
  }

  speechSynthesis.cancel();

  const q = questions[currentIndex];

  displayCurrentQuestion();

  const questionText = buildQuestionOnlyText(q);
  const afterText = buildAfterQuestionText(q);

  if (!questionText.trim()) {
    alert("読み上げる問題がありません。");
    return;
  }

  setText("playStatus", "問題読み上げ中");

  speakText(questionText, () => {
    setText("playStatus", "3秒待機中");

    setTimeout(() => {
      if (!isAutoReading && autoNext) return;

      if (afterText.trim()) {
        setText("playStatus", "解答読み上げ中");

        speakText(afterText, () => {
          isReading = false;

          if (autoNext && isAutoReading) {
            setTimeout(() => {
              moveToNextQuestionForAutoRead();
            }, 800);
          } else {
            setText("playStatus", "停止中");
          }
        });
      } else {
        if (autoNext && isAutoReading) {
          moveToNextQuestionForAutoRead();
        } else {
          setText("playStatus", "停止中");
        }
      }
    }, 3000);
  });
}

function speakText(text, onEndCallback) {
  const utterance = new SpeechSynthesisUtterance(normalizeSpeechText(text));

  utterance.lang = "ja-JP";
  utterance.rate = getSpeechRate();
  utterance.pitch = 1.0;
  utterance.volume = 1.0;

  utterance.onstart = () => {
    isReading = true;
  };

  utterance.onend = () => {
    if (typeof onEndCallback === "function") {
      onEndCallback();
    }
  };

  utterance.onerror = () => {
    isReading = false;
    setText("playStatus", "読み上げエラー");
  };

  speechSynthesis.speak(utterance);
}

function buildQuestionOnlyText(q) {
  const questionId = getQuestionDisplayId(q);
  const questionFormat = getQuestionField(q, ["question_type", "question_format", "format", "type", "問題形式", "形式"]);
  const question = getQuestionField(q, ["question", "問題", "問題文"]);

  const parts = [];

  if (questionId) parts.push(`問題番号。${questionId}。`);
  if (questionFormat) parts.push(`問題形式。${questionFormat}。`);

  parts.push("問題。");
  parts.push(question);

  return parts
    .filter(Boolean)
    .join("。")
    .replace(/\s+/g, " ");
}

function buildAfterQuestionText(q) {
  const readMode = document.getElementById("readMode").value;

  const answer = getQuestionField(q, ["answer", "解答", "正解"]);
  const explanation1 = getQuestionField(q, ["explanation", "explanation1", "解説", "解説1"]);
  const explanation2 = getQuestionField(q, ["explanation2", "explanation_2", "解説2"]);

  const parts = [];

  if (readMode === "answer" || readMode === "explanation1" || readMode === "all") {
    parts.push("解答。");
    parts.push(answer);
  }

  if (readMode === "explanation1" || readMode === "all") {
    parts.push("解説1。");
    parts.push(explanation1);
  }

  if (readMode === "all") {
    parts.push("解説2。");
    parts.push(explanation2);
  }

  return parts
    .filter(Boolean)
    .join("。")
    .replace(/\s+/g, " ");
}

function pauseReading() {
  if (speechSynthesis.speaking && !speechSynthesis.paused) {
    speechSynthesis.pause();
    setText("playStatus", "一時停止中");
  }
}

function resumeReading() {
  if (speechSynthesis.paused) {
    speechSynthesis.resume();
    setText("playStatus", "読み上げ中");
  }
}

function stopReading() {
  isAutoReading = false;
  isReading = false;
  speechSynthesis.cancel();
  setText("playStatus", "停止中");
}

function nextQuestion() {
  stopReading();

  if (!questions.length) return;

  currentIndex++;

  if (currentIndex >= questions.length) {
    alert("全問の読み上げが終了しました。最初に戻ります。");
    currentIndex = 0;
    shuffleArray(questions);
  }

  displayCurrentQuestion();
}

function moveToNextQuestionForAutoRead() {
  if (!isAutoReading) return;

  currentIndex++;

  if (currentIndex >= questions.length) {
    isAutoReading = false;
    setText("playStatus", "全問終了");
    alert("全問の読み上げが終了しました。");
    return;
  }

  displayCurrentQuestion();
  readCurrentQuestion(true);
}

// ------------------------------------------------------
// 読み上げ速度
// ------------------------------------------------------
function setupSpeedControl() {
  const speedRange = document.getElementById("speedRange");
  const speedValue = document.getElementById("speedValue");

  if (!speedRange || !speedValue) return;

  speedRange.addEventListener("input", () => {
    speedValue.textContent = Number(speedRange.value).toFixed(1);
  });
}

function getSpeechRate() {
  const speedRange = document.getElementById("speedRange");
  return speedRange ? Number(speedRange.value) : 1.0;
}

// ------------------------------------------------------
// 画面遷移
// ------------------------------------------------------
function backToMenu() {
  stopReading();
  showArea("menuArea");
}

function backToQuizList() {
  stopReading();
  showArea("quizArea");
}

function showArea(areaId) {
  const areas = ["menuArea", "quizArea", "readerArea"];

  areas.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;

    if (id === areaId) {
      el.classList.remove("hidden");
    } else {
      el.classList.add("hidden");
    }
  });
}

// ------------------------------------------------------
// 共通関数
// ------------------------------------------------------
function getQuestionDisplayId(question) {
  return getQuestionField(question, [
    "display_id",
    "displayId",
    "表示管理番号",
    "id",
    "ID",
    "問題番号"
  ]);
}

function getQuestionField(question, keys) {
  if (!question || !Array.isArray(keys)) return "";

  for (const key of keys) {
    if (
      question[key] !== undefined &&
      question[key] !== null &&
      String(question[key]).trim() !== ""
    ) {
      return String(question[key]);
    }
  }

  return "";
}

function setText(id, text) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`要素が見つかりません: ${id}`);
    return;
  }
  el.textContent = text;
}

function setHTML(id, html) {
  const el = document.getElementById(id);
  if (!el) {
    console.warn(`要素が見つかりません: ${id}`);
    return;
  }
  el.innerHTML = html;
}

function normalizeSpeechText(text) {

  let result = String(text || "");

  // ======================================================
  // 読み上げ補正辞書を適用
  // ======================================================
  SPEECH_REPLACE_RULES.forEach(rule => {
    result = result.replace(rule[0], rule[1]);
  });

  return result

    // 穴埋めの空欄
    .replace(/[（(]\s*[　\s＿_ー－―-]*\s*[）)]/g, " かっこ")

    // ○×・〇×
    .replace(/[○〇]\s*[×✕✖xX☓]/g, " まるばつ ")
    .replace(/[×✕✖xX☓]\s*[○〇]/g, " ばつまる ")

    // 単独の○・〇・×
    .replace(/[○〇]/g, " まる ")
    .replace(/[×✕✖☓]/g, " ばつ ")

    // 空白整理
    .replace(/\s+/g, " ")
    .trim();
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}