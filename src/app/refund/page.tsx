import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy | Petrolia Liquor Store',
  description: 'Refund Policy for Petrolia Liquor Store. All sales are final.',
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            Refund policy
          </h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-[30px] py-[40px] md:py-[60px]">
        <div className="prose prose-sm md:prose-base max-w-none text-[var(--color-text-primary)] leading-relaxed space-y-8">
          <div>
            <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mb-4">Damages and issues</h2>
            <p>
              Please inspect your order upon reception and contact us immediately if the item is defective, damaged or if you receive the wrong item, so that we can evaluate the issue and make it right.
            </p>
          </div>

          <div>
            <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mb-4">Refunds, Returns and Exchanges</h2>
            <p className="text-lg font-medium">
              All sales are final.
            </p>
            <p className="mt-4">
              For further information please contact us at <a href="mailto:petrolialiquorstore@gmail.com" className="text-[var(--color-primary)] hover:underline">petrolialiquorstore@gmail.com</a>. Thank you.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
