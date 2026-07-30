import { createTheme } from '@mui/material/styles';
import { blue } from '@mui/material/colors';

const primary = blue[800];
const primaryLight = blue["900"];
    
const theme = createTheme({
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    '&:hover': {
                        backgroundColor: 'transparent',
                    },
                },
            },
        },
    },
    palette: {
        mode: 'light',
        primary: {
            light: primaryLight,
            main: primary
        },
    },
    Paper: {
        paddingLeft: "16px",
        paddingRight: "16px"
    },
    test: {
        myClass:
        {
            padding: 10
        }
    }
});

const palette = {
    primary: { main: '#3f51b5' },
    secondary: { main: '#f50057' }
};
const themeName = 'San Marino Razzmatazz Mule';

const theme2 = createTheme({ palette, themeName });

export {
    theme,
    theme2
};