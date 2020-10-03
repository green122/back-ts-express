import {ICategory, IVariation} from "../categories/category.controller";
import {IOption} from "../variations/variation.model";

export interface ICartItem {
  listing: IOrderedListing;
  variations: IVariation
}

export interface IOrderedListing {
  id: number;
  category: Pick<ICategory, 'id' | 'name'>;
  images: IImageRecord[];
  name: string;
  description: string;
}

export interface IOrderedVariation {
    orderedItemId: number;
    option: IOption,

}

export interface IImageRecord {
  url: string;
  urlPreview: string;
}
