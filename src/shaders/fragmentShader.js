function fragmentShader() {
    return `
        uniform vec3 uColor;
        uniform float uBottomShadowMag;
        uniform vec3 uSize;

        varying vec3 vLocalPosition;
        varying vec3 vNormalizedPosition;

        const float threshold = 0.01;
        vec2 plane;

        vec2 getPlanePos(vec3 position) {
            if(    abs(position.y - uSize.y / 2.0) <= threshold
                || abs(position.y + uSize.y / 2.0) <= threshold) {
                plane = vec2(uSize.x, uSize.z) / 2.0;
                return position.xz;
            }
            if(     abs(position.x - uSize.x / 2.0) <= threshold
                ||  abs(position.x + uSize.x / 2.0) <= threshold) {
                plane = vec2(uSize.y, uSize.z) / 2.0;
                return position.yz;
            }
            if(     abs(position.z - uSize.z / 2.0) <= threshold
                ||  abs(position.z + uSize.z / 2.0) <= threshold) {
                plane = vec2(uSize.x, uSize.y) / 2.0;
                return position.xy;
            }
        }

        float magByDstFromCenter(vec2 planePos) {
            float hyp = sqrt( pow(plane.x, 2.0) + pow(plane.y, 2.0) );
            float dst = sqrt( pow(planePos.x, 2.0) + pow(planePos.y, 2.0) ); // dst from center
            float dstNormalized = dst/ hyp;

            float blendThreshold = 0.22;
            float threshold = 0.005;

            // Draw edges 
            if(     abs(planePos.x - plane.x) <= threshold
                ||  abs(planePos.x + plane.x) <= threshold) {
                return 0.75;
            }
            if(     abs(planePos.y - plane.y) <= threshold
                ||  abs(planePos.y + plane.y) <= threshold) {
                return 0.75;
            }

            return (1.0 - dstNormalized) < blendThreshold
                ? smoothstep(-0.27, blendThreshold, 1.0 - dstNormalized)
                : 1.0;
        }

        void main() {
            vec3 bottomShadow = vec3( pow(vNormalizedPosition.y , uBottomShadowMag) );
            vec2 planePos = getPlanePos(vLocalPosition);
            float colorMag = magByDstFromCenter(planePos);

            gl_FragColor = vec4(
                uColor * colorMag ,//* bottomShadow,
                1.0
            );
        }
    `
}

export { fragmentShader }