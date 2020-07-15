import { injectable } from "inversify";
import {IOption} from "../variations/variation.model";

@injectable()
export class OptionsDomain {
  public async createOptions(options: IOption[]) {

  }
}
