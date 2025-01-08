import { filters, FabricObject, FabricImage } from 'fabric';
export interface Filter {
    /**
     * Percentage of blur, range between 0 and 1
     * @default {0}
     * @type {number}
     */
    blur?: number | 0,

    /**
     * Set brightness, range from -1 to 1
     * @default {0}
     * @type {number}
     */
    brightness?: number | 0,

    /**
     * Range from -1 to 1
     * @default {0}
     * @type {number}
     */
    contrast?: number | 0,

    /**
     * Saturation value, from -1 to 1.
     * @default {0}
     * @type {number}
     */
    saturation?: number | 0
}



export function applyFilter(object : FabricImage, filtersObject : Filter) {
    var filter = [
        new filters.Blur({ blur: filtersObject.blur }),
        new filters.Brightness({ brightness: filtersObject.brightness }),
        new filters.Contrast({ contrast: filtersObject.contrast }),
        new filters.Saturation({ saturation: filtersObject.saturation })
    ]
    object.applyFilters(filter);

}