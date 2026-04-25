import { NextResponse } from "next/server";
import { plaidClient } from "@/app/lib/plaid";
import { Prisma } from "@prisma/client/extension";
import { prisma } from "@/app/lib/prisma";

export async function POST(request: Request) {
  try {
    const { public_token, userId } = await request.json();

    const exchangeResponse = await plaidClient.itemPublicTokenExchange({
      public_token,
    });

    const accessToken = exchangeResponse.data.access_token;
    const itemId = exchangeResponse.data.item_id;

    const itemResponse = await plaidClient.itemGet({
      access_token: accessToken,
    });

    const instituitionId = itemResponse.data.item.institution_id;

    //salvar a conta no db
    const account = await prisma.account.create({
      data: {
        userId,
        plaidItemId: itemId,
        accessToken,
        bankName: instituitionId ?? "Banco desconhecido",
      },
    });

    return NextResponse.json({ account });
  } catch (error) {
    console.log("Erro ao trocar para token de acesso", error);
    return NextResponse.json(
      { error: "Erro ao trocar token" },
      { status: 500 },
    );
  }
}
