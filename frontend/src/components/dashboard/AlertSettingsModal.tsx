import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { AlertSettings } from '@/hooks/useAlertSettings';
import { Bell, AlertTriangle, Info, Shield, RotateCcw } from 'lucide-react';

interface AlertSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AlertSettings;
  onUpdateSettings: (settings: Partial<AlertSettings>) => void;
  onResetSettings: () => void;
}

export const AlertSettingsModal = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetSettings,
}: AlertSettingsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle className="font-orbitron text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            ALERT PREFERENCES
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <Label className="font-orbitron text-sm">Enable Alerts</Label>
                <p className="text-xs text-muted-foreground font-rajdhani">
                  Receive notifications for close approaches
                </p>
              </div>
            </div>
            <Switch
              checked={settings.enabled}
              onCheckedChange={(checked) => onUpdateSettings({ enabled: checked })}
            />
          </div>

          {/* Risk Level Filters */}
          <div className="space-y-3">
            <Label className="font-orbitron text-xs text-muted-foreground">
              ALERT BY RISK LEVEL
            </Label>
            
            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span className="font-rajdhani text-sm">High Risk</span>
              </div>
              <Switch
                checked={settings.showHighRisk}
                onCheckedChange={(checked) => onUpdateSettings({ showHighRisk: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-warning" />
                <span className="font-rajdhani text-sm">Medium Risk</span>
              </div>
              <Switch
                checked={settings.showMediumRisk}
                onCheckedChange={(checked) => onUpdateSettings({ showMediumRisk: checked })}
                disabled={!settings.enabled}
              />
            </div>

            <div className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/30">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-safe" />
                <span className="font-rajdhani text-sm">Low Risk</span>
              </div>
              <Switch
                checked={settings.showLowRisk}
                onCheckedChange={(checked) => onUpdateSettings({ showLowRisk: checked })}
                disabled={!settings.enabled}
              />
            </div>
          </div>

          {/* Days Ahead Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-orbitron text-xs text-muted-foreground">
                APPROACH WINDOW
              </Label>
              <span className="text-sm font-rajdhani text-primary">
                {settings.daysAhead} days
              </span>
            </div>
            <Slider
              value={[settings.daysAhead]}
              onValueChange={([value]) => onUpdateSettings({ daysAhead: value })}
              min={7}
              max={90}
              step={1}
              disabled={!settings.enabled}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground font-rajdhani">
              Show alerts for approaches within this timeframe
            </p>
          </div>

          {/* Minimum Risk Score (0–100) - stored in localStorage; later backend will persist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-orbitron text-xs text-muted-foreground">
                MINIMUM RISK SCORE
              </Label>
              <span className="text-sm font-rajdhani text-primary">
                {settings.minRiskScore}
              </span>
            </div>
            <Slider
              value={[settings.minRiskScore]}
              onValueChange={([value]) => onUpdateSettings({ minRiskScore: value })}
              min={0}
              max={100}
              step={1}
              disabled={!settings.enabled}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground font-rajdhani">
              Only alert for asteroids at or above this risk score (0–100)
            </p>
          </div>

          {/* Only Hazardous Asteroids - stored in localStorage; later backend will persist */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
            <div>
              <Label className="font-orbitron text-sm">Only Hazardous Asteroids</Label>
              <p className="text-xs text-muted-foreground font-rajdhani">
                Only show alerts for NASA-classified hazardous objects
              </p>
            </div>
            <Switch
              checked={settings.onlyHazardous}
              onCheckedChange={(checked) => onUpdateSettings({ onlyHazardous: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {/* Minimum Diameter */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="font-orbitron text-xs text-muted-foreground">
                MIN. DIAMETER
              </Label>
              <span className="text-sm font-rajdhani text-primary">
                {settings.minDiameter}m
              </span>
            </div>
            <Slider
              value={[settings.minDiameter]}
              onValueChange={([value]) => onUpdateSettings({ minDiameter: value })}
              min={0}
              max={500}
              step={10}
              disabled={!settings.enabled}
              className="w-full"
            />
            <p className="text-xs text-muted-foreground font-rajdhani">
              Only alert for asteroids larger than this
            </p>
          </div>

          {/* Watchlist Only */}
          <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border">
            <div>
              <Label className="font-orbitron text-sm">Watchlist Only</Label>
              <p className="text-xs text-muted-foreground font-rajdhani">
                Only show alerts for watched asteroids
              </p>
            </div>
            <Switch
              checked={settings.notifyWatchlistOnly}
              onCheckedChange={(checked) => onUpdateSettings({ notifyWatchlistOnly: checked })}
              disabled={!settings.enabled}
            />
          </div>

          {/* Reset Button */}
          <Button
            variant="outline"
            onClick={onResetSettings}
            className="w-full font-rajdhani"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset to Defaults
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
