/// <reference types="react" />
interface ResizeContextProps {
    onColumnResize: (colIndex: number, width: number) => void;
}
declare const ResizeContext: import("react").Context<ResizeContextProps>;
export default ResizeContext;
