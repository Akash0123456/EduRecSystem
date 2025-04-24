import React from 'react';
import { Header } from '../../components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { useSettings } from '../../contexts/SettingsContext';

export const Settings = (): JSX.Element => {
  const { settings, updateSettings, resetSettings } = useSettings();

  return (
    <div className="flex flex-col bg-gray-900 min-h-screen">
      <Header />
      {/* Main Content */}
      <main className="flex-1 flex flex-col pt-[69px]">
        <div className="max-w-4xl mx-auto w-full p-6">
          <h1 className="text-3xl font-bold text-gray-100 mb-6">Settings</h1>
          
          {/* Accessibility Settings */}
          <Card className="bg-[#1f293780] border border-gray-700 rounded-lg mb-6">
            <CardHeader>
              <CardTitle className="text-gray-100">Accessibility</CardTitle>
              <CardDescription className="text-gray-400">
                Customize the appearance of the application to improve readability.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Text Size</label>
                <RadioGroup
                  value={settings.textSize}
                  onValueChange={(value) => updateSettings({ textSize: value as 'small' | 'medium' | 'large' })}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="small" id="text-size-small" />
                    <label htmlFor="text-size-small" className="text-sm text-gray-300 cursor-pointer">
                      Small
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="text-size-medium" />
                    <label htmlFor="text-size-medium" className="text-sm text-gray-300 cursor-pointer">
                      Medium (Default)
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="large" id="text-size-large" />
                    <label htmlFor="text-size-large" className="text-sm text-gray-300 cursor-pointer">
                      Large
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Response Settings */}
          <Card className="bg-[#1f293780] border border-gray-700 rounded-lg mb-6">
            <CardHeader>
              <CardTitle className="text-gray-100">Response Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Customize how AI responses are generated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Response Length</label>
                <Select 
                  value={settings.responseLength}
                  onValueChange={(value) => updateSettings({ responseLength: value as 'concise' | 'balanced' | 'detailed' })}
                >
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Select response length" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="concise">Concise - Brief answers with key points</SelectItem>
                    <SelectItem value="balanced">Balanced - Moderate detail (Default)</SelectItem>
                    <SelectItem value="detailed">Detailed - Comprehensive explanations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator className="bg-gray-700" />

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">Citation Style</label>
                <Select 
                  value={settings.citationStyle}
                  onValueChange={(value) => updateSettings({ citationStyle: value as 'MLA' | 'APA' | 'Chicago' | 'Harvard' })}
                >
                  <SelectTrigger className="w-full bg-gray-800 border-gray-700 text-gray-200">
                    <SelectValue placeholder="Select citation style" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700 text-gray-200">
                    <SelectItem value="MLA">MLA</SelectItem>
                    <SelectItem value="APA">APA</SelectItem>
                    <SelectItem value="Chicago">Chicago</SelectItem>
                    <SelectItem value="Harvard">Harvard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Reset Settings */}
          <div className="flex justify-end">
            <Button 
              variant="outline" 
              onClick={resetSettings}
              className="text-gray-300 border-gray-600 hover:bg-gray-700"
            >
              Reset to Defaults
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
