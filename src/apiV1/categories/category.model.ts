import * as mongoose from "mongoose";
import deleteSystemFields from "../../helpers/deleteSystemFields";
const Schema = mongoose.Schema;

const CategorySchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    variations: [
      {
        variationId: String,
        options: [
          {
            id: String,
            price: Number
          }
        ]
      }
    ]
  },
  {
    timestamps: true,
    useNestedStrict: true
  }
);

CategorySchema.virtual("id").get(function() {
  return this._id.toString();
});

CategorySchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, obj) {
    const newDoc = deleteSystemFields(obj);
    return newDoc;
  }
});

export default mongoose.model("Category", CategorySchema);
