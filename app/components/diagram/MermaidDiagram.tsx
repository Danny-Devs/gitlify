'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Skeleton } from '@/app/components/ui/skeleton';

interface MermaidDiagramProps {
  code: string;
  className?: string;
}

export default function MermaidDiagram({
  code,
  className = ''
}: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize mermaid with dark mode support
    mermaid.initialize({
      startOnLoad: false,
      theme: document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'default',
      securityLevel: 'loose',
      fontFamily: 'sans-serif'
    });

    // Function to render the diagram
    const renderDiagram = async () => {
      if (!code.trim()) {
        setError('No diagram code provided');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Generate a unique ID for the diagram
        const id = `mermaid-${Math.random().toString(36).substring(2, 11)}`;

        // Render the diagram
        const { svg } = await mermaid.render(id, code);
        setSvg(svg);
      } catch (err) {
        console.error('Failed to render Mermaid diagram:', err);
        setError('Failed to render diagram. Please check the syntax.');
      } finally {
        setLoading(false);
      }
    };

    // Render the diagram when the component mounts or when the code changes
    renderDiagram();

    // Re-render when theme changes
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          mutation.attributeName === 'class' &&
          (mutation.target as HTMLElement).classList.contains('dark') !==
            mermaid.mermaidAPI.getConfig().theme?.includes('dark')
        ) {
          renderDiagram();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => {
      observer.disconnect();
    };
  }, [code]);

  if (loading) {
    return (
      <div className={`w-full overflow-hidden rounded-md ${className}`}>
        <Skeleton className="w-full h-64" />
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`w-full overflow-hidden rounded-md p-4 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 ${className}`}
      >
        <p>{error}</p>
        <pre className="mt-2 text-xs overflow-auto p-2 bg-white dark:bg-gray-800 rounded">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-md ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
