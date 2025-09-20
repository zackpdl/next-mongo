import Stock from "@/models/Stock";
import Product from "@/models/Product";
import dbConnect from "@/lib/db";

export async function GET(request) {
  await dbConnect();
  
  const pno = request.nextUrl.searchParams.get("pno");
  const s = request.nextUrl.searchParams.get("s");
  const status = request.nextUrl.searchParams.get("status");
  
  let query = {};
  
  // Search by product name
  if (s) {
    const products = await Product.find({ name: { $regex: s, $options: 'i' } });
    const productIds = products.map(p => p._id);
    query.product = { $in: productIds };
  }
  
  // Filter by status
  if (status) {
    query.status = status;
  }
  
  // Pagination
  if (pno) {
    const size = 10;
    const startIndex = (pno - 1) * size;
    const stocks = await Stock.find(query)
      .populate('product')
      .sort({ lastUpdated: -1 })
      .skip(startIndex)
      .limit(size);
    return Response.json(stocks);
  }
  
  const stocks = await Stock.find(query)
    .populate('product')
    .sort({ lastUpdated: -1 });
  
  return Response.json(stocks);
}

export async function POST(request) {
  await dbConnect();
  
  const body = await request.json();
  
  // Check if stock already exists for this product
  const existingStock = await Stock.findOne({ product: body.product });
  if (existingStock) {
    return Response.json({ error: "Stock already exists for this product" }, { status: 400 });
  }
  
  const stock = await Stock.create(body);
  await stock.populate('product');
  
  return Response.json(stock, { status: 201 });
}

export async function PUT(request) {
  await dbConnect();
  
  const body = await request.json();
  const { _id, ...updateData } = body;
  
  const stock = await Stock.findByIdAndUpdate(_id, updateData, { new: true })
    .populate('product');
  
  if (!stock) {
    return Response.json({ error: "Stock not found" }, { status: 404 });
  }
  
  return Response.json(stock);
}
