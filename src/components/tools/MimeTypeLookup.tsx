'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const commonMimeTypes = [
  { ext: '.aac', mime: 'audio/aac', desc: 'AAC audio' },
  { ext: '.abw', mime: 'application/x-abiword', desc: 'AbiWord document' },
  { ext: '.arc', mime: 'application/x-freearc', desc: 'Archive document (multiple files embedded)' },
  { ext: '.avif', mime: 'image/avif', desc: 'AVIF image' },
  { ext: '.avi', mime: 'video/x-msvideo', desc: 'AVI: Audio Video Interleave' },
  { ext: '.azw', mime: 'application/vnd.amazon.ebook', desc: 'Amazon Kindle eBook format' },
  { ext: '.bin', mime: 'application/octet-stream', desc: 'Any kind of binary data' },
  { ext: '.bmp', mime: 'image/bmp', desc: 'Windows OS/2 Bitmap Graphics' },
  { ext: '.bz', mime: 'application/x-bzip', desc: 'BZip archive' },
  { ext: '.bz2', mime: 'application/x-bzip2', desc: 'BZip2 archive' },
  { ext: '.cda', mime: 'application/x-cdf', desc: 'CD audio' },
  { ext: '.csh', mime: 'application/x-csh', desc: 'C-Shell script' },
  { ext: '.css', mime: 'text/css', desc: 'Cascading Style Sheets (CSS)' },
  { ext: '.csv', mime: 'text/csv', desc: 'Comma-separated values (CSV)' },
  { ext: '.doc', mime: 'application/msword', desc: 'Microsoft Word' },
  { ext: '.docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', desc: 'Microsoft Word (OpenXML)' },
  { ext: '.eot', mime: 'application/vnd.ms-fontobject', desc: 'MS Embedded OpenType fonts' },
  { ext: '.epub', mime: 'application/epub+zip', desc: 'Electronic publication (EPUB)' },
  { ext: '.gz', mime: 'application/gzip', desc: 'GZip Compressed Archive' },
  { ext: '.gif', mime: 'image/gif', desc: 'Graphics Interchange Format (GIF)' },
  { ext: '.htm, .html', mime: 'text/html', desc: 'HyperText Markup Language (HTML)' },
  { ext: '.ico', mime: 'image/vnd.microsoft.icon', desc: 'Icon format' },
  { ext: '.ics', mime: 'text/calendar', desc: 'iCalendar format' },
  { ext: '.jar', mime: 'application/java-archive', desc: 'Java Archive (JAR)' },
  { ext: '.jpeg, .jpg', mime: 'image/jpeg', desc: 'JPEG images' },
  { ext: '.js', mime: 'text/javascript', desc: 'JavaScript' },
  { ext: '.json', mime: 'application/json', desc: 'JSON format' },
  { ext: '.jsonld', mime: 'application/ld+json', desc: 'JSON-LD format' },
  { ext: '.mid, .midi', mime: 'audio/midi', desc: 'Musical Instrument Digital Interface (MIDI)' },
  { ext: '.mjs', mime: 'text/javascript', desc: 'JavaScript module' },
  { ext: '.mp3', mime: 'audio/mpeg', desc: 'MP3 audio' },
  { ext: '.mp4', mime: 'video/mp4', desc: 'MP4 video' },
  { ext: '.mpeg', mime: 'video/mpeg', desc: 'MPEG Video' },
  { ext: '.mpkg', mime: 'application/vnd.apple.installer+xml', desc: 'Apple Installer Package' },
  { ext: '.odp', mime: 'application/vnd.oasis.opendocument.presentation', desc: 'OpenDocument presentation document' },
  { ext: '.ods', mime: 'application/vnd.oasis.opendocument.spreadsheet', desc: 'OpenDocument spreadsheet document' },
  { ext: '.odt', mime: 'application/vnd.oasis.opendocument.text', desc: 'OpenDocument text document' },
  { ext: '.oga', mime: 'audio/ogg', desc: 'OGG audio' },
  { ext: '.ogv', mime: 'video/ogg', desc: 'OGG video' },
  { ext: '.ogx', mime: 'application/ogg', desc: 'OGG' },
  { ext: '.opus', mime: 'audio/opus', desc: 'Opus audio' },
  { ext: '.otf', mime: 'font/otf', desc: 'OpenType font' },
  { ext: '.png', mime: 'image/png', desc: 'Portable Network Graphics' },
  { ext: '.pdf', mime: 'application/pdf', desc: 'Adobe Portable Document Format (PDF)' },
  { ext: '.php', mime: 'application/x-httpd-php', desc: 'Hypertext Preprocessor (Personal Home Page)' },
  { ext: '.ppt', mime: 'application/vnd.ms-powerpoint', desc: 'Microsoft PowerPoint' },
  { ext: '.pptx', mime: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', desc: 'Microsoft PowerPoint (OpenXML)' },
  { ext: '.rar', mime: 'application/vnd.rar', desc: 'RAR archive' },
  { ext: '.rtf', mime: 'application/rtf', desc: 'Rich Text Format (RTF)' },
  { ext: '.sh', mime: 'application/x-sh', desc: 'Bourne shell script' },
  { ext: '.svg', mime: 'image/svg+xml', desc: 'Scalable Vector Graphics (SVG)' },
  { ext: '.tar', mime: 'application/x-tar', desc: 'Tape Archive (TAR)' },
  { ext: '.tif, .tiff', mime: 'image/tiff', desc: 'Tagged Image File Format (TIFF)' },
  { ext: '.ts', mime: 'video/mp2t', desc: 'MPEG transport stream' },
  { ext: '.ttf', mime: 'font/ttf', desc: 'TrueType Font' },
  { ext: '.txt', mime: 'text/plain', desc: 'Text, (generally ASCII or ISO 8859-n)' },
  { ext: '.vsd', mime: 'application/vnd.visio', desc: 'Microsoft Visio' },
  { ext: '.wav', mime: 'audio/wav', desc: 'Waveform Audio Format' },
  { ext: '.weba', mime: 'audio/webm', desc: 'WEBM audio' },
  { ext: '.webm', mime: 'video/webm', desc: 'WEBM video' },
  { ext: '.webp', mime: 'image/webp', desc: 'WEBP image' },
  { ext: '.woff', mime: 'font/woff', desc: 'Web Open Font Format (WOFF)' },
  { ext: '.woff2', mime: 'font/woff2', desc: 'Web Open Font Format (WOFF)' },
  { ext: '.xhtml', mime: 'application/xhtml+xml', desc: 'XHTML' },
  { ext: '.xls', mime: 'application/vnd.ms-excel', desc: 'Microsoft Excel' },
  { ext: '.xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', desc: 'Microsoft Excel (OpenXML)' },
  { ext: '.xml', mime: 'application/xml', desc: 'XML' },
  { ext: '.xul', mime: 'application/vnd.mozilla.xul+xml', desc: 'XUL' },
  { ext: '.zip', mime: 'application/zip', desc: 'ZIP archive' },
  { ext: '.3gp', mime: 'video/3gpp', desc: '3GPP audio/video container' },
  { ext: '.3g2', mime: 'video/3gpp2', desc: '3GPP2 audio/video container' },
  { ext: '.7z', mime: 'application/x-7z-compressed', desc: '7-zip archive' },
];

export default function MimeTypeLookup() {
  const t = useTranslations('tools');
  const [search, setSearch] = useState('');

  const filtered = commonMimeTypes.filter(item => 
    item.ext.toLowerCase().includes(search.toLowerCase()) || 
    item.mime.toLowerCase().includes(search.toLowerCase()) ||
    item.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('searchPlaceholder') || 'Search MIME types...'}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-6 py-4 text-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
        />
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-900 border-b border-gray-700">
                <th className="px-6 py-4 font-semibold text-gray-300 w-32">Extension</th>
                <th className="px-6 py-4 font-semibold text-gray-300 w-64">MIME Type</th>
                <th className="px-6 py-4 font-semibold text-gray-300">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {filtered.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 font-mono text-blue-400">{item.ext}</td>
                  <td className="px-6 py-4 font-mono text-green-400 break-all">{item.mime}</td>
                  <td className="px-6 py-4 text-gray-300">{item.desc}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-300">
                    No matching MIME types found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-4 text-right text-gray-300 text-sm">
        Showing {filtered.length} results
      </div>
    </div>
  );
}
