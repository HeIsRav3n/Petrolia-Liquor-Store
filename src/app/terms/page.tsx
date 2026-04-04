import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Petrolia Liquor Store',
  description: 'Terms of Service for Petrolia Liquor Store.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            Terms of service
          </h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-[30px] py-[40px] md:py-[60px]">
        <div className="prose prose-sm md:prose-base max-w-none text-[var(--color-text-primary)] leading-relaxed space-y-6">
          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">OVERVIEW</h2>
            <p>This website is operated by Petrolia Liquor Store. Throughout the site, the terms “we”, “us” and “our” refer to Petrolia Liquor Store. Petrolia Liquor Store offers this website, including all information, tools and services available from this site to you, the user, conditioned upon your acceptance of all terms, conditions, policies and notices stated here.</p>
            <p>By visiting our site and/ or purchasing something from us, you engage in our “Service” and agree to be bound by the following terms and conditions (“Terms of Service”, “Terms”), including those additional terms and conditions and policies referenced herein and/or available by hyperlink. These Terms of Service apply to all users of the site, including without limitation users who are browsers, vendors, customers, merchants, and/ or contributors of content.</p>
            <p>Please read these Terms of Service carefully before accessing or using our website. By accessing or using any part of the site, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions of this agreement, then you may not access the website or use any services. If these Terms of Service are considered an offer, acceptance is expressly limited to these Terms of Service.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 1 - ONLINE STORE TERMS</h2>
            <p>By agreeing to these Terms of Service, you represent that you are at least the age of majority in your state or province of residence, or that you are the age of majority in your state or province of residence and you have given us your consent to allow any of your minor dependents to use this site.</p>
            <p>You may not use our products for any illegal or unauthorized purpose nor may you, in the use of the Service, violate any laws in your jurisdiction (including but not limited to copyright laws).</p>
            <p>You must not transmit any worms or viruses or any code of a destructive nature.</p>
            <p>A breach or violation of any of the Terms will result in an immediate termination of your Services.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 2 - GENERAL CONDITIONS</h2>
            <p>We reserve the right to refuse service to anyone for any reason at any time.</p>
            <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service or any contact on the website through which the service is provided, without express written permission by us.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 3 - ACCURACY, COMPLETENESS AND TIMELINESS OF INFORMATION</h2>
            <p>We are not responsible if information made available on this site is not accurate, complete or current. The material on this site is provided for general information only and should not be relied upon or used as the sole basis for making decisions without consulting primary, more accurate, more complete or more timely sources of information. Any reliance on the material on this site is at your own risk.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 4 - MODIFICATIONS TO THE SERVICE AND PRICES</h2>
            <p>Prices for our products are subject to change without notice.</p>
            <p>We reserve the right at any time to modify or discontinue the Service (or any part or content thereof) without notice at any time.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 5 - PRODUCTS OR SERVICES</h2>
            <p>Certain products or services may be available exclusively online through the website. These products or services may have limited quantities and are subject to return or exchange only according to our Return Policy.</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 12 - PROHIBITED USES</h2>
            <p>In addition to other prohibitions as set forth in the Terms of Service, you are prohibited from using the site or its content: (a) for any unlawful purpose; (b) to solicit others to perform or participate in any unlawful acts; (c) to violate any international, federal, provincial or state regulations, rules, laws, or local ordinances; (d) to infringe upon or violate our intellectual property rights or the intellectual property rights of others...</p>
          </section>

          <section>
            <h2 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mb-2">SECTION 20 - CONTACT INFORMATION</h2>
            <p>Questions about the Terms of Service should be sent to us at <a href="mailto:petrolialiquorstore@gmail.com" className="text-[var(--color-primary)] hover:underline">petrolialiquorstore@gmail.com</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
