import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { Check, Trash } from '@phosphor-icons/react';
import React, { FC } from 'react';

import { ChainID } from '@stacks/transactions';

import { Badge } from '../../../common/components/Badge';
import { DEFAULT_DEVNET_SERVER } from '../../../common/constants/constants';
import { useGlobalContext } from '../../../common/context/useAppContext';
import { useCustomNetworkApiInfo } from '../../../common/queries/useCustomNetworkApiInfo';
import { Network } from '../../../common/types/network';
import { buildUrl } from '../../../common/utils/buildUrl';
import { Box } from '../../../ui/Box';
import { Flex } from '../../../ui/Flex';
import { Icon } from '../../../ui/Icon';
import { IconButton } from '../../../ui/IconButton';
import { Spinner } from '../../../ui/Spinner';
import { Stack } from '../../../ui/Stack';
import { Tooltip } from '../../../ui/Tooltip';
import { Caption, Title } from '../../../ui/typography';

export const NetworkLabel: FC<{ network: Network }> = ({ network }) => {
  const {
    activeNetwork,
    removeCustomNetwork,
    apiUrls: { mainnet, testnet },
  } = useGlobalContext();
  const colorMode = useColorMode().colorMode;
  const isMainnet = network.url === mainnet;
  const isTestnet = network.url === testnet;
  const isDevnet = network.url === DEFAULT_DEVNET_SERVER;
  const isDefault = isMainnet || isTestnet;
  let itemNetworkId: ChainID.Mainnet | ChainID.Testnet = isMainnet
    ? ChainID.Mainnet
    : ChainID.Testnet;

  const { data, error, isFetching } = useCustomNetworkApiInfo(network.url, {
    enabled: !!network.url && !isDefault,
  });

  const isDisabled = isFetching || !!error;

  if (!isDefault && data) {
    itemNetworkId = data?.network_id && parseInt(data.network_id.toString());
  }

  const isActive = activeNetwork.url === network.url;
  const networkHref = buildUrl('/', network);
  const purpleBadgeColor = useColorModeValue('purple.600', 'purple.300');
  const purpleBadgeBg = useColorModeValue('purple.100', 'purple.900');
  const greenBadgeColor = useColorModeValue('green.600', 'green.300');
  const greenBadgeBg = useColorModeValue('green.100', 'green.900');
  const badgeBorder = useColorModeValue('purple.300', 'purple.700');

  return (
    <Flex
      justifyContent={'space-between'}
      width={'100%'}
      py={3}
      px={{ base: 0, lg: 3 }}
      opacity={isDisabled ? 0.5 : 1}
      cursor={isDisabled ? 'not-allowed' : 'unset'}
      gap={2}
    >
      <Stack
        as={isDisabled || isActive ? 'div' : 'a'}
        {...(!!networkHref && (!isDisabled || isActive) ? { href: networkHref } : {})}
        flexGrow={1}
        cursor={isDisabled ? 'not-allowed' : isActive ? 'unset' : 'pointer'}
      >
        <Flex alignItems="center">
          <Title display="block" fontSize={'sm'} fontWeight="normal">
            {network.label === 'https://api.nakamoto.testnet.hiro.so'
              ? 'Nakamoto Testnet'
              : network.label}
          </Title>
          {network.isSubnet ? (
            <Badge bg={`bg4.${colorMode}`} ml="8px" color={`textCaption.${colorMode}`}>
              subnet
            </Badge>
          ) : network.label === 'Stacks Testnet' ? (
            <Badge
              color={greenBadgeColor}
              bg={greenBadgeBg}
              px={'2'}
              py={'1'}
              fontSize={'xs'}
              rounded={'full'}
              border={'1px'}
              borderColor={badgeBorder}
              fontWeight={'medium'}
              ml="8px"
            >
              Now Live!
            </Badge>
          ) : (
            <Badge
              color={purpleBadgeColor}
              bg={purpleBadgeBg}
              px={'2'}
              py={'1'}
              fontSize={'xs'}
              rounded={'full'}
              border={'1px'}
              borderColor={badgeBorder}
              fontWeight={'medium'}
              ml="8px"
            >
              Nakamoto
            </Badge>
          )}
        </Flex>
        <Caption display="block" color="textSubdued" fontWeight="regular" fontSize="sm">
          {network?.url?.includes('//') ? network?.url?.split('//')[1] : network?.url}
        </Caption>
      </Stack>
      <Flex alignItems="center" position={'relative'}>
        {isFetching ? (
          <Spinner size="18px" opacity={0.5} color={'#666'} data-testid="spinner" />
        ) : !!error ? (
          <Caption color={`feedbackError.${colorMode}`}>Offline</Caption>
        ) : network.isCustomNetwork &&
          !isDevnet &&
          !isActive &&
          !network.label.includes('Nakamoto') &&
          network.label !== 'https://api.nakamoto.testnet.hiro.so' ? (
          <Tooltip label="Remove network">
            <IconButton
              disabled={isDisabled}
              position="relative"
              color={`textCaption.${colorMode}`}
              size={'21px'}
              icon={<Icon as={Trash} size={4} />}
              onClick={() => removeCustomNetwork(network)}
              aria-label={'Remove network'}
              _hover={{ bg: 'rgba(255, 255, 255, 0.25)' }}
            />
          </Tooltip>
        ) : isActive ? (
          <Box as={Check} color={`feedbackSuccess.${colorMode}`} size="18px" />
        ) : null}
      </Flex>
    </Flex>
  );
};
