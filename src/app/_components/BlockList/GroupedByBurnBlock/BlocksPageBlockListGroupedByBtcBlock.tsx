'use client';

import { ListFooter } from '@/common/components/ListFooter';
import { useCallback, useRef } from 'react';

import { Section } from '../../../../common/components/Section';
import { Box } from '../../../../ui/Box';
import { Flex } from '../../../../ui/Flex';
import { ExplorerErrorBoundary } from '../../ErrorBoundary';
import { Controls } from '../Controls';
import { BlockListProvider } from '../LayoutA/Provider';
import { UpdateBar } from '../LayoutA/UpdateBar';
import { useBlockListContext } from '../LayoutA/context';
import { BlocksGroup } from './BlocksGroup';
import { useBlockListGroupedByBtcBlockBlocksPage } from './useBlockListGroupedByBtcBlockBlocksPage';

function BlocksPageBlockListGroupedByBtcBlockBase() {
  const { groupedByBtc, setGroupedByBtc, liveUpdates, setLiveUpdates, isUpdateListLoading } =
    useBlockListContext();
  const {
    blockList,
    updateBlockList,
    latestBlocksCount,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useBlockListGroupedByBtcBlockBlocksPage(10);

  // const blockList = [
  //   {
  //     type: UIBlockType.StxBlock,
  //     height: 10001,
  //     hash: '0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
  //   },
  //   {
  //     type: UIBlockType.StxBlock,
  //     height: 10002,
  //     hash: '0xrerqreqwjdhgjhdgj0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
  //   },
  //   {
  //     type: UIBlockType.StxBlock,
  //     height: 10003,
  //     hash: '0xbxvcbxvcbvxcbvxc0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
  //   },
  //   {
  //     type: UIBlockType.StxBlock,
  //     height: 10004,
  //     hash: '0xjhjhfhgjhdjdhjhhj0xfdsadfdasfdasfjhdgf0xfdsadfdasfdasfjhdgf',
  //   },
  // ];

  // const burnBlock = {
  //   height: 332141,
  //   hash: '0xhfgjdkhbafgkjhdafjkhdsafjkhflkjdsahfjkhdsafhdsafdsaf',
  //   timestamp: 0,
  // };
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
      <Box overflowX={'auto'} py={6}>
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
          // horizontal={horizontalControls}
        />
        {!liveUpdates && (
          <UpdateBar
            isUpdateListLoading={isUpdateListLoading}
            latestBlocksCount={latestBlocksCount}
            onClick={updateBlockList}
          />
        )}
        <Flex flexDirection="column" gap={4}>
          {blockList.map(block => (
            <BlocksGroup
              burnBlock={block.burnBlock}
              stxBlocks={block.stxBlocks}
              stxBlocksDisplayLimit={block.stxBlocksDisplayLimit}
            />
          ))}
        </Flex>
        <Box pt={4}>
          {(!liveUpdates || !enablePagination) && (
            <ListFooter
              isLoading={isFetchingNextPage}
              hasNextPage={hasNextPage}
              fetchNextPage={fetchNextPage}
              label={'blocks'}
            />
          )}
        </Box>
      </Box>
    </Section>
  );
}

export function BlocksPageBlockListGroupedByBtcBlock() {
  return (
    <ExplorerErrorBoundary
      Wrapper={Section}
      wrapperProps={{
        title: 'Recent Blocks',
        gridColumnStart: ['1', '1', '2'],
        gridColumnEnd: ['2', '2', '3'],
        minWidth: 0,
      }}
      tryAgainButton
    >
      <BlockListProvider>
        <BlocksPageBlockListGroupedByBtcBlockBase />
      </BlockListProvider>
    </ExplorerErrorBoundary>
  );
}
