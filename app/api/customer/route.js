import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

export async function GET() {
  try {
    await dbConnect();
    const customers = await Customer.find().sort({ memberNumber: 1 });
    return Response.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.dateOfBirth || !body.memberNumber || !body.interests) {
      return new Response("Missing required fields", { status: 400 });
    }
    
    // Check if member number already exists
    const existingCustomer = await Customer.findOne({ memberNumber: body.memberNumber });
    if (existingCustomer) {
      return new Response("Member number already exists", { status: 400 });
    }
    
    const customer = new Customer(body);
    await customer.save();
    return Response.json(customer, { status: 201 });
  } catch (error) {
    console.error("Error creating customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id, ...updateData } = body;
    
    if (!_id) {
      return new Response("Customer ID is required", { status: 400 });
    }
    
    const customer = await Customer.findByIdAndUpdate(_id, updateData, { new: true });
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { _id } = body;
    
    if (!_id) {
      return new Response("Customer ID is required", { status: 400 });
    }
    
    const customer = await Customer.findByIdAndDelete(_id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response("Customer deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
