import { json } from "@remix-run/node";

export async function loader() {


    return json({ 
        message: "Hello from the API",
        ok: true
    });
    // provides data to the component
}

export async function action({ request }) {
    const method = request.method;

    switch (method) {
        case "POST":
            return json({ message: "POST request received", method: "POST" });
        case "PATCH":
            return json({ message: "PATCH request received", method: "PATCH" });
        default:
            return new Response("Method not allowed", { status: 405 });
    }
}