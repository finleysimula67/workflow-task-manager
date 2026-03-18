import { Link } from 'react-router-dom';
import PublicNavbar from '../../components/PublicNavbar';
import PublicFooter from '../../components/PublicFooter';
import nabinphoto from "../../assets/finley.jpg";

function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <PublicNavbar />

      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            About WorkFlow
          </h1>
          <p className="text-xl md:text-2xl text-gray-600">
            We believe productivity should be simple, not complicated
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold mb-8">Our Story</h2>
          <div className="space-y-6 text-gray-600 text-lg leading-relaxed">
            <p>
              WorkFlow was born from a simple frustration: existing task management tools 
              were either too basic or overwhelmingly complex. We needed something in between 
              – powerful enough to handle real work, yet simple enough to use every day.
            </p>
            <p>
              In 2026, we set out to build the task management tool we wished existed. 
              The result is WorkFlow – a platform that combines simplicity with the features 
              teams actually need.
            </p>
            <p>
              Today, WorkFlow helps hundreds of individuals and teams stay organized and 
              productive. From students managing assignments to teams coordinating complex 
              projects, WorkFlow adapts to your needs.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Mission</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Simplicity</h3>
              <p className="text-gray-600">
                Make task management accessible to everyone, regardless of technical skill
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">Reliability</h3>
              <p className="text-gray-600">
                Build a platform you can trust with your important work
              </p>
            </div>

            <div className="text-center p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3">User-First</h3>
              <p className="text-gray-600">
                Design features based on real user needs, not trends
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Team</h2>
          <div className="bg-gradient-to-br from-gray-50 to-blue-50 p-10 rounded-2xl text-center shadow-sm">
            <img 
              src={nabinphoto}
              alt="Nabin Oli" 
              className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-white shadow-lg"
            />
            <h3 className="text-2xl font-bold mb-2">Nabin Oli</h3>
            <p className="text-blue-600 font-semibold mb-4 text-lg">Founder & Developer</p>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
              Full-stack developer passionate about building tools that make people more productive. 
              Specialized in creating simple, powerful applications that solve real problems.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Transparency</h3>
              <p className="text-gray-600">
                We believe in being open and honest with our users about our product, 
                pricing, and policies.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Privacy</h3>
              <p className="text-gray-600">
                Your data is yours. We never sell your information and we protect 
                it with industry-standard encryption.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Continuous Improvement</h3>
              <p className="text-gray-600">
                We're constantly listening to feedback and improving WorkFlow to 
                serve you better.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <h3 className="text-xl font-semibold mb-3">Support</h3>
              <p className="text-gray-600">
                We're here to help. Our support team is responsive and dedicated 
                to your success.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Start organizing your tasks today
          </p>
          <Link 
            to="/register"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-gray-100 transition shadow-lg hover:shadow-xl"
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

export default About;
