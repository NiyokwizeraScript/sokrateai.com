import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SokrateLogo } from "@/components/auth/SokrateLogo";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Logo = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    width="14px"
    height="16px"
    viewBox="0 0 14 16"
    version="1.1"
    className="inline-block mr-2"
  >
    <defs />
    <g id="Flow" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <g
        id="0-Default"
        transform="translate(-121.000000, -40.000000)"
        fill="#E184DF"
      >
        <path
          d="M127,50 L126,50 C123.238576,50 121,47.7614237 121,45 C121,42.2385763 123.238576,40 126,40 L135,40 L135,56 L133,56 L133,42 L129,42 L129,56 L127,56 L127,50 Z M127,48 L127,42 L126,42 C124.343146,42 123,43.3431458 123,45 C123,46.6568542 124.343146,48 126,48 L127,48 Z"
          id="Pilcrow"
        />
      </g>
    </g>
  </svg>
);

const ProductDisplay = () => (
  <div className="flex flex-col items-center">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-heading font-bold mb-2">Sokrate AI Pro</h1>
      <p className="text-xl text-gray-600">US$19.00 / month</p>
    </div>
    <form
      action="/api/create-checkout-session"
      method="POST"
      className="w-full max-w-sm"
    >
      <input
        type="hidden"
        name="lookup_key"
        value="price_1T1zskPu6EUSAVsl2dymo8KQ"
      />
      <Button
        type="submit"
        size="lg"
        className="w-full text-lg py-6 shadow-lg bg-indigo-600 hover:bg-indigo-700 text-white"
      >
        Checkout
      </Button>
    </form>
    <div className="mt-8 text-sm text-gray-400">
      Powered by Stripe using standard checkout.
    </div>
  </div>
);

const SuccessDisplay = ({ sessionId }: { sessionId: string }) => {
  return (
    <div className="text-center">
      <div className="mb-8">
        <SokrateLogo size="lg" className="justify-center mb-4" />
        <h3 className="text-2xl font-bold text-green-600">
          Subscription Successful!
        </h3>
        <p className="text-gray-600 mt-2">Welcome to Sokrate AI Pro.</p>
      </div>
      <form action="/create-portal-session" method="POST">
        <input
          type="hidden"
          id="session-id"
          name="session_id"
          value={sessionId}
        />
        <Button id="checkout-and-portal-button" type="submit" variant="outline">
          Manage your billing information
        </Button>
      </form>
      <div className="mt-8">
        <Button asChild className="bg-primary text-white">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
};

const Message = ({ message }: { message: string }) => (
  <section className="text-center">
    <p className="text-yellow-600 bg-yellow-50 p-4 rounded-lg">{message}</p>
    <div className="mt-4">
      <Button asChild variant="ghost">
        <Link to="/pricing-selection">Return to Plans</Link>
      </Button>
    </div>
  </section>
);

export default function CheckoutPro() {
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    if (searchParams.get("success")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuccess(true);
      setSessionId(searchParams.get("session_id") || "");
    }

    if (searchParams.get("canceled")) {
      setSuccess(false);
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready.",
      );
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-lg p-8 rounded-2xl border border-slate-100 shadow-2xl">
        {!success && message === "" ? (
          <ProductDisplay />
        ) : success && sessionId !== "" ? (
          <SuccessDisplay sessionId={sessionId} />
        ) : (
          <Message message={message} />
        )}

        {!success && (
          <div className="mt-6 text-center">
            <Link
              to="/pricing-selection"
              className="text-sm text-gray-500 hover:text-gray-900"
            >
              Cancel and return
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
