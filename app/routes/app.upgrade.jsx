import { authenticate, MONTHLY_PLAN } from "../shopify.server";


export const loader = async ({ request }) => {
  console.log('TESTING!!!...');
  const { billing, session } = await authenticate.admin(request);
  let { shop } = session;
  let myShop = shop.replace(".myshopify.com", "");
  console.log('TESTING!!!...');

  await billing.require({
    plans: [MONTHLY_PLAN],
    onFailure: async () => billing.request({
      plan: MONTHLY_PLAN,
      isTest: true,
      returnUrl: `https://admin.shopify.com/store/${myShop}/apps/${process.env.APP_NAME}/app/pricing`,
    }),
  });
  // App logic

  return null;
};