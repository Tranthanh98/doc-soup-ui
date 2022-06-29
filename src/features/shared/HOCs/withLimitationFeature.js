import { TooltipDelay, TooltipHost } from '@fluentui/react';
import { ACTION_LIMITATION } from 'core/constants/Const';
import React, { useContext } from 'react';
import GlobalContext from 'security/GlobalContext';

export default function withLimitationFeature(actionKey, allowFeatureKeys, replaceRender = null) {
  return (Component) =>
    ({ ...props }) => {
      const { planFeatures } = useContext(GlobalContext);

      const allowFeatures = planFeatures.filter((i) => allowFeatureKeys.includes(i.featureKey));

      if (allowFeatures?.length === 0 || allowFeatures.some((i) => i.limit < 0)) {
        switch (actionKey) {
          case ACTION_LIMITATION.HIDE: {
            return (
              <div style={{ display: 'none' }}>
                <Component {...props} />
              </div>
            );
          }
          case ACTION_LIMITATION.DISABLED:
            return (
              <TooltipHost content="Please upgrade to use this feature" delay={TooltipDelay.zero}>
                <div
                  onClick={(e) => e.preventDefault()}
                  style={{ pointerEvents: 'none', cursor: 'not-allowed' }}
                  onKeyDown={(e) => e.preventDefault()}
                  role="button"
                  tabIndex={0}
                >
                  <Component {...props} disabled />
                </div>
              </TooltipHost>
            );
          case ACTION_LIMITATION.REPLACED_RENDER:
            return replaceRender;
          default:
            return <Component {...props} isAllow={false} />;
        }
      }
      return <Component {...props} isAllow />;
    };
}
