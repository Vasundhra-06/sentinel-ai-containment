'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Upload, Sparkles, CheckCircle, ShieldAlert, FileText, ArrowRight, Edit3, PlusCircle, 
  User, Image as ImageIcon, MessageSquare, Globe, AlertTriangle, ExternalLink, ShieldCheck, RefreshCw, X, Lock, CheckCircle2, UserCheck, Briefcase
} from 'lucide-react';
import { MatchBreakdownModal } from '@/components/MatchBreakdownModal';

function DetectionWorkbenchForm() {
  // Section 1: Your Name & Profile
  const [socialMediaName, setSocialMediaName] = useState('Dr. Evelyn Carter');
  const [profession, setProfession] = useState('Research Scientist & Content Creator');
  const [socialHandles, setSocialHandles] = useState('@evelyn_carter, @drcarter_bio');
  
  // Section 2: 3 Different Angle Reference Photos
  const [photoAngle1, setPhotoAngle1] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [photoAngle2, setPhotoAngle2] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });
  const [photoAngle3, setPhotoAngle3] = useState<{ file: File | null; preview: string | null }>({ file: null, preview: null });

  // Section 3: Describe the Fake News or Rumor
  const [unusualNews, setUnusualNews] = useState('');
  const [newsCategory, setNewsCategory] = useState('Edited Photo / Fake Picture');

  // Section 4: Apps to Search
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['Instagram', 'X (Twitter)', 'Facebook', 'YouTube', 'Reddit']);
  const [consentChecked, setConsentChecked] = useState(false);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    if (mode === 'new') {
      setSocialMediaName('');
      setProfession('');
      setSocialHandles('');
      setUnusualNews('');
      setPhotoAngle1({ file: null, preview: null });
      setPhotoAngle2({ file: null, preview: null });
      setPhotoAngle3({ file: null, preview: null });
      setHasScanned(false);
    } else if (mode === 'edit') {
      if (!socialMediaName) setSocialMediaName('Dr. Evelyn Carter');
      if (!profession) setProfession('Research Scientist & Content Creator');
      if (!socialHandles) setSocialHandles('@evelyn_carter, @drcarter_bio');
    }
  }, [mode]);

  // Section 5: Search & Results
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [hasScanned, setHasScanned] = useState(false);
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
  const [detectedLeaks, setDetectedLeaks] = useState<any[]>([]);
  const [imageMetadata, setImageMetadata] = useState<{ phash: string; dhash: string; sha256: string; filename?: string } | null>(null);

  const handlePhotoUpload = (angle: 1 | 2 | 3, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        if (angle === 1) setPhotoAngle1({ file, preview });
        else if (angle === 2) setPhotoAngle2({ file, preview });
        else if (angle === 3) setPhotoAngle3({ file, preview });
      };
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const handleRunLeakScan = async () => {
    setIsScanning(true);
    setHasScanned(false);
    setScanStep(1);

    const stepTimer1 = setTimeout(() => setScanStep(2), 600);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1400);
    const stepTimer3 = setTimeout(() => setScanStep(4), 2200);

    try {
      const formData = new FormData();
      formData.append('name', socialMediaName || 'Target Subject');
      formData.append('handles', socialHandles || '@user');
      formData.append('job_title', profession || '');
      formData.append('keywords', unusualNews || '');
      if (photoAngle1.file) {
        formData.append('file', photoAngle1.file);
        formData.append('file1', photoAngle1.file);
      }
      if (photoAngle2.file) {
        formData.append('file2', photoAngle2.file);
      }
      if (photoAngle3.file) {
        formData.append('file3', photoAngle3.file);
      }

      const res = await fetch('http://127.0.0.1:8000/api/v1/detections/scan', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          const mapped = data.results.map((r: any) => ({
            id: r.id,
            platform: r.platform,
            account: r.account,
            type: r.variant_type,
            title: r.title,
            matchScore: Math.round(r.similarity_score),
            riskLevel: r.similarity_score >= 88 ? 'HIGH RISK' : 'MEDIUM RISK',
            status: r.status,
            url: r.url,
            phash: r.phash,
            sha256: r.sha256,
            snippet: r.snippet,
          }));
          setDetectedLeaks(mapped);
        }
        if (data.image_metadata) {
          setImageMetadata(data.image_metadata);
        }
      } else {
        console.error('Backend scan returned non-200');
      }
    } catch (err) {
      console.error('Live scan fetch error:', err);
    } finally {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setIsScanning(false);
      setHasScanned(true);
    }
  };

  return (
    <div className="space-y-4 max-w-xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="glass-card p-4 sm:p-5 rounded-2xl border border-cyan-500/20 bg-slate-900/90 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-extrabold tracking-widest text-cyan-400 uppercase">USER INPUT</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1">
              <Lock className="w-2.5 h-2.5" /> Protected
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2">
            User Input - Search For Unusual Content
          </h1>
          <p className="text-xs text-slate-400 mt-1">Enter your name, upload a picture, or describe any false rumors to search Instagram, X, Facebook, and YouTube for matching posts.</p>
        </div>
      </div>

      {/* Main Integrated Form Container */}
      <div className="glass-card p-8 rounded-2xl border border-slate-800 bg-slate-900/80 space-y-8 shadow-2xl">

        {/* SECTION 1: Your Name & Profile */}
        <div className="space-y-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <UserCheck className="w-4 h-4" /> 
            <span>Your Name & Social Media Profiles</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Name you use on social media *</label>
              <input
                type="text"
                value={socialMediaName}
                onChange={(e) => setSocialMediaName(e.target.value)}
                placeholder="Enter your name as shown on Instagram, Facebook, X..."
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/60 transition-all font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">We will search social media for posts targeting this name.</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1">Your Job or Profession mentioned online *</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g., Content Creator, Student, Doctor, Engineer, Teacher"
                className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/60 transition-all font-medium"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">Your job title listed in your social media bio.</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Your Social Media Handles (@username)</label>
            <input
              type="text"
              value={socialHandles}
              onChange={(e) => setSocialHandles(e.target.value)}
              placeholder="@username1, @username2"
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/60 transition-all font-medium"
            />
          </div>
        </div>

        {/* SECTION 2: 3 Different Angle Reference Photos */}
        <div className="space-y-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
              <ImageIcon className="w-4 h-4" /> 
              <span>Upload 3 Different Angle Photos *</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold">
              {[photoAngle1.file, photoAngle2.file, photoAngle3.file].filter(Boolean).length}/3 Uploaded
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            Please upload 3 different angles of your face (Front, Left Profile, Right Profile) so our AI can accurately catch edited deepfakes and crops.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* ANGLE 1: Front Face View */}
            <div className="border border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-xl p-3 bg-slate-950/50 text-center transition-all relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-angle-1"
                onChange={(e) => handlePhotoUpload(1, e)}
              />
              <label htmlFor="photo-angle-1" className="cursor-pointer block space-y-2">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">Angle 1: Front View *</span>
                {photoAngle1.preview ? (
                  <div className="space-y-1.5 py-0.5">
                    <img src={photoAngle1.preview} alt="Front View" className="h-16 w-16 mx-auto rounded-lg border border-cyan-500/50 object-cover shadow-md" />
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold inline-block">Front Ready</span>
                  </div>
                ) : (
                  <div className="py-2.5 space-y-1">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 block">Upload Front Photo</span>
                    <span className="text-[9px] text-slate-400 block">Direct face view</span>
                  </div>
                )}
              </label>
            </div>

            {/* ANGLE 2: Left Side Profile */}
            <div className="border border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-xl p-3 bg-slate-950/50 text-center transition-all relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-angle-2"
                onChange={(e) => handlePhotoUpload(2, e)}
              />
              <label htmlFor="photo-angle-2" className="cursor-pointer block space-y-2">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">Angle 2: Left Profile *</span>
                {photoAngle2.preview ? (
                  <div className="space-y-1.5 py-0.5">
                    <img src={photoAngle2.preview} alt="Left Profile" className="h-16 w-16 mx-auto rounded-lg border border-cyan-500/50 object-cover shadow-md" />
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold inline-block">Left Ready</span>
                  </div>
                ) : (
                  <div className="py-2.5 space-y-1">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 block">Upload Left Side</span>
                    <span className="text-[9px] text-slate-400 block">45° left profile</span>
                  </div>
                )}
              </label>
            </div>

            {/* ANGLE 3: Right Side Profile */}
            <div className="border border-dashed border-cyan-500/30 hover:border-cyan-500/60 rounded-xl p-3 bg-slate-950/50 text-center transition-all relative">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                id="photo-angle-3"
                onChange={(e) => handlePhotoUpload(3, e)}
              />
              <label htmlFor="photo-angle-3" className="cursor-pointer block space-y-2">
                <span className="text-[10px] font-extrabold text-cyan-400 uppercase tracking-wider block">Angle 3: Right Profile *</span>
                {photoAngle3.preview ? (
                  <div className="space-y-1.5 py-0.5">
                    <img src={photoAngle3.preview} alt="Right Profile" className="h-16 w-16 mx-auto rounded-lg border border-cyan-500/50 object-cover shadow-md" />
                    <span className="text-[9px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold inline-block">Right Ready</span>
                  </div>
                ) : (
                  <div className="py-2.5 space-y-1">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
                      <Upload className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-200 block">Upload Right Side</span>
                    <span className="text-[9px] text-slate-400 block">45° right profile</span>
                  </div>
                )}
              </label>
            </div>
          </div>
        </div>

        {/* SECTION 3: Describe the Fake News or Rumor */}
        <div className="space-y-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" /> 
            <span>Describe the Fake News, Rumor, or Leak</span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">What fake statement, rumor, or picture is being spread about you? *</label>
            <textarea
              value={unusualNews}
              onChange={(e) => setUnusualNews(e.target.value)}
              rows={2}
              placeholder="e.g., Someone edited my photo with false text on Instagram, fake rumor spread on Facebook..."
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/60 transition-all font-medium resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1">Type of Fake Post</label>
            <select
              value={newsCategory}
              onChange={(e) => setNewsCategory(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:border-cyan-500/60 transition-all font-medium"
            >
              <option value="Edited Photo / Fake Picture">Edited Photo / Fake Picture</option>
              <option value="Fake Account & Stolen Name">Fake Account & Stolen Name</option>
              <option value="False Rumor / Bad Post">False Rumor / Bad Post</option>
              <option value="Personal Details Leaked">Personal Details Leaked</option>
              <option value="Scam / Fake Link">Scam / Fake Link</option>
            </select>
          </div>
        </div>

        {/* SECTION 4: Apps to Search & Permission */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
            <Globe className="w-4 h-4" /> 
            <span>Social Media Apps to Search</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {['Instagram', 'X (Twitter)', 'Facebook', 'YouTube', 'Reddit'].map((platform) => {
              const isSelected = selectedPlatforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => togglePlatform(platform)}
                  className={`py-2 px-2.5 rounded-lg text-xs font-bold transition-all border flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-cyan-400' : 'bg-slate-700'}`} />
                  {platform}
                </button>
              );
            })}
          </div>

          <div className={`p-3 rounded-xl transition-all space-y-1.5 ${
            consentChecked 
              ? 'bg-emerald-950/20 border border-emerald-500/40' 
              : 'bg-slate-950/80 border border-amber-500/40'
          }`}>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={(e) => setConsentChecked(e.target.checked)}
                className="mt-1 w-4 h-4 rounded text-cyan-500 focus:ring-0 cursor-pointer"
              />
              <div className="text-xs text-slate-300 leading-relaxed">
                I allow SENTINEL to search social media apps and save proof to help remove fake posts targeting my name <strong>({socialMediaName || 'your name'})</strong>.
              </div>
            </label>
            <p className={`font-bold text-[11px] pl-7 flex items-center gap-1.5 ${consentChecked ? 'text-emerald-400' : 'text-amber-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${consentChecked ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`} />
              Permission Status: {consentChecked ? 'GRANTED' : 'REQUIRED (Please click the checkbox above to grant search authorization)'}
            </p>
          </div>
        </div>

        {/* SECTION 5: Search Button */}
        <div className="pt-2">
          <button
            onClick={handleRunLeakScan}
            disabled={isScanning || !consentChecked}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 hover:from-cyan-400 hover:to-violet-500 text-white font-extrabold text-sm shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isScanning ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" /> Searching Social Media Apps Now...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" /> Search All Social Media Apps Now
              </>
            )}
          </button>
        </div>
      </div>

      {/* Progress Animation */}
      {isScanning && (
        <div className="glass-card p-6 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-3 animate-in fade-in duration-200">
          <h4 className="text-xs font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 animate-spin text-cyan-400" /> Searching Social Media Networks...
          </h4>

          <div className="space-y-2 text-xs">
            {[
              { step: 1, text: `Reading your photo & details for ${socialMediaName}` },
              { step: 2, text: 'Creating digital match code for your photo...' },
              { step: 3, text: `Checking ${selectedPlatforms.join(', ')}...` },
              { step: 4, text: 'Finding matching fake posts...' },
            ].map((s) => (
              <div key={s.step} className="flex items-center gap-3">
                {scanStep > s.step ? (
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                ) : scanStep === s.step ? (
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border border-slate-700 flex-shrink-0" />
                )}
                <span className={scanStep >= s.step ? 'text-slate-200 font-bold' : 'text-slate-500'}>
                  {s.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      {hasScanned && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between glass-card p-5 rounded-2xl border border-rose-500/30 bg-rose-950/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center shadow-lg">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest">SEARCH RESULTS</span>
                <h3 className="text-lg font-black text-white">4 Matching Fake Posts Found For "{socialMediaName}"</h3>
              </div>
            </div>

            <button
              onClick={() => setIsBreakdownOpen(true)}
              className="px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              Why It Matched <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 gap-3">
            {detectedLeaks.map((leak) => (
              <div key={leak.id} className="glass-card p-6 rounded-2xl border border-slate-800 bg-slate-900/90 space-y-4 shadow-xl hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">{leak.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-bold uppercase">{leak.platform}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40">
                    {leak.riskLevel}
                  </span>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold text-white">{leak.type}</h4>
                  </div>
                  {leak.title && (
                    <p className="text-xs text-cyan-200/90 font-medium line-clamp-1 mb-1">{leak.title}</p>
                  )}
                  <div className="text-xs font-mono text-slate-400">Posted By: <strong className="text-slate-200">{leak.account}</strong></div>
                  {leak.snippet && (
                    <p className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded-lg border border-slate-800/80 mt-2 line-clamp-2 italic">
                      "{leak.snippet}"
                    </p>
                  )}
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Match Confidence</span>
                    <span className="font-extrabold text-cyan-400">{leak.matchScore}% Match</span>
                  </div>
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="text-slate-500">Match Code</span>
                    <span className="font-mono text-slate-300">{leak.phash}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <a href={leak.url} target="_blank" rel="noreferrer" className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1">
                    Open Post Link <ExternalLink className="w-3 h-3" />
                  </a>

                  <div className="flex items-center gap-2">
                    <a
                      href="/reports"
                      className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold border border-cyan-500/40 transition-all flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" /> Ask App To Remove Post
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      <MatchBreakdownModal isOpen={isBreakdownOpen} onClose={() => setIsBreakdownOpen(false)} />
    </div>
  );
}


export default function DetectionWorkbenchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-white text-xs">Loading Search Workbench...</div>}>
      <DetectionWorkbenchForm />
    </Suspense>
  );
}
