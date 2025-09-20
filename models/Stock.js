import mongoose from "mongoose";

const stockSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "product",
    required: true
  },
  quantity: { 
    type: Number, 
    required: true,
    default: 0
  },
  minQuantity: { 
    type: Number, 
    required: true,
    default: 0
  },
  maxQuantity: { 
    type: Number, 
    required: true,
    default: 100
  },
  location: { 
    type: String, 
    required: true,
    default: "Main Warehouse"
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock', 'discontinued'],
    default: 'in-stock'
  },
  notes: String
});

// Update status based on quantity
stockSchema.pre('save', function(next) {
  if (this.quantity <= 0) {
    this.status = 'out-of-stock';
  } else if (this.quantity <= this.minQuantity) {
    this.status = 'low-stock';
  } else {
    this.status = 'in-stock';
  }
  this.lastUpdated = new Date();
  next();
});

const Stock = mongoose.models.stock || mongoose.model("stock", stockSchema);

export default Stock;
