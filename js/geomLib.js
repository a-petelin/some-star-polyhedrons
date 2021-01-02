var Vect = function(x,y,z) {
    this._c = [x,y,z];
    this.norm = function() {
        let len = Math.sqrt(this._c.map(x => x * x).reduce((x,y) => x + y));
        if(len != 0)
            this._c = this._c.map(x => x / len);
    };
}

var Plane = function(vec, dist) {
    this._d = dist;
    this._v = vec;
    this._v.norm();
}

Vect.prototype.vecMul = function(vec) {
  var ax = this._c[0], ay = this._c[1], az = this._c[2];
  var bx =  vec._c[0], by =  vec._c[1], bz =  vec._c[2];

  return new Vect(ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx);
}

Vect.prototype.dot = function(vec) {
  return this._c.map((x,i) => x*vec._c[i]).reduce((a,x) => a + x);
}

Vect.prototype.sum = function(vec) {
  let v = new Vect();
  Vect.prototype.constructor.apply(v, this._c.map((x,i) => x + vec._c[i]))
  return v;
}

Vect.prototype.sub = function(vec) {
  let v = new Vect();
  Vect.prototype.constructor.apply(v, this._c.map((x,i) => x - vec._c[i]))
  return v;
}

Vect.prototype.mul = function(sc) {
  let v = new Vect();
  Vect.prototype.constructor.apply(v, this._c.map((x,i) => x * sc))
  return v;
}

Vect.prototype.len = function() {
  return Math.sqrt(this.dot(this));
}

Vect.prototype.tranc = function() {
  let tC = 1e15;
  this._c = this._c.map((x) => Math.floor(x*tC+0.5)/tC);
}

function intersectR(vA, vB, rA, rB, nA, nB) {
  let vT = vA.sum(vB); 
  let cA = Math.sign(vA.dot(vT));
  let cB = Math.sign(vB.dot(vT));
  
  let sinA = (vA.mul(cA).vecMul(vB.mul(cB))).len();
  let cosA = (vA.mul(cA).dot(vB.mul(cB)));
  
  let dA = rA * cosA / sinA;
  let dB = rB * cosA / sinA;
  
  return nA.mul(rA).sum(vA.mul(dA*cA)).sum(nB.mul(rB)).sum(vB.mul(dB*cB));
}

Plane.prototype.intersect = function(plane) {
  let ivec = this._v.vecMul(plane._v);
  ivec.norm();
  ivec.tranc();
  if(!ivec.len())
    return [][0];
  
  let vA = ivec.vecMul( this._v);
  let vB = plane._v.vecMul(ivec);
 
  return new Line(ivec, intersectR(vA, vB, this._d, plane._d, this._v, plane._v));
}

var Line = function(vec, rvec) {
  this._v = vec;
  this._r = rvec;
  this._v.norm();
  this._v.tranc();
  let pv = this._v.mul(this._r.dot(this._v));
  this._r = this._r.sub(pv);
  this._r.tranc();
}

Line.prototype.intersect = function(line) {
  let ivec = this._v.vecMul(line._v);
  ivec.norm();
  ivec.tranc();
 
  if(!ivec.len())
    return [][0];
  
  if(!(this._r.dot(ivec) && line._r.dot(ivec)))
     return [][0];
  
  return intersectR(this._v, line._v, this._r.len(), line._r.len(), this._r, line._r);
};

Vect.prototype.toString = function () {
  return '{' + this._c.reduce((x,y) => '' + x + ', ' + y) + '}';
};

Line.prototype.toString = function () {
  return '{' + this._v + " " + this._r + '}';
};

Plane.prototype.toString = function () {
  return '{' + this._v + " " + this._d + '}';
};

export {Plane, Line, Vect};
