// server/models/Product.js
import mongoose from 'mongoose';

const packagingSchema = new mongoose.Schema(
  {
    // display name e.g. "Pc", "Pkt", "Dozen", "Carton"
    name: { type: String, required: true },

    // multiplier -> how many **pieces** are in 1 unit of this packaging
    // e.g. piece => 1, dozen => 12, carton => 240 (or any number)
    piecesPerUnit: { type: Number, required: true, min: 1 },

    // minimum order quantity in THIS unit (e.g. minQty 1 dozen)
    minQty: { type: Number, default: 1 },

    // step increments in THIS unit (1 = increments of 1 dozen)
    qtyStep: { type: Number, default: 1 },

    // max order quantity in this unit (0 = unlimited)
    maxQty: { type: Number, default: 0 },

    // price for this packaging (optional — admin can set per-pack price)
    price: { type: Number, default: 0 },

    // mark a packaging as default for sales (e.g. "Pkt" default)
    defaultForSale: { type: Boolean, default: false },

    // whether this packaging is available for purchase (sellable)
    sellable: { type: Boolean, default: true },

    // optional custom label
    customName: { type: String, default: '' },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, default: '' },

    // stock is stored in base pieces (smallest inventory unit)
    stock: { type: Number, default: 0 },

    // image path / filename (we build URL on the fly)
    image: { type: String, default: null },

    // list of packaging options; admin can add many (pcs, dozen, carton, custom)
    packagingOptions: { type: [packagingSchema], default: [] },

    // convenience: name of base packaging (should match one packagingOption where piecesPerUnit === 1)
    baseUnitName: { type: String, default: 'piece' },

    // default sale packaging name (one of packagingOptions.name)
    defaultSaleUnit: { type: String, default: null },

    // fallback/base price per piece (optional)
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

/**
 * Convert `units` expressed in packaging option `unitName` into base pieces.
 * - If packaging option not found, fallback: treat as pieces (1:1)
 * - Returns integer number of pieces
 */
productSchema.methods.unitsToPieces = function (unitName, units) {
  if (!units || units <= 0) return 0;
  const pkg = (this.packagingOptions || []).find(p => p.name === unitName);
  if (!pkg) {
    return Math.round(units); // assume pieces
  }
  return Math.round(units * pkg.piecesPerUnit);
};

/**
 * Convert pieces -> how many units are available in the packaging `unitName`
 * e.g. stock = 240 pieces, unit = 'carton' with piecesPerUnit=24 => 10 cartons available
 */
productSchema.methods.availableInUnit = function (unitName) {
  const pkg = (this.packagingOptions || []).find(p => p.name === unitName);
  if (!pkg) return Math.floor(this.stock); // pieces available
  return Math.floor(this.stock / pkg.piecesPerUnit);
};

/**
 * Find packaging option by name and return it or null.
 */
productSchema.methods.getPackaging = function (unitName) {
  return (this.packagingOptions || []).find(p => p.name === unitName) || null;
};

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
export default Product;
