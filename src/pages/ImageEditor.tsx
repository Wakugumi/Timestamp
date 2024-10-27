import { useEffect, useState, useRef } from "react"
import * as fabric from 'fabric'
import ActionButton from "../components/ActionButton";
import './ImageEditor.scss'
import EditingPanel from "../components/EditingPanel";

export default function ImageEditor() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [canvasScaleFactor, setCanvasScaleFactor] = useState(0.8);
    const [canvas, setCanvas] = useState(null);

    let webglBackend;

    let pictures : any[] = [];

    let frames = 
        { url : '/public/frame_1.png', size : [1080, 1920], config : [
            { x: 90, y: 50, width: 900, height: 900},
            { x: 90, y: 970, width: 900, height: 900},
        ]}
    let images = ['/image_2.jpg', '/image_3.jpg']

    const loadFrame = ({canvas, url, maxWidth, maxHeight}) => {
        fabric.FabricImage.fromURL(url).then((img) => {
            const originalWidth = frames.size[0];
            const originalHeight = frames.size[1];
            
            let scaleFactor = 1;
            
            if(originalWidth > maxWidth || originalHeight > maxHeight) {
                scaleFactor = Math.min(maxWidth / originalWidth, maxHeight / originalHeight);
                setCanvasScaleFactor(scaleFactor);
            }

            img.scale(canvasScaleFactor);
            canvas.setHeight(originalHeight * scaleFactor);
            canvas.setWidth(originalWidth * scaleFactor);

            img.set({
                selectable: false,      // Prevent selecting the image
                evented: false,         // Prevent interaction with the image
                lockMovementX: true,    // Prevent moving the image horizontally
                lockMovementY: true,    // Prevent moving the image vertically
                lockScalingX: true,     // Prevent scaling the image horizontally
                lockScalingY: true,     // Prevent scaling the image vertically
                lockRotation: true,     // Prevent rotation of the image
                hasControls: false,     // Hide the controls (e.g., scaling/rotation handles)
                hasBorders: false,      // Hide borders around the image
                });

            canvas.add(img);
        })
    }

    const loadPictures = ({canvas, index, imageURL}) => {
        fabric.FabricImage.fromURL(imageURL).then((img) => {

            const clipPath = new fabric.Rect({
                left: frames.config[index].x * canvasScaleFactor,
                top: frames.config[index].y * canvasScaleFactor,
                width: frames.config[index].width * canvasScaleFactor,
                height: frames.config[index].height * canvasScaleFactor,
                absolutePositioned: true
            })

            
            const aspectRatio = img.width / img.height;
            const targetAspectRatio = frames.config[index].width / frames.config[index].height;

            let scaleFactor = 1;

            if (aspectRatio > targetAspectRatio) {
                scaleFactor = (frames.config[index].height * canvasScaleFactor) / img.height
            } else {
                scaleFactor = (frames.config[index].width * canvasScaleFactor) / img.width;
            }


           
            img.scale(scaleFactor)


            img.set({
                left: frames.config[index].x * canvasScaleFactor + (frames.config[index].width * canvasScaleFactor - img.width * scaleFactor) / 2,
                top: frames.config[index].y * canvasScaleFactor + (frames.config[index].height * canvasScaleFactor - img.height * scaleFactor) / 2,

                clipPath: clipPath,
                selectable: true,       // Allow selecting the image
                evented: true,          // Allow interaction with the image
                lockMovementX: false,   // Allow moving the image horizontally
                lockMovementY: false,   // Allow moving the image vertically
                lockScalingX: true,    // Allow scaling the image horizontally
                lockScalingY: true,    // Allow scaling the image vertically
                lockRotation: true,    // Allow rotation of the image
                hasControls: false,      // Show the controls (e.g., scaling/rotation handles)
                hasBorders: false,       // Show borders around the image
                });

            
            
            pictures.push(img);
            canvas.add(img);
            canvas.bringObjectToFront(img);
        }).catch((err) => {
            console.log('Error loading image', err);
        })
    }

    useEffect( () => {
        try {
            webglBackend = new fabric.WebGLFilterBackend();
          } catch (e) {
            console.log(e)
            webglBackend = new fabric.Canvas2dFilterBackend();
          }

        fabric.setFilterBackend(fabric.initFilterBackend());
        fabric.setFilterBackend(webglBackend);

        const maxWidth = window.innerWidth * 0.8;
        const maxHeight = window.innerHeight * 0.8;

        if(!canvasRef.current) return;

        const initCanvas = new fabric.Canvas(canvasRef.current)

        // Loading the frame image and resizing the canvas
        loadFrame({canvas: initCanvas, url: frames.url, maxWidth, maxHeight});

        // Looping through array of images to insert and snap to grids
        images.forEach((image, index) => {
            loadPictures({canvas: initCanvas, index, imageURL: image});
        })

        initCanvas.renderAll();
        
        pictures.forEach((val, index) => {
            console.log(val)

        })
        initCanvas.renderAll();

        setCanvas(initCanvas);

        
        return () => {
            initCanvas.dispose();
        }
        
    }, [canvasScaleFactor])

    const handleToolbar = (e : any) => {

    }
   

    return (
        <div id="editor">
            <div id="toolbar">

                <ActionButton onClick={handleToolbar} showLeading={false} showTrailing={false}>
                    <span className="material-symbols-outlined">
                        arrow_selector_tool
                    </span>
                </ActionButton>

                <EditingPanel canvas={canvas} imageRefs={pictures} />

            </div>
            <canvas id="canvas" ref={canvasRef}/>
        </div>
    )
}