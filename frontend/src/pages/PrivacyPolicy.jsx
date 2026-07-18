import React from 'react';
import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="p-3 bg-primary/10 rounded-xl">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
        </div>

        <div className="space-y-8 text-gray-600">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">1. Information We Collect</h2>
            <p>
              We collect information you provide directly to us, such as when you create or modify your account, request on-demand services, contact customer support, or otherwise communicate with us. This information may include: name, email, phone number, postal address, profile picture, payment method, and other information you choose to provide.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">2. How We Use Information</h2>
            <p>
              We use the information we collect about you to provide, maintain, and improve our services, such as to facilitate payments, send receipts, provide products and services you request (and send related information), develop new features, provide customer support to Users and Drivers, develop safety features, authenticate users, and send product updates and administrative messages.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">3. Sharing of Information</h2>
            <p>
              We may share the information we collect about you as described in this Statement or as described at the time of collection or sharing, including as follows: with our affiliates and subsidiaries, with third parties to provide you a service you requested through a partnership or promotional offering made by a third party or us, with the general public if you submit content in a public forum, such as blog comments, social media posts, or other features of our Services that are viewable by the general public.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">4. Security</h2>
            <p>
              We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">5. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Statement, please contact us at support@brgrhut.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
