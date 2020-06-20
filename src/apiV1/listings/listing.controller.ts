import "reflect-metadata";
import {injectable} from 'inversify';
import {Request, Response} from "express";
import {Listing, ListingImages} from "./listing.model";
import {Category} from "../categories/category.model";
import {Variation} from "../variations/variation.model";
import {Option} from "../options/option.model";
import {CategoryPersistence} from "../categories/category.persistence";

@injectable()
export default class ListingController {

  constructor(private categoryPersistence: CategoryPersistence) {
  }

  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const listings = await Listing.findAll({
        include: [
          {model: ListingImages}
        ]
      });

      if (!listings) {
        return res.status(404).send({
          success: false,
          message: "Users not found",
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: listings
      });
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const listing = await Listing.findByPk(req.params.id, {
        // raw: true,
        // nest: true,
        include: [{
          model: ListingImages, attributes: ['url', 'urlPreview']
        }],
      });
      if (!listing) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }
      const listingObject = JSON.parse(JSON.stringify(listing));
      const category = await this.categoryPersistence.findCategoryById((listingObject as any).categoryId);

      res.status(200).send({
          ...listingObject, category
        }
      );
    } catch (err) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public update = async (req: any, res: Response): Promise<any> => {
    const {listing} = req.body;
    const listingRec = JSON.parse(listing);
    const {urls, previewUrls}: { urls: string[], previewUrls: string[] } = req.files;
    try {
      const listingEntity = new Listing(listingRec);
      const savedListing = await listingEntity.save();
      const listingId: string = savedListing.get('id') as string;
      console.log('AAAAAAAAAAAAAAA    ', listingId);
      const listingImages = urls.map((url, index) => ({listingId, url, urlPreview: previewUrls[index]}));
      console.log('BBBBBBBBBBBBBB    ', listingImages);
      await ListingImages.bulkCreate(listingImages);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    // try {
    //   const user = await Listing.destroy(req.params.id);
    //
    //   if (!user) {
    //     return res.status(404).send({
    //       success: false,
    //       message: "User not found",
    //       data: null
    //     });
    //   }
    //   res.status(204).send();
    // } catch (err) {
    //   res.status(500).send({
    //     success: false,
    //     message: err.toString(),
    //     data: null
    //   });
    // }
  };
}
