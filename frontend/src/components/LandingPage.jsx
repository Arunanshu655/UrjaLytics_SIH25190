import React from 'react';
import { Zap, Activity, Shield, TrendingUp, CheckCircle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


const LandingPage = () => {
  const { account } = useAuth()
  return (
    <div className="min-h-screen bg-gray-50">    

      {/* Hero Section */}
      <div className="bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="text-center">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Advanced Transformer Diagnostics
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Leverage cutting-edge AI to analyze FRA data with unprecedented accuracy. 
              Make informed decisions faster with our intelligent diagnostic platform.
            </p>
            <div className="flex justify-center space-x-4">
            <Link to={account ? "uploads" : "login"}>
              <button className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2" >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              </Link>
              {/* <button className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Watch Demo
              </button> */}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">247+</div>
              <div className="text-gray-600">Tests Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">89%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Enterprise Clients</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Powerful Features for Precise Diagnostics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Activity className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Real-time Analysis</h4>
              <p className="text-gray-600">
                Get instant insights from your FRA data with our advanced machine learning algorithms.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <Shield className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">High Accuracy</h4>
              <p className="text-gray-600">
                Achieve 89% diagnostic accuracy with AI-powered pattern recognition and analysis.
              </p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
              <h4 className="text-xl font-bold text-gray-900 mb-3">Predictive Insights</h4>
              <p className="text-gray-600">
                Identify potential issues before they become critical with predictive analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Diagnostics?
          </h3>
          <p className="text-xl text-blue-200 mb-8">
            Join leading organizations using Urjalytics for reliable transformer health monitoring.
          </p>
          <button className="px-8 py-4 bg-white text-blue-900 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
            Start Free Trial
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>&copy; 2025 UrjaLytics. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;