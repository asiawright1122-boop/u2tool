<script lang="ts">
  interface Props {
    locale: string;
    translations: Record<string, unknown>;
  }

  let { locale, translations }: Props = $props();

  // Translation helpers
  function t(key: string): string {
    const scope = translations['tools']['gpa-calculator'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.gpa-calculator.${key}`;
  }
  function tCommon(key: string): string {
    const scope = translations['tools'] as Record<string, unknown> || {};
    const keys = key.split('.');
    let value: unknown = scope;
    for (const k of keys) { value = (value as Record<string, unknown>)?.[k]; }
    return typeof value === 'string' ? value : `MISSING: tools.${key}`;
  }

  // Imports
  import { GraduationCap, Plus, Trash2, Calculator } from 'lucide-svelte';
  import { GRADE_POINTS_4, GRADE_POINTS_5 } from '@/lib/tool-stubs';

  // Types
  type GpaScale = '4.0' | '5.0';
  interface Course {
  id: string;
  name: string;
  credits: number;
  grade: string;
}

  let scale = $state('4.0');

  let courses = $state([
    { id: '1', name: 'Course 1', credits: 3, grade: 'A' },
    { id: '2', name: 'Course 2', credits: 3, grade: 'B+' },
    { id: '3', name: 'Course 3', credits: 4, grade: 'A-' },
  ]);

  let result = $derived.by(() => {
    const gradePoints = scale === '4.0' ? GRADE_POINTS_4 : GRADE_POINTS_5;
    let totalPoints = 0;
    let totalCredits = 0;

    for (const course of courses) {
      if (course.credits > 0 && course.grade in gradePoints) {
        totalPoints += gradePoints[course.grade] * course.credits;
        totalCredits += course.credits;
      }
    }

    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    const maxGpa = scale === '4.0' ? 4.0 : 5.0;
    const percentage = (gpa / maxGpa) * 100;

    return {
      gpa: Math.round(gpa * 100) / 100,
      totalCredits,
      totalPoints: Math.round(totalPoints * 100) / 100,
      percentage: Math.round(percentage),
      maxGpa,
    };
  });

  // Functions
  function addCourse() {
    const newCourse: Course = {
      id: Date.now().toString(),
      name: `Course ${courses.length + 1}`,
      credits: 3,
      grade: 'A',
    };
    courses = [...courses, newCourse];
  }
  function removeCourse(id: string) {
    if (courses.length > 1) {
      courses = courses.filter(c => c.id !== id);
    }
  }
  function updateCourse(id: string, field: keyof Course, value: string | number) {
    courses = courses.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    );
  }
  function getGpaColor(gpa: number, maxGpa: number) {
    const ratio = gpa / maxGpa;
    if (ratio >= 0.9) return 'text-green-600 dark:text-green-400';
    if (ratio >= 0.8) return 'text-amber-600 dark:text-amber-400';
    if (ratio >= 0.7) return 'text-yellow-600 dark:text-yellow-400';
    if (ratio >= 0.6) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  }
  function getGpaLabel(gpa: number, maxGpa: number) {
    const ratio = gpa / maxGpa;
    if (ratio >= 0.9) return t('excellent');
    if (ratio >= 0.8) return t('good');
    if (ratio >= 0.7) return t('satisfactory');
    if (ratio >= 0.6) return t('passing');
    return t('needsImprovement');
  }

</script>


    <div class="space-y-6">
      <!-- Scale Selection -->
      <div class="flex gap-2">
        <button
          onclick={() => scale = '4.0'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            scale === '4.0'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          4.0 {t('scale')}
        </button>
        <button
          onclick={() => scale = '5.0'}
          class={`px-4 py-2 rounded-lg font-medium transition-colors ${
            scale === '5.0'
              ? 'bg-amber-500 text-white'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
          }`}
        >
          5.0 {t('scale')}
        </button>
      </div>

      <!-- Courses List -->
      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="tool-label">
            {t('courses')} ({courses.length})
          </label>
        </div>

        <!-- Header -->
        <div class="hidden md:grid grid-cols-12 gap-2 text-sm text-gray-500 px-2">
          <div class="col-span-5">{t('courseName')}</div>
          <div class="col-span-3">{t('credits')}</div>
          <div class="col-span-3">{t('grade')}</div>
          <div class="col-span-1"></div>
        </div>

        {#each courses as course (course.id)}
<div  class="grid grid-cols-12 gap-2 items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <input
              type="text"
              value={course.name}
              onchange={(e) => updateCourse(course.id, 'name', e.target.value)}
              placeholder={t('courseName')}
              class="col-span-12 md:col-span-5 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <input
              type="number"
              value={course.credits}
              onchange={(e) => updateCourse(course.id, 'credits', parseFloat(e.target.value) || 0)}
              min="0"
              max="10"
              step="0.5"
              class="col-span-5 md:col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
            <select
              value={course.grade}
              onchange={(e) => updateCourse(course.id, 'grade', e.target.value)}
              class="col-span-5 md:col-span-3 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {#each GRADES as grade (grade)}
<option  value={grade}>{grade}</option>
{/each}
            </select>
            <button
              onclick={() => removeCourse(course.id)}
              disabled={courses.length === 1}
              class="col-span-2 md:col-span-1 p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded disabled:opacity-30 justify-self-center"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
{/each}

        <button
          onclick={addCourse}
          class="flex items-center gap-2 px-4 py-2 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg"
        >
          <Plus class="w-4 h-4" />
          {t('addCourse')}
        </button>
      </div>

      <!-- Results -->
      <div class="p-6 bg-gradient-to-r from-amber-50 to-slate-50 dark:from-amber-900/20 dark:to-slate-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
        <div class="flex items-center gap-3 mb-4">
          <GraduationCap class="w-8 h-8 text-amber-500" />
          <div>
            <div class="text-sm text-gray-600 dark:text-gray-400">{t('yourGpa')}</div>
            <div class={`text-4xl font-bold ${getGpaColor(result.gpa, result.maxGpa)}`}>
              {result.gpa.toFixed(2)} / {result.maxGpa.toFixed(1)}
            </div>
          </div>
        </div>

        <!-- Progress Bar -->
        <div class="mb-4">
          <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              class="h-full bg-gradient-to-r from-amber-400 to-slate-400 rounded-full transition-all duration-500"
              style="width: {result.percentage}%"></div>
          </div>
          <div class="flex justify-between text-sm text-gray-500 mt-1">
            <span>0.0</span>
            <span class="font-medium">{getGpaLabel(result.gpa, result.maxGpa)}</span>
            <span>{result.maxGpa.toFixed(1)}</span>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-3 gap-4 text-center">
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.totalCredits}</div>
            <div class="text-sm text-gray-500">{t('totalCredits')}</div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.totalPoints}</div>
            <div class="text-sm text-gray-500">{t('totalPoints')}</div>
          </div>
          <div class="p-3 bg-white dark:bg-gray-800 rounded-lg">
            <div class="text-2xl font-bold text-gray-900 dark:text-white">{result.percentage}%</div>
            <div class="text-sm text-gray-500">{t('percentage')}</div>
          </div>
        </div>
      </div>

      <!-- Grade Reference -->
      <div class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <h3 class="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
          <Calculator class="w-5 h-5" />
          {t('gradeReference')}
        </h3>
        <div class="grid grid-cols-4 md:grid-cols-6 gap-2 text-sm">
          {#each GRADES as grade (grade)}
<div  class="flex justify-between p-2 bg-white dark:bg-gray-700 rounded">
              <span class="font-medium">{grade}</span>
              <span class="text-gray-500">
                {scale === '4.0' ? GRADE_POINTS_4[grade] : GRADE_POINTS_5[grade]}
              </span>
            </div>
{/each}
        </div>
      </div>
    </div>
  
