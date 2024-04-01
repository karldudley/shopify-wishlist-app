import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader() {


    return json({ 
        message: "Hello from the API",
        ok: true
    });
    // provides data to the component
}

export async function action({ request }) {
    const method = request.method;
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;

    if(!customerId || !productId || !shop) {
        return json({ 
            message: "Missing data. Required data: customerId, productId, shop",
            method: method
        });
    }

    switch (method) {
        case "POST":
            // Handle POST request
            const wishlist = await db.wishlist.create({
                data: {
                    customerId: customerId,
                    productId: productId,
                    shop: shop
                },
            });
            const response = json({
                message: "Wishlist item created",
                method: "POST",
                wishlist: wishlist
            });
            return cors(request, response);

        case "PATCH":
            // Handle PATCH request
            return json({ message: "PATCH request received", method: "PATCH" });
        default:
            return new Response("Method not allowed", { status: 405 });
    }
}