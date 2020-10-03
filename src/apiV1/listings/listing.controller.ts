import "reflect-metadata";
import {injectable} from 'inversify';
import {Request, Response} from "express";
import {Listing, ListingImages} from "./listing.model";
import {CategoryPersistence} from "../categories/category.persistence";
import {Op} from "sequelize";
import {removeImagesFromStorage} from "../../helpers/uploadMiddleware";
import {pool} from "../../config/db";
import {groupBy, KeyMap} from "../../helpers/groupBy";

type DataRow = {
  id: number,
  name: string,
  description: string,
  category_id: number,
  url: string,
  url_preview: string,
}

type KKK = keyof DataRow;

const keyMap: KeyMap<DataRow> = {
  groupKey: 'id',
  fields: ['id', ['category_id', 'categoryId'], 'name', 'description'],
  nested: {
    groupKey: 'id',
    fields: ['url', ['url_preview', 'urlPreview']],
    groupName: 'images',
  }
}

@injectable()
export default class ListingController {

  constructor(private categoryPersistence: CategoryPersistence) {
  }

  public findAll = async (req: Request, res: Response): Promise<any> => {
    try {
      const listingsInstance = await Listing.findAll({
        include: [
          {model: ListingImages},
        ]
      });

      const {rows} = await pool.query<DataRow>(`
       SELECT listings.id AS id, name, description, category_id, url, url_preview FROM listings
        LEFT JOIN images ON images.listing_id = listings.id
        `
      );

      const listinsgObject = groupBy(rows, {...keyMap, oneToOne: true});
pa
      if (!rows || !rows.length) {
        return res.status(404).send({
          success: false,
          message: "Users not found",
          data: null
        });
      }
      res.status(200).send(listinsgObject);
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

     const {rows} = await pool.query(`
       SELECT listings.id AS id, name, description, category_id, url, url_preview FROM listings
        LEFT JOIN images ON images.listing_id = listings.id
        WHERE listings.id = $1
        `, [req.params.id]
     );


      if (!rows) {
        return res.status(404).send({
          success: false,
          message: "User not found",
          data: null
        });
      }
      const listingObject = groupBy(rows, {...keyMap, oneToOne: true}) as Record<string, any>;

      const category = await this.categoryPersistence.findCategoryById(listingObject.categoryId);

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

  public create = async (req: any, res: Response): Promise<any> => {
    const {listing} = req.body;
    const listingRec = JSON.parse(listing);
    try {
      const listingEntity = new Listing(listingRec);
      const savedListing = await listingEntity.save();
      const listingId: number = savedListing.get('id') as number;
      await this.createImages(listingId, req.files);
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

  public update = async (req: Request, res: Response): Promise<any> => {
    const {id} = req.params;
    const {listing} = req.body;
    const listingRec = JSON.parse(listing);
    const {urls, previewUrls}: { urls: string[], previewUrls: string[] } = req.files as any;
    try {
      const listingEntity = await Listing.findByPk(id);
      const listingImagesIds = listingRec.images.map(image => image.id);
      const listingImages = await ListingImages.findAll({
        where: {
          id: {[Op.notIn]: listingImagesIds}
        }
      });

      const listingUrls = listingImages.map(listingImage => ({
        url: listingImage.get('url') as string,
        urlPreview: listingImage.get('urlPreview') as string
      }));

      await this.createImages(listingRec.id, req.files);

      removeImagesFromStorage(listingUrls);
      listingImages.forEach(listingImage => listingImage.destroy());

      // const listingImages = urls.map((url, index) => ({listingId, url, urlPreview: previewUrls[index]}));
      // await ListingImages.bulkCreate(listingImages, {ignoreDuplicates: true});
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

  private async createImages(listingId: number, uploadedImages: any) {
    const {urls, previewUrls}: { urls: string[], previewUrls: string[] } = uploadedImages;
    const listingImages = urls.map((url, index) => ({listingId, url, urlPreview: previewUrls[index]}));
    await ListingImages.bulkCreate(listingImages, {ignoreDuplicates: true});
  }
}
