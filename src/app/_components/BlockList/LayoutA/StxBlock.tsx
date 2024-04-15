import { useColorModeValue } from '@chakra-ui/react';
import { ReactNode, memo } from 'react';

import { Circle } from '../../../../common/components/Circle';
import { BlockLink } from '../../../../common/components/ExplorerLinks';
import { Timestamp } from '../../../../common/components/Timestamp';
import { truncateMiddle } from '../../../../common/utils/utils';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { HStack } from '../../../../ui/HStack';
import { Text } from '../../../../ui/Text';

interface ListItemProps {
  height: number | string;
  hash: string;
  timestamp: number;
  txsCount?: number;
  icon?: ReactNode;
  hasBorder?: boolean;
}

export const StxBlock = memo(function ({
  timestamp,
  height,
  hash,
  txsCount,
  icon,
  hasBorder,
}: ListItemProps) {
  // TODO: lots of new colors that aren't in the theme. We should either add them or make them conform to the theme
  const textColor = useColorModeValue('slate.900', 'slate.50');
  const secondaryTextColor = useColorModeValue('slate.700', 'slate.600');

  return (
    <Box
      pl={4}
      borderLeft={icon ? undefined : '1px'}
      borderColor="borderPrimary"
      position="relative"
    >
      <Flex
        justifyContent={'space-between'}
        alignItems={'center'}
        flexGrow={1}
        height={14}
        borderBottom={hasBorder ? '1px' : 'none'}
        _after={
          icon
            ? {
                // adds a small line underneath the icon of the first block to connect it with the other rows
                content: '""',
                position: 'absolute',
                left: '0',
                bottom: '0',
                height: '10px',
                width: '1px',
                backgroundColor: 'borderPrimary',
              }
            : {
                // node
                content: '""',
                position: 'absolute',
                left: '-3px',
                top: '50%',
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                backgroundColor: 'borderPrimary',
                borderRadius: '50%',
              }
        }
      >
        <Flex>
          {!!icon && (
            <Circle size={4.5} bg="brand" ml={-6} mr={2} border={'none'}>
              {icon}
            </Circle>
          )}

          <BlockLink hash={hash}>
            <Text fontSize={'14px'} color={textColor} fontWeight={'medium'}>
              #{height}
            </Text>
          </BlockLink>
        </Flex>
        <HStack divider={<>&nbsp;∙&nbsp;</>} fontSize={'12px'} color={secondaryTextColor}>
          <Box>{truncateMiddle(hash, 3)}</Box>
          {txsCount !== undefined ? <Box>{txsCount} txn</Box> : null}
          <Timestamp ts={timestamp} />
        </HStack>
      </Flex>
    </Box>
  );
});
