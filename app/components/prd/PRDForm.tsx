'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Label } from '@/app/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/app/components/ui/radio-group';
import { toast } from '@/app/components/ui/use-toast';
import { Repository } from '@prisma/client';

interface PRDFormProps {
  repository: Repository;
}

export default function PRDForm({ repository }: PRDFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: `${repository.name} PRD`,
    summary: '',
    llmConfigId: ''
  });

  const [llmConfigs, setLlmConfigs] = useState<{ id: string; name: string }[]>(
    []
  );

  // Fetch LLM configurations on component mount
  useState(() => {
    const fetchLlmConfigs = async () => {
      try {
        const response = await fetch('/api/llm/configs');
        const data = await response.json();
        setLlmConfigs(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, llmConfigId: data[0].id }));
        }
      } catch (error) {
        console.error('Failed to fetch LLM configurations:', error);
        toast({
          title: 'Error',
          description: 'Failed to load LLM configurations. Please try again.',
          variant: 'destructive'
        });
      }
    };

    fetchLlmConfigs();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLlmConfigChange = (value: string) => {
    setFormData(prev => ({ ...prev, llmConfigId: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/prds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          repositoryId: repository.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create PRD');
      }

      const data = await response.json();
      router.push(`/prds/${data.id}`);
      toast({
        title: 'Success',
        description: 'PRD generation started successfully!'
      });
    } catch (error) {
      console.error('Failed to create PRD:', error);
      toast({
        title: 'Error',
        description: 'Failed to create PRD. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary</Label>
        <Textarea
          id="summary"
          name="summary"
          value={formData.summary}
          onChange={handleInputChange}
          placeholder="Brief description of what this PRD should cover..."
          rows={4}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>LLM Configuration</Label>
        <RadioGroup
          value={formData.llmConfigId}
          onValueChange={handleLlmConfigChange}
          className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3"
        >
          {llmConfigs.map(config => (
            <div
              key={config.id}
              className="flex items-center space-x-2 border p-3 rounded-md"
            >
              <RadioGroupItem value={config.id} id={`config-${config.id}`} />
              <Label htmlFor={`config-${config.id}`}>{config.name}</Label>
            </div>
          ))}
        </RadioGroup>
        {llmConfigs.length === 0 && (
          <p className="text-sm text-red-500">
            No LLM configurations found. Please create one in your settings.
          </p>
        )}
      </div>

      <Button type="submit" disabled={loading || llmConfigs.length === 0}>
        {loading ? 'Creating...' : 'Generate PRD'}
      </Button>
    </form>
  );
}
