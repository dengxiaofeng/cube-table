import { Key, DataIndex } from '../interface';
export declare function getPathValue<ValueType, ObjectType extends object>(record: ObjectType, path: DataIndex): ValueType;
interface GetColumnKeyColumn {
    key?: Key;
    dataIndex?: DataIndex;
}
export declare function getColumnKey({ key, dataIndex }: GetColumnKeyColumn, index: number): string | number;
export declare function mergeObject<ReturnObject extends object>(...objects: Partial<ReturnObject>[]): ReturnObject;
export declare function validateValue<T>(val: T): boolean;
/**
 * Create a packaged array to fast the v8 process speed
 */
export declare function newArr(len: number): number[];
export {};
