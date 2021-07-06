addLayer("s", {
    name: "start", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "S", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#86c0ef",
    requires(){let r= new Decimal(10)
    if(hasUpgrade("u",11))r=r.sub(upgradeEffect("u",11))
    return r}, // Can be a function that takes requirement increases into account
    resource: "starting points", // Name of prestige currency
    baseResource: "points", // Name of resource prestige is based on
    baseAmount() {return player.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
      mult=mult.mul(tmp.m.effect)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 0, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "s", description: "S: Reset for starting points", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.timer>0},
  upgrades: {
    11: {
        description(){return "Best upgrade points boost point gain. Currently: x"+format(this.effect())},
        cost: new Decimal(1),
        effect(){return player.u.best.sqrt().add(1)}
    },
    12: {
        description(){return "Starting points boost point gain. Currently: x"+format(this.effect())},
        cost: new Decimal(2),
        effect(){
          if(hasUpgrade(this.layer,14))return player.s.points.root(3).add(1)
          return player.s.points.add(1).log10().add(1)}
    },
    13: {
        description(){return "Each upgrade multiplies points by 1.5. Currently: x"+format(this.effect())},
        cost: new Decimal(4),
        effect(){return Decimal.pow(1.5,player.s.upgrades.length)}
    },
    14: {
        description(){return "The second upgrade's formula is better."},
        cost: new Decimal(30),
        unlocked(){return hasMilestone("u",4)},
    },
},passiveGeneration(){return hasMilestone("m",1)?1/6:0}
})
addLayer("m", {
    name: "minutes", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "M", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
    }},
    color: "#6aaa02",
    requires(){let r= new Decimal(6)
    return r}, // Can be a function that takes requirement increases into account
  effect(){return player.m.points.add(1).pow(hasMilestone("u",5)?0.8:1)},
  effectDescription(){return "Multiplying starting point gain by "+format(this.effect())},
    resource: "minutes", // Name of prestige currency
    baseResource: "starting points", // Name of resource prestige is based on
    baseAmount() {return player.s.points}, // Get the current amount of baseResource
    type: "normal", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 1, // Prestige currency exponent
    gainMult() { // Calculate the multiplier for main currency from bonuses
        mult = new Decimal(1)
        return mult
    },
    gainExp() { // Calculate the exponent on main currency from bonuses
        return new Decimal(1)
    },
    row: 1, // Row the layer is in on the tree (0 is the first row)
    hotkeys: [
        {key: "m", description: "M: Reset for minutes", onPress(){if (canReset(this.layer)) doReset(this.layer)}},
    ],
    layerShown(){return player.timer>0&&hasMilestone("u",3)},
  milestones: {
    1: {
        requirementDescription: "100 minutes",
        effectDescription: "Gain 1000% of starting point gain on prestige every minute",
        done() { return player.m.points.gte(100)},
      unlocked(){return hasMilestone("u",5)},
    },
  },
  
})
addLayer("u", {
    name: "upgrades", // This is optional, only used in a few places, If absent it just uses the layer id.
    symbol: "U", // This appears on the layer's node. Default is the id with the first letter capitalized
    position: 0, // Horizontal position within a row. By default it uses the layer id and sorts in alphabetical order
    startData() { return {
        unlocked: true,
		points: new Decimal(0),
      best: new Decimal(0)
    }},
  resource: "upgrade points",
  effectDescription(){return "The gain formula is log"+(hasMilestone("u",5)?2:hasUpgrade("u",14)?8:10)+"(points+1)"},
    color: "#69420a",
    type: "none", // normal: cost to gain currency depends on amount gained. static: cost depends on how much you already have
    exponent: 0.5, // Prestige currency exponent
    row: 99, // Row the layer is in on the tree (0 is the first row)
    layerShown(){return player.timer==0},
  update(diff){
    if(player.timer>0){
      diff=new Decimal(diff)
      if(hasUpgrade("u",13))diff=diff.mul(Decimal.sub(1,Decimal.div(upgradeEffect("u",13),100)))
      diff=diff.toNumber()
      player.timer=Math.max(player.timer-diff,0)
    } else if(player.points.gt(0)){
      player.tab="u"
      player.u.points=player.points.add(1).log((hasMilestone("u",5)?2:hasUpgrade("u",14)?8:10))
      if(player.u.best.lt(player.u.points))player.u.best=player.u.points
      player.points=decimalZero
      doReset("aaaaaa")
      if(hasUpgrade("u",12)){player.s.upgrades.push(11)}
    }
    if(hasMilestone("u",3)&&!hasUpgrade("s",13))player.s.upgrades.push(13)
  },
  clickables:{
    11:{
      display(){return "Start the game"},
      canClick(){return player.timer==0},
      onClick(){player.timer=getTimer();player.tab="s"},
    }
  },
  milestones: {
    1: {
        requirementDescription: "1.6 upgrade points",
        effectDescription: "Unlock some upgrade upgrades",
        done() { return player.u.points.gte(1.6)},
      unlocked(){return true}
    },
    2: {
        requirementDescription: "2 upgrade points",
        effectDescription: "Base point gain is increased by your best upgrade points",
        done() { return player.u.points.gte(2)},
      unlocked(){return hasMilestone("u",1)}
    },
    3: {
        requirementDescription: "3.3 upgrade points",
        effectDescription: "Unlock the ability to see a new layer during the 30 seconds of playing and always have the 3rd starting upgrade. Upgrade upgrades no longer spend your upgrade points.",
        done() { return player.u.points.gte(3.3)},
      unlocked(){return hasMilestone("u",2)}
    },
    4: {
        requirementDescription: "3.9 upgrade points",
        effectDescription: "Unlock another starting upgrade",
        done() { return player.u.points.gte(3.9)},
      unlocked(){return hasMilestone("u",3)}
    },
    5: {
        requirementDescription: "25 upgrade points",
        effectDescription: "Nerf the minute effect but triple upgrade point gain and unlock a minute milestone",
        done() { return player.u.points.gte(25)},
      unlocked(){return hasMilestone("u",4)}
    },
},
  upgrades: {
    11: {
        description(){return "Upgrade points subtract from the starting point requirement Currently: -"+format(this.effect())},
        cost: new Decimal(1.6),
        effect(){return player.u.points.min(9)},
      unlocked(){return hasMilestone("u",1)},
    fullDisplay(){return this.description()+"<br><br>"+"Cost: "+format(this.cost)+" upgrade points"}
    },
    12: {
        description(){return "Start with the 1st starting upgrade"},
        cost: new Decimal(1.69),
      unlocked(){return hasMilestone("u",1)},
    fullDisplay(){return this.description()+"<br><br>"+"Cost: "+format(this.cost)+" upgrade points"},
      onPurchase(){player.s.upgrades.push(11)}
    },
    13: {
        description(){return "Time runs slower based on your upgrade points. Currently: "+format(this.effect(),4)+"%"},
        cost: new Decimal(3.33),
      unlocked(){return hasMilestone("u",3)},
    fullDisplay(){return this.description()+"<br><br>"+"Cost: "+format(this.cost)+" upgrade points"},
      effect(){
        let s = player.u.best.min(30)
        return s
      },
      pay(){},
    },
    14: {
        description(){return "The upgrade point gain formula is slightly better"},
        cost: new Decimal(3.4),
      unlocked(){return hasMilestone("u",3)},
    fullDisplay(){return this.description()+"<br><br>"+"Cost: "+format(this.cost)+" upgrade points"},
      pay(){},
    },
},
  tabFormat:{
    "Milestones":{
      content:[
    ["main-display",3],
    "blank",
    ["resource-display",3],
    "blank",
    "clickables","blank","milestones",]
    },
    "Upgrades":{
      unlocked(){return hasMilestone("u",1)},
      content:[
        ["main-display",3],
    "blank",
    ["resource-display",3],
    "blank",
    "clickables","blank","upgrades"
      ]
    }
  }
})
function getTimer(){
  return 30;
  // might increase with upgrades? probably not though
}