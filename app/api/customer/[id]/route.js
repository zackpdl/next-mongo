import Customer from "@/models/Customer";
import dbConnect from "@/lib/db";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findById(params.id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
  } catch (error) {
    console.error("Error fetching customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    await dbConnect();
    const body = await request.json();
    const customer = await Customer.findByIdAndUpdate(params.id, body, { new: true });
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return Response.json(customer);
  } catch (error) {
    console.error("Error updating customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await dbConnect();
    const customer = await Customer.findByIdAndDelete(params.id);
    if (!customer) {
      return new Response("Customer not found", { status: 404 });
    }
    return new Response("Customer deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting customer:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
