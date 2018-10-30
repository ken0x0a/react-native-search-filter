import * as React from 'react'
import {
  Keyboard,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
  EmitterSubscription
} from 'react-native'

import { createFilter } from './util';

export type SearchInputFilterKeys = string | string[]

export interface SearchInputProps extends TextInputProps {
  caseSensitive?: boolean;
  clearIcon?: React.ReactNode;
  clearIconViewStyles?: Object;
  filterKeys?: SearchInputFilterKeys;
  fuzzy?: boolean;
  inputFocus?: boolean;
  inputViewStyles?: Object;
  onChange?: (...args: any[]) => any;
  onChangeText: Required<TextInputProps>["onChangeText"]
  onSubmitEditing?: (...args: any[]) => any;
  sortResults?: boolean;
  throttle?: number;
  value?: string;
}
export interface SearchInputState  {
  searchTerm: string
  inputFocus?: boolean
}

export default class SearchInput extends React.Component<SearchInputProps,SearchInputState> {
  static defaultProps = {
    caseSensitive: false,
    clearIcon: null,
    clearIconViewStyles: {  position: 'absolute', top: 18,right: 22 },
    fuzzy: false,
    inputViewStyles: {},
    onChange: () => { },
    throttle: 200
  }

  constructor(props: SearchInputProps) {
    super(props);
    this.state = {
      searchTerm: this.props.value || '',
      inputFocus: props.inputFocus,
    }
    this._keyboardDidHide = this._keyboardDidHide.bind(this)
  }
  keyboardDidHideListener!: EmitterSubscription
  input!: TextInput
  _throttleTimeout!: number

  componentWillMount() {
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidHideListener.remove();
  }

  componentWillReceiveProps(nextProps:SearchInputProps) {
    if (this.state.inputFocus !== nextProps.inputFocus) {
      this.input.focus()
    }
    if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
      const e = {
        target: {
          value: nextProps.value,
        }
      }
      this.updateSearch(e)
    }
  }

  _keyboardDidHide() {
    if (this.state.inputFocus) {
      this.setState({ inputFocus: false })
    }
  }

  renderClearIcon() {
    const { clearIcon, clearIconViewStyles, onChangeText } = this.props
    return clearIcon &&
      <TouchableOpacity
        onPress={() => {
          onChangeText('')
          this.input.clear()
        }}
        style={clearIconViewStyles}
      >
        {clearIcon}
      </TouchableOpacity>
  }

  render() {
    const {
      caseSensitive,
      clearIcon,
      clearIconViewStyles,
      filterKeys,
      fuzzy,
      inputFocus,
      inputViewStyles,
      sortResults,
      throttle,
      onChange,
      style,
      value,
      ...inputProps
    } = this.props // eslint-disable-line no-unused-vars
    const { searchTerm } = this.state;

    return (
      <View style={this.props.inputViewStyles}>
        <TextInput
          style={style}
          // type={inputProps.type || 'search'}
          value={searchTerm}
          onChange={this.updateSearch.bind(this)}
          placeholder={inputProps.placeholder || 'Search'}
          {...inputProps}  // Inherit any props passed to it; e.g., multiline, numberOfLines below
          underlineColorAndroid={'rgba(0,0,0,0)'}
          ref={(input) => { this.input = input! }}
          returnKeyType={this.props.returnKeyType}
          onSubmitEditing={this.props.onSubmitEditing}
        />
        {this.renderClearIcon()}
      </View>
    )
  }

  updateSearch(e:any) {
    const searchTerm = e.target.value
    const { onChange } = this.props
    this.setState({
      searchTerm: searchTerm
    }, () => {
      if (this._throttleTimeout) {
        clearTimeout(this._throttleTimeout)
      }

      this._throttleTimeout = setTimeout(
        () => onChange && onChange(searchTerm),
        this.props.throttle
      )
    })
  }

  filter(keys: string[]) {
    const { filterKeys, caseSensitive, fuzzy, sortResults } = this.props
    return createFilter(
      this.state.searchTerm,
      keys || filterKeys,
      { caseSensitive, fuzzy, sortResults }
    )
  }
}

export { createFilter }
