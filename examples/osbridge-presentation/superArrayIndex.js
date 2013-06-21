var Terraformer = require('terraformer');

function superArrayIndex (buckets, x, width) {
  this._index  = [ ];
  this.buckets = buckets;
  this.x       = x;
  this.width   = width;

  for (var i = 0; i < this.buckets; i++) {
    this._index[i] = [ ];
  }
}

function rectFromShape (shape) {
  var rect;
  if(shape.type){
    var b = Terraformer.Tools.calculateBounds(shape);
    rect = {
      x: b[0],
      y: b[1],
      w: Math.abs(b[0] - b[2]),
      h: Math.abs(b[1] - b[3])
    };
  } else {
    rect = shape;
  }

  return rect;
}

superArrayIndex.prototype.serialize = function (callback) {
  var dfd = new Terraformer.Deferred();
  if(callback){
    dfd.then(function(result){
      callback(null, result);
    }, function(error){
      callback(error, null);
    });
  }

  dfd.resolve(this._index);
  return dfd;
};

superArrayIndex.prototype.deserialize = function (data, callback) {
  this._index = data;


  var dfd = new Terraformer.Deferred();
  if(callback){
    dfd.then(function(result){
      callback(null, result);
    }, function(error){
      callback(error, null);
    });
  }

  dfd.resolve();
  return dfd;
};

superArrayIndex.prototype.bucketsFromRect = function (rect) {
  var x = (this.x - rect.x);

  var startBucket = Math.abs(Math.floor((x / this.width) * this.buckets)) - 1;
  var endBucket = Math.abs(Math.floor(((x - rect.w) / this.width) * this.buckets)) - 1;

  var buckets = [ ];

  for (var i = startBucket; i <= endBucket; i++) {
    buckets.push(i);
  }

  return buckets;
};

superArrayIndex.prototype.search = function (shape, callback) {
  var rect = rectFromShape(shape);
  var results = [ ];

  var buckets = this.bucketsFromRect(rect);

  for (var b = 0; b < buckets.length; b++) {
    var bucket = buckets[b];

    for (var i = this._index[bucket].length - 1; i >= 0; i--) {
      if (rect.x >= this._index[bucket][i].x && rect.x <= (this._index[bucket][i].x + this._index[bucket][i].w) &&
          rect.y >= this._index[bucket][i].y && rect.y <= (this._index[bucket][i].y + this._index[bucket][i].h)) {
        results.push(this._index[bucket][i].object);
      }
    }
  }

  var dfd = new Terraformer.Deferred();
  if(callback){
    dfd.then(function(result){
      callback(null, result);
    }, function(error){
      callback(error, null);
    });
  }

  dfd.resolve(results);

  return dfd;
};

superArrayIndex.prototype.insert = function (shape, object, callback) {
  var rect = rectFromShape(shape);

  rect.object = object;

  var buckets = this.bucketsFromRect(rect);

  for (var b = 0; b < buckets.length; b++) {
    this._index[buckets[b]].push(rect);
  }

  var dfd = new Terraformer.Deferred();
  if(callback){
    dfd.then(function(result){
      callback(null, result);
    }, function(error){
      callback(error, null);
    });
  }

  dfd.resolve();
  return dfd;
};

exports.superArrayIndex = superArrayIndex;
