import { Camera } from "web-gphoto2";
import LoggerService from "./LoggerService";
import { DeviceError, handleError } from "../helpers/AppError";

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
        if(CameraService.instance) {
            LoggerService.info("Camera instance already active. This call may unintentionally be called.")
            return;
        }
        try {
            const camera = new Camera();
            LoggerService.info("Camera setup initiating")
            await camera.connect();
            this.instance = camera;
        } catch (error) {
            if(error == "Error: Unknown model") {
                throw new DeviceError('No recognizable camera device', "We're very sorry, our camera seems to be out of order");
            }
            throw new DeviceError(`Error connecting to camera: ${error}`, "We're very sorry, our camera seems to be out of order")
        }
        finally {
            LoggerService.info("Camera setup resolved");
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