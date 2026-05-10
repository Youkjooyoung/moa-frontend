import { useEffect, useRef, useState } from "react";
import { AlertCircle, Clock } from "lucide-react";

const DEFAULT_SECONDS = 600;

export default function CountdownTimer({ expiresAt, onExpire }) {
  const expiredRef = useRef(false);
  const fallbackExpiresAtRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState({ minutes: 10, seconds: 0, total: DEFAULT_SECONDS });

  useEffect(() => {
    expiredRef.current = false;
    fallbackExpiresAtRef.current = Date.now() + DEFAULT_SECONDS * 1000;

    const calculateTimeLeft = () => {
      const parsedExpireTime = expiresAt ? new Date(expiresAt).getTime() : NaN;
      const expireTime =
        Number.isNaN(parsedExpireTime) || parsedExpireTime <= Date.now()
          ? fallbackExpiresAtRef.current
          : parsedExpireTime;

      const diff = Math.max(0, Math.floor((expireTime - Date.now()) / 1000));
      return {
        minutes: Math.floor(diff / 60),
        seconds: diff % 60,
        total: diff,
      };
    };

    setTimeLeft(calculateTimeLeft());

    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (newTimeLeft.total <= 0 && !expiredRef.current) {
        expiredRef.current = true;
        clearInterval(interval);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  const formatTime = () => {
    const mins = String(timeLeft.minutes).padStart(2, "0");
    const secs = String(timeLeft.seconds).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const timerColor = timeLeft.total <= 60 ? "text-red-500" : timeLeft.total <= 180 ? "text-orange-500" : "text-slate-500";
  const isUrgent = timeLeft.total <= 60;

  return (
    <div
      className={`flex items-center justify-center gap-2 ${timerColor}`}
    >
      {isUrgent ? <AlertCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
      <span className="font-mono text-sm font-medium">{formatTime()} {"\ub0a8\uc74c"}</span>
    </div>
  );
}
