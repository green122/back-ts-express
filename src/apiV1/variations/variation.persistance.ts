import {injectable} from "inversify";
import {Op} from "sequelize";
import {IOption, IVariationRequest, OptionVariation, Variation} from "./variation.model";

@injectable()
export class VariationPersistance {

  public async updateOptionsVariations(variation: IVariationRequest, options: IOption[]) {
    const optionVariations = options.map(option => ({optionId: option.id, variationId: variation.id}));
    await OptionVariation.bulkCreate(optionVariations, {ignoreDuplicates: true});

    const optionIdsToDelete = optionVariations.map(({optionId}) => optionId);
    console.log(optionIdsToDelete, optionVariations);
    await OptionVariation.destroy({
      where: {
        variationId: variation.id,
        optionId: {[Op.notIn]: optionIdsToDelete}
      }
    });
  }

  public async updateVariation(variation: IVariationRequest) {
    await Variation.update({variation: variation.name, vary_price: variation.varyPrice}, {
      where: {
        id: variation.id
      },
      returning: true,
    });
  }
}
