import sharp from "sharp";
import mime from 'mime-types';

const filetypes = /jpg|jpeg|png|gif/;
export async function resizeAndMakePreview (image: any) {
  const { width, height } = await sharp(image.buffer).metadata();

  const resizeToSmallOptions = width > height
    ? [200, null]
    : [null, 200];

  const resizeToBigOptions = width > height
    ? [2000, null]
    : [null, 2000];


  const preview = await sharp(image.buffer).resize(...resizeToSmallOptions).toBuffer();
  const resized = width > 2000 || height > 2000 ? await sharp(image.buffer).resize(...resizeToBigOptions) : image.buffer;

  return { preview, resized };
};
