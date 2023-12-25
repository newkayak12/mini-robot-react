export const addClickEventListener = ( onMouseClick ) => {
    document.addEventListener("click", onMouseClick);
}
export const addWindowResizeEventListener = ( camera, renderer ) => {
    window.addEventListener("resize", () => {
        const {innerWidth, innerHeight} = window

        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        if (renderer) renderer.setSize(innerWidth, innerHeight);
    });
}