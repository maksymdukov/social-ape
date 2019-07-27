import React from 'react';

// MUI stuff
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';


function MyButton({children, tip, onClick, btnClassName, tipClassName}) {
    return (
        <Tooltip
            title={tip}
            className={tipClassName}
        >
            <IconButton onClick={onClick} className={btnClassName}>
                {children}
            </IconButton>

        </Tooltip>
    );
}

export default MyButton;