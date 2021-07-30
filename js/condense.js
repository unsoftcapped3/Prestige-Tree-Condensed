addLayer("condensers", {
        name: "condensers", // This is optional, only used in a few places, If absent it just uses the layer id.
        symbol: "C", // This appears on the layer's node. Default is the id with the first letter capitalized
        position: 1, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
        color: "#009696",
        requires: new Decimal(1), // Can be a function that takes requirement increases into account
        resource: "Condensers", // Name of prestige currency
        baseResource: "points", // Name of resource prestige is based on
        baseAmount() {return player.points}, // Get the current amount of baseResource
        type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
        exponent() { return 1 }, // Prestige currency exponent
        gainMult() { // Calculate the multiplier for main currency from bonuses
            mult = new Decimal(1)
            return mult
        },
        gainExp() { // Calculate the exponent on main currency from bonuses
            let exp = new Decimal(1)
			return exp;
        },
        row: 0, // Row the layer is in on the tree (0 is the first row)
        layerShown(){return true},
		doReset(resettingLayer) {
			let keep = [];
			let b11 = player.condensers.buyables[11]
      let b12 = player.condensers.buyables[12]
      let b13 = player.condensers.buyables[13]
      let b21 = player.condensers.buyables[21]
       let b22 = player.condensers.buyables[22]
       let b23 = player.condensers.buyables[23]
       let b31 = player.condensers.buyables[31]
       let b32 = player.condensers.buyables[32]
			if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
      if(hasMilestone("b",2))player.condensers.buyables[11] = b11
      if(hasUpgrade("b",12)||hasMilestone("s",1))player.condensers.buyables[12] = b12
      if(hasMilestone("g",2))player.condensers.buyables[13] = b13
      if(layers[resettingLayer].row <= this.row+2||hasChallenge("h",22))player.condensers.buyables[21] = b21
      if(layers[resettingLayer].row <= this.row+3)player.condensers.buyables[22] = b22
      if(layers[resettingLayer].row <= this.row+3)player.condensers.buyables[23] = b23
      if(layers[resettingLayer].row <= this.row+5)player.condensers.buyables[31] = b31
      if(layers[resettingLayer].row <= this.row+5)player.condensers.buyables[32] = b32
		},
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
		}},
  update(diff){
    if(hasAchievement("a2",22)){
      if(tmp.condensers.buyables[11].canAfford)setBuyableAmount("condensers",11,player.points.div(5).max(0.5).log(3).root(1.75).floor().add(1))
      if(tmp.condensers.buyables[12].canAfford)setBuyableAmount("condensers",12,player.p.points.div(10000).max(0.5).log(3).root(1.75).floor().add(1))
      if(tmp.condensers.buyables[13].canAfford)setBuyableAmount("condensers",13,player.g.power.div(1e6).max(0.5).log(8).root(1.5).floor().add(1))
      if(tmp.condensers.buyables[21].canAfford)setBuyableAmount("condensers",21,player.t.energy.div(1e6).max(0.5).log(7).root(1.7).floor().add(1))
      
    }
    if(player.hs.buyables[12].gte(1)&&tmp.condensers.buyables[32].canAfford)setBuyableAmount("condensers",32,player.m.points.div("1e100").max(0.5).log(1000).root(2).floor().add(1))
    if(player.n.buyables[12].gte(1)&&tmp.condensers.buyables[31].canAfford)setBuyableAmount("condensers",31,player.ps.power.div(1e50).max(0.5).log(1e10).root(1.75).floor().add(1))
    if(hasMilestone("m",2)&&tmp.condensers.buyables[23].canAfford)setBuyableAmount("condensers",23,player.o.energy.div(1e4).max(0.5).log(10).root(1.75).floor().add(1))
    if(hasMilestone("ba",1)&&tmp.condensers.buyables[22].canAfford)setBuyableAmount("condensers",22,player.q.points.div(25).max(0.5).log(2).root(1.6).floor().add(1))
  },
  buyables:{
    rows: 9,
    cols: 3,
      11: {
        cost() { return new Decimal(5).mul(Decimal.pow(3,player.condensers.buyables[11].pow(1.75))) },
        display() { return "Condense your points for "+format(this.cost())+" points. Your "+player.condensers.buyables[this.id]+" condensers are multiplying point gain by "+format(this.effect()) },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[11].add(1))
        },
        effect(){
          let e= player.points.add(1).log10().add(1).pow(player.condensers.buyables[11].add(hasAchievement("a2",12)?player.condensers.buyables[12]:0))
          if(hasAchievement("a2",11))e=e.pow(1.5)
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          return e
        }
    },
    12: {
        cost() { return new Decimal(10000).mul(Decimal.pow(3,player.condensers.buyables[12].pow(1.75))) },
        display() { return "Condense your prestige points for "+format(this.cost())+" prestige points. Your "+player.condensers.buyables[this.id]+" condensers are multiplying prestige point gain by "+format(this.effect()) },
        canAfford() { return player.p.points.gte(this.cost()) },
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[12].add(1))
        },
        effect(){
          let e= player.p.points.add(1).log10().add(1).pow(player.condensers.buyables[12])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          if(hasUpgrade("ba",34))e=e.pow(2)
          return e
        },
      unlocked(){return player.b.unlocked||player.g.unlocked}
    },
    13: {
        cost() { return new Decimal(1e6).mul(Decimal.pow(8,player.condensers.buyables[13].pow(1.5))) },
        display() { return "Condense your generator power for "+format(this.cost())+" generator power. Your "+player.condensers.buyables[this.id]+" condensers are multiplying generator power gain by "+format(this.effect()) },
        canAfford() { return player.g.power.gte(this.cost()) },
        buy() {
            player.g.power = player.g.power.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[13].add(1))
          
        },
        effect(){
          let x = player.condensers.buyables[13]
          if(x.gte(70))x=Decimal.pow(70,0.1).mul(x.pow(0.9))
          let e= player.g.power.add(1).log10().add(1).pow(x)
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          if(hasMilestone("e",3))e=e.pow(1.25)
          return e
        },
      unlocked(){return player.g.unlocked}
    },
    21: {
        cost() { return new Decimal(1e6).mul(Decimal.pow(7,player.condensers.buyables[21].pow(1.7))) },
        display() { return "Condense your time energy for "+format(this.cost())+" time energy. Your "+player.condensers.buyables[this.id]+" condensers are multiplying time energy gain and cap by "+format(this.effect()) },
        canAfford() { return player.t.energy.gte(this.cost()) },
        buy() {
            player.t.energy = player.t.energy.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[21].add(1))
        },
        effect(){
          let e= player.t.energy.add(1).log10().add(1).pow(player.condensers.buyables[21])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          if(hasUpgrade("ba",34))e=e.pow(2)
          return e
        },
      unlocked(){return player.t.unlocked}
    },
    22: {
        cost() { return new Decimal(25).mul(Decimal.pow(2,player.condensers.buyables[this.id].pow(1.6))) },
        display() { return "Condense your quirks for "+format(this.cost())+" quirks. Your "+player.condensers.buyables[this.id]+" condensers are multiplying quirk energy gain by "+format(this.effect()) },
        canAfford() { return player.q.points.gte(this.cost()) },
        buy() {
            player.q.points = player.q.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[this.id].add(1))
        },
        effect(){
          let e= player.q.points.add(1).log10().add(1).pow(player.condensers.buyables[this.id])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          return e
        },
      unlocked(){return hasMilestone("q",5)}
    },
    23: {
        cost() { return new Decimal(10000).mul(Decimal.pow(10,player.condensers.buyables[this.id].pow(1.75))) },
        display() { return "Condense your solar energy for "+format(this.cost())+" solar energy. Your "+player.condensers.buyables[this.id]+" condensers are multiplying solarity gain by "+format(this.effect()) },
        canAfford() { return player.o.energy.gte(this.cost()) },
        buy() {
            player.o.energy = player.o.energy.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[this.id].add(1))
        },
        effect(){
          let e= player.o.energy.add(1).log10().add(1).pow(player.condensers.buyables[this.id])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          return e
        },
      unlocked(){return hasMilestone("o",1)}
    },
    31: {
        cost() { 
          let x = player.condensers.buyables[this.id]
          if(x.gte(13))x=x.sub(12).pow(1.5).add(12)
          return new Decimal(1e50).mul(Decimal.pow(1e10,x.pow(1.75))) },
        display() { return "Condense your phantom power for "+format(this.cost())+" phantom power. Your "+player.condensers.buyables[this.id]+" condensers are multiplying phantom power gain by "+format(this.effect()) },
        canAfford() { return player.ps.power.gte(this.cost()) },
        buy() {
            player.ps.power = player.ps.power.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[this.id].add(1))
        },
        effect(){
          let e= player.ps.power.add(1).log10().add(1).pow(player.condensers.buyables[this.id])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          return e
        },
      unlocked(){return player.n.buyables[12].gte(1)}
    },
    32: {
        cost() { 
          let x = player.condensers.buyables[this.id]
          return new Decimal("1e100").mul(Decimal.pow(1000,x.pow(2))) },
        display() { return "Condense your magic for "+format(this.cost())+" magic. Your "+player.condensers.buyables[this.id]+" condensers are multiplying magic gain by "+format(this.effect()) },
        canAfford() { return player.m.points.gte(this.cost()) },
        buy() {
            player.m.points = player.m.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[this.id].add(1))
        },
        effect(){
          let e= player.m.points.add(1).log10().add(1).pow(player.condensers.buyables[this.id])
          if(hasAchievement("a2",23))e=e.pow(Decimal.add(1,Decimal.div(player.a2.achievements.length,100)))
          return e
        },
      unlocked(){return player.hs.buyables[12].gte(1)}
    },
  },tooltip:"Condensers",
tabFormat: {
  "Condensers":{
    content: [
      "buyables"
    ]
  }
}
})
addLayer("a2", {
        startData() { return {
            unlocked: true,
        }},
        color: "yellow",
        row: "side",
        layerShown() {return true}, 
        tooltip() { // Optional, tooltip displays when the layer is locked
            return ("More Achievements")
        },
        achievements: {
            rows: 16,
            cols: 5,
            11: {
                name: "Prestiged",
                done() { return player.p.points.gte(1e10) },
                tooltip: "Get 1e10 prestige. Reward: Point condensers are 50% stronger.",
            },
          12: {
                name: "3 of each",
                done() { return player.b.points.eq(3)&&player.g.points.eq(3)&&player.condensers.buyables[12].eq(3) },
                tooltip: "Have exactly 3 boosters, 3 generators, and 3 prestige condensers. Reward: Prestige condensers give free point condensers.",
            },
          13: {
                name: "Nice",
                done() { return player.p.points.gte(1.69e69) },
                tooltip: "Reach 1.69e69 prestige points. Reward: add 0.69 to the booster base.",
            },
          14: {
                name: "tbd",
                done() { return player.condensers.buyables[13].gte(2) },
                tooltip: "Buy 2 generator condensers. Reward: The generator cost base is reduced by 9000.",
            },
          15: {
                name: "Counting with ones",
                done() { return player.points.gte(1.11e111) },
                tooltip: "Have 1.11e111 points. Reward: Point gain is multiplied by 1.1e11.",
            },
          21: {
                name: "Trolling",
                done() { return player.condensers.buyables[13].gte(19) },
                tooltip: "Get 19 generator power condensers. Reward: Each generator power condenser and time energy condenser adds 1 to the booster base",
            },
          22: {
                name: "Super Rare News Ticker",
                done() { return player.condensers.buyables[21].gte(7)&&player.t.points.gte(7)&&player.s.points.gte(7) },
                tooltip: "Get 7 time capsules, space energy, and time energy condensers. Reward: Autobuy the first 4 condensers",
            },
          23: {
                name: "Claim a role",
                done() { return player.points.gte("e6969") },
                tooltip: "Have e6969 points. Reward: Quirks multiply enhance point gain and all condensers are 1% stronger per achievement in this layer",
            },
          24: {
                name: "eee",
                done() { return player.ba.pos.gte(1e100)&&player.ba.neg.gte(1e100) },
                tooltip: "Have e100 positivity and negativity. Reward: Phantom souls are cheaper.",
            },

		},
		tabFormat: [
			"blank", 
			["display-text", function() { return "Achievements: "+player.a2.achievements.length }], 
			"blank", "blank",
			"achievements",
		],
		update(diff) {	// Added this section to call adjustNotificationTime every tick, to reduce notification timers
			adjustNotificationTime(diff);
		},	
    }, 
)
