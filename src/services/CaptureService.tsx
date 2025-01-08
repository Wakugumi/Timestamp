import fs from 'fs/promises';
import { DeviceError, FileSystemError } from '../helpers/AppError';
import CameraService from './CameraService';

class CaptureService {

    /**
     * Get array of urls for images captured
     * @return {Promise<string[]>} array of image urls
     */
    public static async getCaptures(): Promise<string[]> {
        const list: string[] = [];
        try {
            const files = await fs.readdir(import.meta.env.VITE_DIR_CAPTURE);
            files.forEach((file: string) => {
                list.push(file);
            });
        } catch (err: any) {
            throw new FileSystemError(err.code + " - " + err.name + " - " + err.message);
        }
        return list;
    }


    public static async takeCapture() {
        const camera = CameraService.getInstance();
        
        try {
            const file = await camera.captureImageAsFile();
            console.log(file);
            const files = await CaptureService.getCaptures();
            const prefix = "capture";
            let maxNumber = 0;
            console.log("Trying to read dir")
            files.forEach(fileName => {
                const match = fileName.match(new RegExp(`^${prefix}-(\\d+)$`));
                console.log(fileName)
                if (match) {
                    const number = parseInt(match[1], 10);
                    if (number > maxNumber) {
                        maxNumber = number;
                    }
                }
            });

            const newFileName = `${prefix}-${maxNumber + 1}`;
            const buffer = await file.arrayBuffer();
            console.log("writing file");
            await fs.writeFile(import.meta.env.VITE_DIR_CAPTURE + newFileName, Buffer.from(buffer));
        } catch (error) {
            throw new DeviceError("Error capturing image: " + error);
        }
    

    }
}

export default CaptureService;