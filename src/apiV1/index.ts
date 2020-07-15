import {Router} from "express";
import auth from "./auth/auth.route";
import {ListingRoute} from "./listings/listing.route";
import {OptionRoute} from "./options/option.route";
import users from "./users/user.route";

import {container} from '../config/di';
import {VariationRoute} from "./variations/variation.route";
import {PricesRoute} from "./prices/prices.route";
import {CategoryRoute} from "./categories/category.route";
import {CartRoute} from "./cart/cart.route";

const {variationRoute} = container.resolve(VariationRoute);
const {optionRoute} = container.resolve(OptionRoute);
const {pricesRoute} = container.resolve(PricesRoute);
const {categoryRoute} = container.resolve(CategoryRoute);
const {listingRoute} = container.resolve(ListingRoute);
const {cartRoute} = container.resolve(CartRoute);

const router: Router = Router();
router.use("/", auth);
router.use("/users", users);
router.use("/listings", listingRoute);
router.use("/variations", variationRoute);
router.use("/categories", categoryRoute);
router.use("/options", optionRoute);
router.use("/prices", pricesRoute);
router.use("/cart", cartRoute);

export default router;
