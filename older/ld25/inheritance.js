function Graph() {
  this.vertexes = [];
  this.edges = [];
}
 
Graph.prototype = {
  addVertex: function(v){
    this.vertexes.push(v);
  }
};
 
var g = new Graph();

function A(a){
  this.varA = a;
}
A.prototype = {
  varA : null,
  doSomething : function(){
    // ...
  }
}
function B(a, b){
  A.call(this, a);
  this.varB = b;
}
B.prototype = Object.create(new A(), {
  varB : { value: null, enumerable: true, configurable: true, writable: true },
  doSomething : { value: function(){ // override
       A.prototype.doSomething.apply(this, arguments); // call super
       // ...
    }, enumerable: true, configurable: true, writable: true }
})
 
var b = new B();
b.doSomething();