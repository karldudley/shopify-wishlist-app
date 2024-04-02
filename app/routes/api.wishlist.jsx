import { json } from "@remix-run/node";
import db from "../db.server";
import { cors } from 'remix-utils/cors';

export async function loader({ request }) {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("customerId");
    const shop = url.searchParams.get("shop");
    const productId = url.searchParams.get("productId");

    if(!customerId || !shop || !productId) {
        return json({
            message: "Missing data. Required data: customerId, productId, shop",
            method: "GET",
            ok: false
        });
    }
    
    // If customerId, shop, productId is provided, return wishlist items for that customer.
    const wishlist = await db.wishlist.findMany({
        where: {
            customerId: customerId,
            shop: shop,
            productId: productId,
        },
    });

    const response = json({
        ok: true,
        message: "Success",
        data: wishlist,
    });

    return cors(request, response);
}

export async function action({ request }) {
    let data = await request.formData();
    data = Object.fromEntries(data);
    const customerId = data.customerId;
    const productId = data.productId;
    const shop = data.shop;
    const _action = data._action;

    if(!customerId || !productId || !shop) {
        return json({ 
            message: "Missing data. Required data: customerId, productId, shop",
            method: method
        });
    }

    let response;

    switch (_action) {
        case "CREATE":
            // Handle POST request
            const wishlist = await db.wishlist.create({
                data: {
                    customerId: customerId,
                    productId: productId,
                    shop: shop
                },
            });
            response = json({ message: "Product added to wishlist", method: _action, wishlisted: true });
            return cors(request, response);

        case "DELETE":
            // Handle DELETE request logic here
            await db.wishlist.deleteMany({
                where: {
                    customerId: customerId,
                    shop: shop,
                    productId: productId,
                },
            });
            response = json({
                message: "Product removed from your wishlist",
                method: _action,
                wishlisted: false,
            });
            return cors(request, response);
        default:
            return new Response("Method not allowed", { status: 405 });
    }
}