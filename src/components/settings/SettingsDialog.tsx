import React from 'react';
import { useStore } from '../../lib/store';
import { Button } from '../../components/ui/button';
import { Settings, Moon, Sun, Monitor } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';
import * as Select from '@radix-ui/react-select';

export function SettingsDialog() {
  const { settings, updateSettings } = useStore();

  const themeIcons = {
    light: <Sun className="h-4 w-4" />,
    dark: <Moon className="h-4 w-4" />,
    system: <Monitor className="h-4 w-4" />,
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background p-6 rounded-lg shadow-lg w-[400px] text-foreground">
          <Dialog.Title className="text-lg font-semibold mb-4">
            Settings
          </Dialog.Title>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label>Theme</label>
              <Select.Root
                value={settings.theme}
                onValueChange={(value) => 
                  updateSettings({ theme: value as 'light' | 'dark' | 'system' })
                }
              >
                <Select.Trigger className="inline-flex items-center justify-center px-4 py-2 rounded border gap-2">
                  {themeIcons[settings.theme as keyof typeof themeIcons]}
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-background border rounded-md shadow-md">
                    <Select.Viewport>
                      <Select.Item value="light" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <Select.ItemText>Light</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="dark" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <Select.ItemText>Dark</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="system" className="px-4 py-2 cursor-pointer hover:bg-muted flex items-center gap-2">
                        <Monitor className="h-4 w-4" />
                        <Select.ItemText>System</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            <div className="flex items-center justify-between">
              <label>Typing Animation</label>
              <Switch.Root
                checked={settings.typingAnimation}
                onCheckedChange={(checked) => 
                  updateSettings({ typingAnimation: checked })
                }
                className="w-11 h-6 bg-muted rounded-full relative data-[state=checked]:bg-primary"
              >
                <Switch.Thumb className="block w-5 h-5 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[22px]" />
              </Switch.Root>
            </div>

            <div className="space-y-2">
              <label>Typing Speed (ms)</label>
              <input
                type="number"
                value={settings.typingSpeed}
                onChange={(e) => updateSettings({ typingSpeed: Number(e.target.value) })}
                min={10}
                max={200}
                className="w-full p-2 border rounded bg-background"
              />
            </div>

            <div className="space-y-2">
              <label>LMStudio URL</label>
              <input
                type="url"
                value={settings.lmStudioUrl}
                onChange={(e) => updateSettings({ lmStudioUrl: e.target.value })}
                className="w-full p-2 border rounded bg-background"
                placeholder="http://localhost:1234"
              />
            </div>

            {settings.activeModel && (
              <div className="text-sm text-muted-foreground">
                Active Model: {settings.activeModel}
              </div>
            )}
          </div>

          <Dialog.Close asChild>
            <Button className="mt-4">Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}