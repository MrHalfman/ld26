/*
 * Momentum JavaScript Library v1.8.1
 * http://momentumjs.org/
 *
 * Copyright (c) 2012 Samborski Charles
 * Released under the MIT license
 * http://opensource.org/licenses/mit-license.php
 *
 */


(function(window){
var 
	//References itself
	self = this,
	
	//window references
	document = window.document,
	location = window.location,
	navigator = window.navigator,
	

	M = function ( selector ){
		return new M.fn.init( selector );
	};
	
M.uid = 0 ;
M.guid = function(){return this.uid++;};
M.PI = Math.PI ;
M.is = function( a , b ){ 
	if(!a) return false ;
	if(a.constructor == b) return true
	var checked = [a];
	while(a=a.__proto__){
		if(-1 < $.inArray(a,checked)) break ;
		if(a.constructor == b) return true ;
		checked.push(a);
	}
	return false ;
}

M.TimeLine = (function(){

	function MAnimation( params ){
		var self = this ;
		this.length = params.length || 10000 ;
		this.maxDelta = 16 ;
		this.callback = params.callback;
		this.frame = this.run = 0 ;
		this.absFirst = this.absNow = this.absLast = M.now();
		this.paused = false ;
		this.fps = 1 ;
		this.speed = 1 ;
		
		this.getTimeObject=function(){

			var obj = {} ;
			obj.absFirst = this.absFirst ;
			obj.speed = this.speed ;
			obj.paused = this.paused ;
			this.absLast = obj.absLast = this.absNow ;
			this.absNow = obj.absNow = M.now();
			obj.fps = this.fps ;
			obj.frameDuration = 1000 / obj.fps ;
			
			obj.absDelta = obj.absNow - obj.absLast ;
			
			obj.delta = obj.paused ? 0 : Math.min(this.maxDelta, obj.absDelta * obj.speed) ;
			obj.run = this.run = (this.run + obj.delta) % this.length ;

			this.lastFrame = obj.lastFrame = this.frame ;
			
			obj.frame = this.frame = Math.floor( obj.run / obj.frameDuration ) ;

			obj.deltaFrame = obj.frame - obj.lastFrame ;

			return obj ;
		}

		
		this.pause = function(){
			this.paused = true ;}
		
		this.resume = function(){
			this.paused = false ;}
		
		this.onframe = function(){
			M.requestAnimationFrame.call(window,this.onframe.bind(this));
			
			var to = this.getTimeObject();
			if(to.frame - to.lastframe != 0){
				this.callback(to);
			}
			
		}
		
		this.play = function(){
			M.requestAnimationFrame.call(window,this.onframe.bind(this));
			this.callback(this.getTimeObject());
		}
	}

	return MAnimation ;

})();

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = 
          window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

M.requestAnimationFrame = 
	window.requestAnimationFrame       || 
	window.webkitRequestAnimationFrame || 
	window.mozRequestAnimationFrame    || 
	window.oRequestAnimationFrame      || 
	window.msRequestAnimationFrame     || 
	function(/* function */ callback, /* DOMElement */ element){
		window.setTimeout(callback, 1000 / 60);
	};

M.capitaliseFirstLetter = function ( string ){
	return string.charAt(0).toUpperCase() + string.slice(1);}

M.random = function(min, max){
  return Math.random() * (max - min) + min;}

M.randomInt = function(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;}


M.fn = M.prototype = {

	constructor: M,
	
	init: function( selector ){
	
		// Handle M(""), M(null), M(undefined), M(false)
		if( !selector ) return this ;
		
		
		
		// Handle $(MomentumElement)
		if ( selector instanceof HTMLCanvasElement ) {
			this.context = this[0] = new M.E.CanvasWrapper( selector );
			this.length = 1;
			return this;
		}
	
	},
	
	//The default selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},
	
	toArray: function() {
		return [].slice.call( this );
	},
	
	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this[ this.length + num ] : this[ num ] );
	},
	
	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		var a = this.get();
		for(var i = 0, c = a.length ; i < c ; i++){
		
			callback(a[i],i,args);
			
		}

	},
	
	eq: function( i ) {
		i = +i;
		return i === -1 ?
			this[i] :
			this[this.length -1];
			//this.slice( i ) :
			//this.slice( i, i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},
	
	append: function() {
	
		for(var i = 0, c = arguments.length ; i < c ; i++){
		
			this.each(
			
				function ( el , i , node ){
			
					if(M.is(el,'Node')){
					
						el.append(node);
					
					}
			
				}
				,arguments[i]
			)
			
		}
		
		return this;
	
	}

};

// Give the init function the Momentum prototype for later instantiation
M.fn.init.prototype = M.fn;





M.extend = M.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend Momentum itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( M.isPlainObject(copy) || (copyIsArray = M.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && M.isArray(src) ? src : [];

					} else {
						clone = src && M.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = M.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

M.create = function ( super1 , constructor , proto ){
		if(super1 == null){
			constructor.prototype={};
		}else{
			constructor.prototype = Object.create( super1.prototype ) ;
		}
		constructor.prototype.constructor = constructor ;
		if(super1 != null){
			constructor.prototype.proto = super1.prototype ;
			constructor.proto = super1.prototype ;
		}else{
			constructor.prototype.proto = null ;
		}
		
		for(var key in proto){
			constructor.prototype[key] = proto[key] ; }
		
		return constructor ;
	}

M.extend({

	toString : function( obj ){
		return Object.prototype.toString.call(obj) ;
	},

	type : (function(){
		var class2type = {},
			classes = (("Boolean Number String Function Array Date RegExp Object").split(" "));
		for(var i=0,c=classes.length;i<c;i++){
			var name = classes[i];
			class2type[ "[object " + name + "]" ] = name.toLowerCase();
		}
		return function( obj ) {
			return obj == null ?
				String( obj ) :
				class2type[ M.toString( obj ) ] || "object";
		}
	})(),
	

	isFunction : function( obj ) {
		return M.type(obj) === "function";
	},
	
	isArray : Array.isArray || function( obj ) {
		return M.type(obj) === "array";
	},
	
	isString : function( obj ) {
		return M.type(obj) === "string";
	},
	
	isWindow : function( obj ) {
		return obj != null && obj == obj.window;
	},
	
	isNumeric : function( obj ) {
		return !isNaN( parseFloat(obj) ) && isFinite( obj );
	},
	
	slice: function( a ){
		return [].slice.call( a ) ;
	},
	
	each : function ( obj , callback , args ){
		var name,
			i = 0,
			length = obj.length,
			isObj = length === undefined || M.isFunction( obj );

		if ( args ) {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.apply( obj[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( obj[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in obj ) {
					if ( callback.call( obj[ name ], name, obj[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.call( obj[ i ], i, obj[ i++ ] ) === false ) {
						break;
					}
				}
			}
		}

		return obj;
	}
	
});

M.extend({
	'now' : function() {return ( new Date() ).getTime();}
});





M.Color = function Color (r,g,b,a){
	this.r=r;
	var a = ((a===undefined) ? 1 : Math.max(0,Math.min(1,a)));
	var rgb={"r":Math.max(0,Math.min(255,r)),"g":Math.max(0,Math.min(255,g)),"b":Math.max(0,Math.min(255,b))},
		hsl = false,
		hsv = false;

	this.getRGBAString = function(){
		return "rgba("+rgb.r+","+rgb.g+","+rgb.b+","+a+")";
	};
	
}

M.Color.random=function(){this.__proto__=new M.Color(M.randomInt(0,255),M.randomInt(0,255),M.randomInt(0,255),0.5);}


M.Event = function MEvent ( src , props ){

	if ( !(this instanceof M.Event) ) {
		return new M.Event( src, props );}

	this.clientX = true ;
	
	if ( props ) {
		M.extend( this, props );}

}

M.event = new function(){

	this.events= {};
	
	this.nativeEvents =   ['click','mousemove'];

	this.add =   function( elem, types, handler, data/*, selector */){
		//Momentum support multiple events : M(...).on('click blur etc',fn);
		types = types.split( " " );
		for (var t = 0; t < types.length; t++ ) {
			//No namespace support actually
			var type = types[ t ];
			
			//Bind the Event to the Element :
			var elemEvents = elem.event(type) ;
			//The eventType do not already exists
			if( !elemEvents ){
				elemEvents = [];
			}
			elemEvents.push( handler ) ;
			elem.event( type , elemEvents ) ;
			
			//var index =  ;
			
			//If this is a native event (ie. click) we had to bind a "watcher" on the viewport :
			if( -1 < $.inArray(type,this.nativeEvents) ){
				//This is a native event so we track it from the root <canvas>
				var root = elem.root ;
				if( !root ){
					console.log('Can\'t bin event');
				}else{
					var nEvHdlr = this.nativeEventHandler[type] ;
					if(nEvHdlr){
						$(root.canvas).on(type,function(ev){
							nEvHdlr(ev,elem);
							//elem.trigger(type);
						});
					}else{
						$(root.canvas).on(type,function(e){
							elem.trigger(type);
						});
					}
					//elemEvents = [];
				}
			}
		}
	};
	
	this.trigger =   function( elem, types ){
	
		types = types.split( " " );
		for (var t = 0; t < types.length; t++ ) {
		
			var type = types[ t ];
			
			var elemEvents = elem.event(type) ;
			
			//The eventType do not already exists
			if( !elemEvents ){ continue ;}
			
			for ( var i = 0 ; i<elemEvents.length; i++ ){
			
				elemEvents[i].call(elem);
			
			}
		
		}
	
	};
	
	this.fns = {
		pointIn: function(ev,elem){
			
			var pos = $(elem.root.canvas).offset();

			if( elem.isPointIn && elem.isPointIn(ev.clientX - pos.left, ev.clientY - pos.top) ) { 	
				elem.trigger(ev.type);

			}
			
		}
	}
	
	this.nativeEventHandler =  {
		click: this.fns.pointIn,
		mousemove : this.fns.pointIn
	}


}


M.DOM = new function MDOMManager(){
	this.propagate = function ( o , self ){
		//From : from the node X
		//Capture : triggered during capture
		//Bubbling : triggered during bubbling
		//args : arguments passed to the function
		// self : with from ?
		
		if( !o ) o = {} ;
		if( !o.from ){
			alert('Erreur during propagation'); return false ;}
		
		if( o.capture ){
			o.capture.apply ( o.from , o.args ) ;}

		for(var i = 0, c = o.from.childrenList.length ; i<o.from.childrenList.length ; i ++){
			
			if(o.from.childrenList[i]){
		
				var child = o.from.childrenList[i] ;
			
				if(o.capture && child.childrenList.length < 1){
					o.capture.apply ( child , o.args ) ;	}
					
				if(o.bubbling && child.childrenList.length < 1){
					o.bubbling.apply ( child , o.args ) ;	}
					
				if(child.childrenList.length > 0){
					M.DOM.propagate( {from : child , capture : o.capture, bubbling : o.bubbling, args : o.args} );}
				
			}else{
				alert(i+'\n'+c);
				var a = 1+1 ;
			}
		}
		
		if(o.bubbling){
			o.bubbling.apply ( o.from , o.args ) ;}
	
	}

}

M.TransformMatrix = function TransformMatrix( mat ){
	var self = this ;
	this.node = false ;
	
	
	this.bindNode = function( node ){
		this.node = node ;
		this.updateAMatrix() ;
		return this;}
	
	this.set = function ( mat ){
		var src ;
		if(mat){
			if(arguments.length < 6){
				src = mat ;
			}else{
				src = arguments ;
			}
		}else{
			src = [1,0,0,1,0,0] ;
		}
		for(var i =0 ; i<6 ; i++){
				this[i]=src[i]}
		this.updateAMatrix() ;
		return this ;
	}

	
	this.clone = function (){
		return new M.TransformMatrix( this ) ;	}
	
	this.det = function(){
		return this[0]*this[3] - this[1]*this[2] ; }

	this.multiply = function ( x ){
		if(M.isNumeric (x)){
			var rep = this.clone();
			for(var i = 0 ; i<6 ; i++){
				rep[i] *= x;}
			return rep ;
		}else{	//Multipling 2 matrix
			var m1 = this, m2 = x ; //Needs a better implementation ?
			return new M.TransformMatrix([
				m1[0]*m2[0]+m1[2]*m2[1], 
				m1[1]*m2[0]+m1[3]*m2[1],
				m1[0]*m2[2]+m1[2]*m2[3],
				m1[1]*m2[2]+m1[3]*m2[3],
				m1[0]*m2[4]+m1[2]*m2[5]+m1[4],
				m1[1]*m2[4]+m1[3]*m2[5]+m1[5]
			]);
		}
		return this ;
	}
	
	this.setMultiply = function( x ){
		this.set( this.multiply( x ) ) ;
		this.updateAMatrix() ;
		return this ;}
	
	this.updateAMatrix = function ( ){
		if(!this.node) return false ;
		var parent = this.node.parent();
		if(!parent){
			this.node.attr('aMatrix',this.clone());
		}else{
			this.node.attr('aMatrix',parent.attr('aMatrix').multiply(this));
		}
		
		return this ;
		
	}
	
	this.scale = function ( x , y ){
		this.setMultiply([x,0,0,y,0,0]);
		return this ;}
	
	this.rotate = function ( a ){
		this.setMultiply([Math.cos(a),-Math.sin(a),Math.sin(a),Math.cos(a),0,0]);
		return this ;}
	
	this.translate = function( x , y ){
		this.setMultiply([1,0,0,1,x,y]);
		return this ;}
	
	this.shear = function( x , y ){
		this.setMultiply([1,y,x,1,0,0]);
		return this ;}
	
	this.reversed = function(){
		var m = this ;
		return (new M.TransformMatrix([
			m[3] ,
			-m[1],
			-m[2],
			m[0] ,
			m[2]*m[5]-m[4]*m[3],
			m[4]*m[1]-m[0]*m[5]
		])).multiply(1/this.det());
	}

	this.setTo = function ( ctx ){
		ctx.setTransform.call( ctx , this[0] , this[1] , this[2] , this[3] , this[4] , this[5] );}
		
	this.addTo = function ( ctx ){
		ctx.transform.call( ctx , this[0] , this[1] , this[2] , this[3] , this[4] , this[5] );}
		
	this.getVector = function ( x , y ){
	
		return {
			x : x*this[0]+y*this[2]+this[4],
			y : x*this[1]+y*this[3]+this[5]
		};
	
	}
	
	this.set( mat );
	

}


M.E = {};

(function(E){
	
	M.E.Node = M.create(
		null,
		function Node(){
			var self = this;
			this.attrs = {} ;
			this.datas = {} ;
			this.events = {} ;
			this.childNodes = [] ;
			this.childrenList = [] ;
			this.parentNode = false ;
			this.root = false ;
		},
		{
			attr : function (){
				var args = M.slice(arguments);
				args.splice(0,0,this.attrs);
				return this.sget.apply(this,args);
			},
			event : function (){
				var args = M.slice(arguments);
				args.splice(0,0,this.events);
				return this.sget.apply(this,args);
			},
			data : function (){
				var args = M.slice(arguments);
				args.splice(0,0,this.datas);
				return this.sget.apply(this,args);
			},
			sget : function( list , name , val ){
				var ans;
				if(M.isString(list)){
					if(this[list]){
						list = this[list];
					}else{
						list = this[list] = {};
					}
				}
				switch (arguments.length){
					case 3 :
						list[name] = val ;
						ans= this ;
					break;
					case 2 :
						if(M.isString(name)){
							ans = list[name] ;
						}else{
							for(var i in name){
								list[i] = name[i] ;
							}
							ans = this ;
						}
					break;
					default :
						ans = list ;
				}
				return ans ;
			},
			children : function ( selector ){
			
				return this.childrenList ;
			
			},
			detach : function (){
				var parent;
				if(parent = this.parent()){
					parent.detachChild( this );
				}
			},
			detachChild : function ( child ){
				for(var i = 0, c=this.childrenList.length;i<c;i++){
					if(child === this.childrenList[i]){
						this.childrenList[i].parentNode = false;
						this.childrenList.splice(i,1);
					}
				}
			},
			prepareAppend : function ( node ){
				if(node.isParentOf(this,false))$.error( 'MMT : Inserting parent-Node in child-Node.' );
				if(this == node)$.error( 'MMT : Inserting Node in itself.' );
				node.detach();
				node.parentNode = this ;
			},
			append : function ( node ){
				this.prepareAppend( node );
				this.childrenList.push ( node ) ;
				return this ;
			},
			prepend : function ( node ){
				this.prepareAppend( node );
				this.childrenList.splice( 0 , 0 , node ) ;
				return this ;
			},
			appendTo : function ( node ){
				node.append( this );
				if(node.constructor == M.E.CanvasWrapper){
					this.root=node;}
				return this ;
			},
			prependTo : function ( node ){
				node.append( this );
				return this ;
			},
			isParentOf : function( node , self ){
				if(!(node && node instanceof Node)){
					return false ;
				}
				if(self && this == node){return true}
				while( node ){
					if( node.parent() == this ){
						return true;
					}else{
						node=node.parent();
					}
				}
				return false;
			},
			parent : function () {
				return this.parentNode;
			},
			ancestors : function ( reversed ){
				var ancestors = [], node = this.parent() ;
				do{
					ancestors.push(node)
				}while(node = node.parent()) ;
				return reversed ? ancestors : ancestors.reverse() ;
			},
			commonParent : function ( node ){
				var own = this.ancestors() ,
					other = node.ancestors() ;
					
				var rep = false ;
				for(var i = 0, c = Math.min(own.length,other.length) ; i<c ;i++){
					if(own[i]==other[i]){
						rep = own[i]
					}else{
						break ;
					}
				}
				return rep ;
			},
			propagate : function( o ){
				//Capture : triggered during capture
				//args : arguments passed to the function
				if(!o){o={};}
				if(!o.from){o.from=this};
				M.DOM.propagate(o);
			},
			on : function ( events , handler , data , selector ){
				M.event.add( this , events , handler , data , selector );
			},
			one : function ( events , handler , data , selector ){
				M.event.add( this , events , handler , data , selector );
			},
			trigger : function ( events ){
				M.event.trigger( this , events );
			}
		}

	)

	M.E.Element = M.create(
		M.E.Node,
		function Element(params){
			M.E.Node.call(this,params);
			var self = this;
			this.attr({
				'zoom':1,
				'scaleX':1,
				'scaleY':1,
				'translateX':new Object(0),
				'translateY':new Object(0),
				'rotation':0,
				'aMatrix':(new M.TransformMatrix()).bindNode(this),
				'rMatrix':(new M.TransformMatrix()).bindNode(this),
				'alpha':1
			});
	
			for(var key in params){this[key] = params[key];}
		},
		{
			zoom:function(x,y){
				switch (arguments.length){
					case 1 :
						y=x;
					case 2 :
						this.attr({'scaleX':x,'scaleY':y}) ;
					break;
					default :
						return this.attr('scaleX');
					break;
				}
				return this ;
			},
			draw : function(c,i){
				if(M.isFunction(c)){
					this.draw = c ;
				}/*else{
					c.fillStyle = (new M.Color.random()).getRGBAString();
					var a = M.random(1,50);
					c.fillRect(10,10,a,51-a);
				}*/
			},
			update : function( dt ){
				//Recalculate pos
			}
		}		
	)
	
	M.E.Point = M.create(
		M.E.Element,
		function Point(params){
			M.E.Element.call(this,params);
			var self = this;
			this.posX=params.x || 0 ;
			this.posY=params.y || 0 ;
			this.color = params.color || (new M.Color.random()).getRGBAString();
		},
		{
			draw : function(c,i){
				c.beginPath();
				c.arc(this.posX,this.posY,0.1,0,2*M.PI);
				c.setFillStyle( this.color );
				c.fill();
			}
		}		
	)
	
	M.E.Rectangle = M.create(
		M.E.Element,
		function Rectangle(params){
			M.E.Element.call(this,params);
			if( !params ){
				this.color = (new M.Color.random()).getRGBAString() ;
			}else{
				this.color = params.color || (new M.Color.random()).getRGBAString(); //Color.rand( true (alpha) )
				this.posX=params.x;
				this.posY=params.y;
				this.width=params.w;
				this.height=params.h;
			}
			this.eventChecker= {};
		},
		{
			isPointIn:function(x,y){
				if( this.posX <= x && x < this.posX + this.width //Check if the mouse fits in X
					&&  this.posY <= y && y < this.posY + this.height ){ //Check if the mouse fits in Y
					return true ;
				}else{
					return false ;
				}
			},
			isRectCollision : function ( rect , b ){
				var coords = [rect.posX,rect.posY,rect.posX+rect.width,rect.posY+rect.height];
				var collision = this.isPointIn(coords[0],coords[1]) || this.isPointIn(coords[0],coords[3]) || this.isPointIn(coords[2],coords[1]) || this.isPointIn(coords[2],coords[3]) ;
				if(!b){collision = collision || rect.isRectCollision(this,true);}
				return collision ;
			},
			checkEventclick : function(o){
				return this.isPointIn(o.mouseX,o.mouseY);
			},
			draw : function(c){
				/*c.setFillStyle( this.color );
				var a = M.random(1,50);
				c.fillRect(this.posX,this.posY,this.width,this.height);*/
			}
			
		}		
	)
	
	M.E.Image = M.create(
		M.E.Rectangle,
		function Image(params){
			M.E.Rectangle.call(this,params);
			this.img = params.url ? new window.Image() : false ;
			this.img.onload = function(){};
			this.img.src = params.url ;
			
			var sp = ["sx","sy","sw","sh"] ;
			for(var i=0 ; i<4 ; i++){this[sp[i]] = params[sp[i]]}
		},
		{
			draw : function(c){
				if( this.img && this.img.complete){
					//http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#drawing-images
					if(!this.sx){
						c.drawImage(this.img,this.posX,this.posY,this.width,this.height);
					}else{
						c.drawImage(this.img,this.sx,this.sy,this.sw,this.sh,this.posX,this.posY,this.width,this.height);
					}
				}
			}
		}
	)
	
	M.E.Square = M.create(
		M.E.Rectangle,
		function Square(params){
			this.proto.constructor.call(this,params);
		},
		{
		}
	)
	
	M.E.CanvasWrapper = M.create(
		M.E.Rectangle,
		function CanvasWrapper(cvs){
			this.proto.constructor.call(this,{x:0,y:0,w:cvs.width,h:cvs.height});
			var self = this ;
			cvs.MMT={'ref':this};
			this.cvs = this.canvas = cvs ;
			this.ctx = this.context = new M.MMTContext( cvs.getContext('2d') , this );
			this.root = this ;
			
			this.animation = new M.TimeLine({callback:function(to){
				self.propagateUpdate(to);
				self.render(to);}
				,length:30000});
			this.animation.pause();
			
		},
		{
			clear : function(){
				if(!arguments.length){
					this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
				}	
			},
			doDraw:function(node,fn){
				var ctx = this.ctx;
				ctx.save();
				node.draw(this.ctx);
				ctx.restore();
			},
			doUpdate:function(node,to){
				node.update(to);
			},
			propagateUpdate : function ( to , from ){
				this.propagate({capture:function( master , to ){
					if(this.update) master.doUpdate( this , to);
				},args:[this,to]});
			},
			render : function ( to ){
				this.ctx.clearRect(0,0,500,500);
				this.propagate({
					capture:function( master , to ){
						if(this.draw){ master.doDraw( this, this.draw , to);}
						if(this.transform){master.ctx.save();this.transform(master.ctx,to);}
					},
					bubbling:function( master , to ){
						if(this.transform){master.ctx.restore();}
					},args:[this,to]
				});
			},
			append : function( node ){
				this.proto.append.call( this, node );
				this.render();
				return this ;
			},
			play : function(){
				this.animation.resume();
				this.animation.play();
			}
			
		}
	)

	function MMTContext ( ctx , node ){
		this.ctx = ctx ;
		this.node = node ;
		this.setNode = function(node){this.node = node;}

		var properties = ['save','restore','createLinearGradient','createRadialGradient','createPattern',
			'clearRect','fillRect','strokeRect','beginPath','fill','stroke',
			'drawSystemFocusRing','drawCustomFocusRing','scrollPathIntoView','clip','isPointInPath',
			'fillText','strokeText','TextMetrics','drawImage','createImageData','getImageData',
			'putImageData','scale','rotate','translate','transform','setTransform','closePath',
			'moveTo','lineTo','quadraticCurveTo','bezierCurveTo','arcTo','rect','arc','ellipse']
			
		for(var i = 0, c = properties.length ; i<c ; i++){
			var property = properties[i];
			
			this[property] = (function(ctx,property){
				return function(){
					ctx[property].apply(ctx,[].slice.call( arguments ));
				}
			})(ctx,property) ;
		}

		var setters = ['fillStyle','strokeStyle','globalAlpha','lineWidth','setLineCap',
			'setLineJoin','setMiterLimit','globalCompositeOperation','shadowColor','shadowBlur',
			'shadowOffsetX','shadowOffsetY','mozTextStyle','font','textAlign','textBaseline'];
			
		for(var i = 0, c = setters.length ; i<c ; i++){
			var setter = setters[i];
			this['set' + M.capitaliseFirstLetter( setter )] = (function(ctx,setter){
				return function(a){ctx[setter]=a;}
			})(ctx,setter);
		}

		
		/*this.scale = function(x, y) {



			this.ctx.scale( x , y );
		};*/

		
		return this ;
	}
	
	M.MMTContext = MMTContext ;


	
})(M.E);

M.IO = new function(){
	this.key={"left":false,"right":false,"top":false,"bottom":false};
}



window.M = M ;

})(window)

$(window)
.keydown(function(e){
	switch(e.which){
		case 37 : M.IO.key.left = true ; break ;
		case 38 : M.IO.key.up = true ; break ;
		case 39 : M.IO.key.right = true ; break ;
	}
	e.preventDefault();
})
.keyup(function(e){
	switch(e.which){
		case 37 : M.IO.key.left = false ; break ;
		case 38 : M.IO.key.up = false ; break ;
		case 39 : M.IO.key.right = false ; break ;
	}
	e.preventDefault();
}) 

