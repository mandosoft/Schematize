import React from 'react';
import MouseTooltip from 'react-sticky-mouse-tooltip';
import {Observer} from 'mobx-react';

export default class NucleotideTooltip extends React.Component {
    // state = {
    //     isMouseTooltipVisible: false,
    // };
    //
    // toggleMouseTooltip = () => {
    //     this.setState(prevState => ({ isMouseTooltipVisible: !prevState.isMouseTooltipVisible }));
    // };

    render() {
        return <MouseTooltip
            visible={<Observer>{() => this.props.store.isCellToolTipVisible}</Observer>}//this.props.store.toolTipContents.length > 0}
            offsetX={15}
            offsetY={10}>
                <Observer>{() => <span>{this.props.store.cellToolTipContent}</span>}</Observer>
        </MouseTooltip>;
    }
}