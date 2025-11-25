import PageHeader from '../components/PageHeader';
import FAQAccordion from '../components/FAQAccordion';
import NewsletterSignup from '../components/NewsletterSignup';
import { faqs } from '../data/faqs';

const FAQ = () => {
  return (
    <div>
      <PageHeader
        eyebrow="Help Center"
        title="Frequently Asked Questions"
        subtitle="Everything you need to know about Patronum Esports, our teams, creators, and partnership opportunities."
      />

      <div className="max-w-4xl mx-auto px-6 lg:px-8 pb-20">
        {/* FAQ Accordion */}
        <FAQAccordion faqs={faqs} />

        {/* Still Have Questions */}
        <div className="mt-16 pt-16 border-t border-slate-800/50">
          <div className="bg-gradient-to-br from-violet-900/20 to-purple-900/20 border border-violet-500/30 rounded-3xl p-8 md:p-12 text-center">
            <div className="text-4xl mb-4">💬</div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-slate-400 mb-6 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our team is here to help.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="mailto:info@patronumesports.com"
                className="px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-2xl hover:shadow-violet-500/50 transition-all duration-300 hover:-translate-y-1"
              >
                Contact Us
              </a>
              <a
                href="/join-us"
                className="px-8 py-3 bg-white/5 border border-white/10 rounded-lg font-semibold hover:bg-white/10 hover:border-violet-200 transition-all backdrop-blur-sm hover:-translate-y-1"
              >
                Join Our Team
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <a
            href="/competitive-esports"
            className="group bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
          >
            <div className="text-2xl mb-3">🏆</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-violet-400 transition-colors">
              Competitive Teams
            </h3>
            <p className="text-sm text-slate-400">
              Learn about our roster and tournament performance
            </p>
          </a>

          <a
            href="/creators-partners"
            className="group bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            <div className="text-2xl mb-3">🎥</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-purple-400 transition-colors">
              Creator Program
            </h3>
            <p className="text-sm text-slate-400">
              Discover creator opportunities and partnerships
            </p>
          </a>

          <a
            href="/media-coverage"
            className="group bg-brand-card backdrop-blur-xl rounded-xl p-6 border border-slate-800/50 hover:border-violet-500/50 transition-all hover:shadow-xl hover:shadow-violet-500/20 hover:-translate-y-1"
          >
            <div className="text-2xl mb-3">📹</div>
            <h3 className="text-lg font-bold mb-2 group-hover:text-violet-400 transition-colors">
              Media & Content
            </h3>
            <p className="text-sm text-slate-400">
              Watch highlights and tournament coverage
            </p>
          </a>
        </div>

        {/* Newsletter */}
        <div className="mt-16">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
};

export default FAQ;
