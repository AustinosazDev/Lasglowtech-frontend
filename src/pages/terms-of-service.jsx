import { Link } from "react-router-dom";
import { LegalDocumentShell } from "./legal-document-shell";

export default function TermsOfServicePage() {
  return (
    <LegalDocumentShell
      title="Terms of Service"
      description="Terms governing use of Lasglowtech websites, services, and learner platform."
      path="/legal/terms"
    >
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">1. Agreement</h2>
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your access to and use of Lasglowtech&apos;s websites,
          applications, training programmes, catalogues, and related services (collectively, the
          &quot;Services&quot;). By creating an account or using the Services, you agree to these Terms.
        </p>
        <p className="mt-3">
          If you do not agree, do not use the Services. This page is a <strong className="text-[#e8ddf8]">scaffold</strong>{" "}
          for your legal review—replace and expand all sections with counsel-approved copy before production use.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">2. Eligibility &amp; accounts</h2>
        <p>
          You must provide accurate registration information and keep credentials secure. You are responsible for
          activity under your account. We may suspend or terminate accounts that violate these Terms or harm other
          users or the platform.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">3. Services &amp; changes</h2>
        <p>
          We may modify, suspend, or discontinue features (including courses, catalogues, or pricing) with reasonable
          notice where practicable. Certain offerings may be governed by separate order terms or enrolment agreements.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">4. Acceptable use</h2>
        <p>You agree not to misuse the Services—for example, by attempting unauthorised access, scraping in violation
          of our rules, distributing malware, harassing others, or infringing intellectual property. We may enforce
          these rules by removing content or restricting access.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">5. Intellectual property</h2>
        <p>
          Lasglowtech and its licensors retain rights in branding, software, course materials, and site content except
          where you own your own submissions. Limited licences are granted only as needed to use the Services as
          offered.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">6. Payments &amp; refunds</h2>
        <p>
          Paid services (e.g. catalogue orders, programmes) are subject to the pricing and payment terms shown at
          checkout or in a separate agreement. Refund rules—if any—should be stated clearly in your final policy.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">7. Disclaimers &amp; limitation of liability</h2>
        <p>
          The Services are provided on an &quot;as is&quot; basis to the extent permitted by law. To the maximum extent
          permitted, Lasglowtech is not liable for indirect or consequential damages arising from use of the Services.
          Your jurisdiction may not allow certain limitations—those limits apply only to the extent permitted.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">8. Governing law</h2>
        <p>
          Specify the governing law and dispute resolution forum appropriate for Lasglowtech (e.g. Nigeria) after legal
          review.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">9. Contact</h2>
        <p>
          For questions about these Terms, contact us via the{" "}
          <Link to="/contact" className="text-[#8700ff] hover:text-[#f97316] font-medium">
            contact page
          </Link>
          .
        </p>
      </section>

      <p className="text-xs text-[#9b8cb5] !mt-10">
        See also our{" "}
        <Link to="/legal/privacy" className="text-[#8700ff] hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
    </LegalDocumentShell>
  );
}
