import {createTheme, ThemeProvider} from "@mui/material";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./pages/home/Home"
import CssBaseline from '@mui/material/CssBaseline';
import "./App.css";
import ProjectList from "./pages/projects/ProjectList";
import CustomerList from "./pages/customers/CustomerList";
import CustomerPage from "./pages/customers/CustomerPage";
import ScreedcheckList from "./pages/screedchecks/ScreedcheckList";
import ProjectPage from "./pages/projects/ProjectPage";
import ScreedcheckPage from "./pages/screedchecks/ScreedcheckPage";
import ThCalendar from "./pages/calendar/ThCalendar";
import AssemblyPage from "./pages/assembly/AssemblyPage";
import AssemblyList from "./pages/assembly/AssemblyList";



function App() {

    const theme = createTheme({
        palette: {
            primary: {
                main: '#f7a700'
            }
        }
    })
  return (
      <CssBaseline>
      <ThemeProvider theme={theme}>
          <Router>
              <Navbar/>
              <div className="container">
                <Sidebar/>
                  <Routes className="mainStage">
                      <Route path="/" element={<Home/>}/>
                      <Route path="/projects" element={<ProjectList/>}/>
                      <Route exact path="/project/:id" element={<ProjectPage/>} />
                      <Route path="/screedchecks" element={<ScreedcheckList/>}/>
                      <Route exact path="/screedcheck/:id" element={<ScreedcheckPage/>}/>
                      <Route path="/customers" element={<CustomerList/>}/>
                      <Route exact path="/customer/:id" element={<CustomerPage/>}/>
                      <Route path="/calendar" element={<ThCalendar/>}/>
                      <Route exact path="/assembly/:id" element={<AssemblyPage/>}/>
                      <Route path="/assemblies" element={<AssemblyList/>}/>
                  </Routes>
              </div>
          </Router>

      </ThemeProvider>
      </CssBaseline>
  );
}
export default App;
