import React from 'react';
import { Shield, FileText } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200/60 p-8 sm:p-12">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <div className="p-3 bg-primary/10 rounded-xl">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
        </div>

        <div className="space-y-8 text-gray-600">
          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">2. Use License</h2>
            <p>
              Permission is granted to temporarily download one copy of the materials (information or software) on brgrhut's website for personal, non-commercial transitory viewing only.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">3. Disclaimer</h2>
            <p>
              The materials on brgrhut's website are provided on an 'as is' basis. brgrhut makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">4. Limitations</h2>
            <p>
              In no event shall brgrhut or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on brgrhut's website.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">5. Revisions and Errata</h2>
            <p>
              The materials appearing on brgrhut's website could include technical, typographical, or photographic errors. brgrhut does not warrant that any of the materials on its website are accurate, complete, or current.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
