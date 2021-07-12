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
			if (layers[resettingLayer].row > this.row) layerDataReset(this.layer, keep)
      if(hasMilestone("b",2))player.condensers.buyables[11] = b11
      if(hasUpgrade("b",12)||hasMilestone("s",1))player.condensers.buyables[12] = b12
      if(hasMilestone("g",2))player.condensers.buyables[13] = b13
      if(layers[resettingLayer].row <= this.row+2)player.condensers.buyables[21] = b21
		},
		startData() { return {
			unlocked: true,
			points: new Decimal(0),
		}},
  update(diff){
    if(hasAchievement("a2",22)){
      for(let i in layers.condensers.buyables){
        if(layers.condensers.buyables[i].canAfford){
          if(tmp.condensers.buyables[i].canAfford){layers.condensers.buyables[i].buy()}
        }
      }
    }
  },
  buyables:{
    rows: 9,
    cols: 3,
      11: {
        cost() { return new Decimal(5).mul(Decimal.pow(3,player.condensers.buyables[11].pow(1.75))) },
        display() { return "Condense your points for "+format(this.cost())+" points. Your condensers are multiplying point gain by "+format(this.effect()) },
        canAfford() { return player.points.gte(this.cost()) },
        buy() {
            player.points = player.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[11].add(1))
        },
        effect(){
          let e= player.points.add(1).log10().add(1).pow(player.condensers.buyables[11].add(hasAchievement("a2",12)?player.condensers.buyables[12]:0))
          if(hasAchievement("a2",11))e=e.pow(1.5)
          return e
        }
    },
    12: {
        cost() { return new Decimal(10000).mul(Decimal.pow(3,player.condensers.buyables[12].pow(1.75))) },
        display() { return "Condense your prestige points for "+format(this.cost())+" prestige points. Your condensers are multiplying prestige point gain by "+format(this.effect()) },
        canAfford() { return player.p.points.gte(this.cost()) },
        buy() {
            player.p.points = player.p.points.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[12].add(1))
        },
        effect(){
          let e= player.p.points.add(1).log10().add(1).pow(player.condensers.buyables[12])
          return e
        },
      unlocked(){return player.b.unlocked||player.g.unlocked}
    },
    13: {
        cost() { return new Decimal(1e6).mul(Decimal.pow(8,player.condensers.buyables[13].pow(1.5))) },
        display() { return "Condense your generator power for "+format(this.cost())+" generator power. Your condensers are multiplying generator power gain by "+format(this.effect()) },
        canAfford() { return player.g.power.gte(this.cost()) },
        buy() {
            player.g.power = player.g.power.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[13].add(1))
        },
        effect(){
          let e= player.g.power.add(1).log10().add(1).pow(player.condensers.buyables[13])
          if(hasMilestone("e",3))e=e.pow(1.25)
          return e
        },
      unlocked(){return player.g.unlocked}
    },
    21: {
        cost() { return new Decimal(1e6).mul(Decimal.pow(7,player.condensers.buyables[21].pow(1.7))) },
        display() { return "Condense your time energy for "+format(this.cost())+" time energy. Your condensers are multiplying time energy gain and cap by "+format(this.effect()) },
        canAfford() { return player.t.energy.gte(this.cost()) },
        buy() {
            player.t.energy = player.t.energy.sub(this.cost())
            setBuyableAmount(this.layer, this.id, player.condensers.buyables[21].add(1))
        },
        effect(){
          let e= player.t.energy.add(1).log10().add(1).pow(player.condensers.buyables[21])
          return e
        },
      unlocked(){return player.t.unlocked}
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
