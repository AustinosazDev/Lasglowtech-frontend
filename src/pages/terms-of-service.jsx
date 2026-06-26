import { Link } from "react-router-dom";
import { LegalDocumentShell } from "./legal-document-shell";

export default function TermsOfServicePage() {
  return (
    <LegalDocumentShell
      title="Terms of Service"
      description="Terms governing use of Lasglowtech websites, digital products, services, and learning platform."
      path="/legal/terms"
    >
      <section>
        <h2>1. Agreement</h2>
        <p>
          These Terms of Service ("Terms") govern your access to and use of Lasglowtech's website at{" "}
          <a href="https://www.lasglowtech.com.ng">lasglowtech.com.ng</a>, applications, service catalogue,
          digital products, training programmes, and related services (collectively, the "Services").
        </p>
        <p>
          By accessing or using the Services, you agree to these Terms and our{" "}
          <Link to="/legal/privacy">Privacy Policy</Link>. If you do not agree, do not use the Services.
        </p>
      </section>

      <section>
        <h2>2. Eligibility and accounts</h2>
        <p>
          You must be at least 18 years old—or have parental or guardian consent where applicable—to use paid
          Services or create an account. You agree to provide accurate information and keep your login credentials
          secure. You are responsible for activity under your account. We may suspend or terminate accounts that
          violate these Terms or harm other users or the platform.
        </p>
      </section>

      <section>
        <h2>3. Services and catalogue</h2>
        <p>
          Lasglowtech offers web and digital services, training, and digital products through our catalogue.
          Product descriptions, pricing, and delivery methods are shown on each product page. We may update,
          suspend, or discontinue any Service with reasonable notice where practicable.
        </p>
      </section>

      <section>
        <h2>4. Payments and digital delivery</h2>
        <p>
          Payments are processed through third-party payment providers (e.g. Flutterwave). By completing a purchase,
          you agree to the price shown at checkout. Digital products may be delivered via download link or external
          access URL after successful payment, as described on the product page.
        </p>
        <p>
          Refunds are handled on a case-by-case basis unless otherwise stated on the product page. Contact us at{" "}
          <a href="mailto:lasglowtech@gmail.com">lasglowtech@gmail.com</a> for billing disputes within 7 days of
          purchase.
        </p>
      </section>

      <section>
        <h2>5. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the Services for unlawful, fraudulent, or harmful purposes</li>
          <li>Attempt unauthorised access to our systems or other users' accounts</li>
          <li>Upload malware, spam, or infringing content</li>
          <li>Scrape, copy, or redistribute site content without permission</li>
          <li>Interfere with advertising systems or circumvent payment for paid products</li>
          <li>Misrepresent your identity or affiliation</li>
        </ul>
        <p>We may remove content or restrict access for violations.</p>
      </section>

      <section>
        <h2>6. Intellectual property</h2>
        <p>
          Lasglowtech and its licensors own the website, branding, software, course materials, and content except
          where you retain rights in your own submissions. You receive a limited, non-exclusive licence to use
          purchased digital products for personal or internal business use as described at purchase. You may not
          resell, redistribute, or publicly share paid materials unless explicitly permitted.
        </p>
      </section>

      <section>
        <h2>7. Advertising</h2>
        <p>
          The Services may display third-party advertisements, including through Google AdSense. Ads are provided "as
          is" by advertisers and ad networks. We are not responsible for the content of third-party ads or external
          sites linked from ads. Your interaction with advertisers is at your own risk and subject to their terms
          and privacy policies.
        </p>
      </section>

      <section>
        <h2>8. Disclaimers</h2>
        <p>
          The Services are provided on an "as is" and "as available" basis. To the fullest extent permitted by law,
          we disclaim warranties of merchantability, fitness for a particular purpose, and non-infringement. We do
          not guarantee uninterrupted or error-free operation.
        </p>
      </section>

      <section>
        <h2>9. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by applicable law, Lasglowtech shall not be liable for indirect,
          incidental, special, consequential, or punitive damages, or loss of profits, data, or goodwill arising from
          your use of the Services. Our total liability for any claim shall not exceed the amount you paid us in the
          twelve (12) months before the claim, or one hundred US dollars (USD 100), whichever is greater.
        </p>
      </section>

      <section>
        <h2>10. Governing law</h2>
        <p>
          These Terms are governed by the laws of the Federal Republic of Nigeria. Any disputes shall be subject to
          the exclusive jurisdiction of the courts of Abuja, FCT, Nigeria, unless otherwise required by mandatory
          law.
        </p>
      </section>

      <section>
        <h2>11. Changes</h2>
        <p>
          We may update these Terms from time to time. The updated version will be posted on this page with a revised
          "Last updated" date. Continued use after changes constitutes acceptance.
        </p>
      </section>

      <section>
        <h2>12. Contact</h2>
        <p>
          For questions about these Terms, contact Lasglowtech at{" "}
          <a href="mailto:lasglowtech@gmail.com">lasglowtech@gmail.com</a> or via our{" "}
          <Link to="/contact">contact page</Link>.
        </p>
      </section>

      <p className="text-xs text-[#9b8cb5] !mt-10">
        See also our <Link to="/legal/privacy">Privacy Policy</Link>.
      </p>
    </LegalDocumentShell>
  );
}
