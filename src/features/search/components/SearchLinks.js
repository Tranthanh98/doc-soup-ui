import React from 'react';
import PropTypes from 'prop-types';
import { FontWeights, Stack } from '@fluentui/react';
import { Link } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import { CustomDetailsList, CustomButton, CustomText } from 'features/shared/components';
import { PAGE_PATHS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { linksColumnSchema } from './columnsSchema';

const titleStyles = {
  root: {
    fontWeight: FontWeights.semibold,
  },
};
const buttonStyles = {
  root: {
    maxHeight: 30,
    borderRadius: 2,
    padding: '5px 16px',
  },
};

const buttonContainerStyles = {
  display: 'flex',
  justifyContent: 'center',
  margin: '24px 0 48px',
};

const stackStyles = {
  root: {
    marginTop: '20px',
    [BREAKPOINTS_RESPONSIVE.mdDown]: {
      marginTop: 0,
    },
  },
};

function SearchContent(props) {
  const { data, keyword } = props;
  const context = React.useContext(GlobalContext);
  const { isMobile } = context;

  const resultColumnSchema = [...linksColumnSchema(isMobile)];

  if (isMobile) {
    resultColumnSchema.splice(1, 2);
  }

  return data.items && data.items.length > 0 ? (
    <Stack.Item>
      <CustomText variant="mediumPlus" styles={titleStyles}>{`Links (${data.totalRows})`}</CustomText>
      <Stack styles={stackStyles}>
        <CustomDetailsList columns={resultColumnSchema} items={data.items} isStickyHeader={false} />
      </Stack>
      {data.totalRows > 5 && (
        <div style={buttonContainerStyles}>
          <Link to={{ pathname: `/${PAGE_PATHS.search}/link`, search: `?keyword=${keyword}` }}>
            <CustomButton text="Load more" title="Load more" styles={buttonStyles} />
          </Link>
        </div>
      )}
    </Stack.Item>
  ) : null;
}

SearchContent.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.oneOfType([PropTypes.array]),
    page: PropTypes.number,
    totalRows: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  keyword: PropTypes.string,
};

SearchContent.defaultProps = {
  keyword: '',
};

export default SearchContent;
