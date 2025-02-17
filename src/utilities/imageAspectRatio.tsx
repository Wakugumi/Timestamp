/**
 * Calculate image aspect ratio from an url
 * @params {string} src - the image source url
 * @returns {Promise<number>} returns number of the ratio as promise function
 */
const imageAspectRatio = (src: string): Promise<number> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      resolve(img.width / img.height);
    };
  });
};
export default imageAspectRatio;
