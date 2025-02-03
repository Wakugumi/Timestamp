type Layout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export default interface Frame {
  /**
   * Identificaiton number for a single frame
   * @type {string}
   */
  id: string;

  /** Name of the frame
   * @type {string}
   */
  name: string;

  /** Identification number of the corresponding theme of the frame
   * @type {string}
   */
  themeId: string;

  /** Numbers of picture(s) avalailable to be pasted on the frame
   * @type {number}
   */
  count: number;

  /** Provide coordinates information for each photo template on the frame.
   * The size of the array is assumed to be equal to count, further checking is better.
   * @type {Layout[]}
   */
  layouts: Layout[];

  /** Price information of this Frame object. Guaranteed to be in Indonesian Rupiah
   * @type {number}
   */
  price: number;

  /** URL direct to the Frame resource.
   * Guaranteed to return response as PNG image file.
   * @type {string}
   */
  url?: string;
}
