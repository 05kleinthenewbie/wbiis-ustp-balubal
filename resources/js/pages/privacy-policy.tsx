import LegalPage, { LegalSection } from '@/components/legal-page';

export default function PrivacyPolicy() {
    return (
        <LegalPage title="Privacy Policy" updated="September 27, 2026">
            <LegalSection title="1. Information We Collect">
                <p>
                    We collect information that you provide directly and
                    information generated as you use the System:
                </p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>
                        Account details: full name, email address, role, and
                        department.
                    </li>
                    <li>
                        Submitted content: service requests, facility booking
                        requests, and incident reports you create, plus job
                        orders, inventory records, and reports recorded by ICT
                        staff.
                    </li>
                    <li>
                        Operational data: timestamps, approval actions, and
                        audit log entries recorded by the System.
                    </li>
                    <li>
                        Device and session data: browser session identifiers and
                        your theme preference stored on your device.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="2. How We Use Your Information">
                <p>Your information is used to:</p>
                <ul className="list-disc space-y-1 pl-6">
                    <li>Create, verify, and manage your account.</li>
                    <li>
                        Process and track service requests, facility bookings,
                        and incident reports, along with job orders, inventory,
                        reports, and account approvals managed by ICT
                        Administrators.
                    </li>
                    <li>
                        Send transactional emails such as verification codes,
                        account status, and approval notifications.
                    </li>
                    <li>
                        Generate reports and maintain audit trails for
                        accountability.
                    </li>
                    <li>
                        Protect the System against misuse and unauthorized
                        access.
                    </li>
                </ul>
            </LegalSection>

            <LegalSection title="3. Email Communications">
                <p>
                    We use an external transactional email provider (Brevo) to
                    deliver verification codes and notifications. Your name and
                    email address are shared with this provider solely to send
                    those messages. We do not use your address for marketing.
                </p>
            </LegalSection>

            <LegalSection title="4. Who Can See Your Information">
                <p>
                    Access follows your role in the university's approval
                    workflow. ICT Administrators and authorized ICT staff can
                    view submissions relevant to their duties. Aggregated,
                    non-identifying data may appear in reports. We do not sell
                    or rent your personal information to third parties.
                </p>
            </LegalSection>

            <LegalSection title="5. Data Retention">
                <p>
                    Account and operational records are retained for as long as
                    needed for university operations, approvals, and audit
                    purposes. Pending registrations that are never verified are
                    discarded automatically after a short period. You may
                    request deletion or correction of your data by contacting
                    the ICT Office, subject to legitimate record-keeping
                    requirements.
                </p>
            </LegalSection>

            <LegalSection title="6. Data Security">
                <p>
                    We protect your information with access controls, role-based
                    permissions, password hashing, session handling, and audit
                    logging. While no system is completely secure, we take
                    reasonable measures to prevent unauthorized access,
                    alteration, or disclosure.
                </p>
            </LegalSection>

            <LegalSection title="7. Your Rights">
                <p>
                    You may request access to, or correction of, the personal
                    information we hold about you, and you may raise concerns
                    about how your data is used by contacting the ICT Office,
                    USTP Balubal Campus. Account status changes (such as
                    deactivation) are performed by ICT Administrators and are
                    recorded in the audit log.
                </p>
            </LegalSection>

            <LegalSection title="8. Cookies and Local Storage">
                <p>
                    The System uses session cookies to keep you signed in and
                    local storage to remember your light or dark theme
                    preference. Disabling these may prevent the System from
                    functioning correctly.
                </p>
            </LegalSection>

            <LegalSection title="9. Changes to This Policy">
                <p>
                    We may update this Privacy Policy from time to time. Changes
                    take effect once posted, and the "Last updated" date at the
                    top of this page reflects the latest revision.
                </p>
            </LegalSection>

            <LegalSection title="10. Contact Us">
                <p>
                    For questions or requests regarding your privacy, contact
                    the ICT Office, USTP Balubal Campus, through the contact
                    details published on the university website.
                </p>
            </LegalSection>
        </LegalPage>
    );
}
