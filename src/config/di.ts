import "reflect-metadata";
import {Container} from "inversify";
import {VariationController} from "../apiV1/variations/variation.controller";
import {VariationRoute} from "../apiV1/variations/variation.route";
import {OptionController} from "../apiV1/options/option.controller";
import {OptionsDomain} from "../apiV1/options/options.domain";
import {OptionRoute} from "../apiV1/options/option.route";
import {VariationDomain} from "../apiV1/variations/variation.domain";
import {VariationPersistance} from "../apiV1/variations/variation.persistance";
import {PricesController} from "../apiV1/prices/prices.controller";
import {PricesDomain} from "../apiV1/prices/prices.domain";
import {PricesRoute} from "../apiV1/prices/prices.route";
import {PricesPersistence} from "../apiV1/prices/prices.persistence";
import CategoryController from "../apiV1/categories/category.controller";
import {CategoryRoute} from "../apiV1/categories/category.route";
import {CategoryPersistence} from "../apiV1/categories/category.persistence";
import ListingController from "../apiV1/listings/listing.controller";
import {ListingRoute} from "../apiV1/listings/listing.route";
import {CartController} from "../apiV1/cart/cart.controller";
import {CartRoute} from "../apiV1/cart/cart.route";
import {CartDomain} from "../apiV1/cart/cart.domain";
import {CartPersistance} from "../apiV1/cart/cart.persistance";

const container = new Container();

container.bind<ListingController>(ListingController).toSelf();
container.bind<ListingRoute>(ListingRoute).toSelf();

container.bind<CategoryController>(CategoryController).toSelf();
container.bind<CategoryPersistence>(CategoryPersistence).toSelf();
container.bind<CategoryRoute>(CategoryRoute).toSelf();

container.bind<VariationController>(VariationController).toSelf();
container.bind<VariationRoute>(VariationRoute).toSelf();
container.bind<VariationDomain>(VariationDomain).toSelf();
container.bind<VariationPersistance>(VariationPersistance).toSelf();

container.bind<OptionController>(OptionController).toSelf();
container.bind<OptionsDomain>(OptionsDomain).toSelf();
container.bind<OptionRoute>(OptionRoute).toSelf();

container.bind<PricesController>(PricesController).toSelf();
container.bind<PricesDomain>(PricesDomain).toSelf();
container.bind<PricesRoute>(PricesRoute).toSelf();
container.bind<PricesPersistence>(PricesPersistence).toSelf();

container.bind<CartController>(CartController).toSelf();
container.bind<CartRoute>(CartRoute).toSelf();
container.bind<CartDomain>(CartDomain).toSelf();
container.bind<CartPersistance>(CartPersistance).toSelf();

export {container};
