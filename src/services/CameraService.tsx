import { Camera } from "web-gphoto2";

export default class CameraService {
    private static instance: Camera;


    private constructor() {

    }

    /**
     * Triggering browser USB device picker
     * @return {Promise<void>}
     */
    public static async selectCamera(): Promise<void> {
        try {
            await Camera.showPicker();
        } catch (error) {
            console.error("Failed to show picker: ", error);
        } finally {
            console.log("Camera device is selected");
        }
    }

    /**
     * Attempting to connect to camera device
     * @return {Promise<void>}
     */
    public static async connectCamera() {
        try {
            await CameraService.instance.connect();
        } catch (error) {
            console.error("Failed to connect camera: ", error);
        } finally {
            console.log("Connected");
        }
    }


    /**
     * Initiate camera instance and attempting to connect to camera devices
     * Only attempt with successfull connection to device will return the instance.
     * @return {Camera} as instance
     */
    public static async setup() {
        try {
            const camera = new Camera();
            console.log("starting camera instance setup");
            await camera.connect();
            console.log(await camera.getSupportedOps());
            this.instance = camera;
        } catch (error) {
            if(error == "Error: Unknown model") {
                throw new Error("Cannot connect to camera, please contact our support")
            }
            throw new Error(error as string);
        }
        finally {
            console.log("camera setup process resolved");
        }

    };

    /**
     * Fetch a preview frame from camera device as blob
     * @returns {Promise<Blob>} returns a promise that sends preview as blob
     */
    public static async getPreview(canvas : HTMLCanvasElement): Promise<void> {
        if(!this.instance) {
            throw new Error("CameraService setup function must be called successsfully first")
        }


        const camera = this.instance;
        const blob = await camera.capturePreviewAsBlob();
        const image = new Image();
        image.src = URL.createObjectURL(blob);

        return new Promise((resolve, reject) => {
            image.onload = () => {
                canvas.getContext('2d')?.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                )
                URL.revokeObjectURL(image.src);
                resolve();

            }

            image.onerror = (err) => {
                URL.revokeObjectURL(image.src);
                reject(err);
            }
        })
        
    }

    public static getInstance() : Camera {
        if(!this.instance) {
            throw new Error("CameraService setup function must be called successsfully first")
        }

        return this.instance
        
    }


}