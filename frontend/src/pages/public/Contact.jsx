import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    // Simulate form submission
    // TODO: Replace with actual API call
    setTimeout(() => {
      toast.success('Message sent! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setSubmitting(false);
    }, 1000);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
      <div className="min-h-screen bg-[#030712] text-white overflow-hidden">
        {/* Navigation */}
        <PublicNavbar />

        {/* Hero Section */}
        <section className="relative py-24 px-4">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
          <div className="max-w-4xl mx-auto text-center relative z-10">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-gradient-to-b from-white to-slate-400 bg-clip-text text-transparent">
              Get in Touch
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto">
              Have questions? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-20 px-4 relative z-10">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">

            {/* Contact Form */}
            <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-sm">
              <h2 className="text-3xl font-bold mb-6 text-white">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Your Name
                  </label>
                  <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-lg focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent transition text-white placeholder-slate-600 outline-none"
                      placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address
                  </label>
                  <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-lg focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent transition text-white placeholder-slate-600 outline-none"
                      placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-lg focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent transition text-white placeholder-slate-600 outline-none"
                      placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Message
                  </label>
                  <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows="6"
                      className="w-full px-4 py-3 bg-[#030712] border border-slate-800 rounded-lg focus:ring-2 focus:ring-[#89CFF0] focus:border-transparent resize-none transition text-white placeholder-slate-600 outline-none"
                      placeholder="Tell us more about your inquiry..."
                  />
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:scale-[1.02] transition-transform shadow-[0_0_20px_rgba(79,70,229,0.3)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-white">Contact Information</h2>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-blue-500/30">
                    <svg className="w-6 h-6 text-[#89CFF0]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-white">Email</h3>
                    <p className="text-slate-400">support@workflow.com</p>
                    <p className="text-sm text-slate-500 mt-1 font-mono tracking-wide">We respond within 24 hours</p>
                  </div>
                </div>

                {/* Support Hours */}
                <div className="flex items-start p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-purple-500/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-white">Support Hours</h3>
                    <p className="text-slate-400">Monday - Friday</p>
                    <p className="text-slate-400 font-mono">9:00 AM - 6:00 PM EST</p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="flex items-start p-6 bg-slate-900/40 border border-slate-800 rounded-2xl hover:border-slate-700 transition">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mr-5 flex-shrink-0 border border-green-500/30">
                    <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-white">Follow Us</h3>
                    <p className="text-slate-400">Connect on social media</p>
                    <div className="flex gap-4 mt-3">
                      <a href="https://x.com/nabinstrivex99" className="text-[#89CFF0] hover:text-white transition font-medium">Twitter</a>
                      <a href="#" className="text-[#89CFF0] hover:text-white transition font-medium">LinkedIn</a>
                      <a href="https://www.facebook.com/nabin.strivex/" className="text-[#89CFF0] hover:text-white transition font-medium">Facebook</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ Link */}
              <div className="mt-8 p-6 bg-slate-900/50 rounded-2xl border border-slate-800 relative overflow-hidden group">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <h3 className="font-semibold text-lg mb-2 text-white relative z-10">Looking for quick answers?</h3>
                <p className="text-slate-400 mb-4 relative z-10">
                  Check out our FAQ section for common questions
                </p>
                <Link to="/faq" className="text-[#89CFF0] hover:text-white font-semibold inline-flex items-center transition relative z-10">
                  Visit FAQ
                  <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-b from-slate-900 to-[#030712] border border-slate-800 p-16 rounded-[2rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px]" />
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-400 mb-10 relative z-10">
              Try WorkFlow free for 14 days. No credit card required.
            </p>
            <Link
                to="/register"
                className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-lg font-bold shadow-[0_0_30px_rgba(79,70,229,0.4)] hover:scale-105 transition-all relative z-10"
            >
              Get Started Free
            </Link>
          </div>
        </section>

        {/* Footer */}
        <PublicFooter />
      </div>
  );
}

export default Contact;