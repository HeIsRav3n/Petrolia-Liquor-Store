import { STORE_INFO } from '@/lib/data';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us | Petrolia Liquor Store',
  description: 'Learn about Petrolia Liquor Store — your trusted local liquor store in Petrolia, Ontario.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-primary-light py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            About Us
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Your trusted local destination for premium spirits, fine wines, craft beers, and more.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-12 md:py-20">
        {/* Story */}
        <div className="prose prose-lg max-w-none">
          <div className="bg-surface rounded-2xl p-8 md:p-12 mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Story
            </h2>
            <p className="text-text-secondary leading-relaxed mb-4">
              Petrolia Liquor Store’s journey began in December of 1993 when four friends came together to venture into the liquor store business. The business was not just about the four partners but more about the families of these partners and the community. The support of the community is what makes Petrolia Liquor Store what it is today. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              The establishment was later passed down to the children of these four friends and continues to be a family-owned business. It is through this store that these four friends became a family that will continue on for many generations to come. 
            </p>
            <p className="text-text-secondary leading-relaxed mb-4">
              Here at Petrolia, we strive to treat each customer with warm and personalized service. It is through our store’s product selection, competitive pricing, and friendly customer service that our business continues to evolve.
            </p>
          </div>

          {/* Values */}
          <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8 text-center" style={{ fontFamily: 'var(--font-heading)' }}>
            Why Choose Us
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: (
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                  </svg>
                ),
                title: 'Premium Selection',
                text: 'Curated products from top brands worldwide, from everyday favourites to rare finds.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                  </svg>
                ),
                title: 'Friendly Service',
                text: 'Our staff is always happy to help with recommendations and answer your questions.',
              },
              {
                icon: (
                  <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                ),
                title: 'Easy Ordering',
                text: 'Simply browse our inventory online and call us to place your order. Quick and personal.',
              },
            ].map((item, i) => (
              <div key={i} className="bg-surface rounded-xl p-6 text-center hover:shadow-lg transition-shadow duration-300">
                <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-primary mb-2">{item.title}</h3>
                <p className="text-text-secondary text-sm">{item.text}</p>
              </div>
            ))}
          </div>

          {/* Store info */}
          <div className="bg-gradient-to-r from-primary to-primary-light rounded-2xl p-8 md:p-12 text-center">
            <h3 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Visit Us Today
            </h3>
            <p className="text-white/70 mb-4">{STORE_INFO.address}</p>
            <a href={`tel:${STORE_INFO.phone}`} className="btn-call inline-flex text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {STORE_INFO.phoneDisplay}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
