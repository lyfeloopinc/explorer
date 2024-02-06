'use client';

import { useParams } from 'next/navigation';
import { FC, ReactNode, useState } from 'react';

import { TabsContainer } from '../../../common/components/TabsContainer';
import { Box } from '../../../ui/Box';
import { FlexProps } from '../../../ui/Flex';
import { ShowValueMenu } from '../..//txsFilterAndSort/ShowValueMenu';
import { FilterButton } from '../../txsFilterAndSort/FilterButton';
import { SortMenu } from '../../txsFilterAndSort/SortMenu';
import { CSVDownloadButton } from './CSVDownloadButton';

export const TxListTabsBase: FC<
  {
    confirmedList: ReactNode;
    mempoolList: ReactNode;
  } & FlexProps
> = ({ confirmedList, mempoolList, ...props }) => {
  const principal = useParams().principal;
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <TabsContainer
      setTabIndex={setTabIndex}
      tabs={[
        {
          title: 'Confirmed',
          content: confirmedList,
        },
        {
          title: 'Pending',
          content: mempoolList,
        },
      ]}
      actions={
        <Box marginLeft={'auto'} display={'flex'} gap={4} width={['100%', '100%', '100%', 'auto']}>
          {!!principal && <CSVDownloadButton address={principal as string} />}
          {tabIndex === 1 && <SortMenu />}
          <ShowValueMenu />
          <FilterButton />
        </Box>
      }
      {...props}
    />
  );
};
