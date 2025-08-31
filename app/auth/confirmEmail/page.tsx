'use client'
import React from "react";

const openGmail = () => {
    const gmailUrl = "https://mail.google.com/mail/u/0/#inbox";
    window.open(gmailUrl, "_blank");
};

const ConfirmEmailPage: React.FC = () => (
    <div className="max-w-md mx-auto mt-10 text-center p-6 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold mb-4">Confirm Your Email</h2>
        <p className="mb-6 text-gray-700">
            We've sent a confirmation link to your email address.<br />
            Please check your inbox and click the link to verify your account.
        </p>
        <button
            onClick={openGmail}
            className="mt-4 px-6 py-3 text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
            Open Gmail
        </button>
        <p className="mt-6 text-sm text-gray-500">
            Didn't receive the email? Check your spam folder or try resending.
        </p>
        <button
            className="mt-2 px-6 py-2 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
            onClick={async () => {
                const supabase = (await import('@/utils/supabase/server')).supabase;
                // Get current user
                const {
                    data: { user },
                    error: userError
                } = await supabase.auth.getUser();
                if (userError || !user) {
                    alert('No user found. Please log in again.');
                    return;
                }
                // Fetch email from profiles table
                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('email')
                    .eq('id', user.id)
                    .single();
                const email = profile?.email || user.email;
                if (!email) {
                    alert('No email found to resend.');
                    return;
                }
                const { error } = await supabase.auth.resend({
                    type: 'signup',
                    email,
                });
                if (error) {
                    alert(error.message);
                } else {
                    alert('Confirmation email resent!');
                }
            }}
        >
            Resend Email
        </button>
    </div>
);

export default ConfirmEmailPage;
