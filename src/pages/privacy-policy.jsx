import { Link } from "react-router-dom";
import { LegalDocumentShell } from "./legal-document-shell";

const ADSENSE_PUBLISHER_ID = "ca-pub-4858698331274766";

export default function PrivacyPolicyPage() {
  return (
    <LegalDocumentShell
      title="Privacy Policy"
      description="How Lasglowtech collects, uses, and protects personal information, including advertising and cookies."
      path="/legal/privacy"
    >
      <section>
        <h2>1. Introduction</h2>
        <p>
          Lasglowtech ("we", "us", "our") operates{" "}
          <a href="https://www.lasglowtech.com.ng">lasglowtech.com.ng</a> and related services. This Privacy
          Policy explains how we collect, use, disclose, and protect personal information when you visit our
          website, create an account, purchase products, apply for programmes, or use our learning platform.
        </p>
        <p>
          By using our Services, you agree to this Policy. If you do not agree, please do not use the Services.
        </p>
      </section>

      <section>
        <h2>2. Information we collect</h2>
        <ul>
          <li>
            <span>Account and profile:</span> name, email, username, and registration details you provide.
          </li>
          <li>
            <span>Orders and payments:</span> billing name, email, order details, and payment references
            processed through our payment partners (e.g. Flutterwave). We do not store full card numbers on our
            servers.
          </li>
          <li>
            <span>Applications and learning:</span> career application fields, course progress, and
            certificate-related data where applicable.
          </li>
          <li>
            <span>Communications:</span> messages you send via contact forms or email.
          </li>
          <li>
            <span>Technical and usage:</span> IP address, browser type, device information, pages visited,
            referring URLs, and similar analytics data.
          </li>
          <li>
            <span>Cookies and similar technologies:</span> see Section 8 below.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. How we use information</h2>
        <p>We use personal information to:</p>
        <ul>
          <li>Provide, operate, and improve our website and services</li>
          <li>Process orders, payments, and digital product delivery</li>
          <li>Manage accounts, applications, and learner enrolments</li>
          <li>Respond to enquiries and provide customer support</li>
          <li>Send service-related emails (e.g. receipts, delivery links)</li>
          <li>Display advertising through Google AdSense where enabled</li>
          <li>Analyse traffic and protect against fraud, abuse, or security risks</li>
          <li>Comply with legal obligations</li>
        </ul>
      </section>

      <section>
        <h2>4. Advertising (Google AdSense)</h2>
        <p>
          We use <strong>Google AdSense</strong> to display advertisements on some pages. Google and its partners
          may use cookies and similar technologies to serve ads based on your prior visits to this website or
          other websites.
        </p>
        <ul>
          <li>
            Our AdSense publisher ID: <code>{ADSENSE_PUBLISHER_ID}</code>
          </li>
          <li>
            Google's use of advertising cookies enables Google and its partners to serve ads to users based on their
            visit to our site and/or other sites on the Internet.
          </li>
          <li>
            You may opt out of personalised advertising by visiting{" "}
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer">
              Google Ads Settings
            </a>
            .
          </li>
          <li>
            You can also opt out of third-party vendor use of cookies for personalised advertising at{" "}
            <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer">
              aboutads.info
            </a>
            .
          </li>
        </ul>
        <p>
          For more on how Google uses data when you use our partners' sites or apps, see{" "}
          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
          >
            Google's partner sites policy
          </a>
          . Our site verification uses the AdSense code and{" "}
          <a href="https://www.lasglowtech.com.ng/ads.txt" target="_blank" rel="noopener noreferrer">
            ads.txt
          </a>{" "}
          file as required by Google.
        </p>
      </section>

      <section>
        <h2>5. Sharing of information</h2>
        <p>We may share information with:</p>
        <ul>
          <li>
            <span>Service providers</span> (hosting, email, payments, analytics, advertising) who process data on
            our instructions
          </li>
          <li>
            <span>Payment processors</span> to complete transactions
          </li>
          <li>
            <span>Advertising partners</span> such as Google for ad delivery and measurement
          </li>
          <li>
            <span>Authorities</span> when required by law or to protect rights and safety
          </li>
        </ul>
        <p>We do not sell your personal information.</p>
      </section>

      <section>
        <h2>6. Data retention</h2>
        <p>
          We retain personal information only as long as needed for the purposes described in this Policy,
          including legal, accounting, or reporting requirements. Order and payment records may be kept for several
          years where required for tax or dispute resolution.
        </p>
      </section>

      <section>
        <h2>7. Security</h2>
        <p>
          We use reasonable technical and organisational measures to protect personal information. No method of
          transmission over the Internet is completely secure, and we cannot guarantee absolute security.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>We and our partners use cookies and similar technologies for:</p>
        <ul>
          <li>
            <span>Essential:</span> site functionality, security, and session management
          </li>
          <li>
            <span>Analytics:</span> understanding how visitors use our site
          </li>
          <li>
            <span>Advertising:</span> serving and measuring ads through Google AdSense
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect site features or ad
          personalisation.
        </p>
      </section>

      <section>
        <h2>9. Your rights</h2>
        <p>
          Depending on applicable law (including Nigeria's Nigeria Data Protection Regulation where relevant), you
          may have rights to access, correct, delete, or restrict processing of your personal information, or to
          object to certain processing. To exercise these rights, contact us using the details in Section 12.
        </p>
      </section>

      <section>
        <h2>10. Children</h2>
        <p>
          Our Services are not directed at children under 13. We do not knowingly collect personal information from
          children under 13. If you believe a child has provided us data, contact us and we will take appropriate
          steps to delete it.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update this Policy from time to time. The revised version will be posted on this page with an
          updated "Last updated" date. Continued use of the Services after changes constitutes acceptance of the
          updated Policy.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          For privacy questions or requests, contact Lasglowtech at{" "}
          <a href="mailto:lasglowtech@gmail.com">lasglowtech@gmail.com</a> or via our{" "}
          <Link to="/contact">contact page</Link>.
        </p>
        <p className="text-[#9b8cb5]">Lasglowtech, Gwarinpa, FCT Abuja, Nigeria.</p>
      </section>

      <p className="text-xs text-[#9b8cb5] !mt-10">
        See also our <Link to="/legal/terms">Terms of Service</Link>.
      </p>
    </LegalDocumentShell>
  );
}
