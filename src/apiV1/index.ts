import { Router } from "express";
import auth from "./auth/auth.route";
import categories from "./categories/category.route";
import listings from "./listings/listing.route";
import users from "./users/user.route";
import variations from "./variations/variation.route";

const router: Router = Router();

router.use("/", auth);
router.use("/users", users);
router.use("/listings", listings);
router.use("/variations", variations);
router.use("/categories", categories);

export default router;
