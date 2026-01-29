'use client';

import { useTranslations } from 'next-intl';
import { useState, useCallback, useMemo } from 'react';

interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: string;
  amenities: string[];
  bookings: { start: number; end: number; title: string }[];
}

function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${m.toString().padStart(2, '0')} ${period}`;
}

function isAvailable(room: Room, start: number, end: number): boolean {
  return !room.bookings.some(b => 
    (start >= b.start && start < b.end) || 
    (end > b.start && end <= b.end) ||
    (start <= b.start && end >= b.end)
  );
}

const AMENITIES = ['Projector', 'Whiteboard', 'Video Conference', 'Phone', 'TV Screen', 'Standing Desk'];

export default function MeetingRoomFinder() {
  const t = useTranslations('tools.meeting-room-finder');
  const tCommon = useTranslations('tools');
  const [rooms, setRooms] = useState<Room[]>([
    { id: '1', name: 'Conference Room A', capacity: 10, floor: '1st', amenities: ['Projector', 'Whiteboard', 'Video Conference'], bookings: [{ start: 540, end: 600, title: 'Team Standup' }, { start: 780, end: 840, title: 'Client Call' }] },
    { id: '2', name: 'Meeting Room B', capacity: 6, floor: '1st', amenities: ['TV Screen', 'Whiteboard'], bookings: [{ start: 600, end: 660, title: 'Design Review' }] },
    { id: '3', name: 'Board Room', capacity: 20, floor: '2nd', amenities: ['Projector', 'Video Conference', 'Phone'], bookings: [{ start: 840, end: 960, title: 'Board Meeting' }] },
    { id: '4', name: 'Huddle Space', capacity: 4, floor: '1st', amenities: ['TV Screen'], bookings: [] },
    { id: '5', name: 'Training Room', capacity: 30, floor: '3rd', amenities: ['Projector', 'Whiteboard', 'Standing Desk'], bookings: [{ start: 540, end: 720, title: 'Workshop' }] },
  ]);

  const [filters, setFilters] = useState({
    minCapacity: 1,
    requiredAmenities: [] as string[],
    startTime: 540,
    endTime: 600,
    floor: '',
  });

  const [bookingRoom, setBookingRoom] = useState<string | null>(null);
  const [bookingTitle, setBookingTitle] = useState('');

  const updateFilter = useCallback(<K extends keyof typeof filters>(key: K, value: (typeof filters)[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const toggleAmenity = useCallback((amenity: string) => {
    setFilters(prev => ({
      ...prev,
      requiredAmenities: prev.requiredAmenities.includes(amenity)
        ? prev.requiredAmenities.filter(a => a !== amenity)
        : [...prev.requiredAmenities, amenity],
    }));
  }, []);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      if (room.capacity < filters.minCapacity) return false;
      if (filters.floor && room.floor !== filters.floor) return false;
      if (!filters.requiredAmenities.every(a => room.amenities.includes(a))) return false;
      return true;
    }).map(room => ({
      ...room,
      available: isAvailable(room, filters.startTime, filters.endTime),
    })).sort((a, b) => {
      if (a.available !== b.available) return a.available ? -1 : 1;
      return a.capacity - b.capacity;
    });
  }, [rooms, filters]);

  const bookRoom = useCallback((roomId: string) => {
    if (!bookingTitle.trim()) return;
    setRooms(prev => prev.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          bookings: [...room.bookings, { start: filters.startTime, end: filters.endTime, title: bookingTitle }].sort((a, b) => a.start - b.start),
        };
      }
      return room;
    }));
    setBookingRoom(null);
    setBookingTitle('');
  }, [bookingTitle, filters.startTime, filters.endTime]);

  const floors = useMemo(() => [...new Set(rooms.map(r => r.floor))], [rooms]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('startTime')}</label>
          <select
            value={filters.startTime}
            onChange={(e) => updateFilter('startTime', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 24 }, (_, i) => i * 60).map(m => (
              <option key={m} value={m}>{formatTime(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('endTime')}</label>
          <select
            value={filters.endTime}
            onChange={(e) => updateFilter('endTime', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {Array.from({ length: 24 }, (_, i) => i * 60).map(m => (
              <option key={m} value={m}>{formatTime(m)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('minCapacity')}</label>
          <select
            value={filters.minCapacity}
            onChange={(e) => updateFilter('minCapacity', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            {[1, 2, 4, 6, 8, 10, 15, 20, 30].map(n => (
              <option key={n} value={n}>{n}+ {t('people')}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('floor')}</label>
          <select
            value={filters.floor}
            onChange={(e) => updateFilter('floor', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          >
            <option value="">{t('anyFloor')}</option>
            {floors.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
        <div className="flex items-end">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {filteredRooms.filter(r => r.available).length} {t('available')}
          </span>
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">{t('requiredAmenities')}</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map(amenity => (
            <button
              key={amenity}
              onClick={() => toggleAmenity(amenity)}
              className={`px-3 py-1 text-sm rounded-full ${
                filters.requiredAmenities.includes(amenity)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {amenity}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <div key={room.id} className={`p-4 rounded-lg border ${
            room.available 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 opacity-60'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">{room.name}</h3>
                <p className="text-xs text-gray-500">{room.floor} Floor • {room.capacity} people</p>
              </div>
              {room.available ? (
                <span className="text-xs px-2 py-1 bg-green-500 text-white rounded">{t('available')}</span>
              ) : (
                <span className="text-xs px-2 py-1 bg-red-500 text-white rounded">{t('busy')}</span>
              )}
            </div>
            
            <div className="flex flex-wrap gap-1 mb-3">
              {room.amenities.map(a => (
                <span key={a} className="text-xs px-2 py-0.5 bg-gray-200 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-400">
                  {a}
                </span>
              ))}
            </div>

            {room.bookings.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">{t('todaysBookings')}:</p>
                <div className="space-y-1">
                  {room.bookings.slice(0, 3).map((b, idx) => (
                    <div key={idx} className="text-xs text-gray-600 dark:text-gray-400">
                      {formatTime(b.start)} - {formatTime(b.end)}: {b.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {room.available && (
              bookingRoom === room.id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={bookingTitle}
                    onChange={(e) => setBookingTitle(e.target.value)}
                    placeholder={t("titlePlaceholder")}
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => bookRoom(room.id)}
                    className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    {t('book')}
                  </button>
                  <button
                    onClick={() => setBookingRoom(null)}
                    className="px-2 py-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setBookingRoom(room.id)}
                  className="w-full px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {t('bookRoom')}
                </button>
              )
            )}
          </div>
        ))}
      </div>

      {filteredRooms.length === 0 && (
        <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
          <p className="text-gray-500">{t('noRoomsMatch')}</p>
          <p className="text-xs text-gray-400 mt-1">{t('tryAdjusting')}</p>
        </div>
      )}
    </div>
  );
}
