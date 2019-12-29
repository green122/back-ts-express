import * as mongoose from "mongoose";
import deleteSystemFields from "../../helpers/deleteSystemFields";
const Schema = mongoose.Schema;

const OptionSchema = Schema({
  name: String,
  price: Number
});

const VariationSchema = Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    options: { type: [OptionSchema] },
    priceVary: {
      type: Boolean
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true }
  }
);

VariationSchema.virtual("id").get(function() {
  return this._id.toString();
});

OptionSchema.virtual("id").get(function() {
  return this._id.toString();
});

OptionSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, obj) {
    const newDoc = deleteSystemFields(obj);
    return newDoc;
  }
});

VariationSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform(doc, obj) {
    const newDoc = deleteSystemFields(obj);
    return newDoc;
  }
});

export default mongoose.model("Variation", VariationSchema);
