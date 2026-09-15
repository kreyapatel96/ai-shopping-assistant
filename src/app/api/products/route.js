import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ai-shopping-assistant");

    const products = await db
      .collection("products")
      .find({})
      .toArray();

    return Response.json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);

    return Response.json(
      {
        success: false,
        message: "Failed to fetch products",
      },
      { status: 500 }
    );
  }
}