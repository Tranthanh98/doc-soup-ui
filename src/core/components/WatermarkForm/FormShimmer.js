import React from 'react';
import PropTypes from 'prop-types';
import { Stack, Shimmer, ShimmerElementsGroup, ShimmerElementType } from '@fluentui/react';

export default function FormShimmer(props) {
  const { children, rightSubmitButton, settingOptionsSchema, isDataLoaded } = props;
  const shimmerOptions = {
    preview: (
      <>
        <ShimmerElementsGroup flexWrap shimmerElements={[{ type: ShimmerElementType.line, width: 460, height: 240 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 32 }]} />
      </>
    ),
    text: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 50, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 75, height: 30 },
            { type: ShimmerElementType.gap, width: 8, height: 30 },
            { type: ShimmerElementType.line, width: 75, height: 30 },
            { type: ShimmerElementType.gap, width: 8, height: 30 },
            { type: ShimmerElementType.line, width: 75, height: 30 },
            { type: ShimmerElementType.gap, width: '100%', height: 30 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    fontSize: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 70, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    fontColor: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 70, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 30, height: 30 },
            { type: ShimmerElementType.gap, width: '100%', height: 30 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    position: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 70, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    rotation: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 70, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    tiled: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 18, height: 18 },
            { type: ShimmerElementType.gap, width: 8, height: 16 },
            { type: ShimmerElementType.line, width: 50, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 16 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    transparency: (
      <>
        <ShimmerElementsGroup
          shimmerElements={[
            { type: ShimmerElementType.line, width: 70, height: 12 },
            { type: ShimmerElementType.gap, width: '100%', height: 12 },
          ]}
        />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 8 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 32 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    summary: (
      <>
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.line, width: '100%', height: 12 }]} />
        <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: '100%', height: 24 }]} />
      </>
    ),
    submitButton: rightSubmitButton ? (
      <ShimmerElementsGroup
        shimmerElements={[
          { type: ShimmerElementType.gap, width: '100%', height: 40 },
          { type: ShimmerElementType.line, width: 71, height: 40 },
          { type: ShimmerElementType.gap, width: 8, height: 40 },
          { type: ShimmerElementType.line, width: 88, height: 40 },
        ]}
      />
    ) : (
      <ShimmerElementsGroup
        shimmerElements={[
          { type: ShimmerElementType.line, width: 152, height: 40 },
          { type: ShimmerElementType.gap, width: '100%', height: 40 },
        ]}
      />
    ),
  };
  const renderFormShimmer = settingOptionsSchema.map((option, index) => {
    if (typeof option === 'string') {
      return <React.Fragment key={index}>{shimmerOptions[option]}</React.Fragment>;
    }
    if (typeof option === 'object') {
      return (
        <Stack horizontal tokens={{ childrenGap: 0 }} key={index}>
          {option.map((item, index) => (
            <React.Fragment key={index + item}>
              {index > 0 && (
                <ShimmerElementsGroup shimmerElements={[{ type: ShimmerElementType.gap, width: 16, height: 76 }]} />
              )}
              <Stack.Item grow key={index}>
                {shimmerOptions[item]}
              </Stack.Item>
            </React.Fragment>
          ))}
        </Stack>
      );
    }
    return null;
  });
  return (
    <Shimmer isDataLoaded={isDataLoaded} customElementsGroup={renderFormShimmer}>
      {children}
    </Shimmer>
  );
}
FormShimmer.propTypes = {
  settingOptionsSchema: PropTypes.oneOfType([PropTypes.array]).isRequired,
  isDataLoaded: PropTypes.bool.isRequired,
  rightSubmitButton: PropTypes.bool,
};
FormShimmer.defaultProps = {
  rightSubmitButton: false,
};
