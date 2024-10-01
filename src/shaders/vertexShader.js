function vertexShader() {
    return `
        uniform vec3 uSize;
        varying vec3 vLocalPosition;
        varying vec3 vNormalizedPosition;
        

        void main() {
            vLocalPosition = position;
            vNormalizedPosition = position + vec3(uSize / 2.0);

            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 clipPosition = projectionMatrix * viewPosition;

            gl_Position = clipPosition;
        }
    `
}

export { vertexShader }