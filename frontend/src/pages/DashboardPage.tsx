import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import RiskExplanationModal from '@/components/dashboard/RiskExplanationModal';
import { AsteroidCard } from '@/components/dashboard/AsteroidCard';
import { NEOFilterBar, type RiskLevelFilter } from '@/components/dashboard/NEOFilterBar';
import { UpcomingCloseApproachPanel } from '@/components/dashboard/UpcomingCloseApproachPanel';
import { AlertsDropdown } from '@/components/dashboard/AlertsDropdown';
import { ProfileDropdown } from '@/components/dashboard/ProfileDropdown';
import { ImpactModal } from '@/components/dashboard/ImpactModal';
import { AlertSettingsModal } from '@/components/dashboard/AlertSettingsModal';
import { WatchlistPanel } from '@/components/dashboard/WatchlistPanel';
import { CommunityChat } from '@/components/dashboard/CommunityChat';
import { AsteroidDetailModal } from '@/components/dashboard/AsteroidDetailModal';
import { calculateImpactScenario } from '@/utils/impactScenario';
import { Asteroid, ImpactScenario } from '@/types/asteroid';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useAsteroidFeed } from '@/hooks/useAsteroidFeed';
import { useAlertSettings } from '@/hooks/useAlertSettings';
import { useAlertNotifications } from '@/hooks/useAlertNotifications';
import { useChatUnread } from '@/hooks/useChatUnread';
import { useToast } from '@/hooks/use-toast';
import {
  Globe,
  LayoutDashboard,
  HelpCircle,
  Star,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import DashboardBackground from '@/components/3d/DashboardBackground';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    asteroids: feedAsteroids,
    loading: feedLoading,
    error: feedError,
    filterStart,
    filterEnd,
    setFilterStart,
    setFilterEnd,
    totalPages,
    currentPage,
    goToPage,
    riskLevel,
    setRiskLevel,
    refetch,
    setFiltersAndRefetch,
  } = useAsteroidFeed();

  const [selectedAsteroid, setSelectedAsteroid] = useState<Asteroid | null>(null);
  const [impactScenario, setImpactScenario] = useState<ImpactScenario | null>(null);
  const [showImpactModal, setShowImpactModal] = useState(false);
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showAlertSettingsModal, setShowAlertSettingsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [isChatFullscreen, setIsChatFullscreen] = useState(false);
  const [selectedChatAsteroidId, setSelectedChatAsteroidId] = useState<string | null>(null);
  const [watchlistOpen, setWatchlistOpen] = useState(false);
  const [detailAsteroidId, setDetailAsteroidId] = useState<string | null>(null);
  const [detailAsteroid, setDetailAsteroid] = useState<Asteroid | null>(null);

  const { watchlist, asteroidCache, addToWatchlist, removeFromWatchlist, isWatched } = useWatchlist();
  const { settings: alertSettings, updateSettings: updateAlertSettings, resetSettings: resetAlertSettings } =
    useAlertSettings();

  const { alertAsteroids } = useAlertNotifications({
    settings: alertSettings,
    watchedAsteroidIds: watchlist.map((w) => w.asteroidId),
    asteroids: feedAsteroids,
  });

  const { unreadCount: chatUnreadCount, followRoom } = useChatUnread({
    isChatOpen: showChatModal,
    currentAsteroidId: selectedChatAsteroidId,
  });

  const allAsteroidsForWatchlist = feedAsteroids;

  const chatAsteroidOptions = useMemo(() => {
    const byId = new Map<string, Asteroid>();
    feedAsteroids.forEach((a) => byId.set(a.id, a));
    Object.values(asteroidCache).forEach((a) => byId.set(a.id, a));
    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [feedAsteroids, asteroidCache]);

  const handleApplyFilters = () => {
    setFiltersAndRefetch(filterStart, filterEnd);
  };

  const handleViewImpact = (asteroid: Asteroid) => {
    const scenario = calculateImpactScenario(asteroid);
    setImpactScenario(scenario);
    setShowImpactModal(true);
  };

  return (
    <div className="min-h-screen text-white relative bg-transparent">
      <div className="fixed inset-0 z-0 pointer-events-none" aria-hidden>
        <DashboardBackground />
      </div>
      <div
        className="fixed inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none"
        aria-hidden
      />

      <div className="relative z-10 pt-8 pb-8 px-4 md:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-6"
        >
          <div className="flex items-center gap-4">
            <LayoutDashboard className="w-6 h-6 text-cyan-400 shrink-0" />
            <h1 className="text-xl md:text-2xl font-orbitron font-bold tracking-widest text-white">
              NEO MONITORING DASHBOARD
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Sheet open={watchlistOpen} onOpenChange={setWatchlistOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 px-3 py-2 border-white/10 text-gray-400 hover:border-cyan-500/50 hover:text-cyan-400 font-mono text-xs uppercase"
                >
                  <Star className="w-4 h-4" />
                  Watchlist ({watchlist.length})
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-card border-border w-full max-w-sm flex flex-col overflow-hidden">
                <h3 className="font-orbitron text-sm font-bold tracking-widest text-foreground shrink-0 pt-2 pb-4">
                  Watchlist
                </h3>
                <div className="flex-1 min-h-0 flex flex-col">
                  <WatchlistPanel
                    watchlist={watchlist}
                    asteroids={allAsteroidsForWatchlist}
                    asteroidCache={asteroidCache}
                    onSelectAsteroid={(a) => {
                      setDetailAsteroidId(a.id);
                      setDetailAsteroid(a);
                      setWatchlistOpen(false);
                    }}
                    onRemoveFromWatchlist={removeFromWatchlist}
                    selectedAsteroidId={detailAsteroidId ?? undefined}
                  />
                </div>
              </SheetContent>
            </Sheet>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowChatModal(true)}
              className="relative gap-2 px-3 py-2 font-mono text-xs uppercase border-white/10 text-gray-400 hover:border-cyan-500/50"
            >
              <MessageCircle className="w-4 h-4" />
              Chat
              {chatUnreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 min-w-4 items-center justify-center rounded-full bg-yellow-500 text-[10px] font-bold text-black">
                  {chatUnreadCount > 99 ? '99+' : chatUnreadCount}
                </span>
              )}
            </Button>
            <UpcomingCloseApproachPanel
              asteroids={feedAsteroids}
              onSelectAsteroid={(a) => setSelectedAsteroid(a)}
            />
            <AlertsDropdown
              alertAsteroids={alertAsteroids}
              onSelectAsteroid={(a) => setSelectedAsteroid(a)}
              onOpenSettings={() => setShowAlertSettingsModal(true)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRiskModal(true)}
              className="gap-2 px-3 py-2 border-white/10 text-gray-400 hover:border-cyan-500/50 font-mono text-xs uppercase"
            >
              <HelpCircle className="w-4 h-4" />
              Risk
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/explorer')}
              className="gap-2 px-3 py-2 border-cyan-500/50 text-cyan-400 font-mono text-xs uppercase"
            >
              <Globe className="w-4 h-4" />
              3D
            </Button>
            <ProfileDropdown />
          </div>
        </motion.div>

        {/* Top filter bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-6">
          <NEOFilterBar
            startDate={filterStart}
            endDate={filterEnd}
            riskLevel={riskLevel}
            onStartDateChange={setFilterStart}
            onEndDateChange={setFilterEnd}
            onRiskLevelChange={setRiskLevel}
            onApply={handleApplyFilters}
            onRefresh={() => {
              goToPage(0);
              refetch();
            }}
            loading={feedLoading}
          />
          {feedError && <p className="text-xs text-red-400 font-mono mt-2">{feedError}</p>}
        </motion.div>

        {/* Main: grid of cards */}
        <div className="grid gap-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            {feedLoading && feedAsteroids.length === 0 ? (
              <div className="py-20 text-center text-gray-400 font-mono">Loading asteroid data…</div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {feedAsteroids.map((asteroid) => (
                    <AsteroidCard
                      key={asteroid.id}
                      asteroid={asteroid}
                      isWatched={isWatched(asteroid.id)}
                      onToggleWatch={() => {
                        if (isWatched(asteroid.id)) {
                          removeFromWatchlist(asteroid.id);
                          toast({ title: 'Removed from Watchlist', description: `${asteroid.name} removed.` });
                        } else {
                          addToWatchlist(asteroid.id, undefined, asteroid);
                          toast({ title: 'Added to Watchlist', description: `${asteroid.name} is now watched.` });
                        }
                      }}
                      onCardClick={() => {
                        setDetailAsteroidId(asteroid.id);
                        setDetailAsteroid(asteroid);
                      }}
                    />
                  ))}
                </div>
                {feedAsteroids.length === 0 && (
                  <div className="py-20 text-center text-gray-400 font-mono">
                    No asteroids match the current filters.
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 0}
                      className="font-mono text-xs uppercase border-white/20"
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      Previous
                    </Button>
                    <span className="text-sm font-mono text-gray-400">
                      Page {currentPage + 1} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage >= totalPages - 1}
                      className="font-mono text-xs uppercase border-white/20"
                    >
                      Next
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </motion.div>
        </div>

        {/* Full-screen asteroid detail */}
        <AsteroidDetailModal
          asteroidId={detailAsteroidId}
          initialAsteroid={detailAsteroid}
          onClose={() => {
            setDetailAsteroidId(null);
            setDetailAsteroid(null);
          }}
        />

        {/* Community chat popup */}
        <Dialog open={showChatModal} onOpenChange={(open) => { setShowChatModal(open); if (!open) setIsChatFullscreen(false); }}>
          <DialogContent
            className={`overflow-hidden flex flex-col bg-card border-border text-foreground transition-all duration-200 ${
              isChatFullscreen
                ? '!left-0 !top-0 !translate-x-0 !translate-y-0 w-screen h-screen max-w-none max-h-none rounded-none'
                : 'max-w-2xl max-h-[85vh]'
            }`}
          >
            <div className="flex-1 min-h-0 flex flex-col">
              <CommunityChat
                asteroids={chatAsteroidOptions}
                selectedAsteroidId={selectedChatAsteroidId}
                onSelectAsteroid={(a) => setSelectedChatAsteroidId(a?.id ?? null)}
                onFollowRoom={followRoom}
                isFullscreen={isChatFullscreen}
                onToggleFullscreen={() => setIsChatFullscreen((v) => !v)}
              />
            </div>
          </DialogContent>
        </Dialog>

      </div>

      <ImpactModal scenario={impactScenario} isOpen={showImpactModal} onClose={() => setShowImpactModal(false)} />
      <RiskExplanationModal isOpen={showRiskModal} onClose={() => setShowRiskModal(false)} />
      <AlertSettingsModal
        isOpen={showAlertSettingsModal}
        onClose={() => setShowAlertSettingsModal(false)}
        settings={alertSettings}
        onUpdateSettings={updateAlertSettings}
        onResetSettings={resetAlertSettings}
      />
    </div>
  );
};

export default DashboardPage;
