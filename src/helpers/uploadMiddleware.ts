import {NextFunction, Response} from "express";
import {S3} from 'aws-sdk';
import {resizeAndMakePreview} from "./resizeMiddleware";
import CONFIG from "../config/config";
import 'multer';

const s3 = new S3({
  accessKeyId: CONFIG.AWSAccessKeyId,
  secretAccessKey: CONFIG.AWSSecretKey,
  region: 'eu-central-1',
})

export async function removeImagesFromStorage(imagesData: Array<{ url: string; urlPreview: string }>) {
  if (!imagesData[0]) {
    return;
  }

  const deletePromises = [];
  imagesData.forEach(image => {
    deletePromises.push(s3.deleteObject({
      Bucket: 'e-shop-brooche-bouquet',
      Key: image.url.split('/').slice(-1)[0]
    }).promise());
    deletePromises.push(s3.deleteObject({
      Bucket: 'e-shop-brooche-bouquet/previews',
      Key: image.urlPreview.split('/').slice(-1)[0]
    }).promise());
  })
  await Promise.all(deletePromises);
}

export async function uploadImagesToStorage(req: any, res: Response, next: NextFunction) {
  const images: Express.Multer.File[] = req.files;
  const resizedPromises = images.map(resizeAndMakePreview);
  const resizedImages = await Promise.all(resizedPromises);

  const uploadImagesPromise: Array<Promise<S3.ManagedUpload.SendData>> = [];
  const uploadPreviewsPromise: Array<Promise<S3.ManagedUpload.SendData>> = [];
  images.forEach((image, index) => {
    const [fileName, fileExtension] = image.originalname.split('.');
    const {resized, preview} = resizedImages[index];
    uploadImagesPromise.push(
      s3.upload({
        Bucket: 'e-shop-brooche-bouquet',
        ACL: 'public-read',
        Body: resized,
        Key: fileName + '.' + fileExtension
      }).promise());
    uploadPreviewsPromise.push(
      s3.upload({
        Bucket: 'e-shop-brooche-bouquet/previews',
        ACL: 'public-read',
        Body: preview,
        Key: fileName + '-sm.' + fileExtension
      }).promise());
  })
  let imagesResult: S3.ManagedUpload.SendData[];
  let previews: S3.ManagedUpload.SendData[];
  try {
    imagesResult = await Promise.all(uploadImagesPromise);
    previews = await Promise.all(uploadPreviewsPromise)
  } catch (e) {
    console.log(e);
  }
  req.files = {
    urls: imagesResult.map(image => image.Location),
    previewUrls: previews.map(image => image.Location),
  }
  return next();
}
