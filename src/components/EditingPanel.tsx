import { useEffect, useState } from 'react';
import * as fabric from 'fabric';

export default function EditingPanel({canvas, imageRefs} : {canvas : any, imageRefs : any}) {

    let imgObj : any[] = []
 

    const presets = [
        { name : "preset-1", saturation : 100, brightness : 100, contrast : 100, blur : 0, grayscale : 0},
        { name : "preset-2", saturation : 50, brightness : 100, contrast : 50, blur : 0, grayscale : 0},
        { name : "preset-3", saturation : 50, brightness : 40, contrast : 70, blur : 0, grayscale : 0}
    ]

    useEffect(() => {
        

        if (imageRefs) {
            imageRefs.forEach((img : any) => {
                imgObj.push(img);
            });
        }
    }, [imageRefs]);

    const handleFilterChange = (e : any) => {
        const index = parseInt(e.target.value);
        console.log(e.target.value)
        imageRefs.forEach(img => {
            img.push(new fabric.filters.Brightness({brightness : presets[index].brightness / 100}));
            img.push(new fabric.filters.Contrast({contrast : presets[index].contrast / 100}));
            img.push(new fabric.filters.Saturation({saturation : presets[index].saturation / 100}));
            img.push(new fabric.filters.Blur({blur : presets[index].blur / 100}));
            img.push(new fabric.filters.Grayscale({grayscale : presets[index].grayscale / 100}));
            img.applyFilters();

        });
        canvas.renderAll();
    }

    return (
        <>

        <div className="editing-container">

            {presets.map((preset, index) => (
                <label htmlFor="" className="editing-button" key={index}>
                <input
                    type = "radio"
                    name = "filter"
                    value = {index}
                    onChange = {handleFilterChange}
                />
                <div>
                    <strong>{preset.name}</strong>
                </div>
                </label>
            ))}

            

        </div>

        </>
    )

}