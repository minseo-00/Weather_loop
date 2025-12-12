"use client";

import React from "react";

interface WeatherEffectsProps {
  weather: string; // "Clear", "Rain", "Snow", "Clouds", etc.
  isNight?: boolean;
}

export default function WeatherEffects({ weather, isNight = false }: WeatherEffectsProps) {
  const weatherLower = weather.toLowerCase();

  // 비 효과 - 밤
  if ((weatherLower.includes("rain") || weatherLower.includes("drizzle") || weatherLower.includes("thunderstorm")) && isNight) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 비오는 밤 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
        {/* 빗방울 */}
        {[...Array(100)].map((_, i) => {
          const left = `${(i * 1.01) % 100}%`;
          const delay = `${(i * 0.03) % 1.5}s`;
          const duration = `${0.4 + (i % 4) * 0.08}s`;
          const height = `${20 + (i % 8) * 3}px`;
          return (
            <div
              key={i}
              className="rain-drop absolute"
              style={{
                left,
                top: `-30px`,
                width: '2px',
                height,
                background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.6), rgba(174, 194, 224, 0.9))',
                borderRadius: '2px',
                animationDelay: delay,
                animationDuration: duration,
              }}
            />
          );
        })}
        <style>{`
          .rain-drop {
            animation: rainFall linear infinite;
          }
          @keyframes rainFall {
            0% {
              transform: translateY(0) rotate(15deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(15deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // 비 효과 - 낮
  if (weatherLower.includes("rain") || weatherLower.includes("drizzle") || weatherLower.includes("thunderstorm")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 비오는 낮 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
          }}
        />
        {/* 빗방울 */}
        {[...Array(100)].map((_, i) => {
          const left = `${(i * 1.01) % 100}%`;
          const delay = `${(i * 0.03) % 1.5}s`;
          const duration = `${0.4 + (i % 4) * 0.08}s`;
          const height = `${20 + (i % 8) * 3}px`;
          return (
            <div
              key={i}
              className="rain-drop absolute"
              style={{
                left,
                top: `-30px`,
                width: '2px',
                height,
                background: 'linear-gradient(to bottom, transparent, rgba(174, 194, 224, 0.5), rgba(174, 194, 224, 0.8))',
                borderRadius: '2px',
                animationDelay: delay,
                animationDuration: duration,
              }}
            />
          );
        })}
        <style>{`
          .rain-drop {
            animation: rainFall linear infinite;
          }
          @keyframes rainFall {
            0% {
              transform: translateY(0) rotate(15deg);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(15deg);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    );
  }

  // 눈 효과 - 밤
  if (weatherLower.includes("snow") && isNight) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 눈 오는 밤 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1478265409131-1f65c88f965c?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
        
        {/* 눈송이 */}
        {[...Array(50)].map((_, i) => {
          const left = `${(i * 2.04) % 100}%`;
          const delay = `${(i * 0.15) % 4}s`;
          const duration = `${4 + (i % 4)}s`;
          const size = `${12 + (i % 6) * 3}px`;
          return (
            <div
              key={i}
              className="snowflake absolute"
              style={{
                left,
                top: `-40px`,
                fontSize: size,
                animationDelay: delay,
                animationDuration: duration,
              }}
            >
              ❄
            </div>
          );
        })}

        <style>{`
          .snowflake {
            animation: snowFall linear infinite;
            color: white;
            text-shadow: 0 0 5px rgba(255,255,255,0.8);
          }
          @keyframes snowFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0.6;
            }
          }
        `}</style>
      </div>
    );
  }

  // 눈 효과 - 낮
  if (weatherLower.includes("snow")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 눈 오는 낮 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
          }}
        />
        
        {/* 눈송이 */}
        {[...Array(50)].map((_, i) => {
          const left = `${(i * 2.04) % 100}%`;
          const delay = `${(i * 0.15) % 4}s`;
          const duration = `${4 + (i % 4)}s`;
          const size = `${12 + (i % 6) * 3}px`;
          return (
            <div
              key={i}
              className="snowflake absolute"
              style={{
                left,
                top: `-40px`,
                fontSize: size,
                animationDelay: delay,
                animationDuration: duration,
              }}
            >
              ❄
            </div>
          );
        })}

        {/* 올라프 */}
        <div className="olaf absolute bottom-16 left-[15%]">
          <svg width="80" height="120" viewBox="0 0 80 120">
            {/* 하체 (큰 눈덩이) */}
            <ellipse cx="40" cy="100" rx="28" ry="18" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            {/* 중체 (중간 눈덩이) */}
            <ellipse cx="40" cy="70" rx="22" ry="16" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            {/* 단추 */}
            <circle cx="40" cy="62" r="2.5" fill="#333"/>
            <circle cx="40" cy="72" r="2.5" fill="#333"/>
            <circle cx="40" cy="82" r="2.5" fill="#333"/>
            {/* 머리 */}
            <circle cx="40" cy="38" r="18" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            {/* 눈 */}
            <ellipse cx="33" cy="34" rx="4" ry="5" fill="#333"/>
            <ellipse cx="47" cy="34" rx="4" ry="5" fill="#333"/>
            <circle cx="34" cy="33" r="1.5" fill="#fff"/>
            <circle cx="48" cy="33" r="1.5" fill="#fff"/>
            {/* 눈썹 */}
            <path d="M28 28 Q33 26 38 28" stroke="#333" strokeWidth="2" fill="none"/>
            <path d="M42 28 Q47 26 52 28" stroke="#333" strokeWidth="2" fill="none"/>
            {/* 당근 코 */}
            <polygon points="40,38 40,42 58,40" fill="#ff6b35"/>
            {/* 입 */}
            <path d="M32 48 Q40 54 48 48" stroke="#333" strokeWidth="2" fill="none"/>
            {/* 이빨 */}
            <rect x="38" y="48" width="4" height="3" fill="#fff" stroke="#333" strokeWidth="0.5"/>
            {/* 나뭇가지 팔 */}
            <g className="olaf-wave">
              <line x1="62" y1="65" x2="78" y2="55" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
              <line x1="75" y1="58" x2="80" y2="50" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
              <line x1="72" y1="56" x2="75" y2="48" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            </g>
            <line x1="18" y1="65" x2="2" y2="55" stroke="#5D4037" strokeWidth="3" strokeLinecap="round"/>
            <line x1="5" y1="58" x2="0" y2="50" stroke="#5D4037" strokeWidth="2" strokeLinecap="round"/>
            {/* 머리 위 나뭇가지 */}
            <line x1="40" y1="20" x2="40" y2="8" stroke="#5D4037" strokeWidth="2"/>
            <line x1="40" y1="12" x2="35" y2="6" stroke="#5D4037" strokeWidth="2"/>
            <line x1="40" y1="12" x2="45" y2="6" stroke="#5D4037" strokeWidth="2"/>
          </svg>
        </div>

        {/* 눈싸움하는 아이들 */}
        <div className="kids-playing absolute bottom-12 right-[10%]">
          <svg width="200" height="140" viewBox="0 0 200 140">
            {/* 왼쪽 아이 - 눈덩이 던지는 중 */}
            <g className="kid-throw">
              {/* 몸 */}
              <rect x="30" y="70" width="28" height="35" rx="5" fill="#e53935"/>
              {/* 다리 */}
              <rect x="32" y="105" width="10" height="25" rx="3" fill="#1565c0"/>
              <rect x="46" y="105" width="10" height="25" rx="3" fill="#1565c0"/>
              {/* 부츠 */}
              <ellipse cx="37" cy="132" rx="8" ry="5" fill="#5D4037"/>
              <ellipse cx="51" cy="132" rx="8" ry="5" fill="#5D4037"/>
              {/* 머리 */}
              <circle cx="44" cy="52" r="16" fill="#ffccbc"/>
              {/* 모자 */}
              <ellipse cx="44" cy="42" rx="14" ry="6" fill="#43a047"/>
              <rect x="32" y="32" width="24" height="12" rx="3" fill="#43a047"/>
              <circle cx="44" cy="30" r="5" fill="#fff"/>
              {/* 얼굴 */}
              <circle cx="38" cy="50" r="2" fill="#333"/>
              <circle cx="50" cy="50" r="2" fill="#333"/>
              <path d="M40 56 Q44 60 48 56" stroke="#e57373" strokeWidth="2" fill="none"/>
              {/* 볼 홍조 */}
              <ellipse cx="34" cy="54" rx="4" ry="2" fill="#ffcdd2"/>
              <ellipse cx="54" cy="54" rx="4" ry="2" fill="#ffcdd2"/>
              {/* 팔 - 눈덩이 들고 있음 */}
              <rect x="55" y="72" width="22" height="8" rx="3" fill="#e53935" transform="rotate(-30 55 72)"/>
              {/* 장갑 */}
              <circle cx="75" cy="62" r="6" fill="#ffeb3b"/>
              {/* 눈덩이 */}
              <circle cx="80" cy="55" r="8" fill="#fff" stroke="#e0e0e0" strokeWidth="1" className="snowball-throw"/>
            </g>

            {/* 오른쪽 아이 - 눈덩이 맞고 있음 */}
            <g className="kid-hit">
              {/* 몸 */}
              <rect x="140" y="75" width="28" height="35" rx="5" fill="#7b1fa2"/>
              {/* 다리 */}
              <rect x="142" y="110" width="10" height="22" rx="3" fill="#0d47a1"/>
              <rect x="156" y="110" width="10" height="22" rx="3" fill="#0d47a1"/>
              {/* 부츠 */}
              <ellipse cx="147" cy="134" rx="8" ry="5" fill="#4e342e"/>
              <ellipse cx="161" cy="134" rx="8" ry="5" fill="#4e342e"/>
              {/* 머리 */}
              <circle cx="154" cy="57" r="16" fill="#ffccbc"/>
              {/* 모자 */}
              <rect x="140" y="38" width="28" height="14" rx="2" fill="#f44336"/>
              <ellipse cx="154" cy="52" rx="16" ry="4" fill="#f44336"/>
              {/* 얼굴 - 놀란 표정 */}
              <circle cx="148" cy="54" r="3" fill="#333"/>
              <circle cx="160" cy="54" r="3" fill="#333"/>
              <ellipse cx="154" cy="64" rx="4" ry="5" fill="#333"/>
              {/* 볼 홍조 */}
              <ellipse cx="144" cy="58" rx="4" ry="2" fill="#ffcdd2"/>
              <ellipse cx="164" cy="58" rx="4" ry="2" fill="#ffcdd2"/>
              {/* 팔 - 방어 자세 */}
              <rect x="125" y="78" width="18" height="8" rx="3" fill="#7b1fa2"/>
              <circle cx="122" cy="82" r="5" fill="#ffeb3b"/>
              {/* 머리 위 눈 파편 */}
              <circle cx="135" cy="45" r="4" fill="#fff" className="snow-splash"/>
              <circle cx="145" cy="40" r="3" fill="#fff" className="snow-splash"/>
              <circle cx="165" cy="42" r="3" fill="#fff" className="snow-splash"/>
            </g>

            {/* 쌓인 눈더미 */}
            <ellipse cx="100" cy="135" rx="50" ry="8" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            <ellipse cx="30" cy="138" rx="25" ry="5" fill="#f5f5f5"/>
            <ellipse cx="170" cy="138" rx="30" ry="6" fill="#f5f5f5"/>
          </svg>
        </div>

        {/* 눈사람 만드는 아이 */}
        <div className="kid-building absolute bottom-20 left-[45%]">
          <svg width="100" height="100" viewBox="0 0 100 100">
            {/* 만들고 있는 눈사람 */}
            <ellipse cx="65" cy="85" rx="18" ry="12" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            <ellipse cx="65" cy="65" rx="12" ry="10" fill="#fff" stroke="#e0e0e0" strokeWidth="1"/>
            {/* 아이 */}
            <g className="kid-build-anim">
              {/* 몸 */}
              <rect x="15" y="50" width="22" height="30" rx="4" fill="#ff9800"/>
              {/* 다리 */}
              <rect x="17" y="80" width="8" height="18" rx="2" fill="#2196f3"/>
              <rect x="27" y="80" width="8" height="18" rx="2" fill="#2196f3"/>
              {/* 부츠 */}
              <ellipse cx="21" cy="100" rx="6" ry="4" fill="#5D4037"/>
              <ellipse cx="31" cy="100" rx="6" ry="4" fill="#5D4037"/>
              {/* 머리 */}
              <circle cx="26" cy="36" r="13" fill="#ffccbc"/>
              {/* 머리카락 */}
              <ellipse cx="26" cy="28" rx="10" ry="6" fill="#5D4037"/>
              {/* 얼굴 */}
              <circle cx="22" cy="35" r="2" fill="#333"/>
              <circle cx="30" cy="35" r="2" fill="#333"/>
              <path d="M23 40 Q26 43 29 40" stroke="#e57373" strokeWidth="1.5" fill="none"/>
              {/* 볼 홍조 */}
              <ellipse cx="19" cy="38" rx="3" ry="1.5" fill="#ffcdd2"/>
              <ellipse cx="33" cy="38" rx="3" ry="1.5" fill="#ffcdd2"/>
              {/* 팔 - 눈사람 만드는 중 */}
              <rect x="35" y="55" width="18" height="6" rx="2" fill="#ff9800"/>
              <circle cx="52" cy="58" r="4" fill="#ffeb3b"/>
            </g>
          </svg>
        </div>

        <style>{`
          .snowflake {
            animation: snowFall linear infinite;
            color: white;
            text-shadow: 0 0 8px rgba(100,149,237,0.8);
          }
          @keyframes snowFall {
            0% {
              transform: translateY(0) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(360deg);
              opacity: 0.6;
            }
          }

          .olaf-wave {
            animation: olafWave 1s ease-in-out infinite;
            transform-origin: 62px 65px;
          }
          @keyframes olafWave {
            0%, 100% { transform: rotate(-10deg); }
            50% { transform: rotate(15deg); }
          }

          .kid-throw {
            animation: throwAnim 2s ease-in-out infinite;
            transform-origin: 44px 100px;
          }
          @keyframes throwAnim {
            0%, 100% { transform: rotate(0deg); }
            30% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }

          .snowball-throw {
            animation: snowballFly 2s ease-in-out infinite;
          }
          @keyframes snowballFly {
            0%, 40% { transform: translateX(0) translateY(0); opacity: 1; }
            60% { transform: translateX(40px) translateY(-20px); opacity: 1; }
            80% { transform: translateX(60px) translateY(0); opacity: 0; }
            100% { transform: translateX(0) translateY(0); opacity: 1; }
          }

          .kid-hit {
            animation: hitReact 2s ease-in-out infinite;
            transform-origin: 154px 100px;
          }
          @keyframes hitReact {
            0%, 50% { transform: rotate(0deg); }
            60%, 70% { transform: rotate(-8deg); }
            80%, 100% { transform: rotate(0deg); }
          }

          .snow-splash {
            animation: splashAnim 2s ease-in-out infinite;
          }
          @keyframes splashAnim {
            0%, 55% { opacity: 0; transform: translateY(0); }
            60% { opacity: 1; transform: translateY(-5px); }
            80% { opacity: 1; transform: translateY(10px); }
            100% { opacity: 0; transform: translateY(15px); }
          }

          .kid-build-anim {
            animation: buildAnim 1.5s ease-in-out infinite;
            transform-origin: 26px 80px;
          }
          @keyframes buildAnim {
            0%, 100% { transform: rotate(0deg) translateX(0); }
            50% { transform: rotate(3deg) translateX(2px); }
          }
        `}</style>
      </div>
    );
  }

  // 맑음 - 밤
  if ((weatherLower.includes("clear") || weatherLower === "") && isNight) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 밤하늘 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
          }}
        />
        
        {/* 달 + 토끼 떡방아 */}
        <div className="absolute top-20 right-20">
          {/* 달 */}
          <div 
            className="w-28 h-28 rounded-full bg-gradient-to-br from-yellow-100 via-yellow-200 to-amber-200 shadow-[0_0_80px_30px_rgba(255,255,200,0.4)]"
            style={{ position: 'relative' }}
          >
            {/* 달 표면 크레이터 */}
            <div className="absolute top-4 left-5 w-4 h-4 rounded-full bg-yellow-300/40"></div>
            <div className="absolute top-8 right-6 w-3 h-3 rounded-full bg-yellow-300/30"></div>
            <div className="absolute bottom-6 left-8 w-5 h-5 rounded-full bg-yellow-300/35"></div>
            
            {/* 토끼 떡방아 찧는 모습 */}
            <svg width="60" height="55" viewBox="0 0 60 55" className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {/* 절구 */}
              <ellipse cx="38" cy="48" rx="12" ry="5" fill="#8B4513"/>
              <rect x="26" y="40" width="24" height="8" fill="#A0522D"/>
              <ellipse cx="38" cy="40" rx="12" ry="4" fill="#CD853F"/>
              {/* 떡 */}
              <ellipse cx="38" cy="41" rx="8" ry="3" fill="#fff"/>
              
              {/* 토끼 */}
              <g className="bunny-pound">
                {/* 몸통 */}
                <ellipse cx="20" cy="38" rx="10" ry="8" fill="#fff"/>
                {/* 머리 */}
                <circle cx="18" cy="26" r="8" fill="#fff"/>
                {/* 귀 */}
                <ellipse cx="14" cy="14" rx="3" ry="10" fill="#fff"/>
                <ellipse cx="22" cy="14" rx="3" ry="10" fill="#fff"/>
                <ellipse cx="14" cy="14" rx="1.5" ry="7" fill="#ffb6c1"/>
                <ellipse cx="22" cy="14" rx="1.5" ry="7" fill="#ffb6c1"/>
                {/* 눈 */}
                <circle cx="15" cy="25" r="1.5" fill="#d32f2f"/>
                <circle cx="21" cy="25" r="1.5" fill="#d32f2f"/>
                {/* 코 */}
                <ellipse cx="18" cy="29" rx="1.5" ry="1" fill="#ffb6c1"/>
                {/* 꼬리 */}
                <circle cx="10" cy="40" r="4" fill="#fff"/>
              </g>
              
              {/* 절구공이 */}
              <g className="mochi-stick">
                <rect x="30" y="15" width="4" height="28" rx="2" fill="#8B4513"/>
                <ellipse cx="32" cy="14" rx="5" ry="3" fill="#A0522D"/>
              </g>
            </svg>
          </div>
        </div>

        {/* 반짝이는 별들 */}
        {[...Array(15)].map((_, i) => (
          <div
            key={`star-${i}`}
            className="twinkle-star absolute"
            style={{
              left: `${5 + (i * 6) % 75}%`,
              top: `${8 + (i * 4.5) % 35}%`,
              fontSize: `${6 + (i % 3) * 3}px`,
              animationDelay: `${(i * 0.4) % 3}s`,
            }}
          >
            ✦
          </div>
        ))}

        {/* 오른쪽 하단 캠핑 아저씨 */}
        <div className="camping-scene absolute bottom-0 right-8">
          <svg width="180" height="140" viewBox="0 0 180 140">
            {/* 나무들 (숲 배경) */}
            <polygon points="10,140 25,60 40,140" fill="#1a3d1a"/>
            <polygon points="30,140 50,40 70,140" fill="#0d2d0d"/>
            <polygon points="55,140 75,55 95,140" fill="#1a3d1a"/>
            
            {/* 텐트 */}
            <polygon points="100,140 130,70 160,140" fill="#ff6b35"/>
            <polygon points="130,70 145,140 160,140" fill="#e55a2b"/>
            <polygon points="115,140 130,100 145,140" fill="#333"/>
            
            {/* 모닥불 */}
            <ellipse cx="80" cy="135" rx="15" ry="4" fill="#4a3728"/>
            {/* 장작 */}
            <rect x="70" y="128" width="20" height="4" rx="2" fill="#8B4513" transform="rotate(-15 80 130)"/>
            <rect x="70" y="128" width="20" height="4" rx="2" fill="#A0522D" transform="rotate(15 80 130)"/>
            {/* 불꽃 */}
            <g className="campfire-flame">
              <ellipse cx="80" cy="122" rx="6" ry="10" fill="#ff4500"/>
              <ellipse cx="80" cy="120" rx="4" ry="8" fill="#ff6a00"/>
              <ellipse cx="80" cy="118" rx="2" ry="5" fill="#ffcc00"/>
            </g>
            {/* 불빛 글로우 */}
            <ellipse cx="80" cy="125" rx="20" ry="8" fill="rgba(255,100,0,0.2)" className="fire-glow"/>
            
            {/* 캠핑 아저씨 */}
            <g className="camper-sitting">
              {/* 다리 (앉아있음) */}
              <rect x="55" y="115" width="16" height="8" rx="3" fill="#2d5a8a"/>
              {/* 몸통 */}
              <rect x="52" y="95" width="20" height="22" rx="3" fill="#3d7cbd"/>
              {/* 머리 */}
              <circle cx="62" cy="85" r="10" fill="#e8c4a0"/>
              {/* 머리카락 */}
              <ellipse cx="62" cy="78" rx="9" ry="5" fill="#4a3728"/>
              {/* 모자 */}
              <ellipse cx="62" cy="77" rx="11" ry="3" fill="#d35400"/>
              <rect x="54" y="70" width="16" height="8" rx="2" fill="#e67e22"/>
              {/* 얼굴 */}
              <circle cx="58" cy="84" r="1.5" fill="#333"/>
              <circle cx="66" cy="84" r="1.5" fill="#333"/>
              <path d="M59 89 Q62 91 65 89" stroke="#333" strokeWidth="1" fill="none"/>
              {/* 손 (막대기 들고 있음) */}
              <circle cx="72" cy="105" r="4" fill="#e8c4a0"/>
              {/* 꼬치 막대 */}
              <line x1="72" y1="105" x2="82" y2="118" stroke="#8B4513" strokeWidth="2"/>
              {/* 마시멜로 */}
              <circle cx="82" cy="118" r="4" fill="#fff"/>
            </g>
          </svg>
        </div>

        {/* 유성 */}
        <div className="shooting-star absolute"></div>

        <style>{`
          .twinkle-star {
            color: #fff;
            text-shadow: 0 0 8px #fff, 0 0 15px #fff;
            animation: twinkle 2.5s ease-in-out infinite;
          }
          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(0.9); }
            50% { opacity: 1; transform: scale(1.1); }
          }

          .bunny-pound {
            animation: bunnyPound 0.6s ease-in-out infinite;
            transform-origin: 20px 45px;
          }
          @keyframes bunnyPound {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }

          .mochi-stick {
            animation: stickPound 0.6s ease-in-out infinite;
            transform-origin: 32px 43px;
          }
          @keyframes stickPound {
            0%, 100% { transform: rotate(20deg) translateY(0); }
            50% { transform: rotate(-10deg) translateY(8px); }
          }

          .campfire-flame {
            animation: flameFlicker 0.3s ease-in-out infinite alternate;
          }
          @keyframes flameFlicker {
            0% { transform: scaleY(1) scaleX(1); }
            100% { transform: scaleY(1.1) scaleX(0.95); }
          }

          .fire-glow {
            animation: glowPulse 1s ease-in-out infinite alternate;
          }
          @keyframes glowPulse {
            0% { opacity: 0.2; }
            100% { opacity: 0.4; }
          }

          .camper-sitting {
            animation: camperSway 3s ease-in-out infinite;
            transform-origin: 62px 130px;
          }
          @keyframes camperSway {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
          }

          .shooting-star {
            top: 15%;
            left: -60px;
            width: 60px;
            height: 2px;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.8), #fff);
            border-radius: 50%;
            box-shadow: 0 0 6px #fff;
            animation: shootingStar 7s linear infinite;
          }
          @keyframes shootingStar {
            0% { transform: translateX(0) translateY(0); opacity: 0; }
            5% { opacity: 1; }
            15% { opacity: 1; }
            25% { transform: translateX(calc(100vw + 100px)) translateY(100px); opacity: 0; }
            100% { transform: translateX(calc(100vw + 100px)) translateY(100px); opacity: 0; }
          }
        `}</style>
      </div>
    );
  }

  // 맑음 - 낮
  if (weatherLower.includes("clear") || weatherLower === "") {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 맑은 낮 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1601297183305-6df142704ea2?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.85,
          }}
        />
      </div>
    );
  }

  // 흐림 - 밤
  if ((weatherLower.includes("cloud") || weatherLower.includes("mist") || weatherLower.includes("fog")) && isNight) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 흐린 밤 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.9,
          }}
        />
      </div>
    );
  }

  // 흐림 - 낮
  if (weatherLower.includes("cloud") || weatherLower.includes("mist") || weatherLower.includes("fog")) {
    return (
      <div className="pointer-events-none fixed inset-0 z-10 overflow-hidden">
        {/* 흐린 낮 이미지 배경 */}
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=1920&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.75,
          }}
        />
      </div>
    );
  }

  return null;
}
