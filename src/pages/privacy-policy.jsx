import { Link } from "react-router-dom";
import { LegalDocumentShell } from "./legal-document-shell";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentShell
      title="Privacy Policy"
      description="How Lasglowtech collects, uses, and protects personal information."
      path="/legal/privacy"
    >
      <section>
        <h2 className="text-lg font-semibold text-white mb-3">1. Introduction</h2>
        <p>
          Lasglowtech (&quot;we&quot;, &quot;us&quot;) respects your privacy. This Policy describes how we handle
          personal information when you use our websites, register an account, apply for programmes, purchase
          services, or interact with our learning platform.
        </p>
        <p className="mt-3">
          This document is a <strong className="text-[#e8ddf8]">scaffold</strong>—have it reviewed under applicable
          law (including Nigeria&apos;s NDPR where relevant) before relying on it publicly.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">2. Information we collect</h2>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>
            <span className="text-[#e8ddf8]">Account &amp; profile:</span> name, email, username, role, and similar
            registration details.
          </li>
          <li>
            <span className="text-[#e8ddf8]">Applications &amp; learning:</span> career application fields, course
            progress, notes you save, certificates metadata.
          </li>
          <li>
            <span className="text-[#e8ddf8]">Transactions:</span> order and payment-related data as processed by our
            payment partners.
          </li>
          <li>
            <span className="text-[#e8ddf8]">Technical:</span> IP address, device/browser type, cookies or similar
            technologies where used.
          </li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">3. How we use information</h2>
        <p>We use personal information to operate and improve the Services—for example:</p>
        <ul className="list-disc pl-5 space-y-2 mt-2">
          <li>Creating and securing accounts</li>
          <li>Processing applications, enrolments, and orders</li>
          <li>Communicating service updates and support responses</li>
          <li>Complying with law and protecting rights and safety</li>
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">4. Legal bases &amp; retention</h2>
        <p>
          Describe the lawful bases for processing (e.g. consent, contract, legitimate interests) and typical retention
          periods for each category of data, as required in your jurisdiction.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">5. Sharing</h2>
        <p>
          We may share information with service providers (hosting, email, payments, analytics) who process it on our
          instructions, or when required by law. We do not sell personal information as a matter of policy—clarify if
          you use ad-tech or data partners.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">6. Security</h2>
        <p>
          We implement appropriate technical and organisational measures to protect personal information. No method of
          transmission over the Internet is completely secure.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">7. Your rights</h2>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or restrict processing of your
          personal information, or to object or withdraw consent. Add a clear process (e.g. email or form) for
          requests and response timelines.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">8. Cookies</h2>
        <p>
          If you use cookies or similar technologies, list categories (essential, analytics, marketing) and link to a
          cookie notice or preference centre if applicable.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">9. Children</h2>
        <p>
          The Services are not directed at children under a defined age. State your policy if minors may use the platform
          with guardian consent.
        </p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">10. Changes</h2>
        <p>We may update this Policy from time to time. We will post the revised version and update the &quot;Last
          updated&quot; date above.</p>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-3">11. Contact</h2>
        <p>
          For privacy requests or questions, contact us via the{" "}
          <Link to="/contact" className="text-[#8700ff] hover:text-[#f97316] font-medium">
            contact page
          </Link>
          .
        </p>
      </section>

      <p className="text-xs text-[#9b8cb5] !mt-10">
        See also our{" "}
        <Link to="/legal/terms" className="text-[#8700ff] hover:underline">
          Terms of Service
        </Link>
        .
      </p>
    </LegalDocumentShell>
  );
}
