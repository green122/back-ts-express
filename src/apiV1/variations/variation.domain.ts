import {injectable} from "inversify";
import {VariationPersistance} from "./variation.persistance";
import {OptionsDomain} from "../options/options.domain";
import {IOption, IVariationRequest} from "./variation.model";

@injectable()
export class VariationDomain {
  constructor(private variationPersistance: VariationPersistance,
              private optionsDomain: OptionsDomain) {
  }

  public async updateVariationAndOptions(variation: IVariationRequest) {
    const optionsToCreate: IOption[] = [];
    const optionsToUpdate: IOption[] = [];
    variation.options.forEach(option => {
      if (String(option.id).includes('temp')) {
        optionsToCreate.push(option);
      } else {
        optionsToUpdate.push(option);
      }
    });

    await Promise.all([
      this.variationPersistance.updateOptionsVariations(variation, optionsToUpdate),
      this.optionsDomain.createOptions(optionsToCreate),
      this.variationPersistance.updateVariation(variation)
    ]);
  }
}
