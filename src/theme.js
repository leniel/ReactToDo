import { createMuiTheme } from '@material-ui/core/styles';
import blue from "@material-ui/core/colors/blue";
import indigo from "@material-ui/core/colors/indigo";

// https://material-ui.com/customization/color/#color
const primary = blue[800];
const primaryLight = blue["900"];

const mainIndigo = indigo[500]
const lightIndigo = indigo[50]
    
const theme = createMuiTheme({
    overrides: {
        MuiAppBar: {
            root: {
                height: 60,
                backgroundColor: 'transparent',
                boxShadow: 'none'
            },
        },
        MuiToolbar: {
            // root: {  // marginBottom: 16,
            //     backgroundColor: 'black', boxShadow: 'none'
            // },
        }
    },
    palette: {
        type: 'light',
        primary: {
            light: primaryLight,
            main: primary
            // dark: '#fff123',
            // contrastText: '#000000',
        },
        // secondary: {
        //     light: lightIndigo,
        //     main: mainIndigo
        // }
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

const theme2 = createMuiTheme({ palette, themeName })

export
    {
        theme,
        theme2
    }