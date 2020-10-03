import {injectable} from "inversify";
import {IOption, IVariationRequest, OptionVariation} from "../variations/variation.model";
import {Option} from "./option.model";
import {IVariation} from "../categories/category.controller";

@injectable()
export class OptionsDomain {
  public async createOptions(options: IOption[], variation: IVariationRequest) {
    const optionsToCreate = options.map(option => ({name: option.name}));
    const createdOptions = await Option.bulkCreate(optionsToCreate, {
      ignoreDuplicates: true,
      returning: true,
      individualHooks: true
    });

    const optionVariations = createdOptions.map(option => ({optionId: option.get('id'), variationId: variation.id}));
    await OptionVariation.bulkCreate(optionVariations, {ignoreDuplicates: true});
  }
}
