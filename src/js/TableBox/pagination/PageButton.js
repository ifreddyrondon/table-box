/**
 * Created by freddyrondon on 5/18/16.
 */

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames';

class PageButton extends Component {

    constructor(props) {
        super(props);
    }

    pageBtnClick(evt) {
        evt.preventDefault();
        this.props.changePage(evt.currentTarget.textContent);
    }

    render() {
        const classes = classSet({
            'active': this.props.active,
            'disabled': this.props.disable,
            'hidden': this.props.hidden
        });
        return (
            <li className={ classes }>
                <a onClick={ this.pageBtnClick.bind(this) }>
                    { this.props.children }
                </a>
            </li>
        );
    }
}
PageButton.propTypes = {
    active: PropTypes.bool,
    changePage: PropTypes.func,
    children: PropTypes.node,
    disable: PropTypes.bool,
    hidden: PropTypes.bool
};

export default PageButton;
