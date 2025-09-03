'use client'
import React from "react";

const openGmail = () => {
  const gmailUrl = "https://mail.google.com/mail/u/0/#inbox";
  window.open(gmailUrl, "_blank");
};

const ConfirmEmailPage: React.FC = () => (
  <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 px-4 overflow-hidden">
    {/* Background Blobs */}
    <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-400/40 rounded-full blur-3xl animate-pulse"></div>
    <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-400/40 rounded-full blur-3xl animate-pulse delay-700"></div>

    <div className="relative w-full max-w-md">
      <div className="bg-white/90 backdrop-blur-lg p-10 rounded-3xl shadow-2xl border border-white/20 text-center">
        {/* Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden shadow-lg mb-6">
          <img
            src="/media/flight.png" // <-- Replace with your logo
            alt="App Logo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Confirm Your Email 📩
        </h2>
        <p className="mb-6 text-gray-600 leading-relaxed">
          We've sent a confirmation link to your email address.  
          Please check your inbox and click the link to verify your account.
        </p>

        {/* Open Gmail button */}
        <button
          onClick={openGmail}
          className="w-full py-3 mb-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold hover:opacity-90 transition duration-200 shadow-lg"
        >
          Open Gmail
        </button>

        {/* Resend section */}
        <p className="mt-6 text-sm text-gray-500">
          Didn't receive the email? Check your spam folder or try resending.
        </p>
        <button
          className="mt-3 w-full py-2 rounded-xl bg-gray-200 text-gray-700 font-medium hover:bg-gray-300 transition duration-200"
          onClick={async () => {
            const supabase = (await import('@/utils/supabase/server')).supabase;
            // Get current user
            const {
              data: { user },
              error: userError,
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
    </div>
  </div>
);

export default ConfirmEmailPage;
