import { useContext, useEffect, useState } from 'react';
import GlobalContext from 'security/GlobalContext';

function useLimitationFeature(allowFeatureKeys) {
  const { planFeatures } = useContext(GlobalContext);

  const [isAllow, setIsAllow] = useState(false);

  useEffect(() => {
    const allowFeatures = planFeatures.filter((i) => allowFeatureKeys.includes(i.featureKey));

    const isAllowFeatures = allowFeatures?.length === 0 || allowFeatures.every((i) => i.limit >= 0);

    setIsAllow(isAllowFeatures);
  }, [allowFeatureKeys, planFeatures]);

  return [isAllow];
}

export default useLimitationFeature;
