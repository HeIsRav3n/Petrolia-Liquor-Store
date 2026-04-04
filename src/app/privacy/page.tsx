import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Petrolia Liquor Store',
  description: 'Privacy Policy for Petrolia Liquor Store. Learn how we collect, use, and disclose your personal information.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white pb-[60px]">
      <div className="bg-white border-b border-[var(--color-border)]">
        <div className="max-w-[1060px] mx-auto px-4 md:px-[30px] py-[30px] md:py-[45px]">
          <h1 className="text-[2em] md:text-[2.5em] font-serif uppercase text-[var(--color-primary)] mb-[10px]">
            Privacy policy
          </h1>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto px-4 md:px-[30px] py-[40px] md:py-[60px]">
        <div className="prose prose-sm md:prose-base max-w-none text-[var(--color-text-primary)] leading-relaxed space-y-6">
          <p>
            This Privacy Policy describes how www.petrolialiquorstore.com (the “Site” or “we”) collects, uses, and discloses your Personal Information when you visit or make a purchase from the Site.
          </p>

          <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mt-10 mb-4">Collecting Personal Information</h2>
          <p>
            When you visit the Site, we collect certain information about your device, your interaction with the Site, and information necessary to process your purchases. We may also collect additional information if you contact us for customer support. In this Privacy Policy, we refer to any information that can uniquely identify an individual (including the information below) as “Personal Information”. See the list below for more information about what Personal Information we collect and why.
          </p>

          <h3 className="text-[1.2em] font-serif uppercase text-[var(--color-primary)] mt-8 mb-2">Device information</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Examples of Personal Information collected:</strong> version of web browser, IP address, time zone, cookie information, what sites or products you view, search terms, and how you interact with the Site.</li>
            <li><strong>Purpose of collection:</strong> to load the Site accurately for you, and to perform analytics on Site usage to optimize our Site.</li>
            <li><strong>Source of collection:</strong> Collected automatically when you access our Site using cookies, log files, web beacons, tags, or pixels.</li>
          </ul>

          <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mt-10 mb-4">Do Not Track</h2>
          <p>
            Please note that because there is no consistent industry understanding of how to respond to “Do Not Track” signals, we do not alter our data collection and usage practices when we detect such a signal from your browser.
          </p>

          <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mt-10 mb-4">Changes</h2>
          <p>
            We may update this Privacy Policy from time to time in order to reflect, for example, changes to our practices or for other operational, legal, or regulatory reasons.
          </p>

          <h2 className="text-[1.5em] font-serif uppercase text-[var(--color-primary)] mt-10 mb-4">Contact</h2>
          <p>
            For more information about our privacy practices, if you have questions, or if you would like to make a complaint, please contact us by e-mail at petrolialiquorstore@gmail.com or by mail using the details provided below:
          </p>
          <p className="border-l-4 border-[var(--color-primary)] pl-4 italic">
            510763 Alberta LTD. O/A Petrolia Liquor Store , 11431 40 Avenue Northwest, Edmonton AB T6J0R4, Canada.
          </p>
        </div>
      </div>
    </div>
  );
}
