'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { Suspense, useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { Text } from '../../../../ui/Text';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { UpdateBar } from '../LayoutA/UpdateBar';
import { FADE_DURATION } from '../LayoutA/consts';
// TODO: move somewhere else
import { useBlockListContext } from '../LayoutA/context';
import { BlocksPageHeaders } from './BlocksPageHeaders';
import { BurnBlockGroup } from './BurnBlockGroup';
import { useBlockListGroupedByBtcBlockBlocksPage } from './useBlockListGroupedByBtcBlockBlocksPage';

function BlocksPageBlockListGroupedByBtcBlockBase() {
  const {
    groupedByBtc,
    setGroupedByBtc,
    liveUpdates,
    setLiveUpdates,
    isBlockListLoading: isUpdateListLoading,
  } = useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBlockListGroupedByBtcBlockBlocksPage(10);

  const lastClickTimeRef = useRef(0);
  const toggleLiveUpdates = useCallback(() => {
    const now = Date.now();
    if (now - lastClickTimeRef.current > 2000) {
      lastClickTimeRef.current = now;
      setLiveUpdates(!liveUpdates);
    }
  }, [liveUpdates, setLiveUpdates]);

  const enablePagination = true;

  return (
    <Section>
      <Controls
        groupByBtc={{
          onChange: () => {
            setGroupedByBtc(!groupedByBtc);
          },
          isChecked: groupedByBtc,
          isDisabled: true,
        }}
        liveUpdates={{
          onChange: toggleLiveUpdates,
          isChecked: liveUpdates,
        }}
        horizontal={true}
      />
      {!liveUpdates && (
        <UpdateBar
          isUpdateListLoading={isUpdateListLoading}
          latestBlocksCount={latestBlocksCount}
          onClick={updateBlockList}
        />
      )}
      <Flex
        flexDirection="column"
        gap={4}
        pt={4}
        style={{
          transition: `opacity ${FADE_DURATION / 1000}s`,
          opacity: isUpdateListLoading ? 0 : 1,
        }}
      >
        {blockList.map(block => (
          <BurnBlockGroup
            burnBlock={block.burnBlock}
            stxBlocks={block.stxBlocks}
            stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
          />
        ))}
      </Flex>
      <Box pt={5} pb={5}>
        {(!liveUpdates || !enablePagination) && (
          <ListFooter
            isLoading={isFetchingNextPage}
            hasNextPage={hasNextPage}
            fetchNextPage={fetchNextPage}
            label={'blocks'}
          />
        )}
      </Box>
    </Section>
  );
}

export function BlocksPageBlockListGroupedByBtcBlock() {
  // TODO: fix the suspense fallback
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <BlockListProvider>
        <BlocksPageHeaders />
        <Suspense fallback={<Text>loading...</Text>}>
          <BlocksPageBlockListGroupedByBtcBlockBase />
        </Suspense>
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}