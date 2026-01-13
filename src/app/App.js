import React, { Suspense } from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import "./themes/styles/style.css";
import JumboApp from "@jumbo/components/JumboApp";
import JumboTheme from "@jumbo/components/JumboTheme";
import AppLayout from "./AppLayout";
import AppRoutes from "./AppRoutes";
import configureStore, { history } from "./redux/store";
import { SnackbarProvider } from "notistack";
import AppProvider from "./AppProvider";
import { config } from "./config/main";
import Div from "@jumbo/shared/Div";
import { CircularProgress } from "@mui/material";

const store = configureStore();

function App() {
  return (
    <Provider store={store}>
      <HashRouter history={history}>
        <AppProvider>
          <JumboApp activeLayout={config.activeLayout}>
            <JumboTheme init={config.theme}>
              <SnackbarProvider
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                maxSnack={3}
              >
                <AppLayout>
                  <Suspense
                    fallback={
                      <Div
                        sx={{
                          display: "flex",
                          minWidth: 0,
                          alignItems: "center",
                          alignContent: "center",
                          height: "100%",
                        }}
                      >
                        <CircularProgress sx={{ m: "-40px auto 0" }} />
                      </Div>
                    }
                  >
                    <AppRoutes />
                  </Suspense>
                </AppLayout>
              </SnackbarProvider>
            </JumboTheme>
          </JumboApp>
        </AppProvider>
      </HashRouter>
    </Provider>
  );
}

export default App;
