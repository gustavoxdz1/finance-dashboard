import { NextResponse } from "next/server";
import { plaidClient } from "@/app/lib/plaid";
import { CountryCode, Products } from "plaid";

export async function POST() {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: {
        client_user_id: "user-id-temporario",
      },
      client_name: "Finance Dashboard",
      products: [Products.Transactions],
      country_codes: [CountryCode.Us],
      language: "en",
    });

    return NextResponse.json({
      link_token: response.data.link_token,
    });
  } catch (error) {
    console.log("Erro ao criar link token", error);
    return NextResponse.json(
      { error: "Erro ao criar link token" },
      { status: 500 },
    );
  }
}
