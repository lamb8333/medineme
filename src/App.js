import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Stars,
  Music,
  ChevronRight,
  ChevronLeft,
  Gift,
  Sun,
  Moon,
  Infinity,
  Eye,
  Cloud,
  Sparkles,
  Feather,
  Camera,
  Clock,
  MapPin,
  Volume2,
  VolumeX,
  Play,
} from "lucide-react";

// --- AYARLAR ---
const START_DATE = new Date(2024, 10, 3, 5, 0);

// --- MÜZİK KAYNAĞI ---
const MUSIC_URL =
  "https://archive.org/download/because-this-must-be-nils-frahm-calm-and-introspective-piano/Because%20this%20must%20be%20-%20Nils%20Frahm%20%20Calm%20and%20introspective%20piano.mp3";

const slides = [
  {
    id: 1,
    title: "Merhaba Medoş'um",
    text: "Senin için kalbimden gelen özel bir sürpriz hazırladım. Hazır mısın?",
    icon: (
      <Gift size={64} className="text-white drop-shadow-lg animate-bounce" />
    ),
    bg: "from-pink-500 to-rose-500",
  },
  {
    id: 12,
    title: "Seninle Geçen Her An",
    text: "Zaman sadece seninle akarken güzel...",
    isCounter: true,
    icon: (
      <Clock size={64} className="text-white drop-shadow-lg animate-pulse" />
    ),
    bg: "from-violet-500 to-fuchsia-500",
  },
  {
    id: 2,
    title: "Gülüşün...",
    text: "Gülüşün benim için güneşin doğuşu gibi. Karanlık günlerimi aydınlatan tek ışığım sensin.",
    icon: (
      <Sun
        size={64}
        className="text-yellow-300 drop-shadow-lg animate-spin-slow"
      />
    ),
    bg: "from-orange-400 to-pink-500",
  },
  {
    id: 3,
    title: "Gözlerin",
    text: "Gözlerine her baktığımda, içinde kaybolduğum uçsuz bucaksız bir okyanus görüyorum.",
    icon: <Eye size={64} className="text-blue-200 drop-shadow-lg" />,
    bg: "from-blue-400 to-cyan-600",
  },
  {
    id: 4,
    title: "Huzurum",
    text: "Senin yanında olduğumda zaman duruyor. Dünyanın en güvenli limanı senin kolların.",
    icon: <Moon size={64} className="text-indigo-200 drop-shadow-lg" />,
    bg: "from-indigo-500 to-purple-600",
  },
  {
    id: 5,
    title: "Sesin",
    text: "Duymaktan bıkmayacağım en güzel melodi, senin o tatlı sesin sevgilim.",
    icon: (
      <Music
        size={64}
        className="text-purple-300 drop-shadow-lg animate-pulse"
      />
    ),
    bg: "from-purple-500 to-pink-500",
  },
  {
    id: 6,
    title: "Senin İçin...",
    text: "Sana olan hislerimi anlatmaya kelimeler yetmez ama, kalbimden dökülen bir kaç dize var...",
    icon: <Feather size={64} className="text-white drop-shadow-lg" />,
    bg: "from-rose-400 to-orange-400",
  },
  {
    id: 7,
    title: "Kalbimin Baharı",
    text: "Baharda açan çiçekler kadar güzelsin, kalbimin en derin yerinde açan tek çiçeksin.",
    icon: <Cloud size={64} className="text-white drop-shadow-lg" />,
    bg: "from-sky-400 to-blue-500",
  },
  {
    id: 8,
    title: "Her Anımda Sen",
    text: "Ne zaman aklıma düşsen, yüzümde istemsiz bir tebessüm, kalbimde tatlı bir çarpıntı.",
    icon: (
      <Sparkles
        size={64}
        className="text-yellow-200 drop-shadow-lg animate-spin"
      />
    ),
    bg: "from-yellow-400 to-orange-500",
  },
  {
    id: 9,
    title: "Mesafeler...",
    text: "Aramızda yollar olabilir ama kalbim her an seninle. En güzel fotoğraflarımızı kavuştuğumuz gün çekeceğiz.",
    icon: (
      <MapPin
        size={64}
        className="text-red-100 drop-shadow-lg animate-bounce"
      />
    ),
    bg: "from-teal-400 to-emerald-600",
  },
  {
    id: 10,
    title: "Yıldızım",
    text: "Gökyüzündeki tüm yıldızları toplasam, senin gözlerinin parıltısı kadar etmez.",
    icon: (
      <Stars
        size={64}
        className="text-yellow-200 drop-shadow-lg animate-pulse"
      />
    ),
    bg: "from-blue-600 to-indigo-800",
  },
  {
    id: 11,
    title: "Sonsuza Kadar",
    text: "Seni her şeyden çok seviyorum Medoş. İyi ki hayatımdasın, iyi ki benimsin.",
    icon: <Infinity size={64} className="text-white drop-shadow-lg" />,
    bg: "from-red-500 to-pink-600",
  },
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [floatingHearts, setFloatingHearts] = useState([]);
  const [timeTogether, setTimeTogether] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [musicState, setMusicState] = useState("melody"); // 'melody' | 'heartbeat'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [appStarted, setAppStarted] = useState(false);

  // Audio Referansları
  const audioCtxRef = useRef(null);
  const audioRef = useRef(null);
  const heartbeatTimerRef = useRef(null);

  // --- UYGULAMAYI BAŞLAT ---
  const startApp = () => {
    // AudioContext'i başlat
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }

    // Müziği oynat
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().catch((e) => console.log("Başlatma hatası:", e));
    }
    setAppStarted(true);
  };

  // --- KALP ATIŞI SENTEZİ ---
  const playHeartbeatSound = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    const createBeat = (freq, vol, time) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, time);
      osc.frequency.exponentialRampToValueAtTime(30, time + 0.1);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(100, time);
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(vol, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      osc.start(time);
      osc.stop(time + 0.5);
    };

    // Güp - güp
    createBeat(60, 1.5, t);
    createBeat(90, 0.8, t + 0.35);
  };

  const toggleAudioMode = () => {
    // Garanti başlatma
    if (!audioCtxRef.current) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new AudioContext();
      audioCtxRef.current.resume();
    }

    if (musicState === "melody") {
      // Müziği durdur, Kalbi başlat
      if (audioRef.current) {
        let vol = 0.5;
        const fadeOut = setInterval(() => {
          if (vol > 0.05) {
            vol -= 0.1;
            if (audioRef.current) audioRef.current.volume = vol;
          } else {
            if (audioRef.current) {
              audioRef.current.pause();
              audioRef.current.volume = 0.5;
            }
            clearInterval(fadeOut);
          }
        }, 50);
      }
      playHeartbeatSound();
      heartbeatTimerRef.current = setInterval(playHeartbeatSound, 1200);
      setMusicState("heartbeat");
    } else {
      // Kalbi durdur, Müziği başlat
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (audioRef.current)
        audioRef.current.play().catch((e) => console.error(e));
      setMusicState("melody");
    }
  };

  useEffect(() => {
    return () => {
      if (heartbeatTimerRef.current) clearInterval(heartbeatTimerRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close();
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = now - START_DATE;
      setTimeTogether({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now() + Math.random();
      setFloatingHearts((prev) => [
        ...prev,
        {
          id,
          left: Math.random() * 100,
          size: Math.random() * 20 + 10,
          duration: Math.random() * 3 + 2,
          delay: 0,
        },
      ]);
      setTimeout(
        () => setFloatingHearts((prev) => prev.filter((h) => h.id !== id)),
        5000
      );
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const blastHearts = () => {
    for (let i = 0; i < 10; i++) {
      setTimeout(() => {
        const id = Date.now() + Math.random();
        setFloatingHearts((prev) => [
          ...prev,
          { id, left: Math.random() * 100, size: 40, duration: 2, delay: 0 },
        ]);
        setTimeout(
          () => setFloatingHearts((prev) => prev.filter((h) => h.id !== id)),
          2000
        );
      }, i * 80);
    }
  };

  const nextSlide = () =>
    currentSlide < slides.length - 1 && setCurrentSlide((prev) => prev + 1);
  const prevSlide = () =>
    currentSlide > 0 && setCurrentSlide((prev) => prev - 1);
  const handleRestart = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(0);
      setIsTransitioning(false);
    }, 1500);
  };

  return (
    <div
      className={`relative w-full h-screen overflow-hidden flex flex-col items-center justify-center transition-colors duration-700 ${
        !appStarted
          ? "bg-pink-600"
          : `bg-gradient-to-br ${slides[currentSlide].bg}`
      }`}
    >
      <audio ref={audioRef} src={MUSIC_URL} loop preload="auto" />

      {floatingHearts.map((heart) => (
        <div
          key={heart.id}
          className="absolute bottom-0 opacity-40 text-white pointer-events-none"
          style={{
            left: `${heart.left}%`,
            fontSize: `${heart.size}px`,
            animation: `floatUp ${heart.duration}s linear`,
            animationDelay: `${heart.delay}s`,
          }}
        >
          ❤
        </div>
      ))}

      {!appStarted ? (
        // GİRİŞ EKRANI
        <div className="z-10 text-center space-y-8 p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl animate-fadeIn w-11/12 max-w-md">
          <div className="bg-white p-4 rounded-full inline-block shadow-lg animate-bounce">
            <Heart size={48} className="text-pink-600 fill-pink-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Medoş'a Özel</h1>
            <p className="text-white/80">Sana bir sürprizim var...</p>
          </div>
          <button
            onClick={startApp}
            className="group relative px-8 py-4 bg-white text-pink-600 font-bold rounded-full text-lg shadow-xl hover:scale-105 transition-all flex items-center gap-3 mx-auto"
          >
            <Play size={24} fill="currentColor" /> Mektubu Aç
            <div className="absolute inset-0 rounded-full ring-2 ring-white/50 animate-ping opacity-75"></div>
          </button>
          <div className="pt-8 text-white/60 text-sm">Medoş'a Özel ❤️</div>
        </div>
      ) : (
        // ANA UYGULAMA
        <>
          {isTransitioning && (
            <div className="fixed inset-0 z-50 flex items-end justify-center overflow-hidden pointer-events-none">
              {Array.from({ length: 40 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-0 text-white animate-heartStorm"
                  style={{
                    left: `${Math.random() * 100}%`,
                    fontSize: `${Math.random() * 60 + 20}px`,
                    animationDelay: `${Math.random() * 0.5}s`,
                  }}
                >
                  ❤
                </div>
              ))}
            </div>
          )}

          <div className="relative z-10 w-11/12 max-w-md aspect-[3/5] bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-8 overflow-hidden animate-fadeIn">
            {/* İlerleme Çubuğu */}
            <div className="w-full flex gap-1 mb-2">
              {slides.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full flex-1 transition-all ${
                    idx <= currentSlide ? "bg-white" : "bg-white/30"
                  }`}
                />
              ))}
            </div>

            {/* "Seni Görünce Kalbim" Butonu - KARTIN İÇİNDE, SEKMELERİN ALTINDA, SAĞDA */}
            <div className="w-full flex justify-end mb-4">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleAudioMode();
                }}
                className={`flex items-center gap-2 px-3 py-1.5 bg-white/20 backdrop-blur-md rounded-full cursor-pointer border border-white/20 shadow-sm hover:bg-white/30 transition-all ${
                  musicState === "heartbeat" ? "ring-2 ring-red-400/50" : ""
                }`}
              >
                {musicState === "heartbeat" ? (
                  <Heart
                    size={16}
                    className="text-white scale-110 fill-current"
                  />
                ) : (
                  <Heart size={16} className="text-white" />
                )}
                <span
                  className={`text-white font-medium text-xs ${
                    musicState === "heartbeat"
                      ? "animate-pulse font-bold text-red-100"
                      : ""
                  }`}
                >
                  Seni Görünce Kalbim
                </span>
              </div>
            </div>

            <div className="flex-1 w-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="transform transition-all duration-500 hover:scale-105">
                {slides[currentSlide].image ? (
                  <div className="relative w-64 h-48 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/30 mx-auto group">
                    <img
                      src={slides[currentSlide].image}
                      alt="Bizim Anımız"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                  </div>
                ) : (
                  slides[currentSlide].icon
                )}
              </div>
              <div className="space-y-4 w-full">
                <h1 className="text-3xl font-bold text-white drop-shadow-md tracking-wide">
                  {slides[currentSlide].title}
                </h1>
                {slides[currentSlide].isCounter ? (
                  <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                    <div className="grid grid-cols-2 gap-4 text-white">
                      <div>
                        <span className="text-3xl font-bold">
                          {timeTogether.days}
                        </span>
                        <br />
                        <span className="text-xs uppercase opacity-80">
                          Gün
                        </span>
                      </div>
                      <div>
                        <span className="text-3xl font-bold">
                          {timeTogether.hours}
                        </span>
                        <br />
                        <span className="text-xs uppercase opacity-80">
                          Saat
                        </span>
                      </div>
                      <div>
                        <span className="text-3xl font-bold">
                          {timeTogether.minutes}
                        </span>
                        <br />
                        <span className="text-xs uppercase opacity-80">
                          Dakika
                        </span>
                      </div>
                      <div>
                        <span className="text-3xl font-bold">
                          {timeTogether.seconds}
                        </span>
                        <br />
                        <span className="text-xs uppercase opacity-80">
                          Saniye
                        </span>
                      </div>
                    </div>
                    <div className="mt-4 text-sm text-white/90 italic">
                      "Ve seni sevmeye devam ediyorum..."
                    </div>
                  </div>
                ) : (
                  <p className="text-lg text-white/90 leading-relaxed font-medium drop-shadow-sm">
                    {slides[currentSlide].text}
                  </p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-between items-center mt-6 relative z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  prevSlide();
                }}
                className={`p-3 rounded-full bg-white/20 hover:bg-white/30 text-white ${
                  currentSlide === 0 ? "opacity-0" : ""
                }`}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  blastHearts();
                }}
                className="active:scale-90 transition-transform"
              >
                <div className="bg-red-500 p-4 rounded-full shadow-lg border-4 border-white/30 animate-pulse">
                  <Heart fill="white" className="text-white w-6 h-6" />
                </div>
              </button>
              {currentSlide === slides.length - 1 ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRestart();
                  }}
                  className="px-4 py-3 rounded-full bg-white text-pink-600 font-bold shadow-lg flex items-center gap-2 text-sm z-50"
                >
                  <Infinity size={18} /> Sonsuza Dek
                </button>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    nextSlide();
                  }}
                  className="p-3 rounded-full bg-white text-pink-500 shadow-lg"
                >
                  <ChevronRight size={28} />
                </button>
              )}
            </div>
          </div>
        </>
      )}

      <style>{`
        @keyframes floatUp { 0% { transform: translateY(0) rotate(0deg); opacity: 0; } 10% { opacity: 0.6; } 100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes heartStorm { 0% { transform: translateY(100vh); opacity: 0; } 10% { opacity: 1; } 100% { transform: translateY(-20vh); opacity: 0; } }
        .animate-fadeIn { animation: fadeIn 0.8s ease-out forwards; }
        .animate-heartStorm { animation: heartStorm 1.5s ease-out forwards; will-change: transform, opacity; }
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
