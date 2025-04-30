'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [llmConfigs, setLlmConfigs] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    endpoint: '',
    apiKey: '',
    modelName: '',
    contextWindow: 16384,
    isActive: true
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/settings');
    } else if (status === 'authenticated') {
      fetchConfigs();
    }
  }, [status, router]);

  const fetchConfigs = async () => {
    try {
      const response = await fetch('/api/llm/configs');
      if (!response.ok) throw new Error('Failed to fetch configurations');
      const data = await response.json();
      setLlmConfigs(data);
    } catch (error) {
      console.error('Error fetching LLM configs:', error);
      toast({
        title: 'Error',
        description: 'Failed to load LLM configurations',
        variant: 'destructive'
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/llm/configs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create configuration');

      toast({
        title: 'Success',
        description: 'LLM configuration created successfully'
      });

      // Reset form and refresh configs
      setFormData({
        name: '',
        endpoint: '',
        apiKey: '',
        modelName: '',
        contextWindow: 16384,
        isActive: true
      });

      await fetchConfigs();
    } catch (error) {
      console.error('Error creating LLM config:', error);
      toast({
        title: 'Error',
        description: 'Failed to create LLM configuration',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="llm" className="w-full">
        <TabsList>
          <TabsTrigger value="llm">LLM Configurations</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="llm" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Add New LLM Configuration</CardTitle>
              <CardDescription>
                Configure connections to local or remote LLM providers
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Configuration Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g., Local Ollama GPT-4"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endpoint">API Endpoint</Label>
                  <Input
                    id="endpoint"
                    name="endpoint"
                    value={formData.endpoint}
                    onChange={handleInputChange}
                    placeholder="e.g., http://localhost:11434/api/generate"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key (optional)</Label>
                  <Input
                    id="apiKey"
                    name="apiKey"
                    type="password"
                    value={formData.apiKey}
                    onChange={handleInputChange}
                    placeholder="Leave blank for local LLMs"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelName">Model Name</Label>
                  <Input
                    id="modelName"
                    name="modelName"
                    value={formData.modelName}
                    onChange={handleInputChange}
                    placeholder="e.g., llama3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contextWindow">Context Window Size</Label>
                  <Input
                    id="contextWindow"
                    name="contextWindow"
                    type="number"
                    value={formData.contextWindow}
                    onChange={handleInputChange}
                    min={1024}
                    required
                  />
                </div>
              </CardContent>

              <CardFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Add Configuration'}
                </Button>
              </CardFooter>
            </form>
          </Card>

          <h2 className="text-xl font-semibold mt-8 mb-4">
            Your Configurations
          </h2>

          {llmConfigs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {llmConfigs.map(config => (
                <Card key={config.id}>
                  <CardHeader>
                    <CardTitle>{config.name}</CardTitle>
                    <CardDescription>
                      {config.ownedByUser
                        ? 'Your configuration'
                        : 'Shared configuration'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Model:</span>
                        <span>{config.modelName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Context Window:
                        </span>
                        <span>
                          {config.contextWindow.toLocaleString()} tokens
                        </span>
                      </div>
                      {config.ownedByUser && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Endpoint:
                          </span>
                          <span className="truncate max-w-[200px]">
                            {config.endpoint}
                          </span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">
              No configurations found. Add your first one above.
            </p>
          )}
        </TabsContent>

        <TabsContent value="account" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">Email: </span>
                  {session?.user?.email}
                </p>
                <p>
                  <span className="font-semibold">Name: </span>
                  {session?.user?.name}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
