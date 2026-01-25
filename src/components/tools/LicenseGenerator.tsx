'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

interface LicenseTemplate {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  conditions: string[];
  limitations: string[];
  template: string;
}

const LICENSES: LicenseTemplate[] = [
  {
    id: 'mit',
    name: 'MIT License',
    description: 'A short and simple permissive license with conditions only requiring preservation of copyright and license notices.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['License and copyright notice'],
    limitations: ['Liability', 'Warranty'],
    template: `MIT License

Copyright (c) {{year}} {{author}}

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`,
  },
  {
    id: 'apache-2.0',
    name: 'Apache License 2.0',
    description: 'A permissive license whose main conditions require preservation of copyright and license notices.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    conditions: ['License and copyright notice', 'State changes'],
    limitations: ['Trademark use', 'Liability', 'Warranty'],
    template: `                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form.

      "Work" shall mean the work of authorship made available under the
      License.

      "Derivative Works" shall mean any work that is based on the Work.

      "Contribution" shall mean any work of authorship submitted to the
      Licensor for inclusion in the Work.

      "Contributor" shall mean Licensor and any Legal Entity on behalf of
      whom a Contribution has been received by Licensor.

   2. Grant of Copyright License.

   3. Grant of Patent License.

   4. Redistribution.

   5. Submission of Contributions.

   6. Trademarks.

   7. Disclaimer of Warranty.

   8. Limitation of Liability.

   9. Accepting Warranty or Additional Liability.

   Copyright {{year}} {{author}}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.`,
  },
  {
    id: 'gpl-3.0',
    name: 'GNU GPL v3',
    description: 'Permissions of this strong copyleft license are conditioned on making available complete source code.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Patent use', 'Private use'],
    conditions: ['License and copyright notice', 'State changes', 'Disclose source', 'Same license'],
    limitations: ['Liability', 'Warranty'],
    template: `                    GNU GENERAL PUBLIC LICENSE
                       Version 3, 29 June 2007

 Copyright (C) 2007 Free Software Foundation, Inc. <https://fsf.org/>
 Everyone is permitted to copy and distribute verbatim copies
 of this license document, but changing it is not allowed.

                            Preamble

  The GNU General Public License is a free, copyleft license for
software and other kinds of works.

Copyright (C) {{year}} {{author}}

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.`,
  },
  {
    id: 'bsd-3-clause',
    name: 'BSD 3-Clause',
    description: 'A permissive license similar to the BSD 2-Clause License, but with a 3rd clause.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['License and copyright notice'],
    limitations: ['Liability', 'Warranty'],
    template: `BSD 3-Clause License

Copyright (c) {{year}}, {{author}}
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this
   list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice,
   this list of conditions and the following disclaimer in the documentation
   and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its
   contributors may be used to endorse or promote products derived from
   this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.`,
  },
  {
    id: 'isc',
    name: 'ISC License',
    description: 'A permissive license lets people do anything with your code with proper attribution.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: ['License and copyright notice'],
    limitations: ['Liability', 'Warranty'],
    template: `ISC License

Copyright (c) {{year}}, {{author}}

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.`,
  },
  {
    id: 'unlicense',
    name: 'The Unlicense',
    description: 'A license with no conditions whatsoever which dedicates works to the public domain.',
    permissions: ['Commercial use', 'Modification', 'Distribution', 'Private use'],
    conditions: [],
    limitations: ['Liability', 'Warranty'],
    template: `This is free and unencumbered software released into the public domain.

Anyone is free to copy, modify, publish, use, compile, sell, or
distribute this software, either in source code form or as a compiled
binary, for any purpose, commercial or non-commercial, and by any
means.

In jurisdictions that recognize copyright laws, the author or authors
of this software dedicate any and all copyright interest in the
software to the public domain. We make this dedication for the benefit
of the public at large and to the detriment of our heirs and
successors. We intend this dedication to be an overt act of
relinquishment in perpetuity of all present and future rights to this
software under copyright law.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.

For more information, please refer to <https://unlicense.org>`,
  },
];

export default function LicenseGenerator() {
  const t = useTranslations('tools.license-generator');
  const tCommon = useTranslations('tools');
  
  const [selectedLicense, setSelectedLicense] = useState<string>('mit');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);

  const currentLicense = LICENSES.find(l => l.id === selectedLicense);

  const generateLicense = () => {
    if (!currentLicense) return;
    
    let licenseText = currentLicense.template;
    licenseText = licenseText.replace(/\{\{year\}\}/g, year);
    licenseText = licenseText.replace(/\{\{author\}\}/g, author || '[Author Name]');
    
    setOutput(licenseText);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'LICENSE';
    link.click();
    URL.revokeObjectURL(url);
  };

  const clearAll = () => {
    setSelectedLicense('mit');
    setAuthor('');
    setYear(new Date().getFullYear().toString());
    setOutput('');
  };

  return (
    <div className="space-y-6">
      {/* License Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {t('selectLicense')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {LICENSES.map(license => (
            <button
              key={license.id}
              onClick={() => setSelectedLicense(license.id)}
              className={`p-3 rounded-lg text-left ${
                selectedLicense === license.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="font-medium text-sm">{license.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* License Info */}
      {currentLicense && (
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-3">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{currentLicense.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{currentLicense.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <h4 className="font-medium text-green-600 dark:text-green-400 mb-1">{t('permissions')}</h4>
              <ul className="space-y-1">
                {currentLicense.permissions.map(p => (
                  <li key={p} className="text-gray-600 dark:text-gray-400">✓ {p}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-600 dark:text-blue-400 mb-1">{t('conditions')}</h4>
              <ul className="space-y-1">
                {currentLicense.conditions.length > 0 ? (
                  currentLicense.conditions.map(c => (
                    <li key={c} className="text-gray-600 dark:text-gray-400">• {c}</li>
                  ))
                ) : (
                  <li className="text-gray-400 dark:text-gray-500">{t('none')}</li>
                )}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-red-600 dark:text-red-400 mb-1">{t('limitations')}</h4>
              <ul className="space-y-1">
                {currentLicense.limitations.map(l => (
                  <li key={l} className="text-gray-600 dark:text-gray-400">✕ {l}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Author Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('author')}
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder={t('authorPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('year')}
          </label>
          <input
            type="text"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder={t('yearPlaceholder')}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        <button
          onClick={generateLicense}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium text-white"
        >
          {t('generate')}
        </button>
        <button
          onClick={clearAll}
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg font-medium text-gray-900 dark:text-gray-100"
        >
          {tCommon('clear')}
        </button>
      </div>

      {/* Output */}
      {output && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LICENSE</label>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded text-sm text-gray-900 dark:text-gray-100"
              >
                {copied ? tCommon('copied') : tCommon('copy')}
              </button>
              <button
                onClick={downloadFile}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm text-white"
              >
                {t('download')}
              </button>
            </div>
          </div>
          <pre className="w-full p-4 bg-gray-900 dark:bg-gray-950 border border-gray-700 rounded-lg font-mono text-sm text-green-400 overflow-x-auto whitespace-pre-wrap max-h-96 overflow-y-auto">
            {output}
          </pre>
        </div>
      )}
    </div>
  );
}
