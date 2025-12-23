'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function ChmodCalculator() {
  const t = useTranslations('tools');
  const [perms, setPerms] = useState({ owner: { r: true, w: true, x: false }, group: { r: true, w: false, x: false }, other: { r: true, w: false, x: false } });
  const [octal, setOctal] = useState('644');
  const [copied, setCopied] = useState(false);

  const calcOctal = (p: typeof perms) => {
    const calc = (o: { r: boolean; w: boolean; x: boolean }) => (o.r ? 4 : 0) + (o.w ? 2 : 0) + (o.x ? 1 : 0);
    return `${calc(p.owner)}${calc(p.group)}${calc(p.other)}`;
  };

  const calcSymbolic = (p: typeof perms) => {
    const sym = (o: { r: boolean; w: boolean; x: boolean }) => `${o.r ? 'r' : '-'}${o.w ? 'w' : '-'}${o.x ? 'x' : '-'}`;
    return `-${sym(p.owner)}${sym(p.group)}${sym(p.other)}`;
  };

  const toggle = (who: 'owner' | 'group' | 'other', perm: 'r' | 'w' | 'x') => {
    const newPerms = { ...perms, [who]: { ...perms[who], [perm]: !perms[who][perm] } };
    setPerms(newPerms);
    setOctal(calcOctal(newPerms));
  };

  const handleOctal = (val: string) => {
    setOctal(val);
    if (/^[0-7]{3}$/.test(val)) {
      const parse = (n: string) => ({ r: (parseInt(n) & 4) > 0, w: (parseInt(n) & 2) > 0, x: (parseInt(n) & 1) > 0 });
      setPerms({ owner: parse(val[0]), group: parse(val[1]), other: parse(val[2]) });
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Checkbox = ({ who, perm, label }: { who: 'owner' | 'group' | 'other'; perm: 'r' | 'w' | 'x'; label: string }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={perms[who][perm]} onChange={() => toggle(who, perm)} className="w-5 h-5 rounded" />
      <span>{label}</span>
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">{t('chmod.octal')}:</label>
        <input type="text" value={octal} onChange={(e) => handleOctal(e.target.value)} maxLength={3} className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded font-mono text-xl text-center" />
        <button onClick={() => copy(`chmod ${octal}`)} className="px-3 py-2 bg-gray-600 rounded hover:bg-gray-700">{copied ? '✓' : t('copy')}</button>
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-300 mb-2">{t('chmod.symbolic')}:</p>
        <p className="font-mono text-xl">{calcSymbolic(perms)}</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        {(['owner', 'group', 'other'] as const).map(who => (
          <div key={who} className="bg-gray-800 rounded-lg p-4">
            <h3 className="font-medium mb-3 capitalize">{t(`chmod.${who}`)}</h3>
            <div className="space-y-2">
              <Checkbox who={who} perm="r" label={t('chmod.read')} />
              <Checkbox who={who} perm="w" label={t('chmod.write')} />
              <Checkbox who={who} perm="x" label={t('chmod.execute')} />
            </div>
          </div>
        ))}
      </div>
      <div className="bg-gray-800 rounded-lg p-4">
        <p className="text-sm text-gray-300 mb-2">{t('chmod.command')}:</p>
        <code className="font-mono">chmod {octal} filename</code>
      </div>
    </div>
  );
}
