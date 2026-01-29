'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslations } from 'next-intl';

interface K8sConfig {
  name: string;
  namespace: string;
  image: string;
  replicas: number;
  port: number;
  targetPort: number;
  serviceType: 'ClusterIP' | 'NodePort' | 'LoadBalancer';
  resources: {
    cpuRequest: string;
    cpuLimit: string;
    memoryRequest: string;
    memoryLimit: string;
  };
  envVars: Array<{ key: string; value: string }>;
  includeIngress: boolean;
  ingressHost: string;
  includeHPA: boolean;
  hpaMinReplicas: number;
  hpaMaxReplicas: number;
  hpaTargetCPU: number;
}

function generateDeployment(config: K8sConfig): string {
  return `apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${config.name}
  namespace: ${config.namespace}
  labels:
    app: ${config.name}
spec:
  replicas: ${config.replicas}
  selector:
    matchLabels:
      app: ${config.name}
  template:
    metadata:
      labels:
        app: ${config.name}
    spec:
      containers:
        - name: ${config.name}
          image: ${config.image}
          ports:
            - containerPort: ${config.targetPort}
          resources:
            requests:
              cpu: "${config.resources.cpuRequest}"
              memory: "${config.resources.memoryRequest}"
            limits:
              cpu: "${config.resources.cpuLimit}"
              memory: "${config.resources.memoryLimit}"${config.envVars.length > 0 ? `
          env:${config.envVars.map(e => `
            - name: ${e.key}
              value: "${e.value}"`).join('')}` : ''}`;
}

function generateService(config: K8sConfig): string {
  return `apiVersion: v1
kind: Service
metadata:
  name: ${config.name}-service
  namespace: ${config.namespace}
spec:
  type: ${config.serviceType}
  selector:
    app: ${config.name}
  ports:
    - port: ${config.port}
      targetPort: ${config.targetPort}
      protocol: TCP`;
}

function generateIngress(config: K8sConfig): string {
  return `apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ${config.name}-ingress
  namespace: ${config.namespace}
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: ${config.ingressHost}
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: ${config.name}-service
                port:
                  number: ${config.port}`;
}

function generateHPA(config: K8sConfig): string {
  return `apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: ${config.name}-hpa
  namespace: ${config.namespace}
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: ${config.name}
  minReplicas: ${config.hpaMinReplicas}
  maxReplicas: ${config.hpaMaxReplicas}
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: ${config.hpaTargetCPU}`;
}

function generateNamespace(namespace: string): string {
  return `apiVersion: v1
kind: Namespace
metadata:
  name: ${namespace}`;
}

export default function KubernetesManifestGenerator() {
  const t = useTranslations('tools.kubernetes-manifest-generator');
  const tCommon = useTranslations('tools');
  const [config, setConfig] = useState<K8sConfig>({
    name: 'my-app',
    namespace: 'default',
    image: 'nginx:latest',
    replicas: 3,
    port: 80,
    targetPort: 80,
    serviceType: 'ClusterIP',
    resources: { cpuRequest: '100m', cpuLimit: '500m', memoryRequest: '128Mi', memoryLimit: '512Mi' },
    envVars: [{ key: 'NODE_ENV', value: 'production' }],
    includeIngress: false,
    ingressHost: 'app.example.com',
    includeHPA: false,
    hpaMinReplicas: 2,
    hpaMaxReplicas: 10,
    hpaTargetCPU: 80,
  });
  const [copied, setCopied] = useState(false);

  const updateConfig = useCallback(<K extends keyof K8sConfig>(key: K, value: K8sConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  }, []);

  const addEnvVar = useCallback(() => {
    setConfig(prev => ({ ...prev, envVars: [...prev.envVars, { key: '', value: '' }] }));
  }, []);

  const removeEnvVar = useCallback((index: number) => {
    setConfig(prev => ({ ...prev, envVars: prev.envVars.filter((_, i) => i !== index) }));
  }, []);

  const updateEnvVar = useCallback((index: number, field: 'key' | 'value', value: string) => {
    setConfig(prev => ({
      ...prev,
      envVars: prev.envVars.map((e, i) => i === index ? { ...e, [field]: value } : e),
    }));
  }, []);

  const output = useMemo(() => {
    const parts: string[] = [];
    if (config.namespace !== 'default') {
      parts.push(generateNamespace(config.namespace));
    }
    parts.push(generateDeployment(config));
    parts.push(generateService(config));
    if (config.includeIngress) {
      parts.push(generateIngress(config));
    }
    if (config.includeHPA) {
      parts.push(generateHPA(config));
    }
    return parts.join('\n---\n');
  }, [config]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  return (
    <div className="space-y-6">
      {/* Basic Config */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('appName')}</label>
          <input type="text" value={config.name} onChange={(e) => updateConfig('name', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('namespace')}</label>
          <input type="text" value={config.namespace} onChange={(e) => updateConfig('namespace', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('image')}</label>
          <input type="text" value={config.image} onChange={(e) => updateConfig('image', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('replicas')}</label>
          <input type="number" value={config.replicas} onChange={(e) => updateConfig('replicas', parseInt(e.target.value) || 1)} min={1}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
      </div>

      {/* Ports & Service */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('servicePort')}</label>
          <input type="number" value={config.port} onChange={(e) => updateConfig('port', parseInt(e.target.value) || 80)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('containerPort')}</label>
          <input type="number" value={config.targetPort} onChange={(e) => updateConfig('targetPort', parseInt(e.target.value) || 80)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('serviceType')}</label>
          <select value={config.serviceType} onChange={(e) => updateConfig('serviceType', e.target.value as K8sConfig['serviceType'])}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm">
            <option value="ClusterIP">ClusterIP</option>
            <option value="NodePort">NodePort</option>
            <option value="LoadBalancer">LoadBalancer</option>
          </select>
        </div>
      </div>

      {/* Resources */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t('resources')}</label>
        <div className="grid grid-cols-4 gap-4">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('cpuRequest')}</label>
            <input type="text" value={config.resources.cpuRequest} onChange={(e) => updateConfig('resources', { ...config.resources, cpuRequest: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('cpuLimit')}</label>
            <input type="text" value={config.resources.cpuLimit} onChange={(e) => updateConfig('resources', { ...config.resources, cpuLimit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('memoryRequest')}</label>
            <input type="text" value={config.resources.memoryRequest} onChange={(e) => updateConfig('resources', { ...config.resources, memoryRequest: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">{t('memoryLimit')}</label>
            <input type="text" value={config.resources.memoryLimit} onChange={(e) => updateConfig('resources', { ...config.resources, memoryLimit: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('environmentVariables')}</label>
          <button onClick={addEnvVar} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">{t('addEnvVar')}</button>
        </div>
        <div className="space-y-2">
          {config.envVars.map((env, idx) => (
            <div key={idx} className="flex gap-2">
              <input type="text" value={env.key} onChange={(e) => updateEnvVar(idx, 'key', e.target.value)} placeholder={t("keyPlaceholder")}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono" />
              <input type="text" value={env.value} onChange={(e) => updateEnvVar(idx, 'value', e.target.value)} placeholder={t("valuePlaceholder")}
                className="flex-1 px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
              <button onClick={() => removeEnvVar(idx)} className="text-red-500 hover:text-red-600">✕</button>
            </div>
          ))}
        </div>
      </div>

      {/* Optional Components */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={config.includeIngress} onChange={(e) => updateConfig('includeIngress', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('includeIngress')}</span>
        </label>
        {config.includeIngress && (
          <input type="text" value={config.ingressHost} onChange={(e) => updateConfig('ingressHost', e.target.value)} placeholder={t("hostPlaceholder")}
            className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm" />
        )}
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={config.includeHPA} onChange={(e) => updateConfig('includeHPA', e.target.checked)} className="rounded" />
          <span className="text-sm text-gray-700 dark:text-gray-300">{t('includeHPA')}</span>
        </label>
      </div>

      {/* Output */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{t('kubernetesManifests')}</label>
          <button onClick={handleCopy} className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            {copied ? tCommon('copied') : tCommon('copy')}
          </button>
        </div>
        <pre className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200 max-h-96">
          {output}
        </pre>
      </div>
    </div>
  );
}
