import SidebarContainer from "./components/sidebar/SidebarContainer";
import {createTheme, ThemeProvider} from "@mui/material";

function App() {

    const theme = createTheme({
        palette: {
            primary: {
                main: '#f7a700'
            }
        }
    })
  return (
      <ThemeProvider theme={theme}>
          <div className="App">
              <SidebarContainer/>
              <div className="mainStage">
                Sample
              </div>
          </div>
      </ThemeProvider>
  );
}
export default App;
