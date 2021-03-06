/**
 * Monster object
 *
 */
(function(window){

	var jQuery = window.jQuery ,

		Gauntlet = window.Gauntlet || {} ,

		Monster = (function(){
			var module = Gauntlet.MoveableAgent.instance();
			module.speed = 3;

			module.weaponSpeed = 5;
			module.currentSwing = 0;
			module.pointsWorth = 5;
			module.type = 1;
			module.damage = 3;
			module.health = 1;
			module.astarinterval = 0;
			module.astarinterval_max = 8;
			module.astarmovement = [];
			module.flying = false;

			module.pathfinder = false;

			module.getPointValue = function(){
			  return this.pointsWorth;
			};

			// caches movement and only interrogates AStar once every astarinterval_max calls
			module.getAStarMovement = function(from,to){
				this.astarinterval--;
				if( this.astarinterval < 0 ){
					this.astarinterval = this.astarinterval_max;
					this.astarmovement = Gauntlet.AStar.getMovementFromTo(from,to);
				}
				return this.astarmovement;
			};

			/**
			 * checkMovement
			 * sets the movement for the monster depending on the player location and the closest floor tile in that direction
			 */
			module.checkMovement = function(){
			  var playerPos = Gauntlet.Player.getPosition() ,
				  xdiff = this.coords.x - playerPos.x ,
				  ydiff = this.coords.y - playerPos.y ,
				  vectorToPlayer = this.pathfinder ? this.getAStarMovement({x:this.coords.x,y:this.coords.y} , {x:playerPos.x,y:playerPos.y}) : ( [ xdiff > 0 ? -1 : ( xdiff < 0 ? 1 : 0 ) , ydiff > 0 ? -1 : ( ydiff < 0 ? 1 : 0 ) ] ) ,
				  vectX = [ vectorToPlayer[ 0 ] , 0 ], vectY = [ 0 , vectorToPlayer[ 1 ] ],
				  newOffset = this.getNewOffset( vectorToPlayer ) ,
				  newTilePos = { x: this.coords.x + newOffset.tileX , y: this.coords.y + newOffset.tileY },
				  tile = Gauntlet.Stage.getTileAt( newTilePos );
			  // if tile in vectorToPlayer direction is a floor tile, set it and return
			  if( this.flying || (tile.substr(0,1) === 'f' || tile.substr(0,1) === 's')){
				this.moving = vectorToPlayer;
			  }else{
				// else if tile in x is ok
				newTilePos = { x: this.coords.x + newOffset.tileX , y: this.coords.y };
				tile = Gauntlet.Stage.getTileAt( newTilePos );
				if( (tile.substr(0,1) === 'f' || tile.substr(0,1) === 's' ) ){
				  this.moving = vectX;
				}else{
				  // else if tile in y is ok
				  newTilePos = { x: this.coords.x , y: this.coords.y + newOffset.tileY };
				  tile = Gauntlet.Stage.getTileAt( newTilePos );
				  if( (tile.substr(0,1) === 'f' || tile.substr(0,1) === 's') ){
					this.moving = vectY;
				  }else{
					this.moving = [ 0 , 0 ];
				  }
				}
			  }
			  return this.moving;
			};

			module.canMoveIntoTile = function( t , newCoords ){
				return (this.flying || ( t.substr(0,1) === "f" || t.substr(0,1) === 's' )) && Gauntlet.MonsterSpawnerCollection.isTileFree( newCoords , this );
			};

			module.afterMoving = function(){
			  var playerPos = Gauntlet.Player.getPosition()
			  if( playerPos.x === this.coords.x && playerPos.y === this.coords.y ){
				this.currentSwing++;
				if( this.currentSwing === 1 ){
				  Gauntlet.Player.hurt( this.damage );
				}else if( this.currentSwing > this.weaponSpeed ){
				  this.currentSwing = 0;
				}
			  }
			};

			module.setType = function( mT ){
			  this.type = mT;
			  switch( this.type ){
				case '0':
				  this.speed = 2;
				  this.damage = 3;
				  this.pointsWorth = 5;
				  this.weaponSpeed = 5;
				  this.health = 1;
				  break;
				case '1':
				  this.speed = 4;
				  this.damage = 6;
				  this.pointsWorth = 10;
				  this.weaponSpeed = 6;
				  this.health = 1;
				  break;
				case '2':
				  this.speed = 2;
				  this.damage = 10;
				  this.pointsWorth = 20;
				  this.weaponSpeed = 7;
				  this.health = 4;
				  break;
				case '3':
				  this.speed = 2;
				  this.damage = 4;
				  this.pointsWorth = 7;
				  this.weaponSpeed = 4;
				  this.health = 1;
				  this.flying = true;
				  break;
				case '4':
				  this.speed = 3;
				  this.damage = 6;
				  this.pointsWorth = 50;
				  this.weaponSpeed = 4;
				  this.health = 4;
				  this.pathfinder = true;
				  break;
				case '5':
				  this.speed = 2;
				  this.damage = 1;
				  this.pointsWorth = 5;
				  this.weaponSpeed = 5;
				  this.health = 4;
				  break;
				case '6':
				  this.speed = 3;
				  this.damage = 4;
				  this.pointsWorth = 75;
				  this.weaponSpeed = 4;
				  this.health = 4;
				  this.pathfinder = true;
				  break;
				case '7':
				  this.speed = 4;
				  this.damage = 5;
				  this.pointsWorth = 100;
				  this.weaponSpeed = 4;
				  this.health = 4;
				  this.pathfinder = true;
				  break;
				default:
				  this.speed = 2;
				  this.damage = 3;
				  this.pointsWorth = 5;
				  this.weaponSpeed = 5;
				  break;
			  }
			};

			return module;

		})();

	Gauntlet.Monster = Monster;
	window.Gauntlet = Gauntlet;

})(this);