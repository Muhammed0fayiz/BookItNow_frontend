import React, { useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Loader2 } from 'lucide-react';
import { Stripe, StripeElements, PaymentIntent } from '@stripe/stripe-js';
import stripePromise from '@/app/utils/stripe';
import axiosInstance from '@/shared/axiousintance';

interface CheckoutFormProps {
  onPaymentSuccess: (paymentIntent: PaymentIntent) => void;
  onPaymentError: (error: string) => void;
  amount: number;
}

interface EventPaymentProps {
  amount: number;
  onSuccess: (paymentIntent: PaymentIntent) => void;
  onError: (error: string) => void;
  show: boolean;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onPaymentSuccess, onPaymentError, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required"
      });

      if (result.error) {
        onPaymentError(result.error.message || 'An unknown error occurred');
      } else if (result.paymentIntent) {
        onPaymentSuccess(result.paymentIntent);
      }
    } catch (error) {
      onPaymentError('An error occurred while processing your payment');
    }

    setProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <PaymentElement className="mb-4" />
      <button
        type="submit"
        disabled={!stripe || processing}
        className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold 
          ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90 transition-all duration-300 transform hover:scale-105'}`}
      >
        {processing ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Processing...
          </div>
        ) : (
          `Pay ₹${amount}`
        )}
      </button>
    </form>
  );
};

const EventPayment: React.FC<EventPaymentProps> = ({ amount, onSuccess, onError, show }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  React.useEffect(() => {
    if (show) {
        
      const fetchPaymentIntent = async () => {
        try {
          const response = await axiosInstance.post('/payment/create-payment-intent', { 
            amount 
          });
          setClientSecret(response.data.clientSecret);
        } catch (error) {
          onError('Failed to initialize payment');
        }
      };

      fetchPaymentIntent();
    }
  }, [amount, show, onError]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 max-w-xl w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Payment</h2>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm 
              amount={amount}
              onPaymentSuccess={onSuccess}
              onPaymentError={onError}
            />
          </Elements>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            <p className="mt-4 text-gray-600">Preparing payment form...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventPayment;