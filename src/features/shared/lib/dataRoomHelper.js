import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Text, Persona, PersonaSize, TooltipDelay, TooltipHost, Image, ImageFit } from '@fluentui/react';
import { PAGE_PATHS } from 'core/constants/Const';
import toLocalTime from 'features/shared/lib/utils';
import { LIGHT_THEME } from 'core/constants/Theme';

const iconStyles = {
  root: {
    marginRight: 8,
  },
};

const firstLinkNameStyles = {
  root: {
    display: 'inline-block',
    maxWidth: 150,
    paddingRight: 20,
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
  },
};

const linkNameStyles = {
  root: {
    selectors: {
      '&:hover': {
        textDecoration: 'underline',
        cursor: 'pointer',
      },
    },
  },
};

const renderActiveDeactiveTextStyles = (item) => {
  return {
    width: '100%',
    textAlign: 'right',
    color: !item.disabledAllLink ? LIGHT_THEME.palette.neutralPrimary : LIGHT_THEME.palette.gray,
  };
};

class DataRoomHelper {
  renderRoomName = (item) => (
    <Stack horizontal verticalAlign="center">
      <Stack.Item disableShrink>
        <Link to={`/${PAGE_PATHS.dataRooms}/${item.id}`}>
          <Image
            imageFit={ImageFit.contain}
            src="/img/default-pdf-thumbnail.png"
            srcSet="/img/default-pdf-thumbnail-2x.png, /img/default-pdf-thumbnail-3x.png"
            alt="Logo"
            width={36}
            height={36}
            styles={iconStyles}
          />
        </Link>
      </Stack.Item>
      <Link to={`/${PAGE_PATHS.dataRooms}/${item.id}`} style={renderActiveDeactiveTextStyles(item)}>
        {item.name}
      </Link>
    </Stack>
  );

  renderOwnerName = (item, personaMenuRef) => (
    <Persona hidePersonaDetails ref={personaMenuRef} size={PersonaSize.size40} text={item?.owner} />
  );

  renderDate = (item) => (
    <Text block style={renderActiveDeactiveTextStyles(item)}>
      {toLocalTime(item.modifiedDate || item.createdDate)}
    </Text>
  );

  renderShareWithAccountTooltip = (linkNames) => {
    const displayLinkNames = [...linkNames];
    displayLinkNames.shift();
    return (
      <>
        {displayLinkNames.map((linkName, index) => {
          return (
            <Stack key={index}>
              <Text style={{ color: LIGHT_THEME.palette.white }}>
                {index + 1}. {linkName}
              </Text>
            </Stack>
          );
        })}
      </>
    );
  };

  renderSharedWithAccount = (item, onShareItem) => {
    if (!item.sharedWithAccount) {
      return null;
    }

    const links = item.sharedWithAccount.split(',');
    links.sort(function (a, b) {
      return b.length - a.length;
    });

    return (
      <Stack horizontal verticalAlign="center">
        <Text
          onClick={() => onShareItem(item)}
          styles={{ ...firstLinkNameStyles, ...linkNameStyles }}
          style={renderActiveDeactiveTextStyles(item)}
        >
          {links[0]}
        </Text>
        {links.length > 1 ? (
          <TooltipHost
            styles={{ root: { minWidth: 70 } }}
            delay={TooltipDelay.zero}
            tooltipProps={{ onRenderContent: () => this.renderShareWithAccountTooltip(links) }}
          >
            <Text
              styles={linkNameStyles}
              style={{
                marginLeft: 10,
                ...renderActiveDeactiveTextStyles(item),
              }}
              onClick={() => onShareItem(item)}
            >
              +{links.length - 1}
            </Text>
          </TooltipHost>
        ) : null}
      </Stack>
    );
  };

  formSchemaDuplicateRoom = (dataRoom, renderPrinciple) => ({
    formTitle: 'Duplicate',
    submitBtnName: 'OK',
    cancleBtnName: 'Cancel',
    formSchema: [
      {
        onRenderTop: renderPrinciple,
        inputProps: {
          label: 'Data Room name',
          id: 'name',
          name: 'name',
          placeholder: 'Please enter a room name',
          type: 'text',
          required: true,
          minLength: 3,
          maxLength: 256,
          autoFocus: true,
          onFocus: (event) => event.target.select(),
        },
        initialValue: dataRoom?.name,
      },
    ],
  });
}
export default new DataRoomHelper();
