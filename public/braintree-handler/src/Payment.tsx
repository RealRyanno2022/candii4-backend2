import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import braintree from 'braintree-web-drop-in';
import './Payment.css';

interface FormErrors {
  [key: string]: string | null;
}

const Payment: React.FC = () => {
  const [clientToken, setClientToken] = useState<string | null>(null);
  const dropinContainer = useRef<HTMLDivElement>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // ... rest of your code

  const validateForm = () => {
    const errors: FormErrors = {};
    const form = document.getElementById("paymentForm") as HTMLFormElement;

    Array.from(form.elements as HTMLFormControlsCollection).forEach((input: HTMLInputElement) => {
      if (!input.value) {
        errors[input.name] = 'This field is required.';
      }
    });

    setFormErrors(errors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormErrors(prevState => ({ ...prevState, [e.target.name]: null }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    validateForm();
  };

  return (
    <div ref={dropinContainer}>
      <form id="paymentForm" onSubmit={handleFormSubmit}>
        <input name="name" type="text" placeholder="Card Holder Name" onChange={handleChange} className={formErrors.name ? "input-error" : ""} />
        <input name="card" type="text" placeholder="Card Number" onChange={handleChange} className={formErrors.card ? "input-error" : ""} />
        <input name="expiry" type="text" placeholder="Expiry Date" onChange={handleChange} className={formErrors.expiry ? "input-error" : ""} />
        <input name="cvv" type="text" placeholder="CVV" onChange={handleChange} className={formErrors.cvv ? "input-error" : ""} />
        <button id="submit-button" type="submit">Confirm Payment</button>
      </form>
    </div>
  );
};

export default Payment;
