import {
  Box,
  Card,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  TextField,
  Button,
} from "@shopify/polaris";
import { json } from "@remix-run/node";
import { useState } from "react";
import { useLoaderData, Form } from "@remix-run/react";

// import prisma db
import db from "../db.server";

export async function loader() {
  // dummy data before database connection
  // let settings = {
  //   name: "My app name",
  //   description: "App description",
  // };

  // get data from database
  let settings = await db.settings.findFirst();
  console.log("settings------>", settings);
  return json(settings);
}

export async function action({ request}) {
  // updates persistent data
  let settings = await request.formData();
  settings = Object.fromEntries(settings);

  // update data in database
  await db.settings.upsert({
    where: { id: '1' },
    create: {
      id: '1',
      name: settings.name,
      description: settings.description,
    },
    update: {
      id: '1',
      name: settings.name,
      description: settings.description,
    
    },
  
  })


  return json(settings);
}


export default function SettingsPage() {
  const settings = useLoaderData();

  const [formState, setFormState] = useState(settings);

  return (
    <Page>
      <ui-title-bar title="Settings" />
      <BlockStack gap={{ xs: "800", sm: "400" }}>
        <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
          <Box
            as="section"
            paddingInlineStart={{ xs: 400, sm: 0 }}
            paddingInlineEnd={{ xs: 400, sm: 0 }}
          >
            <BlockStack gap="400">
              <Text as="h3" variant="headingMd">
                Settings
              </Text>
              <Text as="p" variant="bodyMd">
                Update apps settings and preferences.
              </Text>
            </BlockStack>
          </Box>
          <Card roundedAbove="sm">
            <Form method="POST">
              <BlockStack gap="400">
                <TextField label="App name" name="name" value={formState?.name} onChange={(value) => setFormState({...formState, name: value})}/>
                <TextField label="Description" name="description" value={formState?.description} onChange={(value) => setFormState({...formState, description: value})}/>
                <Button submit={true}>Save</Button>
              </BlockStack>
            </Form>
          </Card>
        </InlineGrid>
      </BlockStack>
    </Page>
  );
}
