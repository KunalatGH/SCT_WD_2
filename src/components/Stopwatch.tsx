import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

interface LapTime {
  id: number;
  time: string;
  totalTime: number;
}

const Stopwatch = () => {
  // State management for stopwatch functionality
  const [time, setTime] = useState(0); // Time in milliseconds
  const [isRunning, setIsRunning] = useState(false);
  const [lapTimes, setLapTimes] = useState<LapTime[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * @param totalMilliseconds - Total time in milliseconds
   * @returns Formatted string "mm:ss:ms"
   */
  const formatTime = useCallback((totalMilliseconds: number): string => {
    const minutes = Math.floor(totalMilliseconds / 60000);
    const seconds = Math.floor((totalMilliseconds % 60000) / 1000);
    const milliseconds = Math.floor((totalMilliseconds % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}:${milliseconds.toString().padStart(2, '0')}`;
  }, []);

  const startStopwatch = useCallback(() => {
    setIsRunning(true);
    intervalRef.current = setInterval(() => {
      setTime(prevTime => prevTime + 10);
    }, 10);
  }, []);

  const pauseStopwatch = useCallback(() => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  
  const resetStopwatch = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLapTimes([]);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);


  const recordLap = useCallback(() => {
    if (time > 0) {
      const newLap: LapTime = {
        id: lapTimes.length + 1,
        time: formatTime(time),
        totalTime: time
      };
      setLapTimes(prevLaps => [newLap, ...prevLaps]);
    }
  }, [time, lapTimes.length, formatTime]);


  const handleStartPause = useCallback(() => {
    if (isRunning) {
      pauseStopwatch();
    } else {
      startStopwatch();
    }
  }, [isRunning, startStopwatch, pauseStopwatch]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        
        {/* Main Stopwatch Display */}
        <Card className="p-8 text-center bg-stopwatch-display border-border/20 shadow-2xl">
          <div className="space-y-6">
            
            {/* Title */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <Timer className="w-8 h-8 text-primary" />
              <h1 className="text-2xl font-bold text-foreground">Stopwatch</h1>
            </div>

            {/* Time Display */}
            <div className="relative">
              <div 
                className={`text-6xl md:text-7xl font-mono font-bold text-stopwatch-text tracking-wider ${
                  isRunning ? 'animate-pulse-glow' : ''
                }`}
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {formatTime(time)}
              </div>
              <div className="text-sm text-muted-foreground mt-2 tracking-widest">
                MM:SS:MS
              </div>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              
              {/* Start/Pause Button */}
              <Button
                onClick={handleStartPause}
                variant={isRunning ? "pause" : "start"}
                size="lg"
                className="min-w-[100px] h-12 text-base font-semibold shadow-lg"
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </>
                )}
              </Button>

              {/* Lap Button */}
              <Button
                onClick={recordLap}
                variant="lap"
                size="lg"
                disabled={time === 0}
                className="min-w-[80px] h-12 text-base font-semibold shadow-lg"
              >
                <Timer className="w-5 h-5 mr-2" />
                Lap
              </Button>

              {/* Reset Button */}
              <Button
                onClick={resetStopwatch}
                variant="reset"
                size="lg"
                disabled={time === 0 && lapTimes.length === 0}
                className="min-w-[80px] h-12 text-base font-semibold shadow-lg"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                Reset
              </Button>
            </div>
          </div>
        </Card>

        {/* Lap Times Display */}
        {lapTimes.length > 0 && (
          <Card className="p-6 bg-card/50 backdrop-blur border-border/20">
            <h3 className="text-lg font-semibold mb-4 text-center text-foreground">
              Lap Times ({lapTimes.length})
            </h3>
            
            <div className="max-h-64 overflow-y-auto scrollbar-thin space-y-2">
              {lapTimes.map((lap, index) => (
                <div
                  key={lap.id}
                  className="flex justify-between items-center p-3 bg-secondary/30 rounded-lg border border-border/10 hover:bg-secondary/50 transition-colors animate-bounce-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="font-medium text-foreground">
                    Lap {lap.id}
                  </span>
                  <span className="font-mono text-lg font-semibold text-primary">
                    {lap.time}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>• Press <strong>Start</strong> to begin timing</p>
          <p>• Use <strong>Lap</strong> to record split times</p>
          <p>• <strong>Reset</strong> clears everything</p>
        </div>
      </div>
    </div>
  );
};

export default Stopwatch;