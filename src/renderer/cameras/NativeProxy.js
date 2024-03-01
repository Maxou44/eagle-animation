class NativeProxy {
    constructor(deviceId = null, context = {}) {
        this.context = context;
        this.deviceId = deviceId,

        console.log(deviceId, context)

        /*this.stream = false;
        this.deviceId = deviceId;

        this.video = false;
        this.width = false;
        this.height = false;

        this.capabilitiesState = {};
        this.previousCapabilitiesState = {};
        this.capabilities = null;*/

    }

    get id() {
        return this?.context?.id || null;
    }

    initPreview() {
        return new Promise(async (resolve) => { // eslint-disable-line no-async-promise-executor
            resolve(true);
        });
    }

    resetCapabilities() {

    }

    applyCapability(key, value) { // eslint-disable-line no-unused-vars

    }

    getCapabilities() {
        return [];
    }

    async connect(video = false, settings = {}) {
        this.video = video;
        this.settings = settings;
        await window.EA('CONNECT_NATIVE_CAMERA', { camera_id: this.context.id });
        return this.initPreview();
    }

    isInitialized() {
        return true;
        //return this.width !== false;
    }

    getPreviewWidth() {
        return this.width;
    }

    getPreviewHeight() {
        return this.height;
    }

    async takePicture() {
        const data = await window.EA('TAKE_PICTURE_NATIVE_CAMERA', { camera_id: this.context.id });
        return data;
    }

    async disconnect() {
        await window.EA('DISCONNECT_NATIVE_CAMERA', { camera_id: this.context.id });
    }
}

class NativeProxyBrowser {
    static async getCameras() {
        try {
            const cameras = await window.EA('LIST_NATIVE_CAMERAS');
            return cameras;
        } catch (err) {
            console.error(err);
        }
        return [];
    }
}

export const Camera = NativeProxy;
export const CameraBrowser = NativeProxyBrowser;
