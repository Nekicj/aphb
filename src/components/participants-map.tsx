import { useEffect, useRef, useState } from 'react';

export interface ParticipantLocation {
  city: string;
  country: string;
  lat: number;
  lng: number;
  participants: number;
}

interface ParticipantsMapProps {
  locations: ParticipantLocation[];
  className?: string;
}

export default function ParticipantsMap({ locations, className = '' }: ParticipantsMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    // Динамически импортируем Leaflet только на клиенте
    const initMap = async () => {
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');
      await import('./participants-map.css');

      // Исправляем проблему с иконками маркеров в Leaflet
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });

      // Создаем карту
      const map = L.map(mapRef.current!, {
        center: [43.2220, 76.8512], // Алматы как центр
        zoom: 4,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Добавляем тайлы карты
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;

      // Добавляем маркеры для каждого местоположения
      locations.forEach((location) => {
        // Функция для получения цвета по стране
        const getCountryColor = (country: string) => {
          const countryColors: Record<string, string> = {
            'Казахстан': '#1D4ED8',    // Синий (бренд)
            'Россия': '#ef4444',       // Красный
            'Узбекистан': '#22c55e',   // Зеленый
            'Кыргызстан': '#f59e0b',   // Оранжевый
            'Таджикистан': '#8b5cf6',  // Фиолетовый
            'Беларусь': '#06b6d4',     // Голубой
          };
          return countryColors[country] || '#6b7280'; // Серый по умолчанию
        };

        const markerSize = 20;
        const markerColor = getCountryColor(location.country);

        // Создаем кастомную иконку
        const customIcon = L.divIcon({
          className: 'custom-marker',
          html: `
            <div style="
              width: ${markerSize}px; 
              height: ${markerSize}px; 
              background-color: ${markerColor}; 
              border: 2px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 8px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 10px;
            ">
              •
            </div>
          `,
          iconSize: [markerSize, markerSize],
          iconAnchor: [markerSize/2, markerSize/2],
        });

        const marker = L.marker([location.lat, location.lng], { icon: customIcon }).addTo(map);
        
        // Создаем popup с информацией
        const popupContent = `
          <div class="text-center p-3 min-w-[200px]">
            <h3 class="font-bold text-xl text-primary-900 mb-1">${location.city}</h3>
            <p class="text-neutral-600">${location.country}</p>
          </div>
        `;
        
        marker.bindPopup(popupContent, {
          maxWidth: 250,
          className: 'custom-popup'
        });
      });

      // Подгоняем карту под все маркеры
      if (locations.length > 0) {
        const group = new L.featureGroup(
          locations.map(loc => L.marker([loc.lat, loc.lng]))
        );
        map.fitBounds(group.getBounds().pad(0.1));
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, locations]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-[420px] md:h-[520px] rounded-3xl overflow-hidden border border-neutral-300"
        style={{ minHeight: '420px' }}
      />

      {/* Показываем загрузку пока карта не инициализирована */}
      {!isClient && (
        <div className="absolute inset-0 bg-neutral-100 rounded-3xl flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-neutral-500">Загрузка карты...</p>
          </div>
        </div>
      )}

      {/* Легенда по странам */}
      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm border border-neutral-300 rounded-2xl p-4 shadow-lg z-[1000]">
        <h4 className="font-bold text-xs uppercase tracking-wide text-primary-900 mb-3">Страны участников</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#1D4ED8] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Казахстан</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#ef4444] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Россия</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#22c55e] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Узбекистан</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#f59e0b] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Кыргызстан</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#8b5cf6] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Таджикистан</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-[#06b6d4] rounded-full border border-white shadow-sm"></div>
            <span className="text-xs text-neutral-600">Беларусь</span>
          </div>
        </div>
      </div>
    </div>
  );
}
