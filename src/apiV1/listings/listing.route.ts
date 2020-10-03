import {injectable} from 'inversify';
import {Router} from "express";
import multer, {diskStorage} from 'multer';

import verifyToken from "../../helpers/verifyToken";
import {uploadImagesToStorage} from "../../helpers/uploadMiddleware";
import ListingController from "./listing.controller";

@injectable()
export class ListingRoute {
  private listing: Router = Router();

  public get listingRoute() {
    return this.listing;
  }

  private storage = multer.memoryStorage();
  private uploadImages = multer({storage: this.storage, limits: {fileSize: 4 * 1024 * 1024}});

  constructor(private controller: ListingController) {
    this.configureRoute();
  }

  private configureRoute() {
    this.listing.get("/", this.controller.findAll);


    this.listing.get("/:id", this.controller.findOne);


    this.listing.post("/:id?", this.uploadImages.array('file') as any,
      uploadImagesToStorage,
      this.controller.create);

    this.listing.put("/:id", this.uploadImages.array('file') as any,
      uploadImagesToStorage,
      this.controller.update);

    this.listing.delete("/:id", this.controller.remove);
  }
}











