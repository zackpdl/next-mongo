import Stock from "@/models/Stock";
import dbConnect from "@/lib/db";

export async function POST(request) {
  await dbConnect();
  
  const { stockId, adjustment, reason, type } = await request.json();
  
  if (!stockId || adjustment === undefined || !type) {
    return Response.json({ error: "Missing required fields" }, { status: 400 });
  }
  
  const stock = await Stock.findById(stockId);
  
  if (!stock) {
    return Response.json({ error: "Stock not found" }, { status: 404 });
  }
  
  let newQuantity = stock.quantity;
  
  if (type === 'add') {
    newQuantity += adjustment;
  } else if (type === 'subtract') {
    newQuantity -= adjustment;
  } else if (type === 'set') {
    newQuantity = adjustment;
  } else {
    return Response.json({ error: "Invalid adjustment type" }, { status: 400 });
  }
  
  if (newQuantity < 0) {
    return Response.json({ error: "Quantity cannot be negative" }, { status: 400 });
  }
  
  stock.quantity = newQuantity;
  stock.notes = reason ? `${stock.notes || ''}\n${new Date().toISOString()}: ${reason}`.trim() : stock.notes;
  
  await stock.save();
  await stock.populate('product');
  
  return Response.json(stock);
}
