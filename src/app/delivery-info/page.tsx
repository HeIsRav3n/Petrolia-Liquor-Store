import Link from 'next/link';

export default function DeliveryInfoPage() {
  return (
    <div className="min-h-screen bg-[var(--color-background)] pt-[40px] pb-[80px]">
      <div className="max-w-[800px] mx-auto px-4 md:px-[30px]">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-[2.5em] md:text-[3.5em] font-serif uppercase tracking-wider text-[var(--color-primary)] mb-4">
            Delivery & Curbside
          </h1>
          <p className="text-[18px] text-[var(--color-text-secondary)]">
            Everything you need to know about receiving your order.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white border border-[var(--color-border)] rounded-lg p-6 md:p-10 shadow-sm space-y-10">
          
          <section className="space-y-4">
            <div className="bg-[var(--color-primary)] text-white p-4 rounded text-center">
              <p className="font-medium text-lg mb-1">Delivery is available everyday 4pm to 6pm</p>
              <p className="font-bold">Call us at <a href="tel:7804380448" className="underline hover:text-gray-200">780-438-0448</a> before placing order to confirm items in stock!</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Curbside Pickup
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed">
              When selecting In Store/ Curbside Pickup, you will be notified when your order is ready for pickup. When you receive the notification, proceed to Petrolia Liquor Store at <a href="https://maps.google.com?daddr=11431 40 Ave NW,Edmonton , AB," target="_blank" rel="noopener noreferrer" className="text-[var(--color-primary)] font-medium hover:underline">11431 40 Ave NW, Edmonton</a>. Upon arrival, call us at <a href="tel:7804380448" className="text-[var(--color-primary)] font-medium hover:underline">780-438-0448</a> and one of our staff members will bring the order to your vehicle.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Local Delivery
            </h2>
            <div className="text-[var(--color-text-primary)] leading-relaxed space-y-4">
              <p>Local Deliveries must be made to a home, or business address where you work.</p>
              <p>Delivery is available everyday 4pm to 6pm.</p>
              <p>Our Pro Serve trained drivers will ask for a valid government issued ID.</p>
              <p>Those who look under 30 will be asked to showcase a valid government issued ID. Upon delivery, you may be asked to provide the credit card used to make the purchase.</p>
              <p className="bg-orange-50 p-3 rounded border border-orange-100 text-orange-800">
                <span className="font-bold">Important:</span> Failure to provide either could prevent your driver from completing your delivery. A $15 restocking fee may be applied for non-compliance.
              </p>
              <p>Please note, the person placing the order must be home to receive it.</p>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              COVID-19 Precautions
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed">
              Please show your ID through your front door window or screen door. Once confirmed of age and that you placed the order, our drivers will leave on your doorstep to comply with the 2 metre physical distancing requirements.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Cancellations
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed">
              If an order has already left the store, cancellations are not guaranteed and may be subject to a $15 restocking fee.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Damages and issues
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed">
              Please inspect your order upon collection and contact us immediately if the item is defective, damaged or if you have received the wrong item.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-serif text-[var(--color-primary)] border-b border-[var(--color-border)] pb-2">
              Refunds, Returns and Exchanges
            </h2>
            <p className="text-[var(--color-text-primary)] leading-relaxed">
              All sales are final. For further information please contact us at <a href="mailto:petrolialiquorstore@gmail.com" className="text-[var(--color-primary)] font-medium hover:underline">petrolialiquorstore@gmail.com</a>.
            </p>
          </section>

        </div>

        <div className="mt-12 text-center">
          <Link href="/products" className="btn-primary inline-flex items-center gap-2">
            Continue Shopping
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
