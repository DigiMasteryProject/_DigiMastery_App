import { useEffect, useState } from "react";
import api from "../services/api";

export function useDigimonEvolution(
  digimonId: number,
  speciesList: any[]
) {
  const [evolutions, setEvolutions] = useState<any[]>([]);
  const [preevolutions, setPreevolutions] = useState<any[]>([]);

  useEffect(() => {
    if (!digimonId) return;

    fetchEvolutionData();
  }, [digimonId]);

  const fetchEvolutionData = async () => {
    try {
      const [evoRes, preRes] = await Promise.all([
        api.get(`/digimon_evolution/base/${digimonId}`),
        api.get(`/digimon_evolution/new/${digimonId}`)
      ]);

      setEvolutions(evoRes?.datos || []);
      setPreevolutions(preRes?.datos || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getDigimonName = (id: number) => {
    return speciesList.find((d) => d.id === id)?.name || `#${id}`;
  };

  return {
    evolutions,
    preevolutions,
    getDigimonName,
  };
}