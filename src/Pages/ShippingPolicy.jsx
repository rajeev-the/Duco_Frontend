import React from "react";
import PolicyLayout from "../Components/PolicyLayout";

export default function ShippingPolicy() {
  return (
    <PolicyLayout title="Shipping Policy">
      <p>This policy explains how we process and deliver orders.</p>
      <h2>Processing Time</h2>
      <p>1–2 business days for standard orders; custom items may take longer.</p>
      <h2>Delivery Timelines</h2>
      <p>Metro: 2–4 days. Non-metro: 3–7 days.</p>
      <h2>Contact</h2>
      <p>Email: shipping@yourbrand.com</p>
    </PolicyLayout>
  );
}