import * as React from 'react';
import { TextInput, TextInputProps, EmitterSubscription } from 'react-native';
import { createFilter } from './util';
export declare type SearchInputFilterKeys = string | string[];
export interface SearchInputProps extends TextInputProps {
    caseSensitive?: boolean;
    clearIcon?: React.ReactNode;
    clearIconViewStyles?: Object;
    filterKeys?: SearchInputFilterKeys;
    fuzzy?: boolean;
    inputFocus?: boolean;
    inputViewStyles?: Object;
    onChange?: (...args: any[]) => any;
    onChangeText: Required<TextInputProps>["onChangeText"];
    onSubmitEditing?: (...args: any[]) => any;
    sortResults?: boolean;
    throttle?: number;
    value?: string;
}
export interface SearchInputState {
    searchTerm: string;
    inputFocus?: boolean;
}
export default class SearchInput extends React.Component<SearchInputProps, SearchInputState> {
    static defaultProps: {
        caseSensitive: boolean;
        clearIcon: null;
        clearIconViewStyles: {
            position: string;
            top: number;
            right: number;
        };
        fuzzy: boolean;
        inputViewStyles: {};
        onChange: () => void;
        throttle: number;
    };
    constructor(props: SearchInputProps);
    keyboardDidHideListener: EmitterSubscription;
    input: TextInput;
    _throttleTimeout: number;
    componentWillMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: SearchInputProps): void;
    _keyboardDidHide(): void;
    renderClearIcon(): false | "" | 0 | JSX.Element | null | undefined;
    render(): JSX.Element;
    updateSearch(e: any): void;
    filter(keys: string[]): (item: any) => boolean;
}
export { createFilter };
