var Terraformer = require('terraformer');

function arrayIndex () {
  this._index = [ ];
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

arrayIndex.prototype.serialize = function (callback) {
  callback(null, this._index);
};

arrayIndex.prototype.deserialize = function (data, callback) {
  this._index = data;
  callback(null);
};

arrayIndex.prototype.search = function (shape, callback) {
  var rect = rectFromShape(shape);
  var results = [ ];

  for (var i = 0; i < this._index.length; i++) {
    if (rect.x >= this._index[i].x && rect.x <= (this._index[i].x + this._index[i].w) &&
        rect.y >= this._index[i].y && rect.y <= (this._index[i].y + this._index[i].h)) {
      results.push(this._index[i].object);
    }
  }

  return results;
};

arrayIndex.prototype.insert = function (shape, object, callback) {
  var rect = rectFromShape(shape);

  rect.object = object;

  this._index.push(shape);

  callback(null);
};

exports.arrayIndex = arrayIndex;
