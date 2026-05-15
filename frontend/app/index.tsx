// app/index.tsx
import { useEffect, useState } from "react";
import { useRouter, useNavigationState } from "expo-router";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setReady(true);
    }, 0); // espera un tick para que el Slot se monte
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) {
      router.replace("/login"); // ahora sí se puede navegar
    }
  }, [ready]);

  return null; // o un Loading
}