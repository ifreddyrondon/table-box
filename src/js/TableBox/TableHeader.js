/**
 * Created by freddyrondon on 4/16/16.
 */

import React, { Component, PropTypes } from 'react';
import classSet from 'classnames'


class TableHeader extends Component {

    handleExpandIcon(){
        this.props.handleCollapse()
    }

    handleExtarnalLink(){
        this.props.handleMaximizeTable()
    }

    render() {
        const containerClasses = classSet('table-header-wrapper', {
            'hidden': this.props.title === ''
        });
        const collapseLinkClass = classSet({
            'minus' : !this.props.isCollapsed,
            'expand' : this.props.isCollapsed,
            'hidden': !this.props.renderCollapse
        });
        const collapseIconClass = classSet('fa', {
            'fa-minus-circle' : !this.props.isCollapsed,
            'fa-plus-circle' : this.props.isCollapsed
        });
        const externalLinkClass = classSet('external-link', {
            'hidden': !this.props.renderMaximize
        });

        return (
            <div ref='container' className={ containerClasses }>
                <div className="pull-left title">
                    {this.props.title}
                </div>
                <div className="pull-right control-icons">
                    <a onClick={this.handleExpandIcon.bind(this)} className={collapseLinkClass}>
                        <i className={collapseIconClass}></i>
                    </a>
                    <a onClick={this.handleExtarnalLink.bind(this)} className={externalLinkClass}>
                        <span className="fa-stack fa-lg external-link">
                            <i className="fa fa-circle fa-stack-2x"></i>
                            <i className="fa fa-sort fa-rotate-45 fa-stack-1x fa-inverse"></i>
                        </span>
                    </a>
                </div>
            </div>
        )
    }
}

TableHeader.propTypes = {
    title: PropTypes.string
};

export default TableHeader