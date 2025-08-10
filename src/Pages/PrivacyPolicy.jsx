import React from "react";
import PolicyLayout from "../Components/PolicyLayout";

export default function PrivacyPolicy() {
  return (
    <PolicyLayout title="Privacy Policy">
      <p>
        This Privacy Policy explains how <strong>YourBrand</strong> collects, uses, and protects your information when you use our services.
      </p>
      <h2>Information We Collect</h2>
      <ul>
        <li>Personal data: name, email, phone, address.</li>
        <li>Order data: items purchased, transaction details.</li>
        <li>Usage data: IP address, device info, pages visited.</li>
      </ul>
      <h2>How We Use Your Information</h2>
      <ul>
        <li>To process orders and communicate with you.</li>
        <li>To improve our services and customer experience.</li>
        <li>To send updates and marketing (with your consent).</li>
      </ul>
      <h2>Contact</h2>
      <p>Email: support@yourbrand.com</p>
    </PolicyLayout>
  );
}
