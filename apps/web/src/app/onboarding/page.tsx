'use client';

import React, { useState } from 'react';
import { UserCheck, Shield, CheckCircle2, Lock, ArrowRight, Upload, ImageIcon, X, AlertTriangle, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [socialMediaName, setSocialMediaName] = useState('Dr. Evelyn Carter');
  const [profession, setProfession] = useState('Research Scientist & Content Creator');
  const [handles, setHandles] = useState('@evelyn_carter, @drcarter_official');
  const [keywords, setKeywords] = useState('Evelyn Carter, biochemistry lab, student records leak');
  
  // Photo 1: User Image Upload
  const [userImageFile, setUserImageFile] = useState<File | null>(null);
  const [userImagePreview, setUserImagePreview] = useState<string | null>(null);

  // Photo 2: Unusual News Input
  const [unusualNews, setUnusualNews] = useState('');
  const [newsCategory, setNewsCategory] = useState('Manipulated Photo / Deepfake');
  const [consentChecked, setConsentChecked] = useState(true);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUserImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setUserImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComplete = () => {
    // Save to localStorage for dynamic display across app
    if (typeof window !== 'undefined') {
      localStorage.setItem('sentinel_social_name', socialMediaName);
      localStorage.setItem('sentinel_profession', profession);
      localStorage.setItem('sentinel_unusual_news', unusualNews);
      if (userImagePreview) {
        localStorage.setItem('sentinel_user_image', userImagePreview);
      }
    }
    router.push('/dashboard');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 py-4 font-sans">
      {/* Page Header */}
      <div className="glass-card p-6 rounded-2xl border border-white/10 text-center space-y-2">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
          <UserCheck className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-bold text-white">Protected Profile & Consent Wizard</h1>
        <p className="text-xs text-gray-400">Configure victim authorization before activating digital incident monitoring</p>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10 space-y-6">
        {/* Step Indicator */}
        <div className="grid grid-cols-4 gap-2 text-[11px] font-semibold text-gray-400 border-b border-white/10 pb-4 text-center">
          <span className={step >= 1 ? 'text-cyan-400 font-bold' : ''}>1. Protected Identity</span>
          <span className={step >= 2 ? 'text-cyan-400 font-bold' : ''}>2. Handles & Keywords</span>
          <span className={step >= 3 ? 'text-cyan-400 font-bold' : ''}>3. Reference Media</span>
          <span className={step >= 4 ? 'text-cyan-400 font-bold' : ''}>4. Unusual News & Consent</span>
        </div>

        {/* STEP 1: Protected Person Information (Photo 3 requirement) */}
        {step === 1 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Step 1: Protected Person Information</h3>
            
            <div>
              <label className="block text-gray-300 font-bold mb-1">Name given on all social media *</label>
              <input
                type="text"
                value={socialMediaName}
                onChange={(e) => setSocialMediaName(e.target.value)}
                placeholder="Enter the name you use on Instagram, X, Facebook, YouTube..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">This name will be monitored for impersonation and false claims across social networks.</span>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Profession / Role mentioned on social media *</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g., Content Creator, Researcher, Software Engineer, Doctor, Model"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none"
              />
              <span className="text-[10px] text-gray-400 mt-0.5 block">Your professional title as stated in your social media bios.</span>
            </div>
          </div>
        )}

        {/* STEP 2: Social Handles & Keywords */}
        {step === 2 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Step 2: Social Handles & Context Keywords</h3>
            <div>
              <label className="block text-gray-300 font-bold mb-1">Known Social Handles</label>
              <input
                type="text"
                value={handles}
                onChange={(e) => setHandles(e.target.value)}
                placeholder="@username1, @username2"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Keywords & Relevant Phrases</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="Keywords to track in posts"
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Reference Media (Photo 1 requirement - Add User Image function) */}
        {step === 3 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white">Step 3: Reference Media</h3>
            <p className="text-gray-400">Upload your authorized reference photo to generate baseline visual perceptual embeddings.</p>

            <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-2xl p-6 bg-cyan-950/10 text-center transition-all cursor-pointer relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="user-reference-image"
                onChange={handleImageUpload}
              />
              
              <label htmlFor="user-reference-image" className="cursor-pointer block space-y-3">
                {userImagePreview ? (
                  <div className="space-y-3">
                    <img src={userImagePreview} alt="User Reference Image" className="h-40 mx-auto rounded-xl border-2 border-cyan-500/50 object-cover shadow-xl" />
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-xs font-bold text-cyan-300">{userImageFile?.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">Image Loaded</span>
                    </div>
                    <span className="text-[11px] text-gray-400 block">Click or drop a new file to change reference image</span>
                  </div>
                ) : (
                  <>
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/20">
                      <Upload className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Click here to choose & upload your reference image</span>
                      <span className="text-[10px] text-gray-400 block mt-1">Supports PNG, JPG, WEBP • Used for pHash facial & visual feature matching</span>
                    </div>
                  </>
                )}
              </label>
            </div>
          </div>
        )}

        {/* STEP 4: Unusual News Input & Explicit Consent (Photo 2 requirement) */}
        {step === 4 && (
          <div className="space-y-4 text-xs">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" /> Step 4: Unusual News & Fake Claim Context Input
            </h3>

            <div>
              <label className="block text-gray-300 font-bold mb-1">What kind of unusual news or fake claim is being spread on social media? *</label>
              <textarea
                value={unusualNews}
                onChange={(e) => setUnusualNews(e.target.value)}
                rows={3}
                placeholder="e.g., Fake screenshot claiming I made false statements, edited video circulated on Instagram, fake arrest rumor, or unauthorized personal leak..."
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none resize-none"
              />
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Unusual News Category</label>
              <select
                value={newsCategory}
                onChange={(e) => setNewsCategory(e.target.value)}
                className="w-full p-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium focus:border-cyan-500 focus:outline-none"
              >
                <option value="Manipulated Photo / Deepfake">Manipulated Photo / Deepfake</option>
                <option value="Impersonation & Fake Quotes">Impersonation & Fake Quotes</option>
                <option value="False Rumor / Scandal Post">False Rumor / Scandal Post</option>
                <option value="Unauthorized Personal Leak">Unauthorized Personal Leak</option>
                <option value="Phishing / Scam Link">Phishing / Scam Link</option>
              </select>
            </div>

            {/* Explicit Consent Agreement */}
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={consentChecked}
                  onChange={(e) => setConsentChecked(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-0"
                />
                <div className="text-gray-300 leading-relaxed">
                  I hereby grant SENTINEL explicit authorization to perform multimodal detection, fingerprint matching, evidence preservation, and platform reporting regarding digital content targeting my identity.
                </div>
              </label>
              <p className="font-bold text-emerald-400 text-[11px] pl-7">Consent State: VERIFIED & AUDITABLE</p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-white/10">
          <button
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-semibold disabled:opacity-50"
          >
            Back
          </button>
          
          {step < 4 ? (
            <button
              onClick={() => setStep((s) => Math.min(4, s + 1))}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 text-white text-xs font-semibold flex items-center gap-1.5"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={!consentChecked}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-lg shadow-cyan-500/25 disabled:opacity-50"
            >
              Complete Onboarding & Launch Dashboard <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
