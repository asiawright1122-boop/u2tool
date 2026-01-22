'use client';

import { TOOL_COMPONENTS_MAP } from './ToolRegistry';
import ToolErrorBoundary from './ToolErrorBoundary';

export default function ToolWrapper({ slug }: { slug: string }) {
  const ToolComponent = TOOL_COMPONENTS_MAP[slug];

  if (!ToolComponent) {
    return <div className="text-center text-gray-600 dark:text-gray-300">Tool not found: {slug}</div>;
  }

  return (
    <ToolErrorBoundary toolName={slug}>
      <ToolComponent />
    </ToolErrorBoundary>
  );
}


