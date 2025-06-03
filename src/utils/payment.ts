import axios from "axios";
import { MIDTRANS_SERVER_KEY, MIDTRANS_TRANSACTION_URL } from "./env";

export interface Payment {
  transaction_details: {
    gross_amount: number;
    order_id: string;
  };
  customer_details: {
    first_name: string;
    email: string;
    phone: string;
  };
}

export type TypeResponseMidtrans = {
  token: string;
  redirect_url: string;
};

export default {
  async createLink(payload: Payment): Promise<TypeResponseMidtrans> {
    const result = await axios.post<TypeResponseMidtrans>(
      `${MIDTRANS_TRANSACTION_URL}`,
      payload,
      {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${Buffer.from(
            `${MIDTRANS_SERVER_KEY}:`
          ).toString("base64")}`,
        },
      }
    );
    if (result.status !== 201) {
      throw new Error("payment failed");
    }
    return result?.data;
  },
};
