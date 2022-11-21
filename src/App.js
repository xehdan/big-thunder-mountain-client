import {createTheme, ThemeProvider} from "@mui/material";
import Navbar from "./components/navbar/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/sidebar/Sidebar";
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
import Mailer from "./pages/mailer/Mailer";
import BookingDashboard from "./pages/booking/BookingDashboard";
import {useMemo} from "react";
import useMediaQuery from '@mui/material/useMediaQuery';
import CustomerCreate from "./pages/customers/CustomerCreate";
import ComplaintList from "./pages/complaint/ComplaintList";
import ComplaintPage from "./pages/complaint/ComplaintPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import TaskList from "./pages/task/TaskList";
import {UserContextProvider} from "./context/UserContext";
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';


function App() {
    Sentry.init({
        dsn:  "https://db8399bc864a4f26a76dd60dbe4a74e6@o770040.ingest.sentry.io/4504197052694528",
        integrations: [new BrowserTracing()],

        tracesSampleRate: 1.0,
    })

    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark');
/*
    const theme = createTheme({
        palette: {
            mode: 'dark',
            primary: {
                main: '#f7a700'
            }
        }
    })*/

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode: prefersDarkMode ? 'dark' : 'light',
                    primary: {
                        main: '#f7a700'
                    }
                }
            }),
        [prefersDarkMode]
    )


  return (
      <ThemeProvider theme={theme}>
          <UserContextProvider>

          <CssBaseline />
          <Router>
              <Navbar/>
              <div className="container">
                <Sidebar/>
                  <Routes className="mainStage">
                      <Route path="/" element={<DashboardPage/>}/>
                      <Route path="/task" element={<TaskList/>}/>
                      <Route path="/projects" element={<ProjectList/>}/>
                      <Route exact path="/project/:id" element={<ProjectPage/>} />
                      <Route path="/screedchecks" element={<ScreedcheckList/>}/>
                      <Route exact path="/screedcheck/:id" element={<ScreedcheckPage/>}/>
                      <Route path="/customers" element={<CustomerList/>}/>
                      <Route path="/customer/create" element={<CustomerCreate/>}/>
                      <Route exact path="/customer/:id" element={<CustomerPage/>}/>
                      <Route path="/calendar" element={<ThCalendar/>}/>
                      <Route exact path="/assembly/:id" element={<AssemblyPage/>}/>
                      <Route path="/assemblies" element={<AssemblyList/>}/>
                      <Route exact path="/complaint/:id" element={<ComplaintPage/>}/>
                      <Route path="/complaints" element={<ComplaintList/>}/>
                      <Route exact path="/mailer" element={<Mailer/>}/>
                      <Route exact path="/booking" element={<BookingDashboard/>}/>
                  </Routes>
              </div>
          </Router>

          </UserContextProvider>
      </ThemeProvider>
  );
}
export default App;
