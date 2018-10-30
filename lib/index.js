import * as React from 'react';
import { Keyboard, TextInput, TouchableOpacity, View } from 'react-native';
import { createFilter } from './util';
export default class SearchInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: this.props.value || '',
            inputFocus: props.inputFocus,
        };
        this._keyboardDidHide = this._keyboardDidHide.bind(this);
    }
    componentWillMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.inputFocus !== nextProps.inputFocus) {
            this.input.focus();
        }
        if (typeof nextProps.value !== 'undefined' && nextProps.value !== this.props.value) {
            const e = {
                target: {
                    value: nextProps.value,
                }
            };
            this.updateSearch(e);
        }
    }
    _keyboardDidHide() {
        if (this.state.inputFocus) {
            this.setState({ inputFocus: false });
        }
    }
    renderClearIcon() {
        const { clearIcon, clearIconViewStyles, onChangeText } = this.props;
        return clearIcon &&
            <TouchableOpacity onPress={() => {
                onChangeText('');
                this.input.clear();
            }} style={clearIconViewStyles}>
        {clearIcon}
      </TouchableOpacity>;
    }
    render() {
        const { caseSensitive, clearIcon, clearIconViewStyles, filterKeys, fuzzy, inputFocus, inputViewStyles, sortResults, throttle, onChange, style, value, ...inputProps } = this.props;
        const { searchTerm } = this.state;
        return (<View style={this.props.inputViewStyles}>
        <TextInput style={style} value={searchTerm} onChange={this.updateSearch.bind(this)} placeholder={inputProps.placeholder || 'Search'} {...inputProps} underlineColorAndroid={'rgba(0,0,0,0)'} ref={(input) => { this.input = input; }} returnKeyType={this.props.returnKeyType} onSubmitEditing={this.props.onSubmitEditing}/>
        {this.renderClearIcon()}
      </View>);
    }
    updateSearch(e) {
        const searchTerm = e.target.value;
        const { onChange } = this.props;
        this.setState({
            searchTerm: searchTerm
        }, () => {
            if (this._throttleTimeout) {
                clearTimeout(this._throttleTimeout);
            }
            this._throttleTimeout = setTimeout(() => onChange && onChange(searchTerm), this.props.throttle);
        });
    }
    filter(keys) {
        const { filterKeys, caseSensitive, fuzzy, sortResults } = this.props;
        return createFilter(this.state.searchTerm, keys || filterKeys, { caseSensitive, fuzzy, sortResults });
    }
}
SearchInput.defaultProps = {
    caseSensitive: false,
    clearIcon: null,
    clearIconViewStyles: { position: 'absolute', top: 18, right: 22 },
    fuzzy: false,
    inputViewStyles: {},
    onChange: () => { },
    throttle: 200
};
export { createFilter };
//# sourceMappingURL=index.js.map