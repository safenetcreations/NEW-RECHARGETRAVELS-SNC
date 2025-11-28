import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bot, Key, CheckCircle, XCircle, Loader2, Eye, EyeOff, ExternalLink } from 'lucide-react';

const AISettingsPanel = () => {
  const { toast } = useToast();
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [status, setStatus] = useState<'unknown' | 'valid' | 'invalid'>('unknown');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const settingsDoc = await getDoc(doc(db, 'settings', 'ai_config'));
      if (settingsDoc.exists()) {
        const data = settingsDoc.data();
        if (data?.gemini_api_key) {
          setApiKey(data.gemini_api_key);
          setStatus('valid');
        }
      }
    } catch (error) {
      console.error('Error loading AI settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      await setDoc(doc(db, 'settings', 'ai_config'), {
        gemini_api_key: apiKey.trim(),
        updated_at: new Date().toISOString(),
        provider: 'gemini',
      });

      toast({
        title: 'API Key Saved',
        description: 'Your Gemini API key has been saved successfully.',
      });
      setStatus('unknown');
    } catch (error) {
      console.error('Error saving API key:', error);
      toast({
        title: 'Error',
        description: 'Failed to save API key. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const testApiKey = async () => {
    if (!apiKey.trim()) {
      toast({
        title: 'API Key Required',
        description: 'Please enter your Gemini API key first.',
        variant: 'destructive',
      });
      return;
    }

    setIsTesting(true);
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Say "Hello" in one word.' }] }],
          }),
        }
      );

      if (response.ok) {
        setStatus('valid');
        toast({
          title: 'API Key Valid',
          description: 'Your Gemini API key is working correctly.',
        });
      } else {
        setStatus('invalid');
        toast({
          title: 'API Key Invalid',
          description: 'The API key is not valid. Please check and try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      setStatus('invalid');
      toast({
        title: 'Connection Error',
        description: 'Could not connect to Gemini API. Please check your internet connection.',
        variant: 'destructive',
      });
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center p-8">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <CardTitle className="flex items-center gap-2">
              AI Trip Planner Settings
              {status === 'valid' && (
                <Badge className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" /> Connected
                </Badge>
              )}
              {status === 'invalid' && (
                <Badge className="bg-red-100 text-red-700">
                  <XCircle className="w-3 h-3 mr-1" /> Invalid Key
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Configure your Google Gemini API key for AI-powered itinerary generation
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Input */}
        <div className="space-y-2">
          <Label htmlFor="apiKey" className="flex items-center gap-2">
            <Key className="w-4 h-4" />
            Gemini API Key
          </Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="apiKey"
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIza..."
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={testApiKey}
            variant="outline"
            disabled={isTesting || !apiKey}
          >
            {isTesting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Test Connection
              </>
            )}
          </Button>
          <Button
            onClick={saveApiKey}
            disabled={isSaving || !apiKey}
            className="bg-gradient-to-r from-purple-500 to-teal-500"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              'Save API Key'
            )}
          </Button>
        </div>

        {/* Help Section */}
        <div className="p-4 bg-gray-50 rounded-xl space-y-3">
          <h4 className="font-semibold text-gray-700">How to get a Gemini API Key:</h4>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
            <li>
              Go to{' '}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 hover:underline inline-flex items-center gap-1"
              >
                Google AI Studio <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>Sign in with your Google account</li>
            <li>Click "Create API Key"</li>
            <li>Copy the key and paste it above</li>
          </ol>
          <p className="text-xs text-gray-500 mt-2">
            Note: Gemini API has a free tier with generous limits for personal use.
          </p>
        </div>

        {/* Status Info */}
        {status === 'valid' && (
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-5 h-5" />
              <span className="font-semibold">AI Trip Planner is Active</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Users can now generate AI-powered itineraries using Google Gemini.
            </p>
          </div>
        )}

        {status === 'unknown' && apiKey && (
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 text-amber-700">
              <Key className="w-5 h-5" />
              <span className="font-semibold">API Key Not Tested</span>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              Click "Test Connection" to verify your API key works correctly.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AISettingsPanel;
