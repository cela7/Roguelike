// Dungeon Generator - - done
// Controllable Player - done
// Enemies - - - - - - - done
// Weapons & items - - - partially done
// Bosses - - - - - - - - not done
// Good enemy AI - - - - not done
// Refinements - - - - - not done

// Bugs to fix:
// --Most collision bugs fixed, post detailed descriptions of collision bugs below--
// - You can (mostly enemies) get stuck on corners
// - Faster arrows clip through walls

// Things to do:
// List any bugs here:

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

var chestopen = [];
var projectiles = [];
var eprojectiles = [];
var spawnpoints = [];
var items = [];
var quadtree = {topleft:[],topright:[],bottomleft:[],bottomright:[]};
var mapsize = 128;
var map = new Array(mapsize);
var floor = 1;
var txt = {t:"Floor 1",d:200,md:200};
var damagetxt = [];
var pickupd = 0;
var dropd = 0;
var potiond = 0;
var scale = 32;
for(var i=0;i<mapsize;i++) {
	map[i] = [];
  for(var k=0;k<mapsize;k++) {
  	map[i][k] = 0;
  }
}

var images = {glimmer: new Image(),sword: new Image(),chest: new Image(), openedchest: new Image(),stairs: new Image(),helix: new Image(),rapier: new Image(),bow: new Image(),arrow: new Image(),nightingale: new Image(),katana: new Image(),spear: new Image(),dagger: new Image(),staff: new Image(),ghostwalker: new Image(),justifier: new Image(),crossbow: new Image(),witheredblade: new Image(),talon: new Image(),comet: new Image(),tetsuyama: new Image(),peacekeeper: new Image(),busterblade: new Image(),yang: new Image(),yin: new Image(),orb: new Image(),potion: new Image(),butterfly: new Image(),viper: new Image(),leviathan: new Image(),sabertooth: new Image(),soulcatcher: new Image(),fang: new Image(),exporb: new Image(),magicchest: new Image(),hpotionb:new Image(),hpotiong:new Image(),hpotiond:new Image(),hpotiono:new Image()};
loadImages();

// name,type,rarity,damage,knockback,buff,image,usetime,range,ability,de
var weapons = [
new Weapon("Glimmer","spear","uncommon",24,25,"",images.glimmer,20,10,0,"lunge","Named after the way the polished metal on the head of the spear glints in the sunlight"),
new Weapon("Sword","sword","common",4,20,"",images.sword,10,70,0,"dash",""),
new Weapon("Helix","spear","rare",80,25,"",images.helix,18,10,0,"lunge","A large spear with a shaft shaped like a helix"),
new Weapon("Rapier","spear","common",5,15,"",images.rapier,7,10,0,"dash",""),
new Weapon("Justifier","spear","epic",210,40,"",images.justifier,25,15,0,"lunge","",40,40),
new Weapon("Bow","bow","common",8,5,"",images.bow,40,7,0,"rapid",""),
new Weapon("Nightingale","bow","legendary",550,30,"arrow",images.nightingale,40,25,0,"rapid","An assassin's weapon of choice for stealthily removing targets"),
new Weapon("Ghostwalker","bow","godly",27777,30,"arrow",images.ghostwalker,20,25,0,"rapid","",38,38),
new Weapon("Katana","sword","common",4,5,"",images.katana,6,60,0,"dash","",36,36),
new Weapon("Spear","spear","common",5,20,"",images.spear,20,6,0,"lunge",""),
new Weapon("Crossbow","bow","common",3,5,"arrow",images.crossbow,18,6,0,"rapid",""),
new Weapon("Withered Blade","sword","uncommon",12,20,"",images.witheredblade,12,60,0,"dash",""),
new Weapon("Talon","bow","uncommon",40,25,"arrow",images.talon,22,12,0,"rapid",""),
new Weapon("Comet","spear","uncommon",15,22,"",images.comet,15,7,0,"lunge",""),
new Weapon("Tetsuyama","sword","uncommon",8,10,"",images.tetsuyama,8,60,0,"dash",""),
new Weapon("Peacekeeper","sword","uncommon",22,25,"",images.peacekeeper,18,60,1,"dash",""),
new Weapon("Buster Sword","sword","epic",180,40,"",images.busterblade,20,70,0,"lunge",""),
new Weapon("Yang","sword","rare",100,30,"",images.yang,20,70,0,"dash",""),
new Weapon("Yin","sword","rare",20,15,"",images.yin,8,70,0,"dash",""),
new Weapon("Staff","staff","common",7,10,"orb",images.staff,22,6,0,"rapid",""),
new Weapon("None","none","none",0,0,"","data:image/png;base64",0,0,0,"",""),
new Weapon("Butterfly","bow","epic",8,0,"arrow",images.butterfly,5,14,1,"rapid",""),
new Weapon("Viper","bow","uncommon",17,7,"arrow",images.viper,10,12,0,"rapid",""),
new Weapon("Leviathan","bow","legendary",11,0,"arrow",images.leviathan,8,16,1,"rapid",""),
new Weapon("Sabertooth","sword","legendary",210,6,"",images.sabertooth,5,60,1,"dash",""),
new Weapon("Soulcatcher","bow","epic",310,30,"arrow",images.soulcatcher,45,20,0,"rapid",""),new Weapon("Dagger","dagger","common",3,2,"",images.dagger,8,40,0,"cloak","Hold shift to cloak"),
new Weapon("Fang","dagger","uncommon",10,2,"",images.fang,8,45,0,"cloak","Hold shift to cloak")
];

var common = weapons.filter(function(el) { return (el.rarity == "common") });
var uncommon = weapons.filter(function(el) { return (el.rarity == "uncommon") });
var rare = weapons.filter(function(el) { return (el.rarity == "rare") });
var epic = weapons.filter(function(el) { return (el.rarity == "epic") });
var legendary = weapons.filter(function(el) { return (el.rarity == "legendary") });
var godly = weapons.filter(function(el) { return (el.rarity == "godly") });

// name,type,image,rarity,level,effect,de
var potions = [
new Potion("Health Potion","drink",images.potion,"common","1",10,0,"Heals 10 hp"),
new Potion("Speed Potion","drink",images.potion,"common","1",0,1800,"Increases your movement speed"),
new Potion("Health Potion","drink",images.hpotionb,"uncommon","2",25,0,"Heals 25 hp"),
new Potion("Health Potion","drink",images.hpotiong,"rare","3",75,0,"Heals 75 hp"),
new Potion("Health Potion","drink",images.hpotiond,"epic","4",200,0,"Heals 200 hp"),
new Potion("Health Potion","drink",images.hpotiono,"legendary","5",500,0,"Heals 500 hp")

];

var player = {x:50,y:50,w:16,h:16,v:{x:0,y:0},a:{x:0,y:0},w:16,h:16,speed:1,health:10,maxhealth:10,level:1,exp:0,hurt:0,inventory:[weapons[1]],slot:0,curWeap:weapons[1],usinga:0,apoint:{x:0,y:0},cooldown:0,abweap:0,cloak:0,effects:[]};
var friction = 1.3;
var keys = [];
var enemies = [];
var stageitems = [];
var exporbs = [];

var req;

var mx = 0;
var my = 0;
var mdown = 0;
var ev;

document.addEventListener("keydown",function(e) {
	keys[e.keyCode] = true;
});
document.addEventListener("keyup",function(e) {
	keys[e.keyCode] = false;
});
document.addEventListener("mousemove",function(e) {
	mx = e.clientX-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width);
  my = e.clientY-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height);
});
document.addEventListener("mousedown",click);
document.addEventListener("mouseup",function(e) { mdown = 0; })
function click(e) {
	mdown = 1;
  ev = e;
	switch(e.which) {
  	case 1:
    	// Left click
      if(player.curWeap.use==0) {
        player.curWeap.use = player.curWeap.usetime;
        player.curWeap.clickangle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        if(player.curWeap.type=="sword") {
          player.curWeap.swingStyle = random(0,1);
        }
      }
      break;
    case 3:
    	// Right click
      useAbility(e);
  }
}

function newDungeon() {
	// Functions
	this.findClosestRoom = function(room) {
  	var mid = {x:room.x+room.w/2,y:room.y+room.h/2};
    var closest = null;
    var closestDistance = 1000;
    for(var i=0;i<this.rooms.length;i++) {
    	var check = this.rooms[i];
      if(check == room) { continue; };
      var check_mid = {x:check.x+check.w/2,y:check.y+check.h/2};
      var distance = Math.min(Math.abs(mid.x - check_mid.x) - (room.w / 2) - (check.w / 2), Math.abs(mid.y - check_mid.y) - (room.h / 2) - (check.h / 2));
      if(distance<closestDistance) {
      	closestDistance = distance;
        closest = check;
      }
    }
    return closest;
  }
  
  this.SquashRooms = function() {
  	for(var i=0;i<10;i++) {
    	for(var k=0;k<this.rooms.length;k++) {
      	var room = this.rooms[k];
        while(true) {
        	var old_position = {x:room.x,y:room.y};
          if(room.x>1) { room.x--; };
          if(room.y>1) { room.y--; };
          if(room.x == 1 && room.y == 1) { break; }
          if(this.collides(room,k)) {
          	room.x = old_position.x;
            room.y = old_position.y;
            break;
          }
        }
      }
    }
  }
  
  this.collides = function(room,ignore) {
  	for(var i=0;i<this.rooms.length;i++) {
    	if(i==ignore) { continue; };
      var check = this.rooms[i];
      if(!((room.x+room.w < check.x) || (room.x > check.x+check.w) || (room.y+room.h < check.y) || (room.y > check.y+check.h))) {
      	return true;
      }
    }
    return false;
  }
  
	var room_count = random(10,20);
  var room_min = 4;
  var room_max = 16;
  this.rooms = [];
  quadtree = {topleft:[],topright:[],bottomleft:[],bottomright:[]};
  for(var i=0;i<room_count;i++) {
  	var room = {x:random(1,mapsize-room_max-1),y:random(1,mapsize-room_min-1),w:random(room_min,room_max),h:random(room_min,room_max)};
    if(this.collides(room)) {
    	i--;
      continue;
    }
    room.w--;
    room.h--;
    
    this.rooms.push(room);
  }
  this.SquashRooms();
  
  for(var i=0;i<room_count;i++) {
  	var roomA = this.rooms[i];
    var roomB = this.findClosestRoom(roomA);
    var pointA = {x:random(roomA.x,roomA.x+roomA.w),
    							y:random(roomA.y,roomA.y+roomA.h)};
  	var pointB = {x:random(roomB.x,roomB.x+roomB.w),
    							y:random(roomB.y,roomB.y+roomB.h)};
    while((pointB.x != pointA.x) || (pointB.y != pointA.y)) {
    	if(pointB.x != pointA.x) {
      	if(pointB.x > pointA.x) { pointB.x--; }
        else { pointB.x++; };
      } else if(pointB.y != pointA.y) {
      	if(pointB.y > pointA.y) { pointB.y--; }
        else { pointB.y++; };
      }
      map[pointB.x][pointB.y] = 1;
    }
	}
	for(var i=0;i<room_count;i++) {
		var room = this.rooms[i];
    for(var x=room.x;x<room.x+room.w;x++) {
    	for(var y=room.y;y<room.y+room.h;y++) {
      	map[x][y] = 1;
      }
    }
  }
  
  for(var x=0;x<mapsize;x++) {
  	for(var y=0;y<mapsize;y++) {
    	if(map[x][y]==1) {
      	for(var xx=x-1;xx<=x+1;xx++) {
        	for(var yy=y-1;yy<=y+1;yy++) {
          	if(map[xx][yy] == 0) {
            	map[xx][yy] = 2;
            }
          }
        }
      }
    }
  }
  // Check if the dungeon has inaccessible rooms
  floodFill(1,1);
  for(var i=0;i<mapsize;i++) {
  	for(var k=0;k<mapsize;k++) {
    	if(map[k][i]==1) {
      	stageitems = [];
        for(var i=0;i<mapsize;i++) {
					map[i] = [];
  				for(var k=0;k<mapsize;k++) {
  					map[i][k] = 0;
  				}
				}
      	newDungeon();
        stageitems = [];
        spawnpoints = [];
        break;
      } else if(map[k][i]==4) {
      	map[k][i] = 1;
      }
    }
  }
  
  var flag = false;
  for(var i=0;i<rooms.length;i++) {
  	if(random(0,9)==1) {
      var x = this.rooms[i].x+random(2,this.rooms[i].w-2);
      var y = this.rooms[i].y+random(2,this.rooms[i].h-2);
    	stageitems.push({name:"chest",type:"common",x:x,y:y,opened:false,item:null});
    } /*else if(random(0,30)==1) {
    	var x = this.rooms[i].x+random(2,this.rooms[i].w-2);
      var y = this.rooms[i].y+random(2,this.rooms[i].h-2);
    	stageitems.push({name:"magicchest",type:"common",x:x,y:y,opened:false,item:null,item2:null,item3:null});
    }*/
    spawnpoints.push({x:this.rooms[i].x+(this.rooms[i].w/2),y:this.rooms[i].y+(this.rooms[i].h/2),w:this.rooms[i].w,h:this.rooms[i].h});
    if(!flag && random(0,rooms.length-1)==1 || !flag && i==rooms.length-1) {
    	var sx = this.rooms[i].x+random(2,this.rooms[i].w-2);
      var sy = this.rooms[i].y+random(2,this.rooms[i].h-2);
    	stageitems.push({name:"stairs",type:"",x:sx,y:sy});
      flag = true;
    }
  }
  for(var i=0;i<mapsize;i++) {
  	for(var k=0;k<mapsize;k++) {
    	if(k <= mapsize/4 && i <= mapsize/4 && map[k][i]!=0 && map[k][i]!=1) {
      	quadtree.topleft.push({x:k,y:i,t:map[k][i]});
      }
      if(k >= mapsize/4 && i <= mapsize/4 && map[k][i]!=0 && map[k][i]!=1) {
      	quadtree.topright.push({x:k,y:i,t:map[k][i]});
      }
      if(k <= mapsize/4 && i >= mapsize/4 && map[k][i]!=0 && map[k][i]!=1) {
      	quadtree.bottomleft.push({x:k,y:i,t:map[k][i]});
      }
      if(k >= mapsize/4 && i >= mapsize/4 && map[k][i]!=0 && map[k][i]!=1) {
      	quadtree.bottomright.push({x:k,y:i,t:map[k][i]});
      }
    }
  }
  var rnd = random(0,spawnpoints.length-1);
  player.x = spawnpoints[rnd].x*scale;
  player.y = spawnpoints[rnd].y*scale;
}

function drawMap() {
	var coords = [Math.floor(player.x/32),Math.floor(player.y/32)];
	for(var i=coords[1]-16;i<coords[1]+16;i++) {
  	for(var k=coords[0]-16;k<coords[0]+18;k++) {
    	if(k>=0 && k<map[0].length && i>=0 && i<map.length) {
        if(map[k][i]==0) {
          ctx.fillStyle="#777777";
          ctx.strokeStyle="#777777";
        }
        if(map[k][i]==1) {
          ctx.fillStyle="#000000";
          ctx.strokeStyle="#000000";
        }
        if(map[k][i]==2) {
          ctx.fillStyle="#ffffff";
          ctx.strokeStyle="#ffffff";
        }
        if(map[k][i]==3) {
          ctx.fillStyle="#777777";
          ctx.strokeStyle="#777777";
        }
        if(map[k][i]==4) {
          ctx.fillStyle="#ff7777";
          ctx.strokeStyle="#ff7777";
        }
        ctx.fillRect(k*scale,i*scale,scale,scale);
        // This is to fix the white lines around each tile
        ctx.lineWidth = 1;
        ctx.strokeRect(k*scale,i*scale,scale,scale);
      }
    }
  }
  for(var i=0;i<stageitems.length;i++) {
  	if(stageitems[i].name=="chest") {
    	if(stageitems[i].opened) {
      	ctx.drawImage(images.openedchest,stageitems[i].x*scale,stageitems[i].y*scale,32,32);
      } else {
    		ctx.drawImage(images.chest,stageitems[i].x*scale,stageitems[i].y*scale,32,32);
      }
    }
    if(stageitems[i].name=="magicchest") {
    	if(stageitems[i].opened) {
      	ctx.drawImage(images.openedchest,stageitems[i].x*scale,stageitems[i].y*scale,32,32);
      } else {
    		ctx.drawImage(images.magicchest,stageitems[i].x*scale,stageitems[i].y*scale,32,32);
      }
    }
    if(stageitems[i].name=="stairs") {
    	ctx.drawImage(images.stairs,stageitems[i].x*scale,stageitems[i].y*scale,scale,scale);
    }
  }
}
function drawHud() {
	ctx.strokeStyle = "#666666";
  ctx.fillStyle="rgba(200,200,200,0.8)";
	ctx.strokeRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+218,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.fillRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+218,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.strokeRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+254,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.fillRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+254,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.strokeRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+290,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.fillRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+290,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.strokeRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+326,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  ctx.fillRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+326,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
  for(var i=0;i<player.inventory.length;i++) {
  	ctx.save();
    var x = -clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+220+i*36;
    var y = -clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+470;
    var angle = Math.PI/180*-90;
    ctx.translate(x,y);
    ctx.rotate(angle);
    ctx.drawImage(player.inventory[i].image,0,0,28,28);
    ctx.restore();
  }
  var x = -clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+16;
  var y = -clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440;
  ctx.fillStyle="#550000";
  ctx.fillRect(x,y,180,16);
  ctx.fillStyle="#ff0000";
  ctx.fillRect(x,y,player.health/player.maxhealth*180,16);
  ctx.fillStyle="#ffffff";
  ctx.font = "8pt Arial";
  ctx.textAlign = "center";
  ctx.fillText(player.health+"/"+player.maxhealth,x+90,y+12);
}

function keyHandle() {
	player.a = {x:0,y:0};
	if(keys[65]) {
  	player.a.x += -player.speed*(1-player.cloak/2);
  }
  if(keys[68]) {
  	player.a.x += player.speed*(1-player.cloak/2);
  }
  if(keys[87]) {
  	player.a.y += -player.speed*(1-player.cloak/2);
  }
  if(keys[83]) {
  	player.a.y += player.speed*(1-player.cloak/2);
  }
  if(keys[49]) {
  	player.curWeap = player.inventory[0];
    player.slot = 0;
    player.curWeap.use = 0;
  }
  if(keys[50]) {
  	if(player.inventory.length>=2) {
      player.curWeap = player.inventory[1];
      player.slot = 1;
      player.curWeap.use = 0;
    }
  }
  if(keys[51]) {
  	if(player.inventory.length>=3) {
      player.curWeap = player.inventory[2];
      player.slot = 2;
      player.curWeap.use = 0;
    }
  }
  if(keys[52]) {
  	if(player.inventory.length>=4) {
      player.curWeap = player.inventory[3];
      player.slot = 3;
      player.curWeap.use = 0;
    }
  }
  if(keys[192]) {
  	if(typeof player.inventory[player.slot] !== "undefined") {
    	var x = -clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+canvas.width/2-64;
  		var y = -clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+canvas.height-142;
      showStats(x,y,player.curWeap);
    }
  }
  if(keys[16] && player.curWeap.ability=="cloak") {
  	if(player.cloak<1) {
    	player.cloak+=0.05;
    }
  } else {
  	if(player.cloak>0) {
    	player.cloak-=0.05;
    }
  }
  if(keys[81]) {
  	if(typeof player.inventory[player.slot] !== "undefined" && dropd==0) {
      items.push({item:player.inventory[player.slot],x:player.x,y:player.y});
      player.inventory.splice(player.slot,1);
      dropd = 50;
      if(typeof player.inventory[player.slot-1] === "undefined") {
      	player.curWeap = weapons[20];
      } else {
      	player.slot--;
      	player.curWeap = player.inventory[player.slot];
      }
    }
  }
  if(keys[69]) {
  	for(var i=0;i<stageitems.length;i++) {
    	if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="chest" && !stageitems[i].opened) {
      	stageitems[i].opened = true;
        chestopen.push({chest:stageitems[i],delay:400});
      }
      if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="magicchest" && !stageitems[i].opened) {
      	stageitems[i].opened = true;
        chestopen.push({chest:stageitems[i],delay:400});
      }
      if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="stairs") {
      	chestopen = [];
        enemies = [];
        projectiles = [];
        stageitems = [];
        spawnpoints = [];
        items = [];
        floor++;
        if(floor % 10 != 0) {
          for(var i=0;i<mapsize;i++) {
            map[i] = [];
            for(var k=0;k<mapsize;k++) {
              map[i][k] = 0;
            }
          }
          newDungeon();
        } else {
        	map = loadBossMap();
          player.x = 32*15;
          player.y = 32*29;
          quadtree = {topleft:[],topright:[],bottomleft:[],bottomright:[]};
          for(var i=0;i<32;i++) {
          	for(var k=0;k<32;k++) {
            	quadtree.topleft.push({x:k,y:i,t:map[k][i]});
            }
          }
          stageitems.push({name:"magicchest",type:"common",x:15,y:8,opened:false,item:null});
        	stageitems.push({name:"stairs",type:"",x:15,y:2});
          // Boss
          // name,x,y,w,h,c,health,attack,speed,aitype
          enemies.push(new Enemy("Flame Guardian",15*32,2*32,20,20,"#f62817",200,9,1,"flameBoss"));
        }
        txt = {t:"Floor "+floor,d:200,md:200};
      }
    }
    for(var i=0;i<items.length;i++) {
    	if(dist(player.x,player.y,items[i].x,items[i].y)<64 && pickupd<1) {
      	var temp = player.curWeap;
        if(player.inventory.length<4) {
        	player.inventory.push(items[i].item);
          items.splice(i,1);
          if(player.inventory.length==1) {
          	player.slot = 0;
            player.curWeap = player.inventory[player.slot];
          }
        } else {
        	player.curWeap = items[i].item;
          player.inventory[player.slot] = items[i].item;
        	items[i].item = temp;
        }
        pickupd = 50;
      }
    }
  }
  player.v.x /= friction;
  player.v.y /= friction;
  
  player.v.x += player.a.x;
  player.v.y += player.a.y;
  if(!checkCollision(player,0)) {
    player.x += player.v.x;
    mx += player.v.x;
  }
  if(!checkCollision(player,1)) {
    player.y += player.v.y;
    my += player.v.y;
  }
}
function checkCollision(object,dir) {
	if(object.x+object.v.x < mapsize*scale/4 && object.y+object.v.y < mapsize*scale/4) {
  	for(var i=0;i<quadtree.topleft.length;i++) {
    	if(quadtree.topleft[i].t==2) {
      	// Collision problems have been fixed
    		var box = {x:quadtree.topleft[i].x*scale,y:quadtree.topleft[i].y*scale,w:scale,h:scale};
        if(dir==0) {
        	var obj = {x:object.x+object.v.x,y:object.y,w:object.w,h:object.h};
        } else if(dir==1) {
        	var obj = {x:object.x,y:object.y+object.v.y,w:object.w,h:object.h};
        } else {
        	var obj = {x:object.x+object.v.x,y:object.y+object.v.y,w:object.w,h:object.h};
        }
        if(obj.x+obj.w>box.x && obj.x<box.x+box.w && obj.y+obj.h>box.y && obj.y<box.y+box.h) {
        	if(dir==0 && obj.x+obj.w>box.x && object.v.x>0) {
          	object.x = box.x-object.w;
          }
          if(dir==0 && obj.x<box.x+box.w && object.v.x<0) {
          	object.x = box.x+box.w;
          }
          if(dir==1 && obj.y+obj.h>box.y && object.v.y>0) {
          	object.y = box.y-object.h;
          }
          if(dir==1 && obj.y<box.y+box.h && object.v.y<0) {
          	object.y = box.y+box.h;
          }
          return true;
        }
      }
    }
  }
  if(object.x+object.v.x >= mapsize*scale/4 && object.y+object.v.y < mapsize*scale/4) {
  	for(var i=0;i<quadtree.topright.length;i++) {
    	if(quadtree.topright[i].t==2) {
      	// Collision problems have been fixed
    		var box = {x:quadtree.topright[i].x*scale,y:quadtree.topright[i].y*scale,w:scale,h:scale};
        if(dir==0) {
        	var obj = {x:object.x+object.v.x,y:object.y,w:object.w,h:object.h};
        } else if(dir==1) {
        	var obj = {x:object.x,y:object.y+object.v.y,w:object.w,h:object.h};
        } else {
        	var obj = {x:object.x+object.v.x,y:object.y+object.v.y,w:object.w,h:object.h};
        }
        if(obj.x+obj.w>box.x && obj.x<box.x+box.w && obj.y+obj.h>box.y && obj.y<box.y+box.h) {
        	if(dir==0 && obj.x+obj.w>box.x && object.v.x>0) {
          	object.x = box.x-object.w;
          }
          if(dir==0 && obj.x<box.x+box.w && object.v.x<0) {
          	object.x = box.x+box.w;
          }
          if(dir==1 && obj.y+obj.h>box.y && object.v.y>0) {
          	object.y = box.y-object.h;
          }
          if(dir==1 && obj.y<box.y+box.h && object.v.y<0) {
          	object.y = box.y+box.h;
          }
          return true;
        }
      }
    }
  }
  if(object.x+object.v.x < mapsize*scale/4 && object.y+object.v.y >= mapsize*scale/4) {
  	for(var i=0;i<quadtree.bottomleft.length;i++) {
    	if(quadtree.bottomleft[i].t==2) {
      	// Collision problems have been fixed
    		var box = {x:quadtree.bottomleft[i].x*scale,y:quadtree.bottomleft[i].y*scale,w:scale,h:scale};
        if(dir==0) {
        	var obj = {x:object.x+object.v.x,y:object.y,w:object.w,h:object.h};
        } else if(dir==1) {
        	var obj = {x:object.x,y:object.y+object.v.y,w:object.w,h:object.h};
        } else {
        	var obj = {x:object.x+object.v.x,y:object.y+object.v.y,w:object.w,h:object.h};
        }
        if(obj.x+obj.w>box.x && obj.x<box.x+box.w && obj.y+obj.h>box.y && obj.y<box.y+box.h) {
        	if(dir==0 && obj.x+obj.w>box.x && object.v.x>0) {
          	object.x = box.x-object.w;
          }
          if(dir==0 && obj.x<box.x+box.w && object.v.x<0) {
          	object.x = box.x+box.w;
          }
          if(dir==1 && obj.y+obj.h>box.y && object.v.y>0) {
          	object.y = box.y-object.h;
          }
          if(dir==1 && obj.y<box.y+box.h && object.v.y<0) {
          	object.y = box.y+box.h;
          }
          return true;
        }
      }
    }
  }
  if(object.x+object.v.x >= mapsize*scale/4 && object.y+object.v.y >= mapsize*scale/4) {
  	for(var i=0;i<quadtree.bottomright.length;i++) {
    	if(quadtree.bottomright[i].t==2) {
      	// Collision problems have been fixed
    		var box = {x:quadtree.bottomright[i].x*scale,y:quadtree.bottomright[i].y*scale,w:scale,h:scale};
        if(dir==0) {
        	var obj = {x:object.x+object.v.x,y:object.y,w:object.w,h:object.h};
        } else if(dir==1) {
        	var obj = {x:object.x,y:object.y+object.v.y,w:object.w,h:object.h};
        } else {
        	var obj = {x:object.x+object.v.x,y:object.y+object.v.y,w:object.w,h:object.h};
        }
        if(obj.x+obj.w>box.x && obj.x<box.x+box.w && obj.y+obj.h>box.y && obj.y<box.y+box.h) {
        	if(dir==0 && obj.x+obj.w>box.x && object.v.x>0) {
          	object.x = box.x-object.w;
          }
          if(dir==0 && obj.x<box.x+box.w && object.v.x<0) {
          	object.x = box.x+box.w;
          }
          if(dir==1 && obj.y+obj.h>box.y && object.v.y>0) {
          	object.y = box.y-object.h;
          }
          if(dir==1 && obj.y<box.y+box.h && object.v.y<0) {
          	object.y = box.y+box.h;
          }
          return true;
        }
      }
    }
  }
}

function itemAnimation(obj) {
	if(obj.chest.name=="chest") {
    var rnd = random(1,1000);
    if(rnd<=750) {
      var arr = common;
    }
    if(rnd>750 && rnd<=870) {
      var arr = uncommon;
    }
    if(rnd>870 && rnd<=940) {
      var arr = rare;
    }
    if(rnd>940 && rnd<=980) {
      var arr = epic;
    }
    if(rnd>980 && rnd<=1000) {
      var arr = legendary;
    }
    var rnd2 = random(0,65535);
    if(rnd2==7) {
      var arr = godly;
    }
    if(obj.delay>0) {
      if(obj.delay%(5+(100-obj.delay/4))==0) {
        var index = random(0,arr.length-1);
        var image = arr[index].image;
        //name,type,rarity,damage,knockback,shoot,image,usetime,range,ability,de,w,h
        obj.chest.item = new Weapon(arr[index].name,arr[index].type,arr[index].rarity,arr[index].damage,arr[index].knockback,arr[index].shoot,arr[index].image,arr[index].usetime,arr[index].range,arr[index].auto,arr[index].ability,arr[index].de,arr[index].w,arr[index].h);
      }
        ctx.save();
        var angle = Math.PI/180*-90;
        ctx.translate(obj.chest.x*scale,obj.chest.y*scale-16);
        ctx.rotate(angle);
        ctx.drawImage(obj.chest.item.image,0,0,32,32);
        ctx.restore();
      obj.delay--;
      return false;
    } else {
      items.push({item:obj.chest.item,x:obj.chest.x*scale,y:obj.chest.y*scale-16});
      return true;
    }
  } else if(obj.chest.name=="magicchest") {
  	var rnd = random(1,100);
    var rnd2 = random(1,100);
    var rnd3 = random(1,100);
    if(rnd<=70) {
      var arr = common;
    }
    if(rnd2<=70) {
    	var arr2 = common;
    }
    if(rnd3<=80) {
    	var arr3 = epic;
    }
    if(rnd>70 && rnd<=83) {
      var arr = uncommon;
    }
    if(rnd2>70 && rnd2<=83) {
      var arr2 = uncommon;
    }
    if(rnd>83 && rnd<=92) {
      var arr = rare;
    }
    if(rnd2>83 && rnd2<=92) {
      var arr2 = rare;
    }
    if(rnd>92 && rnd<=98) {
      var arr = epic;
    }
    if(rnd2>92 && rnd2<=98) {
      var arr2 = epic;
    }
    if(rnd>98 && rnd<=100) {
      var arr = legendary;
    }
    if(rnd2>98 && rnd2<=100) {
      var arr2 = legendary;
    }
    if(rnd3>80 && rnd3<=100) {
      var arr3 = legendary;
    }
    var rnda = random(0,65535);
    if(rnda==7) {
      var arr = godly;
      var arr2 = common;
      var arr3 = rare;
    }
    if(obj.delay>0) {
      if(obj.delay%(5+(100-obj.delay/4))==0) {
        var index = random(0,arr.length-1);
        var index2 = random(0,arr2.length-1);
        var index3 = random(0,arr3.length-1);
        var image = arr[index].image;
        //name,type,rarity,damage,knockback,shoot,image,usetime,range,ability,de,w,h
        obj.chest.item = new Weapon(arr[index].name,arr[index].type,arr[index].rarity,arr[index].damage,arr[index].knockback,arr[index].shoot,arr[index].image,arr[index].usetime,arr[index].range,arr[index].auto,arr[index].ability,arr[index].de,arr[index].w,arr[index].h);
      obj.chest.item2 = new Weapon(arr2[index2].name,arr2[index2].type,arr2[index2].rarity,arr2[index2].damage,arr2[index2].knockback,arr2[index2].shoot,arr2[index2].image,arr2[index2].usetime,arr2[index2].range,arr2[index2].auto,arr2[index2].ability,arr2[index2].de,arr2[index2].w,arr2[index2].h);
      obj.chest.item3 = new Weapon(arr3[index3].name,arr3[index3].type,arr3[index3].rarity,arr3[index3].damage,arr3[index3].knockback,arr3[index3].shoot,arr3[index3].image,arr3[index3].usetime,arr3[index3].range,arr3[index3].auto,arr3[index3].ability,arr3[index3].de,arr3[index3].w,arr3[index3].h);
      }
        ctx.save();
        var angle = Math.PI/180*-90;
        ctx.translate(obj.chest.x*scale,obj.chest.y*scale-16);
        ctx.rotate(angle);
        ctx.drawImage(obj.chest.item.image,0,-32,32,32);
        if(obj.delay<300) {
        	ctx.drawImage(obj.chest.item2.image,0,0,32,32);
        }
        if(obj.delay<200) {
        	ctx.drawImage(obj.chest.item3.image,0,32,32,32);
        }
        ctx.restore();
      obj.delay--;
      return false;
    } else {
      items.push({item:obj.chest.item,x:obj.chest.x*scale-32,y:obj.chest.y*scale-16});
      items.push({item:obj.chest.item2,x:obj.chest.x*scale,y:obj.chest.y*scale-16});
      items.push({item:obj.chest.item3,x:obj.chest.x*scale+32,y:obj.chest.y*scale-16});
      return true;
    }
  }
}


function Enemy(name, x, y, w, h, c, health, attack, speed, aitype) {
  this.name = name;
  this.x = x;
  this.y = y;
  this.v = {
    x: 0,
    y: 0
  };
  this.a = {
    x: 0,
    y: 0
  };
  this.w = w;
  this.h = h;
  this.c = c;
  this.health = health;
  this.attack = attack;
  this.speed = speed;
  this.aitype = aitype;
  this.dead = false;
  this.cooldown = 0;
  this.currentPath;
  this.status = 0;
  this.cansee = 0;
  this.apoint = {
    x: -1,
    y: -1
  };
  this.update = function() {
    ctx.fillStyle = this.c;
    ctx.fillRect(this.x, this.y, this.w, this.h);
    // Just a simple AI, replace with A* pathfinding later
    if (this.aitype == "melee" && !this.dead) {
      var dx;
      var dy;
      if (dist(this.x, this.y, player.x, player.y) >= 5120 * (1.001 - player.cloak)) {
        if (this.cansee > 0) {
          this.cansee -= 0.1;
        }
      }
      if (dist(this.x, this.y, player.x, player.y) <= 5120 * (1.001 - player.cloak) || this.cansee >= 0.1) {
        if (this.cansee < 20) {
          this.cansee += 0.05;
        }
        dx = player.x - this.x;
        dy = player.y - this.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dx *= this.speed;
        dy /= len;
        dy *= this.speed;
      } else {
        if (this.cansee > 0) {
          this.cansee -= 0.05;
        }
        dx = this.apoint.x - this.x;
        dy = this.apoint.y - this.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len != 0) {
          dx /= len;
          dy /= len;
          dx *= this.speed;
          dy *= this.speed;
        }
        if (random(0, 40) == 7) {
          this.apoint.x = random(this.x - this.speed * 2, this.x + this.speed * 2);
        }
        if (random(0, 40) == 7) {
          this.apoint.y = random(this.y - this.speed * 2, this.y + this.speed * 2);
        }
      }
      if (this.cooldown == 0) {
        this.v.x = dx;
        this.v.y = dy;
      }
      this.v.x /= friction;
      this.v.y /= friction;
      this.v.x += this.a.x;
      this.v.y += this.a.y;
      if (!checkCollision(this, 0)) {
        this.x += this.v.x;
      }
      if (!checkCollision(this, 1)) {
        this.y += this.v.y;
      }
      var weap = player.curWeap;
      if (this.x + this.w > weap.x && this.x < weap.x + weap.w && this.y + this.h > weap.y && this.y < weap.y + weap.h && weap.use > 0 && this.cooldown == 0 && weap.type != "bow" && weap.type != "staff") {
        if (weap.type == "dagger" && player.cloak >= 0.8 && this.cansee <= 0.15) {
          var damage = player.curWeap.damage * 6 + Math.pow(player.curWeap.level, 4) - 1;
        } else {
          var damage = player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1;
        }
        this.health -= damage;
        this.cansee = 30;
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        var cos = -Math.cos(angle - 40) * player.curWeap.knockback;
        var sin = -Math.sin(angle - 40) * player.curWeap.knockback;
        damagetxt.push({
          x: this.x + this.w / 2,
          y: this.y - this.h / 2,
          vy: -2,
          d: 25,
          md: 25,
          t: damage
        });
        if (player.curWeap.knockback != 0) {
          this.v = {
            x: cos,
            y: sin
          };
          this.cooldown = 10;
        }
        if (this.health <= 0) {
          this.dead = true;
          dropLoot(this);
          this.x = -2000;
          if (player.usinga > 0 && player.curWeap.ability == "dash") {
            player.cooldown = 0;
          }
          player.curWeap.exp += 5;
          if (player.curWeap.exp >= player.curWeap.level * 100 && player.curWeap.level < 5) {
            player.curWeap.exp = 0;
            player.curWeap.level++;
            txt.t = "Weapon Level Increased!";
            txt.d = 100;
            txt.md = 100;
          }
        }
      } else if (weap.type == "bow" || weap.type == "staff") {
        for (var i = 0; i < projectiles.length; i++) {
          if (lineBox(projectiles[i], this, 8, player.curWeap.range)) {
            this.health -= player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1;
            var cos = -Math.cos(projectiles[i].r - 40) * player.curWeap.knockback;
            var sin = -Math.sin(projectiles[i].r - 40) * player.curWeap.knockback;
            projectiles[i].collided = true;
            damagetxt.push({
              x: this.x + this.w / 2,
              y: this.y - this.h / 2,
              vy: -2,
              d: 25,
              md: 25,
              t: player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1
            });
            if (player.curWeap.knockback != 0) {
              this.v = {
                x: cos,
                y: sin
              };
              this.cooldown = 10;
            }
            if (this.health <= 0) {
              this.dead = true;
              dropLoot(this);
              this.x = -2000;
              player.curWeap.exp += 5;
              if (player.curWeap.exp >= player.curWeap.level * 100 && player.curWeap.level < 5) {
                player.curWeap.exp = 0;
                player.curWeap.level++;
                txt.t = "Weapon Level Increased!";
                txt.d = 100;
                txt.md = 100;
              }
            }
          }
        }
      }
      if (this.cooldown > 0) {
        this.cooldown--;
      }
    } else if (this.aitype == "ranged" && !this.dead) {
      var dx;
      var dy;
      if (dist(this.x, this.y, player.x, player.y) >= 5120 * (1.001 - player.cloak)) {
        if (this.cansee > 0) {
          this.cansee -= 0.1;
        }
      }
      if (dist(this.x, this.y, player.x, player.y) <= 5120 * (1.001 - player.cloak) || this.cansee >= 0.1) {
        if (this.cansee < 20) {
          this.cansee += 0.05;
        }
        dx = player.x - this.x;
        dy = player.y - this.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        dx /= len;
        dx *= this.speed;
        dy /= len;
        dy *= this.speed;
      } else {
        if (this.cansee > 0) {
          this.cansee -= 0.05;
        }
        dx = this.apoint.x - this.x;
        dy = this.apoint.y - this.y;
        var len = Math.sqrt(dx * dx + dy * dy);
        if (len != 0) {
          dx /= len;
          dy /= len;
          dx *= this.speed;
          dy *= this.speed;
        }
        if (random(0, 40) == 7) {
          this.apoint.x = random(this.x - this.speed * 2, this.x + this.speed * 2);
        }
        if (random(0, 40) == 7) {
          this.apoint.y = random(this.y - this.speed * 2, this.y + this.speed * 2);
        }
      }
      var angle = Math.atan2(player.x - this.x, player.y - this.y);
      //eprojectiles.push(new Projectile(this.x,this.y,16,16,angle,{x:dx,y:dy},"arrow"));
      if (this.cooldown == 0) {
        this.v.x = dx;
        this.v.y = dy;
      }
      this.v.x /= friction;
      this.v.y /= friction;
      this.v.x += this.a.x;
      this.v.y += this.a.y;
      if (!checkCollision(this, 0)) {
        this.x += this.v.x;
      }
      if (!checkCollision(this, 1)) {
        this.y += this.v.y;
      }
      var weap = player.curWeap;
      if (this.x + this.w > weap.x && this.x < weap.x + weap.w && this.y + this.h > weap.y && this.y < weap.y + weap.h && weap.use > 0 && this.cooldown == 0 && weap.type != "bow" && weap.type != "staff") {
        if (weap.type == "dagger" && player.cloak >= 0.8 && this.cansee <= 0.15) {
          var damage = player.curWeap.damage * 6 + Math.pow(player.curWeap.level, 4) - 1;
        } else {
          var damage = player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1;
        }
        this.health -= damage;
        this.cansee = 30;
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        var cos = -Math.cos(angle - 40) * player.curWeap.knockback;
        var sin = -Math.sin(angle - 40) * player.curWeap.knockback;
        damagetxt.push({
          x: this.x + this.w / 2,
          y: this.y - this.h / 2,
          vy: -2,
          d: 25,
          md: 25,
          t: damage
        });
        if (player.curWeap.knockback != 0) {
          this.v = {
            x: cos,
            y: sin
          };
          this.cooldown = 10;
        }
        if (this.health <= 0) {
          this.dead = true;
          dropLoot(this);
          this.x = -2000;
          if (player.usinga > 0 && player.curWeap.ability == "dash") {
            player.cooldown = 0;
          }
          player.curWeap.exp += 5;
          if (player.curWeap.exp >= player.curWeap.level * 100 && player.curWeap.level < 5) {
            player.curWeap.exp = 0;
            player.curWeap.level++;
            txt.t = "Weapon Level Increased!";
            txt.d = 100;
            txt.md = 100;
          }
        }
      } else if (weap.type == "bow" || weap.type == "staff") {
        for (var i = 0; i < projectiles.length; i++) {
          if (lineBox(projectiles[i], this, 8, player.curWeap.range)) {
            this.health -= player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1;
            var cos = -Math.cos(projectiles[i].r - 40) * player.curWeap.knockback;
            var sin = -Math.sin(projectiles[i].r - 40) * player.curWeap.knockback;
            projectiles[i].collided = true;
            damagetxt.push({
              x: this.x + this.w / 2,
              y: this.y - this.h / 2,
              vy: -2,
              d: 25,
              md: 25,
              t: player.curWeap.damage + Math.pow(player.curWeap.level, 4) - 1
            });
            if (player.curWeap.knockback != 0) {
              this.v = {
                x: cos,
                y: sin
              };
              this.cooldown = 10;
            }
            if (this.health <= 0) {
              this.dead = true;
              dropLoot(this);
              this.x = -2000;
              player.curWeap.exp += 5;
              if (player.curWeap.exp >= player.curWeap.level * 100 && player.curWeap.level < 5) {
                player.curWeap.exp = 0;
                player.curWeap.level++;
                txt.t = "Weapon Level Increased!";
                txt.d = 100;
                txt.md = 100;
              }
            }
          }
        }
      }
      if (this.cooldown > 0) {
        this.cooldown--;
      }
    }
  }
}

function dropLoot(obj) {
	var n = random(floor,floor*3);
  for(var i=0;i<n/(Math.floor(n/10)+1);i++) {
  	if(Math.floor(n/10)*5==0) {
    	var v = 1;
    } else {
    	var v = Math.floor(n/10)*5;
    }
    exporbs.push({x:obj.x,y:obj.y,v:{x:Math.random()*20-10,y:Math.random()*20-10},w:8,h:8,value:v});
  }
	var rnd = random(0,14);
	if(rnd==0) {
  	var rndc = random(0,100);
    if(rndc<50) {
    	rnd2 = random(0,1); // worst health potion or worst speed potion
    } else if(rndc>=50 && rndc<80) {
    	rnd2 = 2; // health potion beta
    } else if(rndc>=80 && rndc<90) {
    	rnd2 = 3; // health potion gamma
    } else if(rndc>=90 && rndc<97) {
    	rnd2 = 4; // health potion delta
    } else if(rndc>=97 && rndc<100) {
    	rnd2 = 5; // health potion omega
    }
  	//var rnd2 = random(0,potions.length-1);
    //name,type,image,rarity,level,effect,duration,de
    var item = new Potion(potions[rnd2].name,potions[rnd2].type,potions[rnd2].image,potions[rnd2].rarity,potions[rnd2].level,potions[rnd2].effect,potions[rnd2].duration,potions[rnd2].de);
    items.push({item:item,x:obj.x,y:obj.y});
  }
}

function Weapon(name,type,rarity,damage,knockback,shoot,image,usetime,range,auto,ability,de,w,h) {
	this.name = name;
  this.type = type;
  this.item = "weapon";
  if(this.type=="sword") {
  	this.id = 0;
  } else if(this.type=="spear") {
  	this.id = 1;
  } else if(this.type=="bow") {
  	this.id = 2;
  } else if(this.type=="staff") {
  	this.id = 3;
  }
  this.level = 1;
  this.exp = 0;
  this.rarity = rarity;
  this.damage = damage;
  this.knockback = knockback;
  this.shoot = shoot;
  this.usetime = usetime;
  this.x;
  this.y;
  if(w) {
  	this.w = w;
  } else {
  	this.w = image.width*2;
  }
  if(h) {
  	this.h = h;
  } else {
  	this.h = image.height*2;
  }
  this.use = 0;
  this.range = range;
  this.auto = auto;
  this.ability = ability;
  this.clickangle = 0;
  this.swingStyle = 0;
  this.image = image;
  this.de = de;
  this.update = function() {
  	if(this.type=="spear") {
    	if(this.use>0) {
      	ctx.save();
  			ctx.translate(player.x+8,player.y+8);
  			ctx.rotate(this.clickangle);
        var imagex = Math.cos((this.clickangle+40)*Math.PI/180)*(this.range+this.use);
        var imagey = Math.sin((this.clickangle+40)*Math.PI/180)*(this.range+this.use);
  			ctx.drawImage(image,imagex,imagey,this.w,this.h);
        var cos = Math.cos(this.clickangle);
        var sin = Math.sin(this.clickangle);
        imagex+=20;
        imagey+=20;
        this.x = (imagex*cos - imagey*sin)+player.x;
        this.y = (imagex*sin + imagey*cos)+player.y;
  			ctx.restore();
        this.use--;
      } else {
        ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        ctx.translate(player.x+8,player.y+8);
        this.x = player.x+8;
        this.y = player.y+8;
        ctx.rotate(angle);
        ctx.drawImage(this.image,0,0,this.w,this.h);
        ctx.restore();
      }
    }
    else if(this.type=="sword") {
    	if(this.use>0) {
      	ctx.save();
  			ctx.translate(player.x+8,player.y+8);
        if(this.swingStyle==0) {
          ctx.rotate(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
          var cos = Math.cos(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        	var sin = Math.sin(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        } else {
        	ctx.rotate(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
          var cos = Math.cos(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        	var sin = Math.sin(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        }
        var imagex = Math.cos((this.clickangle+40)*Math.PI/180);
        var imagey = Math.sin((this.clickangle+40)*Math.PI/180);
  			ctx.drawImage(image,imagex,imagey,this.w,this.h);
        imagex+=20;
        imagey+=20;
        this.x = (imagex*cos - imagey*sin)+player.x;
        this.y = (imagex*sin + imagey*cos)+player.y;
  			ctx.restore();
        this.use--;
      } else {
        ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        ctx.translate(player.x+8,player.y+8);
        this.x = player.x+8;
        this.y = player.y+8;
        ctx.rotate(angle);
        ctx.drawImage(image,0,0,this.w,this.h);
        ctx.restore();
      }
    } else if(this.type=="dagger") {
    	if(this.use>0) {
      	ctx.save();
  			ctx.translate(player.x+8,player.y+8);
        if(this.swingStyle==0) {
          ctx.rotate(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
          var cos = Math.cos(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        	var sin = Math.sin(this.clickangle-(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        } else {
        	ctx.rotate(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
          var cos = Math.cos(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        	var sin = Math.sin(this.clickangle+(this.range-(this.usetime-this.use)*this.range*2/this.usetime)*Math.PI/180);
        }
        var imagex = Math.cos((this.clickangle+40)*Math.PI/180);
        var imagey = Math.sin((this.clickangle+40)*Math.PI/180);
        this.w = 32; this.h = 32;
  			ctx.drawImage(image,imagex,imagey,this.w,this.h);
        this.w = 16; this.h = 16;
        imagex+=20;
        imagey+=20;
        this.x = (imagex*cos - imagey*sin)+player.x;
        this.y = (imagex*sin + imagey*cos)+player.y;
  			ctx.restore();
        this.use--;
      } else {
        ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        ctx.translate(player.x+8,player.y+8);
        this.x = player.x+8;
        this.y = player.y+8;
        this.w = 32; this.h = 32;
        ctx.rotate(angle);
        ctx.drawImage(image,0,0,this.w,this.h);
        ctx.restore();
      }
    } else if(type=="bow") {
    	if(this.use>0) {
      	ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
  			ctx.translate(player.x+8,player.y+8);
        ctx.rotate(angle);
  			ctx.drawImage(this.image,0,0,this.w,this.h);
        if(this.use==this.usetime) {
        	var dx = mx-(player.x+16); var dy = my-(player.y+16);
          var len = Math.sqrt(dx*dx + dy*dy);
          var speed = this.range;
          dx /= len; dy /= len; dx *= speed; dy *= speed;
        	var v = {x:dx,y:dy};
        	projectiles.push(new Projectile(player.x+8,player.y+8,16,16,angle,v,this.shoot));
        }
  			ctx.restore();
        this.use--;
      } else {
        ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        ctx.translate(player.x+8,player.y+8);
        this.x = player.x+8;
        this.y = player.y+8;
        ctx.rotate(angle);
        ctx.drawImage(this.image,0,0,this.w,this.h);
        ctx.restore();
      }
    } else if(type=="staff") {
    	if(this.use>0) {
      	ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
  			ctx.translate(player.x+8,player.y+8);
        ctx.rotate(angle);
  			ctx.drawImage(this.image,0,0,this.w,this.h);
        if(this.use==this.usetime) {
        	var dx = mx-(player.x+16); var dy = my-(player.y+16);
          var len = Math.sqrt(dx*dx + dy*dy);
          var speed = this.range;
          dx /= len; dy /= len; dx *= speed; dy *= speed;
        	var v = {x:dx,y:dy};
        	projectiles.push(new Projectile(player.x+8,player.y+8,16,16,angle,v,this.shoot));
        }
  			ctx.restore();
        this.use--;
      } else {
        ctx.save();
        var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
        ctx.translate(player.x+8,player.y+8);
        this.x = player.x+8;
        this.y = player.y+8;
        ctx.rotate(angle);
        ctx.drawImage(this.image,0,0,this.w,this.h);
        ctx.restore();
      }
    }
  }
}

function Potion(name,type,image,rarity,level,effect,duration,de) {
	this.name = name;
  this.type = type;
  this.image = image
  this.rarity = rarity;
  this.de = de;
  this.use = 0;
  this.usetime = 1;
  this.item = "potion";
  this.level = level;
  this.effect = effect;
  this.duration = duration;
  this.update = function() {
  	if(this.use>0 && potiond==0 && pickupd==0) {
    	player.inventory.splice(player.slot,1);
      player.slot--;
      if(typeof player.inventory[player.slot] !== "undefined") {
      	player.curWeap = player.inventory[player.slot];
      } else {
      	player.curWeap = weapons[20];
      }
      if(this.effect>0) {
        player.health += this.effect;
        if(player.health>player.maxhealth) {
          player.health = player.maxhealth;
        }
      }
      if(this.name=="Speed Potion") {
      	var flag = -1;
      	for(var i=0;i<player.effects.length;i++) {
        	if(player.effects[i].t=="speed") { flag = i; }
        }
        if(flag==-1) {
      		player.effects.push({t:"speed",d:this.duration,md:this.duration});
        } else {
        	player.effects[flag].d = player.effects[flag].md-1;
        }
      }
      potiond = 50;
    }
  }
}

function gameover() {
	ctx.textAlign="center";
	ctx.fillStyle="#ff0000";
  ctx.font = "Bold 24pt Arial";
  var offsetx = -clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width);
  var offsety = -clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height);
  ctx.fillText("GAME OVER",canvas.width/2+offsetx,canvas.height/2+offsety);
	cancelAnimationFrame(req);
}
function useAbility(e) {
	player.abweap = player.curWeap;
	if(player.curWeap.ability=="dash" && player.cooldown==0) {
  	player.usinga = 5;
    var mouse = {x:e.clientX-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width),y:e.clientY-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)};
    var dx = mouse.x-player.x; var dy = mouse.y-player.y;
    var len = Math.sqrt(dx*dx + dy*dy);
    dx /= len; dy /= len; dx *= 30; dy *= 30;
    player.apoint = {x:dx,y:dy};
    player.curWeap.use = player.curWeap.usetime;
    player.curWeap.clickangle = Math.atan2(mouse.y-(player.y+8),mouse.x-(player.x+8))+(Math.PI/180*-40);
    player.curWeap.swingStyle=random(0,1);
    player.cooldown = 360;
  } else if(player.curWeap.ability=="lunge" && player.cooldown==0) {
  	player.usinga = 4;
    var mouse = {x:e.clientX-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width),y:e.clientY-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)};
    var dx = mouse.x-player.x; var dy = mouse.y-player.y;
    var len = Math.sqrt(dx*dx + dy*dy);
    dx /= len; dy /= len; dx *= 10; dy *= 10;
    player.apoint = {x:dx,y:dy};
    player.curWeap.use = player.curWeap.usetime;
    player.curWeap.clickangle = Math.atan2(mouse.y-(player.y+8),mouse.x-(player.x+8))+(Math.PI/180*-40);
    player.cooldown = 180;
  } else if(player.curWeap.ability=="rapid" && player.cooldown==0) {
      player.cooldown = 300;
      player.usinga = 25;
  }
}
function Projectile(x,y,w,h,r,v,type,wait) {
	this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.r = r;
  this.v = v;
 	if(wait) {
  	this.wait = wait;
  } else {
  	this.wait = 0;
  }
  this.type = type;
  if(this.type=="arrow") {
  	this.img = images.arrow;
  } else if(this.type=="orb") {
  	this.img = images.orb;
  } else {
  	this.img = images.arrow;
  }
  this.collided = false;
  this.update = function() {
  	if(this.wait==0) {
      this.x += this.v.x;
      this.y += this.v.y;
      this.w = 4;
      this.h = 4;
    } else {
    	this.wait--;
    }
    if(checkCollision(this)) {
    	this.collided = true;
    }
    if(this.collided) {
    	projectiles.splice(this,1);
    }
  }
}

newDungeon();

function update() {
	ctx.setTransform(1,0,0,1,0,0);
	ctx.clearRect(0,0,canvas.width,canvas.height);
  var camX = clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width);
  var camY = clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height);
  ctx.translate(camX,camY);
  drawMap();
  drawHud();
  if(txt.d>0) {
  	displayText(txt,canvas.width/2,canvas.height/3);
    txt.d--;
  }
  if(mdown==1 && player.curWeap.auto==1) {
  	click(ev);
  }
  if(damagetxt.length>0) {
  	damageText();
  }
  if(random(0,79)==6 && enemies.length<50 && floor%10!=0) {
  	var index = random(0,spawnpoints.length-1);
    var x = (spawnpoints[index].x+random(-spawnpoints[index].w/2+2,spawnpoints[index].w/2-2))*scale;
    var y = (spawnpoints[index].y+random(-spawnpoints[index].h/2+2,spawnpoints[index].h/2-2))*scale;
    var rnd = random(0,3);
    // name,x,y,w,h,c,health,attack,speed,aitype
    if(rnd==0) {
    	enemies.push(new Enemy("light",x,y,16,16,"#ff0000",15+Math.floor(1.2*(floor-1)),Math.floor(1.1*(floor-1)/4)+3,2,"ranged"));
    } else if(rnd==1 && floor>2) {
    	enemies.push(new Enemy("heavy",x,y,16,16,"#660000",35+Math.floor(1.2*(floor-1)),Math.floor(1.1*(floor-1)/4)+5,1,"melee"));
    } else if(rnd==2 && floor>10) {
    	enemies.push(new Enemy("speed",x,y,16,16,"#0066ff",10+Math.floor(1.2*(floor-1)),Math.floor(1.1*(floor-1)/4)+2,3.5,"melee"));
    } else if(rnd==3 && floor>10) {
    	enemies.push(new Enemy("beast",x,y,24,24,"#706050",105+Math.floor(1.2*(floor-1)),Math.floor(1.1*(floor-1))+6,1,"melee"));
    }
  }
  for(var i=0;i<stageitems.length;i++) {
  	if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="chest" && !stageitems[i].opened) {
    	ctx.fillStyle="#ffffff";
      ctx.textAlign="center";
      ctx.font="8pt Arial";
    	ctx.fillText("Press E to Open",stageitems[i].x*scale+16,stageitems[i].y*scale-16);
    }
    if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="magicchest" && !stageitems[i].opened) {
    	ctx.fillStyle="#ffffff";
      ctx.textAlign="center";
      ctx.font="8pt Arial";
    	ctx.fillText("Press E to Open",stageitems[i].x*scale+16,stageitems[i].y*scale-16);
    }
    if(dist(player.x,player.y,stageitems[i].x*scale+16,stageitems[i].y*scale+16)<64 && stageitems[i].name=="stairs") {
    	ctx.fillStyle="#ffffff";
      ctx.textAlign="center";
      ctx.font="8pt Arial";
    	ctx.fillText("Press E to descend",stageitems[i].x*scale+16,stageitems[i].y*scale-16);
    }
  }
  for(var i=0;i<items.length;i++) {
  	if(dist(player.x,player.y,items[i].x+16,items[i].y+16)<64) {
    	showStats(items[i].x+36,items[i].y-32,items[i].item);
    }
  }
  for(var i=0;i<exporbs.length;i++) {
  	ctx.drawImage(images.exporb,exporbs[i].x,exporbs[i].y,8,8);
    if(!checkCollision(exporbs[i])) {
      exporbs[i].x+=exporbs[i].v.x;
      exporbs[i].y+=exporbs[i].v.y;
    }
    exporbs[i].v.x/=friction;
    exporbs[i].v.y/=friction;
    if(dist(player.x,player.y,exporbs[i].x,exporbs[i].y)<32 && exporbs[i].v.x <= 0.1 && exporbs[i].v.y <= 0.1) {
      player.exp+=exporbs[i].value;
      exporbs.splice(i,1);
      if(player.exp>=25*(player.level*player.level)) {
      	player.level++;
        player.exp = 0;
        player.maxhealth += Math.floor(1.5*(player.level));
        player.health += Math.floor(1.5*(player.level));
        txt = {t:"Level Up",d:100,md:100};
      }
    }
  }
  if(pickupd>0) {
  	pickupd--;
  }
  if(dropd>0) {
  	dropd--;
  }
  if(potiond>0) {
  	potiond--;
  }
  for(var i=0;i<player.effects.length;i++) {
  	if(player.effects[i].t=="speed" && player.effects[i].d==player.effects[i].md) {
    	player.speed += 0.25;
    }
    if(player.effects[i].t=="speed" && player.effects[i].d==1) {
    	player.speed -= 0.25;
    }
    player.effects[i].d--;
    if(player.effects[i].d<=0) {
    	player.effects.splice(i,1);
    }
  }
  for(var i=0;i<chestopen.length;i++) {
  	if(itemAnimation(chestopen[i])) {
    	chestopen.splice(i,1);
      i--;
    } else {
    	itemAnimation(chestopen[i]);
    }
  }
  for(var i=0;i<items.length;i++) {
  	ctx.save();
    var angle = Math.PI/180*-90;
    ctx.translate(items[i].x,items[i].y);
    ctx.rotate(angle);
  	ctx.drawImage(items[i].item.image,0,0,32,32);
    ctx.restore();
  }
  for(var i=0;i<projectiles.length;i++) {
  	ctx.save();
    angle = projectiles[i].r;
    ctx.translate(projectiles[i].x,projectiles[i].y);
    ctx.rotate(angle);
    ctx.drawImage(projectiles[i].img,0,0,32,32);
    ctx.restore();
    projectiles[i].update();
  }
  for(var i=0;i<eprojectiles.length;i++) {
  	ctx.save();
    angle = eprojectiles[i].r;
    ctx.translate(eprojectiles[i].x,eprojectiles[i].y);
    ctx.rotate(angle);
    ctx.drawImage(eprojectiles[i].img,0,0,32,32);
    ctx.restore();
    eprojectiles[i].update();
    console.log(eprojectiles);
  }
  if(player.usinga==0) {
  	keyHandle();
    if(player.cooldown>0) {
    	player.cooldown--;
      ctx.fillStyle="#888888";
      ctx.fillRect(-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+540,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+440,32,32);
      ctx.fillStyle="#ff2222";
      ctx.textAlign="center";
      ctx.font="16pt Arial";
      ctx.fillText(Math.ceil(player.cooldown/60),-clamp(-player.x+8 + canvas.width/2, -mapsize*28, mapsize*4.5 - canvas.width)+556,-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height)+462);
    }
  } else {
  	if(player.curWeap.name == player.abweap.name) {
      if(player.curWeap.ability=="dash") {
        var temp = player.v;
        player.v.x = player.apoint.x;
        player.v.y = player.apoint.y;
        if(!checkCollision(player,0)) {
          player.x+=player.apoint.x;
        }
        if(!checkCollision(player,1)) {
          player.y+=player.apoint.y;
        }
        player.v = temp;
      } else if(player.curWeap.ability=="lunge") {
        player.v.x+=player.apoint.x;
        player.v.y+=player.apoint.y;
      } else if(player.curWeap.ability=="rapid") {
        keyHandle();
        if(player.usinga % 5 == 0) {
          var angle = Math.atan2(my-(player.y+8),mx-(player.x+8))+(Math.PI/180*-40);
          var dx = mx-(player.x+16); var dy = my-(player.y+16);
          var len = Math.sqrt(dx*dx + dy*dy);
          var speed = player.curWeap.range;
          dx /= len; dy /= len; dx *= speed; dy *= speed;
          var v = {x:dx,y:dy};
          projectiles.push(new Projectile(player.x+8,player.y+8,16,16,angle,v,player.curWeap.shoot));
        }
      }
      player.usinga--;
    } else {
    	player.usinga = 0;
    }
  }
  for(var i=0;i<enemies.length;i++) {
  	enemies[i].update();
    if(enemies[i].x+enemies[i].w>player.x && enemies[i].x<player.x+player.w && enemies[i].y+enemies[i].h>player.y && enemies[i].y<player.y+player.h && player.hurt==0 && player.usinga==0) {
    	player.health -= enemies[i].attack;
      if(player.health<=0) {
      	gameover();
        var flag = 1;
      }
      player.hurt = 160;
    }
  }
  if(player.hurt>0) {
  	player.hurt--;
   	if(Math.floor(player.hurt/16) % 2 == 0) {
    	ctx.fillStyle="rgba(255,255,255,"+(1-player.cloak/2)+")";
  		ctx.fillRect(player.x,player.y,player.w,player.h);
    }
  } else {
  	ctx.fillStyle="rgba(255,255,255,"+(1-player.cloak/2)+")";
  	ctx.fillRect(player.x,player.y,player.w,player.h);
  }
  player.curWeap.update();
  if(flag!=1) {
  	req = requestAnimationFrame(update);
  }
}
update();

function lineBox(line,box,steps,range) {
	var r = range/steps;
	for(var k=0;k<range;k+=r) {
    var p = k/range;
    if(box.x+box.w>line.x+line.v.x*p && box.x<line.x+line.v.x*p && box.y+box.h>line.y+line.v.y*p && box.y<line.y+line.v.y*p) {
			return true;
      break;
    }
  }
  return false;
}
function particles() {
	// For status effects
}


function random(min,max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}
function dist(x1,y1,x2,y2) {
	return Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
}
function clamp(value, min, max){
    if(value < min) return min;
    else if(value > max) return max;
    return value;
}
function displayText(text,x,y) {
	ctx.fillStyle="rgba(255,255,255,"+text.d/text.md+")";
  ctx.strokeStyle="rgba(128,128,128,"+text.d/text.md+")";
  ctx.lineWidth = 3;
  ctx.textAlign="center";
	ctx.font="24pt Arial";
  ctx.fillText(text.t,x-clamp(-player.x+8 + canvas.width/2, -mapsize*16, mapsize*4.5 - canvas.width),y-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height));
  ctx.strokeText(text.t,x-clamp(-player.x+8 + canvas.width/2, -mapsize*16, mapsize*4.5 - canvas.width),y-clamp(-player.y+8 + canvas.height/2, -mapsize*28, mapsize*3.75 - canvas.height));
}
function damageText() {
	for(var i=0;i<damagetxt.length;i++) {
  	ctx.font = "15px Arial";
  	ctx.strokeStyle = "rgba(0,0,0,"+damagetxt[i].d/damagetxt[i].md+")";
    ctx.lineWidth = 1;
  	ctx.fillStyle = "rgba(255,255,255,"+damagetxt[i].d/damagetxt[i].md+")";
  	ctx.fillText(damagetxt[i].t,damagetxt[i].x,damagetxt[i].y);
    ctx.strokeText(damagetxt[i].t,damagetxt[i].x,damagetxt[i].y);
    damagetxt[i].y+=damagetxt[i].vy;
    damagetxt[i].vy+=0.1;
    damagetxt[i].d--;
    if(damagetxt[i].d==0) {
    	damagetxt.splice(i,1);
    }
  }
}

function wrapText(text, x, y, maxWidth, lineHeight) {
	var words = text.split(' ');
	var line = '';

	for(var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = ctx.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > maxWidth && n > 0) {
			ctx.fillText(line, x, y);
			line = words[n] + ' ';
			y += lineHeight;
		}
		else {
			line = testLine;
		}
	}
	ctx.fillText(line, x, y);
}
function showStats(x,y,item) {
	ctx.fillStyle="rgba(255,255,255,0.8)";
  ctx.fillRect(x,y,128,96);
  if(item.rarity=="common") {
    ctx.fillStyle = "#3388cc";
  } else if(item.rarity=="uncommon") {
    ctx.fillStyle = "#0000ff";
  } else if(item.rarity=="rare") {
    ctx.fillStyle = "#ff00ff";
  } else if(item.rarity=="epic") {
    ctx.fillStyle = "#dd8500";
  } else if(item.rarity=="legendary") {
    ctx.fillStyle = "#ff0000";
  } else if(item.rarity=="godly") {
  	ctx.fillStyle = "#66aa66";
  }
  // +38 -32
  var level;
  if(item.level == 1) {
  	level = "α";
  } else if(item.level == 2) {
    level = "β";
  } else if(item.level == 3) {
    level = "γ";
  } else if(item.level == 4) {
    level = "δ";
  } else if(item.level == 5) {
    level = "Ω";
  }
  ctx.textAlign="left";
  ctx.font="8pt Arial";
  ctx.fillText(item.name+" "+level,x+6,y+12);
  if(item.item=="weapon") {
  	ctx.fillText("Damage: "+(item.damage+(Math.pow(item.level,4)-1)),x+6,y+26);
  	ctx.fillText("Attack Speed: "+(1/(item.usetime*(1/60))).toFixed(4),x+6,y+40);
  }
  ctx.font="italic 8pt Arial";
  wrapText(item.de,x+6,y+54,128,12);
}

function floodFill(x,y) {
	if(map[x][y]==1) {
		map[x][y] = 4;
  } else {
  	return;
  }
  if(x>=1) {
  	floodFill(x-1,y);
  }
  if(x<mapsize) {
  	floodFill(x+1,y);
  }
  if(y>=1) {
  	floodFill(x,y-1);
  }
  if(y<mapsize) {
  	floodFill(x,y+1);
  }
}

function loadImages() {
	images.glimmer.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABPSURBVDhPY/gPBQxkAiYoDTYIyiQJMDECAZRNOaDEK3AwaggmGJyGILNJSkQoGqEJEJ6UiQUwjTDDiHYBuu0kGwADyAaBAMkGgADCEAYGAGPaR9P4vH7uAAAAAElFTkSuQmCC";
  images.sword.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB6SURBVDhPpZFREoAgCAWx+9+5eg4wKAhM7Yci4aJGN0MfuXieIg6VjnhgsIXjZd+IHIcO/XDahHwmWBAJZjCTBeEJ0FHWVXd9RCDFVmbjiCmwRVHHTOKuEJ1CiOQuYelIUgGoJKUAZJKWAJwky2/MkI47bQE4SX5A9AC2c1v3v2km5AAAAABJRU5ErkJggg==";
  images.chest.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaklEQVQ4T2NkoBAwgvT/////PznmMIIAuZphFsINeP36NcPPnz8Z2NnZiaJlZGTAZsANePLkCdGaQZaIioqiGjDwLiAnFlDCAN0LoEBavXo12NzQ0FAGbPIEAxEW0tjCZxAG4jCIRnLTAQBlcv7ZBt0uqwAAAABJRU5ErkJgggAA";
  images.openedchest.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAaElEQVQ4T2NkoBAwgvT/////PzZzVq9eDRYODQ3Fag0jCMA0X7x4kSS36Ovrg9WPGsDAgDcWCIUqSiy8fv2a4efPnwzs7OxE0TIyMqix8OTJE6I1gywRFRVFNWDUBYQiDLc8PC+QawQAASvC3VYA6+MAAAAASUVORK5CYIIA";
  images.stairs.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAXklEQVQ4T2P8////fwYGBoa3b9+CKAYREREwTSxgRDfgwIEDYL0fP34E08nJyXjNImgAzGVfv34FG9TY2IhiIMkG3Lt3D2zAp0+fwPSoAaNhMDDpgOSkTHJmIjU7AwAt9TNSmLlXywAAAABJRU5ErkJgggAA";
  images.helix.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAc0lEQVQ4T6WTQQ7AIAgE2f8/mgaTNbSFuLRePDkMsMLd3cwMAOKeHhDwFbKq/rG4aQdo2sqr7ymkBEzm0RqoJq1Btc5qPsfd06QzkgC0CYMn6Ajg42yShywDcuCykQTIcWf1nV7181RxX22pgO7PjAAV5AKEW1gJ1muJJwAAAABJRU5ErkJgggAA";
  images.rapier.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAe0lEQVQ4T6XTOw7AIAgAUNi9Eqf3SLrTQGJjrfJpXVz0yU9kZgYAQESUPbtwAF8RffUPcoc9I5loHnkLUmsFIgrX5AWM1wWLFHZbebnce4dSihvJsXWtNW2vh5i9jyDu8HiIC0gaFhICLCQMnJAUsEPSwIzo0GW/73r+AvwBRekdnHv7AAAAAElFTkSuQmCC";
  images.bow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAi0lEQVQ4T52TQQ6AQAgD5dH6CPfRmCWpwQoL6smDnZaCsn14VFXn5yIikN0vFefYdz3HEIa0ABDDZEKQogSweELagEpsfWSzR2LvjhQhIHPmDRiEE1Sx4RwmyGJzcQ8IEqycfeuc2Eb4K7ZOMvrK1ad4naY/1Q7ERoCI18TlRTcT3gGvavWjpZfYhVxVJaAJb9rg3AAAAABJRU5ErkJgggAA";
  images.arrow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAcUlEQVQ4T2NkYGBg+P///39GRkZGEJtUwAjSDNJEtgEwG/fu3fvf2dmZZFegaCDHEAwbSTUEq5NJMQSnn0GGXL52k6EgNwtvuOCUnDB52n9dLXUGQobgNR1kyMd3rxnq6+txqiM52tAT2qgBDAwDHwYAoWItERq3KaAAAAAASUVORK5CYIIA";
  images.nightingale.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiElEQVQ4T52TQQ7AIAgE5QE+rSff6alP8wE2a7INUSrFHmlmFhElHX6ttQ5UDvkEQc5ZjgR3rf0qRSAJCwij87BAw2HBDIcEVjIEv4ZoJTPdFXzBvPrtED14OwMP5hKZHXiwbn+ZQQSm6N1E66qQMCfyEeHfOIIu6Idl1a3aENCmBUwnxMWZJQ/4wZKBy0iXowAAAABJRU5ErkJgggAA";
  images.katana.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAbElEQVQ4T93TQQ6AIAwEwO5b1VcJfnVNTWqIgm05yoVwmdItgCRFRABA9+yCAqUesq3LBeg5g91V91KpyDRg1a2F6C1efVsm0VyGwUUhN3lvSi7QZtPLJQR8IWFghKSAHpIGnq91Cmj/yw+AEwAtOxGQhca4AAAAAElFTkSuQmCC";
  images.spear.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhUlEQVQ4T53TzQ2AIAwF4Ndx9ICjMARzMQSjwEHHqakJiUZ+Wrhwod8rJRAzMwAQEcluXSTAVQo255aQJ7Ui+3GYu/gUnDmzFfklxhg5hKDupHnQgnSTtMiwVc1MpnedIVNAnnmEqABBejNRAz3EBLQQM/BG5AssAfX/pJSwBEiyFHvvcQPV3E8Y7XOFtAAAAABJRU5ErkJgggAA";
  images.dagger.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAVElEQVQ4T2P8////fwYGBgZGRkZGEE0qYMRmAEiMWAPhtsI0keoiFGeTYjPMq9RxAbKzYWxiAxZryJNiCM6oI9YQvHFPTIyQlXiQE9uoAQwMAx8GAHxZNBHHogV5AAAAAElFTkSuQmCC";
  images.staff.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAn0lEQVQ4T6WSzQqDQAyEk2eteiiIHn0Ej0pLBX+eNZKUSCrZmm29rCgz+80wSEQEAICIyGfug2zAYj2zDVjA4vE5QVvfxSiH6APbUkSJDgMVDI8XKUmkF7e46O0SNVWakuj/VDdfCbw4Z7rLCF4c+y0ZwSLbOCECrxcbx+4ka77LulFZ3ESj72EDRa+aTpY6j/17/tHt/21gsX+KkBrUDlfdkwn3sLWMAAAAAElFTkSuQmCC";
  images.ghostwalker.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAlklEQVQ4T52T3Q2AIBCDZQC2YQEmZygGwJSkpDn5O30xUdp+PSA8zqfW2iiJMYbg1I/lMPptQDHeboJSSss5d53bgP2B7jZgsuLD5KqCxQbB9RBVzC3QKlsCK1bhkWCWzMEdK5zEevg+FYimfTXRntwxTfxAckpprKEQH7j3SwObrH1396UT2AS9cXrzZkZjBla0QrYmL8aEj3ET89MrAAAAAElFTkSuQmCC";
  images.justifier.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAeklEQVQ4T6WTQQ6AMAgE2f8/GkMTEtxCC+rFeGC6TFeoqoqIAIC9pw8c8BWyTv2T4hXbQNNVtr2nkFQcQ04rluYdcvNzvLoIqdy0Evhw5qd04IWy4TjIkJbE2BUu3LW+mcwo9grgpm7Ayc+T9aOVwA/hTizgJAHLtO8HAgR4AWATn1kAAAAASUVORK5CYIIA";
  images.crossbow.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAj0lEQVQ4T61TWwrAIAyzJ9zQcyrbCTsiVIL43OaPiE3aJCru4xLgVVWxi0g+76xCAPAbotLRwNZ9dZr/CNiLnSmaprGcnhTU4K7r+ojkilHPELLpw9haJAY2ydPcmeROyaGzeTSdgAsBPrwvj23qAb9GjA0wp7NMUGtm4mEKKGQwy+F/M4yRY+7Fuh1j/VMfs8lyBdvBqQ8AAAAASUVORK5CYIIA";
  images.witheredblade.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAiklEQVQ4T6WTUQ6AMAhD4f6HxmwJS6kdTvVncYNnW6ZHRJiZubuPdTxjD99zX62exdyE4A44v8oQbmaFqKTILgdgqbO1AFmUkE8ZyJBICdesDNAnZtL5n2fKX4aYzY9T+AORFvBCYahKyW0KnD7aURMqgN2V7SBHAL4jqOQYsIV0f5o6YzuvFKjpXHIFiAWmzLRhAAAAAElFTkSuQmCC";
  images.talon.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAoElEQVQ4T52TURaAIAgEwW6s5/DISg8KU6Iy/TPZARZCWDxERMhnRZ9zphgjLAFYnFLCpQpUzFX/BnhiBk150Iv77FMAK/4FGMouhWRiIYj7Or3HFtzMDAlBtApxAZ643xedgOuBLRu3bUjCYqgV9PvweHP77FuDyfGhAZ7c1n41s9y7qgRgl6Q5jCgrK/daD/NMS1fAGWQDvn62qU18g+wTiYQRLb8quAAAAABJRU5ErkJgggAA";
  images.comet.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAdklEQVQ4T6WT2wrAMAhDlf7/J5cOB4HMdTNufRFachpvvuZcZmY+hkfsHg9AiBHbgBD8cXGx/cXFLe8uZFu4DuSx8irktXUKpOz9DsJ3JQBtzoMGiATYQdoAhvDgyQ4w4hBjf0oAFyyLzzdleVjImysD8icMPABqVl/5zdqYDAAAAABJRU5ErkJgggAA";
  images.tetsuyama.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAAc0lEQVQ4T93TQQpAIQgEUKX7Hzn6GBglpY3tfps28Zix4lZrIyLiUlj27GKBBJl3xRC8p7CpFEXSLXVeao5Eth5Sq8/YVtNU6AUsiXQmGex45Sjmvh0ECx/hjHlzC6Hd3HbgNRSBMHQEkW/gnU0nsuiPoQ8ZuFALqBpMXgAAAABJRU5ErkJgggAA";
  images.peacekeeper.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB5SURBVDhPxY9LDsAgCESp979z6zOSjMQPrvoWCsgMaK9gQsxXFI6n0rKKClMmNIHHsXZiOlk3OtEaESNSE7gxGtb3G4h3lN43NJL79PgWGb7QKpWZSN9TYAIxjmxdXcR0NdBtjmupUHGT1L92JikDWJr0O8XK5E/MPijTh7GQt3KBAAAAAElFTkSuQmCC";
  images.busterblade.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAAnElEQVRIS+2VSw6AMAhE5f6HxpBIg5XyX+qmpot5MIMIiIjX8wAA8PvUCQQgYT6nhFfRsgO6nO5iWaJZxXcd6MtzKTjVmRrqLt4Zgg/AsqqSkWrRXnHHLhNgjWw0eNMiCWDB7IcZDlkDRDI5robTJGm2WXaZu2cC4i63LsQFkCUdSAjQgYQBVUgKUIGkAWnI9B9s1yt1kCnqB7hu3V1vaBV2BW3gAAAAAElFTkSuQmCC";
  images.yang.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAB7SURBVDhPpZLbDoAgDEOH///PShdqyjIuynlAxmhXEstdsUaptO02F5YopKmaj+gSAJrxPJoPgYCw9saCNDrYngxUyD2+ijcT3im8hMlTQUjmhYq1nsG7nZsSTYmax94QiEAru9p/pK9wMkz2IiQwwREw+fUE5djgELMHIXxzzCfHzTYAAAAASUVORK5CYII=";
  images.yin.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACRSURBVDhPpZFBDoQgEARxnwXvh2+51IQ2SBh2kq2DCtpFZ7zuThpcnfEY5sNlDUo6yz1eDUAy7a9yFwJCa3vxg211iJ5sM1BQodZaqrWGGjxDRAKSQESybQA5Z7sjibZ5IADhBjuYgzBbZyxjzKeP/FbgNgBJmA3Y5sLxX0tQSnl9N7c7CsAb5Co9gsQT/UlKX+oYfZ6fve69AAAAAElFTkSuQmCC";
  images.orb.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAP0lEQVQ4T2NkgIL/////h7EZGRkZYWxCNFghsmZSDWHEppkUQwaBARSHAVVigVBU4ZMnOr5xGTJqAAPDMAgDAO+dHBH3XCxWAAAAAElFTkSuQmCC";
  images.potion.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAZklEQVQ4T+2S2w4AMQREzf9/tMammlnRW+zj9qUEJwaQ/lRV3bYfANif2U9SLPbkEwi42Arcd5shFovQFyCTkHXHkC2AodzdkHmjfwlg/byFkoQ4tHSI5TV+ckgnF7e8xB9QmYBIA5N0UBFoO12TAAAAAElFTkSuQmCC";
  images.butterfly.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAp0lEQVQ4T5VTQQ6AMAiT/22v3f6HQa3pChr1ogtraQuau/t2PWZm+P76tiAIIIj+kixAJgHxm5LjTlxgG3H+ouhuhg5PJJWlMYb33k/7KlFD1WwAhvKbQP1Xk0lglfdGwmDOrZy7jnbOuYVntptC1CLURefW2lHGdFArQ2QiTvs3gXpefPPmVpv2FJjeDSspxKpzFR4spWQ5IN2F6s9Ni8QgXW90ZUU767fG7TXkbvsAAAAASUVORK5CYIIA";
  images.viper.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAmElEQVQ4T5WTQRKFMAhD5ZbtCXtMHNR0UgYq/Ru/ixdIiKKqen0/ERH8rz7FBAyE0InIwzJYFeGhz8psw94rW4wxtLV2Tc8nIgb33l/7Pqy/UBc4WzUTAQzbxqdn8yIMc27bu//ZCTOoZLII7xrHgfm2zs5kApln9ARlCjPwMIZEXVmKZFeJYEzj84UbZJ79ZK779luo1PsGsuGv8S6wAhsAAAAASUVORK5CYIIA";
  images.leviathan.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA30lEQVQ4T42T0RHEIAhEtSItSSvTkrQib5bJOqtxzOUnkcADFvStteGeJ8bo+X17jzGG9958PQAhBPPvvbt/IEcAiPjxBYFPrdWllBxirAxWQQjesJ2qKaWMnLMlmwCFsPcThMH0McguFoy0aTt7MHxeAJatEFSyB6vfqwKOlZOBYOiZbUIXndx17sgMtW3eIjjOAB01YP+qtmqiwQY+bdxJbS4a/dHiMsY9894zztRF92VWwA2jYATqXSFAqzYhYFC1mV0vmY6O+7GISBDVnovy3JElq6z6dRP3IEJ1rD9pGO3xoZRg5AAAAABJRU5ErkJgggAA";
  images.sabertooth.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAsUlEQVRIS+2TQQ6AIAwE2+/A/58C36mpyZLaCEjxYqIXDMZpmS4sIkJExMys61sPK7jWSimlBte93UJnlx4O8E6BdvwePKrm4hVwhVk1EXhTgQGWUiTnzLrqnr6HwfgRCdFhAh7t/OIYSUC3UBKJY/eY6N5qWIng0J9VszrQ6WBsDP1FGg11CrYXaMX5IzDgdx32vD8G+0j6Ir7AMnhWAN/D4FEB7X4b3EvGD25mvqfiAFIpexP/fhexAAAAAElFTkSuQmCC";
  images.soulcatcher.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAwElEQVQ4T6VT2xGCMBBM+pESDPUolANaD7EE7OecvZnNXE5hCOYn+bh93C7E8McREYln8QrGOUPwmCa5dF24phSaCQC+j2PMyyLNBATTdVMGtJ36XtVxHyawyhX4SIgeDPtUx3s3RKrZplgf7l0CC4YLDKO6Sn1rBa9sq7MEr5y/VwD4va4BXRPIBuz+AIOsyuCX7dswBOuUGXC2EHgwHNgPhm+/tg6B9TnPOkMgU7YN+BltwddilUpVMZY8/M/3AdF6ujiqTJZMAAAAAElFTkSuQmCC";
  images.fang.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAY0lEQVQ4T+2SsRIAIAhC4f8/2s7BrixT91qcfCFAEREAIEmd3UcF6LLNNkAXvIqOqk32qqKq6Ljbfq/6MgHei+oZGyAy8JXQNbr1DINGkDD7KuRZHg+5qUjbl6WSArJmfgAwAKLBQBE8kwGiAAAAAElFTkSuQmCC";
  images.exporb.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAH0lEQVQYV2NkYGBg+P///38QzQgCIA6IhklgCqBrAQA/2xf9w9hMEQAAAABJRU5ErkJgggAA";
  images.magicchest.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAl0lEQVQ4T62TQQ4AEQxFWTmBnWs5pWvZOYFVJ19SoZhMamyGRP9/01/WXC6LeiIijY7F0hazYRfIORvnnKm1fvp675tGFyilfC6GSQhhFviVAHiSCI6jyUKgSaH1YIxxdAVFSqnpxhgnot5AGSMj8gVJxQaMP6Ug/w9nvsj71x6cYoTLbj6WOTjFCIHdcC0pXBOoY7x9TA+BW+nd9B7SZQAAAABJRU5ErkJgggAA";
  images.hpotionb.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAW0lEQVQ4T+2SwQoAIAhD3f9/tGEkiCkadaxLEe6x4UDrMDPLEwD0r3PPYRVbQRcEKxaRh1WgTeBdREAbtwRoRHXiHb8DZPmvInTWer/GJ0XqNC6bOaptBPkAogHzJVARhjezlAAAAABJRU5ErkJgggAA";
  images.hpotiong.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAWUlEQVQ4T+2SQQoAIAgE3f8/2jAQTNQCPdYpSUfXFmQOM7OGAGDfsvtOsoU+8QaC7xrFFeQAZN0r6BNAwV6qTDYHiGCqvSVBissltr9xxEgvjiud+AGdDRAt8wVQEf+acEgAAAAASUVORK5CYIIA";
  images.hpotiond.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAY0lEQVQ4T+1SQQoAIAhz/3+0ISSYlSu61iVJXdsU0o+qqsd+A0B+m2pWjTdAqACMgeUrJgOAN2QJ8ZNYYzFlwDw6BjCgLHdgsGLj2p8kXJm4m3k5BWYSXSRWwPJ0VT8Ac0CkAT5VUBEvJDXDAAAAAElFTkSuQmCC";
  images.hpotiono.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAc0lEQVQ4T61S0RIAIQRs//+j3WhGIyF19VSyay1o5hARcQgA7J/3npIYLEB9z4hcghMVi8wTcG9VyxOwxCo+vPPAM61iZFeQJe5IBkE6qmQnEBlXNXQisK6L/KyNtwpufBgKWL7tWxNGS/V/ClIlqr5b5w8CXWgR0JAUeAAAAABJRU5ErkJgggAA";
}


function loadBossMap() {
	var bmap = [[2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2],
 [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]];
 return bmap;
}
