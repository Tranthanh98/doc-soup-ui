import { FontWeights, Stack } from '@fluentui/react';
import { PAGE_PATHS } from 'core/constants/Const';
import { BREAKPOINTS_RESPONSIVE } from 'core/constants/Theme';
import { CustomButton, CustomDetailsList, CustomText } from 'features/shared/components';
import React from 'react';
import { Link } from 'react-router-dom';
import GlobalContext from 'security/GlobalContext';
import PropTypes from 'prop-types';
import { columnContactSchema } from './columnsSchema';

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

function SearchContact(props) {
  const { data, keyword } = props;
  const context = React.useContext(GlobalContext);
  const { isMobile } = context;

  const resultColumnSchema = [...columnContactSchema(isMobile)];

  if (isMobile) {
    resultColumnSchema.splice(2, 1);
  }

  return data.items && data.items.length > 0 ? (
    <Stack.Item>
      <CustomText variant="mediumPlus" styles={titleStyles}>{`Contacts (${data.totalRows})`}</CustomText>
      <Stack styles={stackStyles}>
        <CustomDetailsList columns={resultColumnSchema} items={data.items} isStickyHeader={false} />
      </Stack>
      {data.totalRows > 5 && (
        <div style={buttonContainerStyles}>
          <Link to={{ pathname: `/${PAGE_PATHS.search}/contact`, search: `?keyword=${keyword}` }}>
            <CustomButton text="Load more" title="Load more" styles={buttonStyles} />
          </Link>
        </div>
      )}
    </Stack.Item>
  ) : null;
}

SearchContact.propTypes = {
  data: PropTypes.shape({
    items: PropTypes.oneOfType([PropTypes.array]),
    page: PropTypes.number,
    totalRows: PropTypes.number,
    totalPages: PropTypes.number,
  }).isRequired,
  keyword: PropTypes.string,
};

SearchContact.defaultProps = {
  keyword: '',
};

export default SearchContact;
