import React from 'react';
// import {Observer} from 'mobx-react';

class CompressedViewSwitch extends React.Component {
    render() {
        return (
            <input
                type="checkbox"
                checked={this.props.store.useVerticalCompression}
                onChange={this.props.store.toggleUseVerticalCompression}
            />
        );
    }
}

export default CompressedViewSwitch