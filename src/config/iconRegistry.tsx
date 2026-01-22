import {
    FileJson,
    Lock,
    Link,
    FileCode,
    Fingerprint,
    KeyRound,
    QrCode,
    Type,
    Image,
    Calculator,
    Palette,
    Globe,
    Hash,
    Clock,
    Shuffle,
    AlignLeft,
    FileText,
    Binary,
    Cpu
} from 'lucide-react';
import { JSX } from 'react';

export const iconRegistry: Record<string, JSX.Element> = {
    // Encoding
    'json-formatter': <FileJson />,
    'base64': <Lock />,
    'url-encoder': <Link />,
    'html-encoder': <FileCode />,

    // Generators
    'uuid-generator': <Fingerprint />,
    'password-generator': <KeyRound />,
    'qr-generator': <QrCode />,
    'lorem-ipsum': <AlignLeft />,

    // Text
    'word-counter': <Type />,
    'case-converter': <Type />,
    'markdown-preview': <FileText />,

    // Converters
    'color-converter': <Palette />,
    'timestamp-converter': <Clock />,
    'unit-converter': <Calculator />,
    'image-to-base64': <Image />,

    // Development
    'regex-tester': <Binary />,
    'ip-lookup': <Globe />,
    'hash-generator': <Hash />,

    // Other
    'random-generator': <Shuffle />,
    'code-minifier': <Cpu />,
};

// Fallback icon
export const DefaultIcon = <Cpu />;
