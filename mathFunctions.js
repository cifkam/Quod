function rad2deg(rad) { return rad * 180/Math.PI; }

function sAdd(v, a)   { return [v[0]+a, v[1]+a]; }
function sSub(v, a)   { return [v[0]-a, v[1]-a]; }
function sMult(v, a)  { return [v[0]*a, v[1]*a]; }
function sDiv(v, a)   { return [v[0]/a, v[1]/a]; }

function vSub(v, w)   { return [v[0]-w[0], v[1]-w[1]]; }
function vAdd(v, w)   { return [v[0]+w[0], v[1]+w[1]]; }
function vOrtho(v)    { return [-v[1], v[0]] }
function vOpposite(v) { return [-v[0], -v[1]] }
function vEquals(v,w) { return v[0]==w[0] && v[1]==w[1]; }
function vLength(v)   { return Math.sqrt((v[0]**2 + v[1]**2)); }
function vDot(v,w)    { return v[0]*w[0] + v[1]*w[1]; }
function vMean(vects) { return sDiv(vSum(vects), vects.length); }

function vSum(vects) {
    let x = 0;
    let y = 0;
    for (let i = 0; i < vects.length; ++i) {
        x += vects[i][0];
        y += vects[i][1];
    }
    return [x, y];
}
function vAngle(a,b) {
    return rad2deg(
        Math.acos(
            vDot(a,b) / (vLength(a)*vLength(b))
        )
    );
}
