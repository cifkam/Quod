function rad2deg(rad) {
    return rad * 180/Math.PI;
}

function vSub(a, b) {
    return [a[0]-b[0], a[1]-b[1]];
}
function vAdd(a, b) {
    return [a[0]+b[0], a[1]+b[1]];
}
function vDiv(a, scalar)
{
    return [a[0]/scalar, a[1]/scalar];
}
function vMult(a, scalar)
{
    return [a[0]*scalar, a[1]*scalar]
}
function vSum(vectors)
{
    let x = 0;
    let y = 0;
    for (let i = 0; i < vectors.length; ++i)
    {
        x += vectors[i][0];
        y += vectors[i][1];
    }
    return [x, y];
}
function vMean(vectors)
{
    return vDiv(vSum(vectors), vectors.length);
}
function vOrtho(a) {
    return [-a[1], a[0]]
}
function vOpposite(a)
{
    return [-a[0], -a[1]]
}
function vEquals(a,b)
{
    return a[0]==b[0] && a[1]==b[1];
}
function vLength(a)
{
    return Math.sqrt((a[0]**2 + a[1]**2));
}
function vDot(a,b)
{
    return a[0]*b[0] + a[1]*b[1];
}
function vAngle(a,b)
{
    return rad2deg(
        Math.acos(
            vDot(a,b) / (vLength(a)*vLength(b))
        )
    );
}
