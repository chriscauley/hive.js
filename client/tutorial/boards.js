/* eslint-disable */
// not linting becauset his file should mostly be treated like binary

export default {
  queen: {"W":8,"H":6,"stacks":{"18":[2],"20":[4],"25":[7],"27":[5],"29":[1],"35":[3],"36":[6],"37":[0]},"piece_types":["queen","beetle","queen","ant","spider","ant","ant","grasshopper"],"piece_owners":[1,2,2,2,1,1,1,2],"turn":20,"rules":{}, "current_player": 1},
  beetle: {"W":6,"H":5,"stacks":{"8":[1],"13":[0,2],"14":[6],"15":[5],"20":[3],"21":[4]},"piece_types":["grasshopper","queen","beetle","queen","grasshopper","beetle","grasshopper"],"piece_owners":[2,2,1,1,1,2,2],"turn":9,"rules":{}, "current_player": 2},
  grasshopper: {"W":8,"H":4,"stacks":{"10":[2],"11":[0],"12":[1],"18":[4],"19":[3],"20":[5],"21":[6]},"piece_types":["queen","beetle","grasshopper","ant","queen","spider","grasshopper"],"piece_owners":[2,2,2,1,1,1,1],"turn":9,"rules":{}, "current_player": 2},
  spider: {"W":8,"H":6,"stacks":{"19":[0],"20":[1],"26":[5],"27":[3],"28":[4],"29":[2]},"piece_types":["spider","beetle","queen","queen","beetle","grasshopper"],"piece_owners":[1,1,1,2,2,2],"turn":13,"rules":{}, "current_player": 2},
  ant: {"W":8,"H":6,"stacks":{"12":[7],"18":[5],"20":[1],"25":[6],"27":[2],"28":[4],"29":[0],"35":[8],"37":[3]},"piece_types":["ant","spider","grasshopper","grasshopper","grasshopper","spider","queen","queen","ant"],"piece_owners":[2,1,1,2,2,1,1,2,1],"turn":42,"rules":{}, "current_player": 1},
  ladybug: {"W":6,"H":5,"stacks":{"7":[0],"9":[5],"10":[8],"13":[1],"14":[2],"15":[4],"16":[6],"19":[7],"20":[3]},"piece_types":["ladybug","grasshopper","beetle","queen","mosquito","queen","spider","ant","ladybug"],"piece_owners":[2,1,1,1,2,2,1,2,1],"turn":10,"rules":{}, "current_player": 1},
  mosquito: {"W":6,"H":6,"stacks":{"14":[0],"15":[3],"16":[5],"20":[1,6],"21":[2],"22":[4]},"piece_types":["scorpion","queen","grasshopper","mosquito","beetle","queen","mosquito"],"piece_owners":[2,1,1,2,1,2,1],"turn":16,"rules":{}, "current_player": 1},
  pill_bug: {"W":6,"H":6,"stacks":{"8":[4],"14":[3],"15":[5],"19":[0],"20":[2],"25":[1]},"piece_types":["pill_bug","queen","spider","grasshopper","queen","ant"],"piece_owners":[1,1,1,2,2,2],"turn":8,"rules":{},"current_player": 1},
  orchid_mantis: {"W":8,"H":6,"stacks":{"11":[5,6],"12":[3],"20":[2],"21":[4],"27":[0],"28":[1],"35":[7]},"piece_types":["orchid_mantis","queen","beetle","queen","ant","ant","orchid_mantis","grasshopper"],"piece_owners":[1,1,2,2,2,1,2,1],"turn":9,"rules":{}, "current_player": 2},
  fly: {"W":50,"H":50,"stacks":{"1176":[6],"1225":[5],"1227":[8],"1273":[4],"1274":[0,2],"1275":[1],"1276":[3],"1277":[7]},"piece_types":["queen","queen","fly","orchid_mantis","wasp","fly","wasp","scorpion","scorpion"],"piece_owners":[1,2,2,2,1,1,1,2,1],"turn":14,"rules":{},"room_name":"local","current_player":1},
  scorpion: {"W":6,"H":5,"stacks":{"8":[2],"13":[1],"15":[3],"16":[5],"19":[0],"21":[4],"22":[6]},"piece_types":["queen","spider","beetle","queen","grasshopper","beetle","scorpion"],"piece_owners":[1,1,2,2,2,2,1],"turn":11,"rules":{}, "current_player": 2},
  wasp: {"W":6,"H":6,"stacks":{"8":[1],"13":[0],"14":[2],"15":[4],"19":[3],"20":[5],"25":[6]},"piece_types":["ant","queen","wasp","queen","wasp","beetle","grasshopper"],"piece_owners":[2,2,2,1,1,1,2],"turn":8,"rules":{}, "current_player": 1},
  dragonfly: {"W":6,"H":5,"stacks":{"7":[7],"8":[3],"14":[1,0],"15":[4],"19":[6],"20":[2],"21":[5]},"piece_types":["dragonfly","spider","queen","scorpion","queen","beetle","dragonfly","spider"],"piece_owners":[1,1,1,2,2,2,2,1],"turn":14,"rules":{}, "current_player": 1},
  damselfly: {"W":6,"H":5,"stacks":{"7":[7],"8":[3],"14":[1,0],"15":[4],"19":[6],"20":[2],"21":[5]},"piece_types":["damselfly","spider","queen","scorpion","queen","beetle","damselfly","spider"],"piece_owners":[1,1,1,2,2,2,2,1],"turn":14,"rules":{}, "current_player": 1},
  centipede: {"W":6,"H":6,"stacks":{"10":[6],"14":[4],"15":[3,5],"20":[0],"21":[2],"27":[1]},"piece_types":["queen","grasshopper","centipede","ant","ladybug","beetle","queen"],"piece_owners":[1,1,2,2,2,1,2],"turn":10,"rules":{}, "current_player": 1},
  cockroach: {"W":8,"H":6,"stacks":{"12":[3],"14":[6],"18":[1],"19":[2],"20":[5],"21":[4,7],"27":[0]},"piece_types":["queen","cockroach","beetle","queen","fly","ant","cockroach","beetle"],"piece_owners":[1,1,2,2,2,1,2,1],"hash":0.5479472595173172,"turn":20,"rules":{}, "current_player": 1},
  cicada: {"actions":[],"W":50,"H":50,"stacks":{"1226":[3],"1273":[2],"1274":[0],"1275":[1],"1323":[4]},"piece_types":["queen","queen","cicada","cicada","ant"],"piece_owners":[1,2,1,2,1],"hash":"21f05bca4e8cc4257c4de80ac6dfdd6aaa971ec0","turn":5,"rules":{"pieces":{"beetle":2,"ant":3,"centipede":1,"cockroach":1,"cicada":2}},"current_player":2},
  lanternfly: {"W":50,"H":50,"stacks":{"1222":[6],"1225":[5],"1226":[7],"1273":[2],"1274":[0],"1275":[1],"1276":[3],"1323":[4]},"piece_types":["queen","beetle","beetle","queen","lanternfly","ant","cicada","lanternfly"],"piece_owners":[1,2,1,2,1,2,1,2],"hash":"c3ebd4ae845992bc447b61ee23449c23cfd8ea41","turn":8,"rules":{"pieces":{"beetle":2,"ant":3,"lanternfly":1,"centipede":1,"cockroach":1,"cicada":2}},"current_player":1},
  lanternfly_nymph: {"actions":[],"W":50,"H":50,"stacks":{"1223":[8],"1226":[5],"1273":[2],"1274":[0],"1275":[1],"1276":[3],"1323":[4],"1324":[6],"1326":[7]},"piece_types":["pill_bug","mosquito","queen","pill_bug","lanternfly_nymph","lanternfly_nymph","centipede","queen","orchid_mantis"],"piece_owners":[1,2,1,2,1,2,1,2,1],"hash":"3e89a125b257082f0a7cd6687cec8c0303eab5d3","turn":16,"rules":{},current_player: 1},
  trapdoor_spider: {"W":50,"H":50,"stacks":{"1226":[6],"1274":[0],"1275":[1],"1276":[3],"1277":[5],"1323":[4],"1325":[2],"1327":[7]},"piece_types":["trapdoor_spider","trapdoor_spider","queen","queen","cicada","ant","ant","cicada"],"piece_owners":[1,2,1,2,1,2,1,2],"rules": {},"current_player":2},
  orbweaver: {"actions":[],"W":50,"H":50,"stacks":{"1174":[10,8],"1176":[5],"1222":[12],"1225":[3],"1272":[6],"1273":[2],"1274":[0],"1275":[1],"1276":[7],"1325":[11],"1322":[9],"1323":[4]},"piece_types":["orbweaver","grasshopper","grasshopper","orbweaver","queen","queen","wasp","fly","fly","trapdoor_spider","trapdoor_spider","cockroach","cockroach"],"piece_owners":[1,2,1,2,1,2,1,2,1,2,1,2,1],"turn":18,"rules":{},"last":{"from":1226,"to":1277},"current_player":1,"last_move_at":1604858870793},
  praying_mantis: {"W":50,"H":50,"stacks":{"1225":[5],"1273":[6],"1274":[0,4],"1275":[1],"1276":[7,3],"1323":[2]},"piece_types":["queen","queen","praying_mantis","praying_mantis","beetle","fly","ant","beetle"],"piece_owners":[1,2,1,2,1,2,1,2],"turn":14,"last":{"from":1325,"special":1276},"current_player":1, rules: {}},
  emerald_wasp: {"W":50,"H":50,"stacks":{"1225":[5],"1273":[2],"1274":[0],"1275":[1,4],"1276":[3]},"piece_types":["beetle","beetle","queen","queen","emerald_wasp","emerald_wasp"],"piece_owners":[1,2,1,2,1,2],"turn":7,"rules":{},"current_player": 2},
  kung_fu_mantis: {"W":50,"H":50,"stacks":{"1224":[7],"1225":[4,3],"1274":[0],"1275":[1],"1276":[5],"1323":[6],"1324":[2],"1325":[8]},"piece_types":["queen","queen","ant","kung_fu_mantis","grasshopper","ant","kung_fu_mantis","ladybug","ladybug"],"piece_owners":[1,2,1,2,1,2,1,1,2],"turn":13,"rules":{},"current_player":2},
  earthworm: {"actions":[],"W":50,"H":50,"stacks":{"1223":[8],"1225":[3],"1226":[7],"1273":[0,6],"1274":[2],"1275":[1],"1276":[5],"1323":[4]},"piece_types":["centipede","pill_bug","queen","earthworm","earthworm","dragonfly","beetle","queen","lanternfly_nymph"],"piece_owners":[1,2,1,2,1,2,1,2,1],"hash":"1d4cc628d73f7cc48ab20a7b3a4800f37e13b3f3","turn":16,"rules":{},"current_player":1},
}