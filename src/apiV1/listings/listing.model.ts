import * as mongoose from "mongoose";
const Schema = mongoose.Schema;

const ListingSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: false
    }
    // category: {
    //   type: String,
    //   required: true,
    //   trim: true
    // }
  },
  {
    timestamps: true,
    useNestedStrict: true
  }
);

export default mongoose.model("Listing", ListingSchema);
