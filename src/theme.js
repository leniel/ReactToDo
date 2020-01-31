import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
    overrides: {
        MuiAppBar: {
            root: {
                marginBottom: 16,
                backgroundColor: 'transparent', boxShadow: 'none'
            },
        }
    },
    palette: {
        type: 'light',
        primary: {
            light: '#63ccff',
            main: '#123456',
            // dark: '#fff123',
            // contrastText: '#000000',
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

export default theme;