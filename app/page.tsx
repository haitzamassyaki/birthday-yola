'use client';

import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function BirthdayGreeting() {
  // States
  const [isOpened, setIsOpened] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [candlesBlown, setCandlesBlown] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string; desc: string } | null>(null);

  // Refs
  const confettiCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const sparkleCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Data Foto Galeri (Bisa ganti URL dengan foto asli Yola)
  const galleryPhotos = [
    {
      url: '/foto1.jpg',
      title: 'Momen Istimewa #1',
      desc: 'Senyuman terindah yang selalu menghangatkan hari-hariku.',
    },
    {
      url: '/foto2.jpeg',
      title: 'Momen Istimewa #2',
      desc: 'Setiap sudut kota terasa indah saat dilewati bersamamu.',
    },
    {
      url: '/foto3.jpg',
      title: 'Momen Istimewa #3',
      desc: 'Terima kasih telah tumbuh dan berjuang bersama sejauh ini.',
    },
  ];

  // 1. EFEK CONFETTI (HTML5 Canvas Engine)
  const triggerConfetti = () => {
    const canvas = confettiCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = ['#FBBF24', '#F59E0B', '#60A5FA', '#3B82F6', '#E11D48', '#EC4899', '#38BDF8'];
    const confettiCount = 200;
    const particles: any[] = [];

    for (let i = 0; i < confettiCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * confettiCount,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: Math.random() * 0.07 + 0.05,
        tiltAngle: Math.random() * Math.PI,
      });
    }

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p, i) => {
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();

        if (p.y > canvas.height) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: -20,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
            tiltAngleIncremental: p.tiltAngleIncremental,
            tiltAngle: p.tiltAngle,
          };
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    setTimeout(() => {
      cancelAnimationFrame(animationFrameId);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }, 7000);
  };

  // 2. EFEK SPARKLE MOUSE TRAIL
  useEffect(() => {
    const canvas = sparkleCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Array<{ x: number; y: number; size: number; alpha: number; vx: number; vy: number }> = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 3; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          size: Math.random() * 3 + 1,
          alpha: 1,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5 - 0.5,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.02;

        ctx.fillStyle = `rgba(251, 191, 36, ${p.alpha})`; // Warna Emas Sparkle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
        }
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Handler Buka Amplop & Play Audio
  const handleOpenEnvelope = () => {
    setIsOpened(true);
    triggerConfetti();

    // Mencoba memutar audio jika file tersedia
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Audio play failed or file missing:", err);
      });
    }
  };

  // Handler Toggle Music
  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Handler Tiup Lilin
  const handleBlowCandle = () => {
    setCandlesBlown(true);
    triggerConfetti();
  };

  const balloons = [
    { left: '5%', color: 'from-amber-400 to-yellow-600', delay: '0s', duration: '14s' },
    { left: '20%', color: 'from-blue-500 to-indigo-800', delay: '3s', duration: '11s' },
    { left: '38%', color: 'from-amber-300 to-yellow-500', delay: '6s', duration: '15s' },
    { left: '65%', color: 'from-sky-400 to-blue-700', delay: '1s', duration: '12s' },
    { left: '82%', color: 'from-yellow-400 to-amber-600', delay: '5s', duration: '13s' },
  ];

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 font-sans overflow-x-hidden selection:bg-amber-400 selection:text-slate-950">
      <Head>
        <title>Happy 23rd Birthday Yola Okta Vina!</title>
      </Head>

      {/* Background Audio (Simpan file music.mp3 di folder /public) */}
      <audio ref={audioRef} src="/music.mp3" loop />

      {/* Canvas Elements */}
      <canvas ref={confettiCanvasRef} className="fixed inset-0 pointer-events-none z-50 w-full h-full" />
      <canvas ref={sparkleCanvasRef} className="fixed inset-0 pointer-events-none z-40 w-full h-full" />

      {/* Floating Balloons di Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {balloons.map((b, index) => (
          <div
            key={index}
            className="absolute bottom-[-150px] animate-float-up flex flex-col items-center opacity-70"
            style={{ left: b.left, animationDelay: b.delay, animationDuration: b.duration }}
          >
            <div className={`w-16 h-20 md:w-20 md:h-24 bg-gradient-to-tr ${b.color} rounded-t-full rounded-b-[40%] shadow-lg shadow-amber-500/10 relative`}>
              <div className="absolute top-3 left-3 w-4 h-6 bg-white/30 rounded-full blur-[1px]"></div>
            </div>
            <div className={`w-2 h-2 bg-amber-500 rotate-45 -mt-1`}></div>
            <div className="w-[1px] h-24 bg-amber-200/30"></div>
          </div>
        ))}
      </div>

      {/* 💌 OVERLAY AMPLOP DIGITAL MEWAH (WAX SEAL REVEAL) */}
      {!isOpened && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/95 backdrop-blur-2xl px-4 transition-all duration-700">
          <div className="text-center max-w-md w-full">
            <p className="text-amber-400/80 tracking-[0.3em] uppercase text-xs mb-6 animate-pulse">
              Invitation For Yola Okta Vina
            </p>
            
            {/* Kartu Amplop Glassmorphism */}
            <div className="relative bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-amber-500/30 p-8 rounded-3xl shadow-2xl shadow-amber-500/10 flex flex-col items-center">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/40 mb-6 shadow-inner">
                <span className="text-3xl">✉️</span>
              </div>
              <h2 className="text-2xl font-extrabold text-amber-200 tracking-wide mb-2">
                Surat Spesial Ulang Tahun
              </h2>
              <p className="text-slate-400 text-sm mb-8">
                Tekan segel emas di bawah untuk membuka ucapan rahasia.
              </p>

              {/* Segel Lilin Emas (Wax Seal Button) */}
              <button
                onClick={handleOpenEnvelope}
                className="group relative w-20 h-20 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-500 rounded-full p-1 shadow-lg shadow-amber-500/30 hover:scale-110 active:scale-95 transition-all duration-300"
              >
                <div className="w-full h-full bg-amber-950/40 rounded-full border border-amber-200/50 flex flex-col items-center justify-center text-amber-200 font-serif font-bold text-lg group-hover:bg-transparent transition-colors">
                  <span>23</span>
                  <span className="text-[9px] uppercase tracking-wider font-sans -mt-1">Open</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🎵 FLOATING MUSIC PLAYER */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 bg-slate-900/80 border border-amber-500/30 p-2.5 rounded-full backdrop-blur-md shadow-xl shadow-amber-500/10">
          <button
            onClick={toggleMusic}
            className={`w-12 h-12 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 font-bold shadow-md hover:scale-105 transition-transform ${isPlaying ? 'animate-spin-slow' : ''}`}
          >
            🎵
          </button>
          <div className="pr-3 hidden sm:block text-left">
            <p className="text-xs font-semibold text-amber-200">Special Song</p>
            <p className="text-[10px] text-slate-400">{isPlaying ? 'Playing Music...' : 'Click to Play'}</p>
          </div>
        </div>
      )}

      {/* MAIN CONTENT WEBSITE */}
      <main className={`transition-opacity duration-1000 ${isOpened ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* HERO SECTION */}
        <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-300 text-xs font-semibold tracking-widest uppercase backdrop-blur-md shadow-inner">
              ✨ 16 OKTOBER 2003 • EXCLUSIVE DAY
            </div>

            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
              Happy 23rd Birthday <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                Yola Okta Vina
              </span>
            </h1>

            <p className="text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed font-light">
              Hari ini adalah perayaan atas hadirnya insan indah yang membawa banyak kehangatan dan kebahagiaan.
            </p>

            <div className="pt-6 flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={triggerConfetti}
                className="px-8 py-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-slate-950 rounded-full font-bold hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg shadow-amber-500/25"
              >
                🎉 Tembak Confetti
              </button>
              <a
                href="#cake"
                className="px-8 py-4 bg-slate-900/80 text-amber-300 border border-amber-500/30 rounded-full font-semibold hover:bg-amber-500/10 backdrop-blur-md transition-all duration-300"
              >
                🎂 Tiup Lilin ↓
              </a>
            </div>
          </div>
        </section>

        {/* 🎂 INTERACTIVE CAKE & CANDLE SECTION */}
        <section id="cake" className="relative z-10 py-20 px-4 bg-slate-900/50 backdrop-blur-md border-y border-amber-500/20">
          <div className="max-w-xl mx-auto text-center space-y-8">
            <h2 className="text-3xl font-bold text-amber-200">Make A Wish & Tiup Lilinnya</h2>

            {/* Ilustrasi Kue & Lilin Interactive */}
            <div className="relative py-12 flex flex-col items-center justify-center">
              {/* Nyala Api / Asap Lilin */}
              <div className="flex gap-6 mb-2">
                {[1, 2].map((i) => (
                  <div key={i} className="relative flex flex-col items-center">
                    {!candlesBlown ? (
                      <div className="w-4 h-6 bg-gradient-to-t from-amber-500 via-yellow-300 to-white rounded-full animate-pulse shadow-lg shadow-yellow-500/80"></div>
                    ) : (
                      <div className="w-1.5 h-8 bg-slate-400/40 rounded-full animate-ping"></div>
                    )}
                    <div className="w-1.5 h-12 bg-gradient-to-b from-indigo-300 to-blue-500 rounded-t-sm"></div>
                  </div>
                ))}
              </div>

              {/* Badan Kue */}
              <div className="w-56 h-24 bg-gradient-to-r from-amber-900/60 via-amber-800/80 to-amber-900/60 border border-amber-500/40 rounded-t-3xl relative shadow-2xl flex items-center justify-center">
                <span className="text-3xl font-black text-amber-300/40 tracking-widest">23</span>
                <div className="absolute top-0 inset-x-0 h-4 bg-amber-200/20 rounded-t-3xl"></div>
              </div>
              <div className="w-64 h-16 bg-gradient-to-r from-slate-800 to-slate-900 border border-amber-500/30 rounded-b-2xl shadow-xl"></div>
            </div>

            <button
              onClick={handleBlowCandle}
              disabled={candlesBlown}
              className={`px-8 py-3.5 rounded-full font-bold transition-all duration-300 ${
                candlesBlown
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                  : 'bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20'
              }`}
            >
              {candlesBlown ? '✨ Lilin Berhasil Ditiup!' : '💨 Tiup Lilin Sekarang'}
            </button>
          </div>
        </section>

        {/* ✉️ SURAT UCAPAN (GLASSMORPHISM) */}
        <section id="pesan" className="relative z-10 py-24 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-gradient-to-b from-slate-900/80 to-slate-950/80 backdrop-blur-xl border border-amber-500/30 p-8 md:p-12 rounded-3xl shadow-2xl shadow-amber-500/5 text-center space-y-6">
              <p className="text-xs font-semibold tracking-[0.2em] text-amber-400 uppercase">
                16 OKTOBER 2003 — 16 OKTOBER 2026
              </p>
              <h2 className="text-3xl font-extrabold text-amber-100">Untuk Yola Okta Vina</h2>
              
              <div className="space-y-4 text-slate-300 leading-relaxed font-light text-lg">
                <p>
                  Selamat bertambah usia yang ke-23 bebee ❤️
                </p>
                <p>
                  Semoga di fase 23 tahun ini, langkah bebee semakin dimudahkan, dikelilingi kebaikan, kesehatan, dan kebahagiaan yang tak pernah putus. Tetaplah menjadi pribadi yang lembut dan ceria.
                </p>
              </div>

              <div className="pt-6 border-t border-amber-500/20 text-amber-300 font-semibold text-xl">
                Dengan Penuh Cinta, <br />
                <span className="text-amber-400 font-bold">Cowokmu yang paling guantenggg maximallll ❤️</span>
              </div>
            </div>
          </div>
        </section>

        {/* 🖼️ 3D GALLERY & LIGHTBOX MODAL */}
        <section className="relative z-10 py-24 px-4 bg-slate-900/40 backdrop-blur-md border-t border-amber-500/20">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div>
              <h2 className="text-3xl font-bold text-amber-200">Galeri Momen Indah</h2>
              <p className="text-slate-400 text-sm mt-2">Klik foto untuk melihat pesan tersembunyi.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {galleryPhotos.map((photo, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(photo)}
                  className="group cursor-pointer aspect-[9/16] bg-slate-800/80 rounded-2xl border border-amber-500/20 overflow-hidden relative shadow-lg hover:scale-105 hover:border-amber-400/60 transition-all duration-300"
                >
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  <div className="absolute bottom-4 inset-x-4 text-left">
                    <p className="text-amber-300 font-semibold text-sm">{photo.title}</p>
                    <p className="text-slate-300 text-xs line-clamp-1">{photo.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LIGHTBOX MODAL */}
        {selectedImage && (
          <div
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="max-w-md w-full bg-slate-900 border border-amber-500/40 rounded-3xl overflow-hidden p-4 space-y-4 shadow-2xl">
              <div className="aspect-[9/16] rounded-2xl overflow-hidden">
                <img src={selectedImage.url} alt={selectedImage.title} className="w-full h-full object-cover" />
              </div>
              <div className="text-center p-2">
                <h3 className="text-amber-200 font-bold text-lg">{selectedImage.title}</h3>
                <p className="text-slate-300 text-sm mt-1">{selectedImage.desc}</p>
                <p className="text-xs text-amber-400/60 mt-3">Klik di mana saja untuk menutup</p>
              </div>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <footer className="relative z-10 py-8 text-center bg-slate-950 text-slate-500 text-xs border-t border-amber-500/10">
          <p>Created with ❤️ specially for Yola Okta Vina • 16 Oktober 2003</p>
        </footer>
      </main>

      {/* STYLES & ANIMATIONS */}
      <style jsx global>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 0; }
          10% { opacity: 0.7; }
          90% { opacity: 0.7; }
          100% { transform: translateY(-125vh) rotate(15deg); opacity: 0; }
        }
        .animate-float-up { animation: floatUp linear infinite; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}