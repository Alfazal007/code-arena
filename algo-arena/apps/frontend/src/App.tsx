import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { SignUp } from "./components/Signup";
import UserProvider from "./context/UserContext";
import { SignIn } from "./components/Signin";
import Landing from "./components/Landing";
import { SingleProblem } from "./components/SingleProblem";

export interface User {
    accessToken: string;
    refreshToken: string;
    username: string;
    id: string;
}

function App() {

    const router = createBrowserRouter([
        {
            path: "/signup",
            element: <SignUp />,
        },
        {
            path: "/signin",
            element: <SignIn />
        },
        {
            path: "/",
            element: <Landing />
        },
        {
            path: "/problem/:problemId",
            element: <SingleProblem />
        },
    ]);

    return (
        <>
            <UserProvider>
                <RouterProvider router={router} />
            </UserProvider>
        </>
    );
}

export default App;
