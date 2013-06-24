var Terraformer = require('terraformer');

function rectFromShape (shape) {
  var rect;
  if(shape.type) {
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


function buildBucketMaths (buckets, xOffset, width) {
  return function (rect) {
    var x = rect.x < 0 ? -rect.x : rect.x;
    var w = x - (rect.w < 0 ? -rect.w : rect.w);

    var endBucket = (~~x) - 1;
    var startBucket = (~~w) - 1;

    var buckets = [ ];

    for (var i = startBucket; i <= endBucket; i++) {
      buckets.push(i);
    }

    return buckets;
  };
}


function superArrayIndex (options) {
  this._index  = [ ];
  options = options || { };

  this.options = options;
  this.buckets = options.buckets || 180;
  this.xOffset = options.xOffset || 0;
  this.width   = options.width   || 180;

  for (var i = 0; i < this.buckets; i++) {
    this._index[i] = [ ];
  }

  this.bucketsFromRect = buildBucketMaths(this.buckets, this.xOffset, this.width);
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
        if (rect.y + rect.w < this._index[bucket][i].y) {
          break;
        }
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
    this._index[buckets[b]] = this._index[buckets[b]].sort(function (a, b) {
      return (a.y > b.y) ? -1 : 1;
    });
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
