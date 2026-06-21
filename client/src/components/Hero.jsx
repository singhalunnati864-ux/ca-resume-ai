import React from 'react';
import { Briefcase, Star, Users } from 'lucide-react';
import Features from './Features.jsx';
import Pricing from './Pricing.jsx';

export default function Hero({ setPage, hasBoughtPlan }) {
  return (
    <div className="home-hero">
      <div className="hero-kicker hero-fade-in hero-fade-in-delay-1">
        AI-Powered · CA-Specific · ATS Optimizer
      </div>

      <h1 className="hero-title hero-fade-in hero-fade-in-delay-2">
        <span>Sign Up to Build Your</span>
        <strong>Big 4-Ready Resume</strong>
        <em>Powered by AI</em>
      </h1>

      <p className="hero-subtitle hero-fade-in hero-fade-in-delay-3">
        Crafted for ambitious CA students with a premium, recruiter-ready finish from the very first draft.
      </p>

      <button className="hero-resume-button hero-fade-in hero-fade-in-delay-4" onClick={() => setPage('builder')}>
        Build My Resume →
      </button>

      <div className="hero-stats hero-fade-in hero-fade-in-delay-5">
        <div>
          <span><Users size={21} /></span>
          <strong>12,400+</strong>
          <p>Resumes Built</p>
        </div>
        <div>
          <span><Star size={21} /></span>
          <strong>94%</strong>
          <p>Avg ATS Score</p>
        </div>
        <div>
          <span><Briefcase size={21} /></span>
          <strong>Big 4</strong>
          <p>Ready</p>
        </div>
      </div>

      <Features setPage={setPage} />

      {!hasBoughtPlan && (
        <div className="home-pricing-section">
          <Pricing setPage={setPage} startPay={() => setPage('pricing')} />
        </div>
      )}

      <footer className="home-footer">
        <p>© 2026 CA Resume AI. Designed for Big 4 Articleship Aspirants.</p>
      </footer>
    </div>
  );
}
