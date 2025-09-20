import Stock from "@/models/Stock";
import dbConnect from "@/lib/db";

export async function GET(request, { params }) {
  await dbConnect();
  
  const stock = await Stock.findById(params.id).populate('product');
  
  if (!stock) {
    return Response.json({ error: "Stock not found" }, { status: 404 });
  }
  
  return Response.json(stock);
}

export async function DELETE(request, { params }) {
  await dbConnect();
  
  const stock = await Stock.findByIdAndDelete(params.id);
  
  if (!stock) {
    return Response.json({ error: "Stock not found" }, { status: 404 });
  }
  
  return Response.json({ message: "Stock deleted successfully" });
}

export async function PUT(request, { params }) {
  await dbConnect();
  
  const body = await request.json();
  
  const stock = await Stock.findByIdAndUpdate(params.id, body, { new: true })
    .populate('product');
  
  if (!stock) {
    return Response.json({ error: "Stock not found" }, { status: 404 });
  }
  
  return Response.json(stock);
}
