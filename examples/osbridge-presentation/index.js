var Terraformer = require('terraformer'),
    GeoStore    = require('terraformer-geostore').GeoStore,
    Memory      = require('../../src/Store/Memory').Memory,
    arrayIndex  = require('./arrayIndex').arrayIndex,
    RTree       = require('terraformer-rtree').RTree,
    superArray  = require('./superArrayIndex').superArrayIndex;

var Benchmark = require('benchmark');

var counties = require('./counties_rough.json');

var arrayStoreTest = new GeoStore({
  store: new Memory(),
  index: new arrayIndex()
});

var a = new superArray();
var superStoreTest = new GeoStore({
  store: new Memory(),
  index: a //new superArray(20, -171.74517, 107)
});

var rTreeStoreTest = new GeoStore({
  store: new Memory(),
  index: new RTree()
});


for (var i = 0; i < counties.length; i++) {
  arrayStoreTest.add(counties[i]);
  rTreeStoreTest.add(counties[i]);
  superStoreTest.add(counties[i]);
}


var portland = { type: "Point", coordinates: [ -122.61923540493, 45.533841334631 ] };
var la       = { type: "Point", coordinates: [ -118.2428, 34.0522 ] };
var bismark  = { type: "Point", coordinates: [ -100.7833, 46.8083 ] };
var austin   = { type: "Point", coordinates: [ -97.7428, 30.2669 ] };
var boston   = { type: "Point", coordinates: [ -71.0603, 42.3583 ] };
var tampa    = { type: "Point", coordinates: [ -81.9604, 28.0908 ] };

/*
  superStoreTest.contains(portland).then(function (results){ console.dir(results); });
  superStoreTest.contains(la).then(function (results){ console.dir(results); });
  superStoreTest.contains(bismark).then(function (results){ console.dir(results); });
  superStoreTest.contains(austin).then(function (results){ console.dir(results); });
  superStoreTest.contains(boston).then(function (results){ console.dir(results); });
  superStoreTest.contains(tampa).then(function (results){ console.dir(results); });
*/

var suite = new Benchmark.Suite();

// add tests
suite.add('arrayIndex', function() {
  arrayStoreTest.contains(portland).then(function (results){ });
  arrayStoreTest.contains(la).then(function (results){ });
  arrayStoreTest.contains(bismark).then(function (results){ });
  arrayStoreTest.contains(austin).then(function (results){ });
  arrayStoreTest.contains(boston).then(function (results){ });
  arrayStoreTest.contains(tampa).then(function (results){ });
})
.add('superStoreIndex', function() {
  superStoreTest.contains(portland).then(function (results){ });
  superStoreTest.contains(la).then(function (results){ });
  superStoreTest.contains(bismark).then(function (results){ });
  superStoreTest.contains(austin).then(function (results){ });
  superStoreTest.contains(boston).then(function (results){ });
  superStoreTest.contains(tampa).then(function (results){ });
})
.add('rTreeIndex', function() {
  rTreeStoreTest.contains(portland).then(function (results){ });
  rTreeStoreTest.contains(la).then(function (results){ });
  rTreeStoreTest.contains(bismark).then(function (results){ });
  rTreeStoreTest.contains(austin).then(function (results){ });
  rTreeStoreTest.contains(boston).then(function (results){ });
  rTreeStoreTest.contains(tampa).then(function (results){ });
})
// add listeners
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': false });
