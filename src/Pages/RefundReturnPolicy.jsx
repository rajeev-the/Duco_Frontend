import React from "react";
import PolicyLayout from "../Components/PolicyLayout";

export default function RefundReturnPolicy() {
  return (
    <PolicyLayout title="Refund & Return Policy">
      <p>We want you to love your purchase. If you are not satisfied, please read this policy.</p>
      <h2>Eligibility</h2>
      <ul>
        <li>Requests must be raised within 7 days of delivery.</li>
        <li>Items must be unused and in original packaging.</li>
      </ul>
      <h2>Refunds</h2>
      <p>Refunds are processed within 5–7 business days after inspection.</p>
      <h2>Contact</h2>
      <p>Email: returns@yourbrand.com</p>
    </PolicyLayout>
  );
}
