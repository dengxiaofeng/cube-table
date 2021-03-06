import * as React from 'react';
import { StickyOffsets, CustomizeComponent, GetComponentProps, Key, GetRowKey } from '../interface';
export interface BodyRowProps<RecordType> {
    record: RecordType;
    index: number;
    className?: string;
    style?: React.CSSProperties;
    /** Set if need collect column width info */
    measureColumnWidth: boolean;
    stickyOffsets: StickyOffsets;
    recordKey: Key;
    expandedKeys: Set<Key>;
    rowComponent: CustomizeComponent;
    cellComponent: CustomizeComponent;
    onRow: GetComponentProps<RecordType>;
    rowExpandable: (record: RecordType) => boolean;
    indent?: number;
    getRowKey: GetRowKey<RecordType>;
    childrenColumnName: string;
}
declare function BodyRow<RecordType extends {
    children?: RecordType[];
}>(props: BodyRowProps<RecordType>): JSX.Element;
declare namespace BodyRow {
    var displayName: string;
}
export default BodyRow;
