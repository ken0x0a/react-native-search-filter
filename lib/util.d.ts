import { SearchInputFilterKeys } from './index';
export declare function getValuesForKey(key: string, item: any): any[];
interface searchStringsOptions {
    caseSensitive?: boolean;
    fuzzy?: boolean;
    sortResults?: boolean;
    normalize?: boolean;
}
export declare function searchStrings(strings: string[], term: string, { caseSensitive, fuzzy, sortResults, normalize }?: searchStringsOptions): boolean;
export declare function createFilter(term: string, keys: SearchInputFilterKeys, options?: searchStringsOptions): (item: any) => boolean;
export {};
