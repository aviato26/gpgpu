
exports.vertex =
`
uniform float count;

void main()
{
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    gl_PointSize = 1.0;
}
`
