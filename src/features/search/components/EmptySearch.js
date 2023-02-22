import React from 'react';
import { Stack } from '@fluentui/react';
import { FileDetailEmptyContent, CustomText } from 'features/shared/components';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';

const emptyTokens = {
  childrenGap: 20,
};

const emptyStackItemStyles = {
  root: { [BREAKPOINTS_RESPONSIVE.mdDown]: { marginTop: 34 } },
};

const emptyTextStyles = {
  fontSize: 12,
};

function EmptySearch() {
  return (
    <FileDetailEmptyContent
      imageUrl="/img/pages/emptySearch.png"
      srcSet="/img/pages/emptySearch2x.png 2x, /img/pages/emptySearch3x.png 3x"
      offsetHeight="410px"
      content={
        <Stack tokens={emptyTokens}>
          <Stack.Item styles={emptyStackItemStyles}>
            <CustomText styles={{ root: { marginBottom: 30, fontSize: 20, fontWeight: 'normal' } }}>
              Sorry, no search results were found.
            </CustomText>
          </Stack.Item>
          <Stack.Item>
            <div style={{ marginBottom: 8 }}>
              <CustomText color="textSecondary" style={{ fontSize: 14 }}>
                Suggestions :
              </CustomText>
            </div>
            <div>
              <CustomText color="textSecondary" style={emptyTextStyles}>
                ∙ Make sure all words are spelled correctly.
              </CustomText>
            </div>
            <div>
              <CustomText color="textSecondary" style={emptyTextStyles}>
                ∙ Try different keywords.
              </CustomText>
            </div>
            <div>
              <CustomText color="textSecondary" style={emptyTextStyles}>
                ∙ Try more general keywords.
              </CustomText>
            </div>
            <div>
              <CustomText color="textSecondary" style={emptyTextStyles}>
                ∙ Try fewer keywords.
              </CustomText>
            </div>
          </Stack.Item>
        </Stack>
      }
    />
  );
}

export default EmptySearch;
